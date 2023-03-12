<template>
  <div class="input-group mb-3">
    <input
      type="search"
      class="form-control"
      placeholder="Input your course here..."
      aria-label="Course description"
      aria-describedby="search-button"
      @keyup.enter.prevent="submit"
      maxlength="1000"
      v-model="searchText"
    />
    <button
      @click="toggleRecord()"
      class="btn btn-outline btn-outline-secondary"
      type="button"
    >
      <i
        class="bi"
        :class="{ 'bi-mic': !isRecording, 'bi-mic-fill': isRecording }"
      ></i>
    </button>
    <button
      @click="submit"
      class="btn btn-outline-primary"
      type="button"
      id="search-button"
    >
      Search
    </button>
  </div>
</template>

<style scoped>
input {
  height: 50px;
}
</style>

<script>
export default {
  data() {
    return {
      searchText: "",
      isRecording: false,
    };
  },
  emits: ["search", "error"],
  methods: {
    submit() {
      if (this.searchText.length > 12) {
        this.$emit("search", this.searchText);
      } else {
        this.$emit("error", [
          "Your search term is not long enough for the results to be relevant. Please input more text.",
          2,
        ]);
      }
    },
    audioSetup() {
      // Check if browser supports recording audio.
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Your browser does not support audio recording.");
        return;
      }

      navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then(this.setUpRecorder)
        .then(() => {
          this.$_mediaRecorder.start();
        });
    },
    setUpRecorder(stream) {
      this.isRecording = true;
      const options = { contentType: "audio/webm" };
      const recordedChunks = [];
      this.$_mediaRecorder = new MediaRecorder(stream, options);

      this.$_mediaRecorder.addEventListener("dataavailable", (e) => {
        if (e.data.size > 0) recordedChunks.push(e.data);
      });

      // eslint-disable-next-line no-unused-vars
      this.$_mediaRecorder.addEventListener("stop", (_e) => {
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
              this.searchText = data.transcript;
            });
          })
          .catch(() => {
            this.$emit("error", [
              "Failed to transcribe audio. Please check your microhpone is connected and try again later.",
              1,
            ]);
          });
      });
    },
    toggleRecord() {
      // Check if recorder is running, and start stop depending on state
      if (this.isRecording) {
        this.$_mediaRecorder.stop();
        this.isRecording = false;
      } else {
        this.audioSetup();
      }
    },
  },
};
</script>
