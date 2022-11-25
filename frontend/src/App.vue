<script setup>
import PageHeader from "./components/PageHeader.vue";
import SearchBox from "./components/SearchBox.vue";
import SearchResults from "./components/SearchResults.vue";
</script>

<template>
  <main>
    <div class="container">
      <PageHeader />
      <SearchBox @search="toggleShow" />
      <SearchResults v-if="showResults" />
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      showResults: false,
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
