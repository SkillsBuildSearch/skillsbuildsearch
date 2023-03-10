<script setup>
import PageHeader from "./components/PageHeader.vue";
import SearchBox from "./components/SearchBox.vue";
import SearchResults from "./components/SearchResults.vue";
import SignUpBox from "./components/SignUpBox.vue";
import ErrorAlert from "./components/ErrorAlert.vue";
</script>

<template>
  <main>
    <div class="container">
      <PageHeader />
      <div class="row mb-5">
        <div class="col">
          <SearchBox
            @search="loadResults"
            @error="generateError($event[0], $event[1])"
            @voice="toggleRecord()"
            :voice-active="isRecording"
          />
          <ErrorAlert
            v-for="error in errorMessages"
            :message="error.message"
            :code="error.code"
            :key="error.id"
          ></ErrorAlert>
          <SearchResults
            :results="results"
            :total-results="maxResults"
            @load-more="loadResults(lastSearch, 5, true)"
            :loading="loading"
          />
        </div>
        <div class="col-auto" v-if="Object.entries(categories).length > 0">
          <h2>Course categories</h2>
          <div
            v-for="category in Object.entries(categories)"
            :key="category[0]"
            class="form-check"
          >
            <input
              class="form-check-input"
              type="checkbox"
              v-model="categories[category[0]]"
              :id="category[0] + 'Input'"
            />
            <label class="form-check-label" :for="category[0] + 'Input'">
              {{ category[0] }}
            </label>
          </div>
        </div>
      </div>
      <SignUpBox></SignUpBox>
    </div>
  </main>
</template>

<script>
export default {
  components: {
    PageHeader,
    SearchBox,
    SearchResults,
    SignUpBox,
    ErrorAlert,
  },
  data() {
    return {
      showResults: false,
      categories: {},
      results: [],
      maxResults: 20,
      lastSearch: "",
      loading: false,
      errorMessages: [],
      mediaRecorder: {},
      isRecording: false,
    };
  },
  methods: {
    loadResults(text, offset, append) {
      this.loading = true;
      this.clearErrors();

      // If categories haven't loaded, try to load them again when a search is attempted.
      if (Object.entries(this.categories).length == 0) {
        this.loadCategories();
      }

      let uri = `http://localhost:5001/api/v1/search?text=${encodeURIComponent(
        text
      )}`;

      if (offset) {
        uri += `&offset=${encodeURIComponent(offset)}`;
      }

      let catEncoding = 0;
      Object.entries(this.categories).forEach((value, idx) => {
        /* eslint-disable-next-line no-bitwise */
        catEncoding |= value[1] << idx;
      });

      uri += `&checkboxes=${encodeURIComponent(catEncoding)}`;

      const searchRequest = new Request(uri);

      fetch(searchRequest)
        .then((response) => {
          if (!response.ok) {
            this.loading = false;
            this.generateError("Server error. Please try again later.", 1);
          }

          response.json().then((data) => {
            if (Object.hasOwn(data, "error")) {
              this.generateError(data.error, data.code);
            } else {
              if (append) {
                this.results = this.results.concat(data);
              } else {
                this.results = data;
              }
              this.clearErrors();
            }
            this.loading = false;
            this.lastSearch = text;
          });
        })
        .catch(() => {
          this.loading = false;
          this.generateError(
            "Failed to load search results, as the server is offline. Please try again later.",
            1
          );
        });
    },
    loadCategories() {
      const categoryRequest = new Request(
        "http://localhost:5001/api/v1/categories/"
      );

      fetch(categoryRequest)
        .then((response) => {
          if (!response.ok) {
            this.generateError("Server error. Please try again later.", 1);
          }

          response.json().then((data) => {
            for (const value of data) {
              this.categories[value] = true;
            }
            this.clearErrors();
          });
        })
        .catch(() => {
          this.generateError(
            "Failed to load categories, as the server is offline. Please try again later.",
            1
          );
        });
    },
    generateError(message, code) {
      if (this.errorMessages.length >= 3) {
        this.errorMessages.shift();
      }
      this.errorMessages.push({
        id: Date.now(),
        message: message,
        code: code,
      });
    },
    clearErrors() {
      this.errorMessages = [];
    },
    audioSetup() {
      // Check if browser supports recording audio.
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Your browser does not support audio recording.");
        return;
      }

      navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then(this.recordVoice)
        .then(() => {
          console.log(this.mediaRecorder);
          this.mediaRecorder.start();
        });
    },
    recordVoice(stream) {
      this.isRecording = true;
      const options = { contentType: "audio/webm" };
      const recordedChunks = [];
      this.mediaRecorder = new MediaRecorder(stream, options);

      this.mediaRecorder.addEventListener("dataavailable", function (e) {
        if (e.data.size > 0) recordedChunks.push(e.data);
      });

      this.mediaRecorder.addEventListener("stop", function () {
        // console.log("stop media recording");
        const audio = new Blob(recordedChunks);
        const formData = new FormData();
        formData.append("audio", audio);
        const postRequest = {
          method: "POST",
          body: formData,
        };

        fetch("http://localhost:5001/api/v1/stt", postRequest)
          .then((response) => {
            response.json().then((data) => {
              console.log(data);
            });
            
          })
          .catch(() => {

          });
        this.isRecording = false;
      });
    },
    toggleRecord() {
      // Check if recorder is running, and start stop depending on state
      if (this.isRecording) {
        console.log("button pressed");
        this.mediaRecorder.stop();
        this.isRecording = false;
      } else {
        this.audioSetup();
      }
    },
  },
  mounted() {
    this.loadCategories();
  },
};
</script>
