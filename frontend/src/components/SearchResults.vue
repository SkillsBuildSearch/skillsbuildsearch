<template>
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

<script>
export default {
  props: {
    results: Array,
  },
};
</script>
