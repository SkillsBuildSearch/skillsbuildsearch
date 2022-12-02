<template>
  <div class="input-group mb-3">
    <input
      type="search"
      class="form-control"
      placeholder="Input your course here..."
      aria-label="Course description"
      aria-describedby="search-button"
      @keyup.enter="submit"
      v-model="searchText"
    />
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
    };
  },
  methods: {
    submit() {
      this.$emit("search", this.searchText);
    },
  },
};
</script>
