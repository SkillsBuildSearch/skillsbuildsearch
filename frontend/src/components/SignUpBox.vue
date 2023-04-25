<template>
  <div
    class="modal fade"
    id="signUpModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">
            Hey, you - sign up to SkillsBuild!
          </h1>
          <button
            type="button"
            class="btn-close"
            @click="close()"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          Before you start any of the courses, you need to get your IBM
          SkillsBuild account here.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close()">
            Close
          </button>
          <button @click="signUp()" type="button" class="btn btn-primary">
            Sign up
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Modal } from "bootstrap";

export default {
  methods: {
    saveCookie() {
      document.cookie = "popup=false; SameSite=Strict; Secure";
    },
    close() {
      this.saveCookie();
      Modal.getInstance(document.getElementById("signUpModal")).hide();
    },
    getCookie() {
      // Returns true if the popup should be shown.
      return (
        "false" !==
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("popup="))
          ?.split("=")[1]
      );
    },
    signUp() {
      // Redirects user to sign up to SkillsBuild and closes the modal.
      this.close();
      window.location.assign("https://skillsbuild.org");
    },
  },
  mounted() {
    setTimeout(() => {
      const signUpModal = new Modal("#signUpModal", {
        keyboard: false,
      });
      if (this.getCookie()) {
        signUpModal.show();
      }
    }, 1000);
  },
};
</script>
