import { mount } from "@vue/test-utils";
import SearchBox from "./src/components/SearchBox.vue";
import { describe, it, expect, vi, afterEach } from "vitest";

describe("SearchBox.vue", () => {
  afterEach(async () => {
    await vi.clearAllMocks();
  });
  it("emits search event when search button clicked", () => {
    const wrapper = mount(SearchBox);

    wrapper
      .find("input[type='search']")
      .setValue("test string over twelve characters");
    wrapper.find("#search-button").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("search");
    expect(wrapper.emitted().search[0]).toEqual([
      "test string over twelve characters",
    ]);
  });
  it("emits error event when search button clicked and text is not long enough", () => {
    const wrapper = mount(SearchBox);

    wrapper.find("input[type='search']").setValue("under 12");
    wrapper.find("#search-button").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("error");
    expect(wrapper.emitted().error[0]).toEqual([
      [
        "Your search term is not long enough for the results to be relevant. Please input more text.",
        2,
      ],
    ]);
  });
  it("calls ToggleRecord function when microphone button clicked", () => {
    const wrapper = mount(SearchBox);

    const toggleRecord = vi.fn(() => 1);
    wrapper.vm.toggleRecord = toggleRecord;

    wrapper.find({ ref: "voiceButton" }).trigger("click");
    toggleRecord.mockReturnValueOnce(1);
  });
});
