<script setup>
import PageHeader from "./components/PageHeader.vue";
import SearchBox from "./components/SearchBox.vue";
import SearchResults from "./components/SearchResults.vue";
</script>

<template>
  <main>
    <div class="container">
      <PageHeader />
      <div class="row">
        <div class="col">
          <SearchBox @search="loadResults" />
          <SearchResults :results="results" />
        </div>
        <div class="col-auto">
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
    </div>
  </main>
</template>

<script>
export default {
  components: {
    PageHeader,
    SearchBox,
    SearchResults,
  },
  data() {
    return {
      showResults: false,
      categories: {},
      results: [],
    };
  },
  methods: {
    loadResults(text) {
      let uri = `http://localhost:5001/api/v1/search?text=${encodeURIComponent(
        text
      )}`;
      
      let catEncoding = 0;
      Object.entries(this.categories).forEach((value, idx) => {
        /* eslint-disable-next-line no-bitwise */
        catEncoding |= value[1] << idx;
      });

      uri += `&checkboxes=${encodeURIComponent(catEncoding)}`;

      const searchRequest = new Request(uri);

      fetch(searchRequest).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        response.json().then((data) => {
          this.results = data;
        });
      });
    },
    loadCategories() {
      const searchRequest = new Request(
        "http://localhost:5001/api/v1/categories/"
      );

      fetch(searchRequest).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        response.json().then((data) => {
          for (const value of data) {
            this.categories[value] = true;
          }
        });
      });
    },
  },
  mounted() {
    this.loadCategories();
  },
};
</script>
