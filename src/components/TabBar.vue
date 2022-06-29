<template>
  <div
    name="tabbar"
    class="
      h-12
      fixed
      z-10
      bottom-0
      left-0
      right-0
      flex
      bg-black
      items-center
      justify-around"
  >
    <router-link
      name="tab"
      v-for="(tab, index) in tabs" :key="index"
      :to="'/'+tab.link"
      class="flex flex-col items-center justify-center"
      :class="($router.currentRoute.value.fullPath === '/'+tab.link) ? 'opacity-100' : 'opacity-50'">
      <img name="icon" :src="'/assets/icons/'+tab.icon" alt="home" class="w-5 h-5">
      <span name="label" class="text-xs text-white">
        {{tab.label}}
      </span>
    </router-link>
  </div>
</template>

<script lang="ts">
import router from '../router'

export default {
  name: "TabBar",
  data(){
    return{
      route: '',
      tabs:[
        {
          label: "Inicio",
          icon: "home.svg",
          link: "inicio"
        },
        {
          label: "Próximamente",
          icon: "albums-outline.svg",
          link: "proximamente"
        },
        {
          label: "Noticias",
          icon: "chatbubble-ellipses-outline.svg",
          link: "noticias"
        },{
          label: "Buscar",
          icon: "search-outline.svg",
          link: "buscar"
        }
      ]
    }
  }
};
</script>


