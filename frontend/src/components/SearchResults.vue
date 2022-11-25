<template>
  <div v-for="result in searchResults" :key="result.link">
    <h2>
      <a :href="result.link">{{ result.title }}</a>
    </h2>
    <p>{{ result.desc }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchResults: [
        {
          title: "AI course",
          desc: "The best AI course ever",
          link: "https://google.com",
        },
      ],
    };
  },
};
</script>
