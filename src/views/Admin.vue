<template>
    <div class="page admin">
        <SideBar :menuOptions="menuOptions"/>

        <!-- BANNERS -->
        <section class="banners" v-show="$route.params.section === 'banners'">
            <div class="section-header w-full h-16 px-8 bg-zinc flex items-center justify-between z-10">
                <div class="section-title flex items-center gap-4 text-white">
                    <div class="page-icon p-3 bg-gray-700 rounded-full">
                        <img src="/assets/icons/albums-outline.svg" alt="Boletería" class="h-5 w-5" />
                    </div>
                    <p class="text-md font-bold">Banners</p>
                </div>
            </div>
            <div class="section-body p-8 flex flex-col gap-8 mt-16">
                <Banner v-for="(banner, index) in banners" :key="index" :image="banner.image"/>
            </div>
        </section>

        <!-- MOVIES -->
        <section class="movies" v-show="$route.params.section === 'peliculas'">
            <div class="section-header w-full h-16 px-8 bg-zinc flex items-center justify-between z-10">
                <div class="section-title flex items-center gap-4 text-white">
                    <div class="page-icon p-3 bg-gray-700 rounded-full">
                        <img src="/assets/icons/albums-outline.svg" alt="Boletería" class="h-5 w-5" />
                    </div>
                    <p class="text-md font-bold">Películas</p>
                </div>
            </div>
            <div class="section-body p-8 grid grid-cols-2 gap-8 mt-16 md:grid-cols-4" v-if="nowPlaying.length > 0"> 
                <MovieItem
                    v-for="(item,index) in nowPlaying" :key="index"
                    :title="item.nombre"
                    :poster="(item.poster) ? item.poster : noPoster"
                />
            </div>
        </section>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

// axios
import axios from 'axios'

// Import Custom Components
import SideBar from '@/components/SideBar.vue'
import Banner from "@/components/Banner.vue";
import MovieItem from "@/components/MovieItem.vue";

export default defineComponent({
  name: 'Admin',
  components:{
    SideBar,
    Banner,
    MovieItem
  },
  data(){
      return{
          nowPlaying: [],
          menuOptions: [
              {
                  link: '/admin/banners',
                  label: 'Banners',
                  icon: '/assets/icons/albums-outline.svg'
              },
              {
                  link: '/admin/peliculas',
                  label: 'Peliculas',
                  icon: '/assets/icons/albums-outline.svg'
              }
          ],
          banners: [
            {
            image: '/assets/img/banner_01.jpg'
            },
            {
            image: '/assets/img/banner_02.jpg'
            },
            {
            image: '/assets/img/banner_03.jpg'
            }
        ],
        noPoster: '/assets/img/no_poster.jpg'
      }
  },
  created(){
    //get now playing
    const getNowPlaying = axios.get('https://nogales.adro.studio/api/cartelera.php').catch(error => {
        console.log(error.response)
        throw 'Error de Servidor'
    })

    Promise.resolve(getNowPlaying).then((response)=>{
      this.nowPlaying = response.data
    })
  },
  mounted(){
      console.log(this.$route.params)
  },
  watch:{
        $route (to, from){
            console.log(this.$route.params)
        }
    }
})

</script>

<style>
section{
    margin-left: 220px;
}

.section-header{
    position: fixed;
    top:0;
    left: 220px;
}
</style>