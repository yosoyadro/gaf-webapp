<template>
  <div
    ref="root"
  >
    <!-- NAVBAR -->
    <NavBar class="fixed w-full top-0 left-0 z-10 bg-black">
      <!-- logo -->
      <router-link to="/">
        <img v-if="cinemaInfo.logo" :src="cinemaInfo.logo" alt="Logo" class="h-6 md:h-8" >
        <p v-else class="text-white text-xl font-bold">{{cinemaInfo.nombre}}</p>
      </router-link>

      <!-- social -->
      <div class="social flex gap-4" v-if="!kioskMode">
        <!-- Facebook -->
        <a v-if="cinemaInfo.facebook" :href="cinemaInfo.facebook">
          <img class="w-6 h-6" src="/assets/icons/facebook-brands.svg" alt="facebook">
        </a>
        <!-- Twitter -->
        <a v-if="cinemaInfo.twitter" :href="cinemaInfo.twitter">
          <img class="w-6 h-6" src="/assets/icons/twitter-brands.svg" alt="twitter">
        </a>
        <!-- Instagram -->
        <a v-if="cinemaInfo.instagram" :href="cinemaInfo.instagram">
          <img class="w-6 h-6" src="/assets/icons/instagram-brands.svg" alt="instagram">
        </a>
      </div>

      <!-- clock -->
      <div class="clock flex gap-2" v-if="kioskMode">
        <p class="text-white text-2xl">{{ dateTime.hours }}:{{ dateTime.minutes }}</p>
        <img src="/assets/icons/time-outline.svg" alt="fecha" class="h-8">
      </div>
    </NavBar>

    <!-- MAIN -->
    <main class="pt-14 text-white" :class="(!kioskMode) ? 'min-h-screen': 'pb-20'">
      <router-view v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component" />
        </transition>
      </router-view>

    </main>

    <!-- FOOTER WEB -->
    <section
      class="footer bg-neutral p-10 flex flex-col gap-8 items-center justify-between md:flex-row"
      v-if="!kioskMode">
      <div class="cinema-info flex flex-col gap-4 items-center opacity-25 md:flex-row">
        <!-- logo -->
        <div class="logo-container md:pr-4 md:border-r">
          <img v-if="cinemaInfo.logo" src="/img/logo.png" alt="Logo" class="h-8">
          <p v-else class="text-white text-xl font-bold">{{cinemaInfo.nombre}}</p>
        </div>
        <!-- locaion -->
        <div class="location text-center md:text-left">
          <p class="text-white">{{cinemaInfo.direccion}}</p>
          <p class="text-white">{{cinemaInfo.localidad}}, {{cinemaInfo.provincia}}</p>
        </div>
      </div>

      <div class="developer flex flex-col text-center text-white opacity-25">
          <span class="text-xs">Desarrollada por</span>
          <a href="https://adro.studio" class="text-xl">adro.studio</a>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

// axios
import axios from 'axios'

// custom components
import NavBar from '@/components/NavBar.vue'
import Button from '@/components/Button.vue'

//set date
const date = new Date();

export default defineComponent({
  name: 'Inicio',
  components:{
    NavBar,
    Button
  },
  data(){
    return{
      cinemaInfo: [] as any[any],
      dateTime: {
        hours: (date.getHours() < 10) ? '0'+date.getHours() : date.getHours(),
        minutes: (date.getMinutes() < 10) ? '0'+date.getMinutes() : date.getMinutes()
      },
      timer: undefined as any,
    }
  },
  async created(){
      //get config
      const getConfig = axios.get(window.location.protocol+'//'+window.location.hostname.replace('www.','')+':'+window.location.port+'/config.json').catch(error => {
          throw 'Error de Servidor'
      })

      await Promise.resolve(getConfig).then((response)=>{
        const cineId = response.data.cineId

        //get cinema info
        const getCinemaInfo = axios.get(window.location.protocol+'//gaf.adro.studio/api/cine.php?cineId='+cineId).catch(error => {
            throw 'Error de Servidor'
        })

        Promise.resolve(getCinemaInfo).then((response)=>{
          this.cinemaInfo = response.data
          console.log(this.cinemaInfo)
        })
      })
  },
  methods: {
    setDateTime() {
      const date = new Date();
      this.dateTime = {
        hours: (date.getHours() < 10) ? '0'+date.getHours() : date.getHours(),
        minutes: (date.getMinutes() < 10) ? '0'+date.getMinutes() : date.getMinutes()
      };
    }
  },
  beforeMount() {
    this.timer = setInterval(this.setDateTime, 60000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
})
</script>

<style>
*{
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
}

/*-- Transition --*/
.fade-enter-active, .fade-leave-active /* .fade-leave-active below version 2.1.8 */ {
  position: absolute;
  width: 100%;
  left: 0;
}

/*-- Content --*/
/*.content p{
    margin-bottom: 16px;
}

.content img{
    max-width: 100%;
    height: auto;
    margin: 0 auto;
}

.content p iframe {
    display: block;
    margin: 0 auto;
    max-width: 100% !important;
}*/


/*.fade-enter-active{
  animation: enter .3s linear;
}

.fade-leave-active{
  opacity: 0;
}

@keyframes enter {
  0% {
    opacity: 0;
    padding-top: 64px;
  }
  50% {
    opacity: 0;
    padding-top: 64px;
  }
  100% {
    opacity: 100;
    padding-top: 0px;
  }
}

@keyframes leave {
  0% {
    opacity: 100;
  }
  100% {
    opacity: 0;
    }
}
*/
</style>

