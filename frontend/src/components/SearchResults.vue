<template>
  <div>
    <div class="d-flex justify-content-center">
      <div
        v-if="loading"
        class="spinner-border"
        role="status"
        style="width: 3rem; height: 3rem"
      >
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <template v-if="!loading">
      <div v-for="result in results" :key="result.link">
        <h2>
          <a :href="result.Link">{{ result.Title }}</a>
        </h2>
        <span
          v-for="topic in result.Topic.split(', ')"
          :key="topic"
          class="badge bg-secondary me-1"
        >
          {{ topic }}
        </span>
        <p>{{ result.Description_short }}</p>
      </div>
    </template>
    <div
      class="d-flex justify-content-center mt-3"
      v-if="results.length < totalResults && results.length"
    >
      <button
        @click="$emit('loadMore')"
        type="button"
        class="btn btn-outline-primary mx-auto"
      >
        Load more...
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    results: Array,
    totalResults: Number,
    loading: Boolean,
  },
};
</script>
