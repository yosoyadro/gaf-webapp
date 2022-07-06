<template name="home">
  <div class="home-page relative text-white pt-14 pb-20">
    <!-- FEATURED -->
    <section class="mb-6 lg:mb-10 lg:px-10"
    v-if="!kioskMode">
      <div
        class="swiper"
        ref="featured"
        v-show="featured.length > 0"
      >
        <div class="swiper-wrapper">
          <div
            class="swiper-slide"
            v-for="(item, index) in featured"
            :key="index"
          >
            <Banner v-if="item" :image="item.image" />
          </div>

          <div class="swiper-pagination"></div>
        </div>
      </div>
      <!-- Skeleton -->
      <div
        v-show="featured.length == 0"
        class="flex gap-2 px-4 animate-pulse lg:px-10"
      >
        <Banner />
      </div>
    </section>

    <!-- NOW PLAYING -->
    <section class="mb-6 lg:mb-10">
      <!-- Section Title -->
      <p
        class="
          px-4
          lg:px-10
          pb-2
          text-lg
          font-bold
          lg:text-2xl
          lg:pb-6
        "
        v-if="!kioskMode"
      >
        Comprá tu entrada
      </p>
      <div v-if="nowPlaying.length > 0" class="showtimes grid grid-cols-2 md:grid-cols-4 gap-4 px-4 lg:px-10">
        <router-link :to="'/pelicula/'+item.pref" v-for="(item,index) in nowPlaying" :key="index">
          <MovieItem
            :title="item.nombre"
            :poster="(item.poster) ? item.poster : noPoster"
          />
        </router-link>
      </div>

      <div v-else class="showtimes grid grid-cols-2 md:grid-cols-4 gap-4 px-4 lg:px-10">
        <MovieItem
          v-for="index in 4"
          :key="index"
        />
      </div>
    </section>

    <!-- COMING SOON -->
    <section
    class="mb-6 lg:mb-10"
    v-if="!kioskMode">
      <!-- Section Title -->
      <p
        class="
          px-4
          lg:px-10
          pb-2
          text-lg
          font-bold
          lg:text-2xl lg:pb-6
        "
      >
        Próximamente
      </p>
      <!-- Swiper -->
      <div class="swiper px-4 lg:px-10" ref="comingSoon">
        <div class="swiper-wrapper">
          <div
            class="swiper-slide"
            v-for="item in comingSoon"
            :key="item.id"
          > 
            <MovieItem
              :showTitle="true"
              :showDateTag="true"
              :poster="item.poster"
              :title="item.titulo_local"
            />
          </div>
          <!-- Skeleton -->
          <div
            class="swiper-slide"
            :class="comingSoon.length == 0 ? 'visible' : 'hidden'"
            v-for="index in 6"
            :key="index"
          >
            <MovieItem :showTitle="true" :showDateTag="true" :movie="item" />
          </div>
          <div class="swiper-pagination"></div>
        </div>
      </div>
    </section>

    <!-- FOOTER KIOSK -->
    <section
      class="footer w-full fixed bottom-0 left-0 bg-neutral px-10 py-6 flex flex-row gap-8 items-center justify-between text-white"
      v-if="kioskMode">
      <p class="text-2xl">¿Ya compraste tus entradas?</p>
      <router-link to="/retiro">
        <Button class="text-black">Iniciar Retiro</Button>
      </router-link>
    </section>

  </div>
</template>

<script lang="ts">
// Utils
import utilities from "../utilities";

//Vuex
import { mapState } from "vuex";

// Swiper
import { Swiper, Autoplay } from "swiper"
Swiper.use([Autoplay])
import "swiper/swiper-bundle.css"

// Custom Components
import Banner from "@/components/Banner.vue"
import MovieItem from "@/components/MovieItem.vue"
import Button from '@/components/Button.vue'

import { defineComponent } from "vue";

export default defineComponent({
  components: {
    Banner,
    MovieItem,
    Button
  },
  data() {
    return {
      featured: [
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
      config: [] as any[any],
      nowPlaying: [] as any[any],
      comingSoon: [] as any[any],
      noPoster: '/assets/img/no_poster.jpg'
    };
  },
  async mounted() {
    //scrollto top
    window.scrollTo(0, 0);

    //set header
    //utilities.setHeader()

    //create featured swiper
    const featuredOpts = {
      centeredSlides: true,
      spaceBetween: 8,
      speed: 500,
      loop: true,
      autoplay: {
        delay: 5000,
      },
      breakpoints: {
        768: {
          spaceBetween: 16,
        },
      },
    };

    setTimeout(() => {
      new Swiper(this.$refs.featured as any, featuredOpts);
    }, 1);


    //create coming soon swiper
    const comingSoonOpts = {
      slidesPerView: 3,
      spaceBetween: 8,
      speed: 300,
      resistanceRatio: 0.75,
      grabCursor: true,
      longSwipes: true,
      breakpoints: {
        768: {
          slidesPerView: 6,
          spaceBetween: 16,
        },
      },
    };

    new Swiper(this.$refs.comingSoon as any, comingSoonOpts);

    // get now playing
    if(this.$store.state.cinemaInfo.id){
      this.getNowPlaying()
    }

    //get thu
    const thisThu = utilities.getThu();

    //get coming soon movies
    let comingSoon = utilities.getComingSoon(
      "peliculas",
      "peliculas?fields=*,poster.*&filter[fecha_local][gt]=" +
        thisThu +
        "&sort=fecha_local&limit=6"
    );
    Promise.resolve(comingSoon).then((data) => {
      this.comingSoon = data;
      this.comingSoon.forEach((item: any, index: number) => {
        this.comingSoon[index].poster = item.poster.data.thumbnails[5].url
        this.comingSoon[index].fecha_local = utilities.getFormatedDate(
          item.fecha_local
        );
      });
    });
  },
  computed: mapState(['cinemaInfo']),
  methods:{
    getNowPlaying(){
      const cinemaId = this.$store.state.cinemaInfo.id
      const getNowPlaying = utilities.getFromApi('/nowPlaying/'+cinemaId)

      Promise.resolve(getNowPlaying).then((response)=>{
        this.nowPlaying = response.data.data
      })
    }
  },
  watch:{
    cinemaInfo(data){
      if(data.id){ 
        this.getNowPlaying()
      }
    }
  }

})
</script>

<style scoped>
.main {
  top: 36em;
}
</style>
