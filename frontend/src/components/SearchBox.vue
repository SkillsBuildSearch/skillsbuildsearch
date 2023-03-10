<template>
  <div class="input-group mb-3">
    <input
      type="search"
      class="form-control"
      placeholder="Input your course here..."
      aria-label="Course description"
      aria-describedby="search-button"
      @keyup.enter.prevent="submit"
      v-model="searchText"
      maxlength="1000"
    />
    <button
      @click="voice"
      class="btn btn-outline btn-outline-secondary"
      type="button"
    >
      <i
        class="bi"
        :class="{ 'bi-mic': !voiceActive, 'bi-mic-fill': voiceActive }"
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
    };
  },
  props: {
    voiceActive: Boolean,
  },
  emits: ["voice", "search", "error"],
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
    voice() {
      this.$emit("voice");
    },
  },
};
</script>
