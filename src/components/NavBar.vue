<template>
  <div
    ref="navbar"
    class="
      h-12
      md:h-14
      flex
      gap-4
      lg:rounded-b-xl
      px-4
      items-center
      justify-between
      lg:px-10
    ">
     <slot></slot>
  </div>
</template>

<script lang="ts">
export default {
    name: 'NavBar',
}
</script>


