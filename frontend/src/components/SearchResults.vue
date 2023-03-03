<template>
  <div>
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
    <div
      class="d-flex justify-content-center"
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
  },
};
</script>
