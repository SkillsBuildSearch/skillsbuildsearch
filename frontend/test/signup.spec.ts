import { mount } from "@vue/test-utils";
import SignUpBox from "./src/components/SignUpBox.vue";
import { describe, it, expect, vi, afterEach } from "vitest";

describe("SignUpBox.vue", () => {
  afterEach(async () => {
    await vi.clearAllMocks();
  });
  it("Checks that signup modal is shown", () => {
    const wrapper = mount(SignUpBox);
    const getCookie = vi.fn(() => false);
    wrapper.vm.getCookie = getCookie();
    setTimeout(() => {
      const signUpModal = wrapper.find("#signUpModal");
      console.log(signUpModal.wrapperElement);
      expect(signUpModal.attributes("style")).toContain("display: none;");
    }, 1500);
  });
  it("Checks that signup modal is not shown", () => {
    const wrapper = mount(SignUpBox);
    const getCookie = vi.fn(() => true);
    wrapper.vm.getCookie = getCookie();
    setTimeout(() => {
      const signUpModal = wrapper.find("#signUpModal");
      console.log(signUpModal.wrapperElement);
      expect(signUpModal.attributes("style")).not.toContain("display: none;");
    }, 1500);
  });
});
