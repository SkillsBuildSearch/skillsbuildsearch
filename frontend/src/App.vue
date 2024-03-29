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
        <div
          class="col-12 col-md-3"
          v-if="Object.entries(categories).length > 0"
        >
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
    };
  },
  methods: {
    loadResults(text, offset, append) {
      // Load search results from API.

      this.loading = true;
      this.clearErrors();

      // If categories haven't loaded, try to load them again when a search is attempted.
      if (Object.entries(this.categories).length == 0) {
        this.loadCategories();
      }
      let uri = `${
        import.meta.env.VITE_APP_SERVER_ADDRESS
      }/api/v1/search?text=${encodeURIComponent(text)}`;

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
      // Load course categories from API. This runs on page load.

      const categoryRequest = new Request(
        `${import.meta.env.VITE_APP_SERVER_ADDRESS}/api/v1/categories/`
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
      // Display an error message using the ErrorMessage component.

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
  },
  mounted() {
    this.loadCategories();
  },
};
</script>
