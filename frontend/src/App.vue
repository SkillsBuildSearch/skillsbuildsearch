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
          <SearchBox @search="toggleShow" />
          <SearchResults v-if="showResults" />
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
  data() {
    return {
      showResults: false,
      categories: {
        "Artificial Intelligence": false,
        Capstone: false,
        "Data Science": false,
        "IBM Automation": false,
        "IBM Cloud": false,
        "IBM Engineering": false,
        "IBM Security": false,
        "IBM Z": false,
        "Red Hat Academy": false,
        "IBM Quantum": false,
      },
    };
  },
  methods: {
    toggleShow(result) {
      if (result) {
        this.showResults = true;
      } else {
        this.showResults = false;
      }
    },
  },
};
</script>
