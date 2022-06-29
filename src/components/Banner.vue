<template>
  <!-- banner -->
  <div
    v-if="image"
    class="
      banner
      relative
      w-full
      bg-white
      bg-opacity-25
      md:rounded-md
      overflow-hidden"
    :style="(image) ? { backgroundImage: 'url(' + image + ')' } : null">
  </div>

  <!-- skeleton -->
  <div v-else
    class="
      banner
      w-full
      bg-white
      bg-opacity-25
      rounded-md"
  />
</template>

<script lang="ts">
import './components.css'

export default {
  name: "Banner",
  props:{
    image: {
      type: String
    },
    data: {
			type: Object
    },
    showButton: {
      type: Boolean,
      default: true
    },
    showText:{
      type: Boolean,
      default: true
    }
  }
};
</script>

<style>
.banner {
    padding-top: 35%;
    background-position: center;
    background-size: cover;
    overflow: hidden;
}

/*@media (min-width: 768px) {
    .banner {
        padding-top: 30%;
    }
}*/
</style>


