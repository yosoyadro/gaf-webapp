<template>
  <div ref="root">
    <!-- NAVBAR -->
    <NavBar class="fixed w-full top-0 left-0 z-10 bg-black">
      <!-- logo -->
      <router-link to="/">
        <img
          v-if="$store.state.cinemaInfo.logo"
          :src="$store.state.cinemaInfo.logo"
          alt="Logo"
          class="h-6 md:h-8"
        />
        <p v-else class="text-white text-xl font-bold">
          {{ $store.state.cinemaInfo.nombre }}
        </p>
      </router-link>

      <!-- social -->
      <div class="social flex gap-4" v-if="!kioskMode">
        <!-- Facebook -->
        <a
          v-if="$store.state.cinemaInfo.facebook"
          :href="$store.state.cinemaInfo.facebook"
        >
          <img
            class="w-6 h-6"
            src="/assets/icons/facebook-brands.svg"
            alt="facebook"
          />
        </a>
        <!-- Twitter -->
        <a
          v-if="$store.state.cinemaInfo.twitter"
          :href="$store.state.cinemaInfo.twitter"
        >
          <img
            class="w-6 h-6"
            src="/assets/icons/twitter-brands.svg"
            alt="twitter"
          />
        </a>
        <!-- Instagram -->
        <a
          v-if="$store.state.cinemaInfo.instagram"
          :href="$store.state.cinemaInfo.instagram"
        >
          <img
            class="w-6 h-6"
            src="/assets/icons/instagram-brands.svg"
            alt="instagram"
          />
        </a>
      </div>

      <!-- clock -->
      <div
        class="clock flex gap-2 select-none"
        v-if="kioskMode"
        @click="openKioskMenu()"
      >
        <p class="text-white text-2xl">
          {{ dateTime.hours }}:{{ dateTime.minutes }}
        </p>
        <img src="/assets/icons/time-outline.svg" alt="fecha" class="h-8" />
      </div>
    </NavBar>

    <!-- MAIN -->
    <main
      class="text-white"
      :class="!kioskMode ? 'min-h-screen' : 'pb-20'"
    >
      <router-view v-slot="{ Component }">
        <transition name="fade">
          <!--keep-alive exclude="Pagar"-->
            <component :is="Component" />
          <!--/keep-alive-->
        </transition>
      </router-view>
    </main>

    <!-- FOOTER WEB -->
    <section
      class="
        footer
        bg-neutral
        p-10
        flex flex-col
        gap-8
        items-center
        justify-between
        md:flex-row
      "
      v-if="!kioskMode"
    >
      <div
        class="
          cinema-info
          flex flex-col
          gap-4
          items-center
          opacity-25
          md:flex-row
        "
      >
        <!-- logo -->
        <div class="logo-container md:pr-4 md:border-r">
          <img
            v-if="$store.state.cinemaInfo.logo"
            src="/img/logo.png"
            alt="Logo"
            class="h-8"
          />
          <p v-else class="text-white text-xl font-bold">
            {{ $store.state.cinemaInfo.nombre }}
          </p>
        </div>
        <!-- location -->
        <div class="location text-center md:text-left">
          <p class="text-white">{{ $store.state.cinemaInfo.direccion }}</p>
          <p class="text-white">
            {{ $store.state.cinemaInfo.localidad }},
            {{ $store.state.cinemaInfo.provincia }}
          </p>
        </div>
      </div>

      <div class="developer flex flex-col text-center text-white opacity-25">
        <span class="text-xs">Desarrollada por</span>
        <a href="https://adro.studio" class="text-xl">adro.studio</a>
      </div>
    </section>

    <!-- KIOSK MENU -->
    <KioskMenu v-if="kioskMode" ref="kioskMenu" />

    <!-- TOAST FOR UPDATES -->
    <Toast ref="toast" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

// utilities
import utilities from "./utilities";

// custom components
import NavBar from "@/components/NavBar.vue";
import Button from "@/components/Button.vue";
import KioskMenu from "@/components/KioskMenu.vue";
import Toast from "@/components/Toast.vue";
import { CustomVue } from "vuex";

//set date
const date = new Date();

//enable kiosk config menu
let kioskMenuCounter = 0;

export default defineComponent({
  name: "Inicio",
  components: {
    NavBar,
    Button,
    KioskMenu,
    Toast,
  },
  data() {
    return {
      dateTime: {
        hours: date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
        minutes:
          date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
      },
      timer: undefined as any,
    };
  },
  async created() {
    //get config
    const cinemaConfig = await utilities.getConfig()

    //get cinema info
    const cinemaId = cinemaConfig.data.cinemaId;
    const cinemaInfo = await utilities.getFromApi("/cinemas/" + cinemaId);

    if (cinemaInfo.data.status == "ok") {
      this.$store.commit("setCinemaInfo", cinemaInfo.data.data);
    } else {
      const toast = this.$refs.toast as any
      toast.show("Hubo un problema al cargar la información de este cine. Por favor, recargue la web.")
    }
  },
  mounted() {
    //Electron
    if ((this as any).kioskMode) {

      //set electron api
      const { electron } = window as any;
        
      //on new update
      electron.on('update_available', () => {
        const toast = this.$refs.toast as any
        toast.show("Hay una nueva actualización. Se inició la descarga.")
      })

      //on update downloaded
      electron.on('update_downloaded', () => {
        // show toast
        const toast = this.$refs.toast as CustomVue
        toast.show("Instalando nueva actualizacion. La aplicación se reiniciará.")

        // give time to read and restart
        setTimeout(() => {
          electron.send('update_install')
        }, 5000);
      })

      //print ticket
      //electron.send("print")
    }
  },
  methods: {
    setDateTime() {
      const date = new Date();
      this.dateTime = {
        hours: date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
        minutes:
          date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
      };
    },
    openKioskMenu() {
      if (kioskMenuCounter < 4) {
        kioskMenuCounter++
      } else {
        // show kiosk menu
        const kioskMenu = this.$refs.kioskMenu as CustomVue
        kioskMenu.toggleMenu(true)

        // reset kiosk menu count
        kioskMenuCounter = 0
      }
    },
  },
  beforeMount() {
    this.timer = setInterval(this.setDateTime, 60000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
});
</script>

<style>
* {
  font-family: "Poppins", sans-serif;
  font-size: 16px;
}

/*-- Transition --*/
/*.fade-enter-active, .fade-leave-active {
  width: 100%;
}*/

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

.fade-enter-active{
  animation: enter .3s linear;
}

.fade-leave-active{
  opacity: 0;
}

@keyframes enter {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 100;
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
</style>

