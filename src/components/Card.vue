<template>
  <!-- vertical simple -->
  <div
    name="card"
    v-if="type == 'vertical-simple'"
    class="w-full rounded-sm overflow-hidden flex flex-col"
  >
    <div
      v-if="data"
      name="card-image"
      class="w-full"
      :class="(slim) ? 'slim' : null">
      <div
        class="w-full rounded-sm bg-white bg-opacity-25"
        :style=" (data.portada) ? { backgroundImage: 'url(' + data.portada.data.thumbnails[5].url+ ')' } : null"
      ></div>
    </div>

    <div
      v-else
      name="card-image"
      class="w-full">
      <div
        class="w-full rounded-sm bg-white bg-opacity-25"
      ></div>
    </div>
  </div>

  <!-- vertical full -->
  <div
    name="card"
    v-if="type == 'vertical-full'"
    class="w-full bg-stone-900 rounded-xl overflow-hidden flex flex-col"
  >
    <div name="card-image" class="w-full">
      <div class="w-full rounded-xl bg-gray-100"></div>
    </div>
    <div name="card-text" class="p-4">
      <p class="text-lg font-semibold pb-2 text-white">Titulo</p>
      <p class="text-sm leading-relaxed text-white">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus
        adipisci sapiente tempore nostrum ab aliquam eos voluptatum assumenda,
        placeat porro, quos hic fugit voluptate quaerat obcaecati earum ducimus,
        molestias rem! aaaaaaaaaa
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import './components.css'

export default {
  name: "Card",
  props:{
    type: {
			type: String,
      default: "vertical-simple" 
		},
    data: {
			type: Object
    },
    slim: {
      type: Boolean,
      default: false
    }
  }
};
</script>


