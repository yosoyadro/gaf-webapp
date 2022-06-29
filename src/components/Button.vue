<template>
  <div class="button h-9 bg-white rounded-full py-2 text-md font-semibold flex items-center justify-center gap-2 cursor-pointer" :class="this.$props.iconOnly ? 'px-2' : 'px-4'">
    <slot></slot>
  </div>
</template>

<script lang="ts">
export default {
  name: "Button",
  props: {
    iconOnly: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
.button{
  width: fit-content;
}
</style>


