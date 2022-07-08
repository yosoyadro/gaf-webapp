<template>
  <div
    class="
      toast-container
      fixed
      left-0
      right-0
      text-black
      bg-amber
      p-8
      m-8
      rounded-xl
      transition-all
      duration-500
      shadow-2xl
      flex
      items-center
      justify-between
    "
    :class="showToast ? 'bottom-0' : '-bottom-80'"
  >
    <div class="toast-text">{{ message }}</div>
    <div
      class="icon w-4 h-4 bg-accent-color"
      :style="'-webkit-mask-image: url(/assets/icons/circle-exclamation-solid.svg);'"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Toast",
  data() {
    return {
      showToast: false,
      message: "",
    };
  },
  methods: {
    show: function (message: string) {
      this.message = message;
      this.showToast = true;

      setTimeout(() => {
        this.showToast = false;
      }, 5000);
    },
  },
});
</script>