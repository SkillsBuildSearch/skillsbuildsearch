<script setup>
import { Alert } from "bootstrap";
</script>

<template>
  <div
    id="alertInstance"
    class="alert alert-dismissible fade show"
    :class="{ 'alert-danger': code == 1, 'alert-warning': code == 2 }"
    role="alert"
  >
    <strong>Error</strong>
    {{ message }}
    <!--     <button
      type="button"
      class="btn-close"
      data-bs-dismiss="alert"
      aria-label="Close"
    ></button> -->
  </div>
</template>

<script>
export default {
  props: {
    message: String,
    code: Number,
  },
  mounted() {
    setTimeout(() => {
      const alert = Alert.getOrCreateInstance("#alertInstance");
      alert.close();
    }, 5000);
  },
};
</script>
