<template>
  <div class="movie-page relative px-4 lg:px-8 pt-14 min-h-screen">
    <div class="content flex flex-col gap-8" v-show="!loading">
      <!-- main image -->
      <div class="main-image hidden relative w-full md:block"
      v-if="!kioskMode">
        <Banner
          :image="(movie.urlTrailer) ? 'https://img.youtube.com/vi/'+getTrailerId(movie.urlTrailer)+'/maxres1.jpg' : null"
          :showText="false"
          :showButton="false"
        />
        <!-- play icon -->
        <img
          class="
            w-10
            h-10
            md:w-20 md:h-20
            absolute
            top-1/2
            left-1/2
            transform
            -translate-x-1/2 -translate-y-1/2
            cursor-pointer
          "
          src="/assets/icons/play.svg"
          alt="play"
          v-if="movie.urlTrailer && movie.urlTrailer != ''"
          @click="playVideo()"
        />
      </div>

      <!-- video player-->
      <div
        class="
          video-player
          bg-black
          md:w-full
          md:h-full
          md:fixed
          md:top-0
          md:left-0
          md:bg-opacity-80
          md:z-10
          md:flex
          md:items-center
          md:justify-center
          md:transition
        "
        :class="(play) ? 'md:flex' : 'md:hidden'"
        v-if="!kioskMode"
      >
        <div class="
          video-container
          relative
          w-full
          bg-neutral
          md:w-3/4">
          <div
            class="
              player-header
              relative
              p-4
              justify-between
              border-b border-gray-800
              hidden
              md:flex
            "
          >
            <p>{{ movie.nombre }}</p>
            <img
              src="/assets/icons/close-outline.svg"
              alt="cerrar"
              class="cursor-pointer w-6 h-6"
              @click="stopVideo()"
            />
          </div>
          <div
            ref="youtube"
            class="video-body relative w-full"
            style="padding-top: 56.25%"
          >
              
          </div>
        </div>
      </div>

      <!-- movie info / showtimes -->
      <section
        class="
          movie
          relative
          w-full
          flex
          gap-8
          mb-10
          overflow-hidden"
          :class="(!kioskMode) ? 'md:px-4 md:-mt-36' : null"
      >
        <!-- poster desktop -->
        <div class="poster hidden md:w-1/5 md:flex md:flex-none">
          <MovieItem
            :showTitle="false"
            :poster="movie.poster ? movie.poster : noPoster"
          />
        </div>

        <div class="mobile w-full md:w-4/5 flex-none">
          <!-- title -->
          <div class="title flex gap-4 items-center md:h-36">
              <div class="poster w-2/5 flex-none md:hidden">
                <MovieItem
                  :showTitle="false"
                  :poster="movie.poster ? movie.poster : noPoster"
                />
              </div>
              <div class="text flex flex-col gap-4">
                  <p class="text-xs">Comprá tus entradas para</p>
                  <p
                  class="
                      title
                      text-xl
                      font-bold
                      md:text-4xl
                  "
                  v-if="movie.nombre"
                  >
                  {{ movie.nombre }}
                  </p>
              </div>
          </div>

          <!-- showtimes -->
          <div class="showtimes" v-if="showtimes.length > 0">
            <div class="showtimes w-full flex flex-col gap-4">
              <div class="dates flex border-b border-gray-600 mb-4 overflow-auto">
                <div
                  class="date flex-none w-24 text-center py-4 cursor-pointer"
                  :class="itemIndex == 0 ? 'border-b-4' : null"
                  v-for="(item, itemIndex) in showtimes"
                  :key="itemIndex"
                  @click.capture="selectDay(itemIndex, item)"
                  ref="date"
                >
                  <p class="text-md md:text-xl">{{ item.day }}</p>
                  <p class="text-xs md:text-sm">{{ item.date }}</p>
                </div>
              </div>
              <div
                class="shows w-full flex gap-8"
                v-show="selectedDay.shows"
              >
                <div
                  class="show-container w-1/4 md:w-1/6 lg:w-1/12"
                  v-for="(show, showIndex) in selectedDay.shows"
                  :key="showIndex"
                >
                  <div class="show text-center cursor-pointer">
                    <router-link :to="'/entradas/'+show.fref">
                      <p
                        class="
                          px-4
                          py-2
                          border
                          rounded-md
                          mb-2
                          text-sm
                          md:text-md
                        "
                      >
                        {{ show.hora }}
                      </p>
                    </router-link>
                    <p class="text-xs">{{ show.idioma }} - {{ show.formato }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- no showtimes -->
          <div class="no-showtimes py-8 text-center md:text-left" v-else>
            <p class="text-xl font-bold">No Hay funciones disponibles</p>
          </div>
        </div>      
      </section>

      <!-- FOOTER KIOSK -->
      <section
        class="footer w-full fixed bottom-0 left-0 bg-neutral px-10 py-6 flex flex-row gap-8 items-center justify-between text-white"
        v-if="kioskMode">
        <Button class="text-black" @click="$router.go(-1)">Volver</Button>
        <Button class="text-black">Continuar</Button>
      </section>
    </div>
    <!-- loading spinner-->
    <Spinner v-show="loading" class="absolute h-screen fixed" />
  </div>
</template>

<script lang="ts">
// custom components
import Spinner from "@/components/Spinner.vue";
import Banner from "@/components/Banner.vue";
import MovieItem from "@/components/MovieItem.vue";
import Button from '@/components/Button.vue'

import utilities from "@/utilities";

import { defineComponent } from "vue";

export default defineComponent({
  name: "Película",
  components: {
    Banner,
    MovieItem,
    Button,
    Spinner
  },
  data() {
    return {
      loading: true,
      videoId: "",
      movie: [] as any[any],
      showtimes: [] as any[any],
      selectedDay: [] as any[any],
      selectedShow: [] as any[any],
      noPoster: "/assets/img/no_poster.jpg",
      play: false
    };
  },
  async created() {
    // get pref
    const pref = this.$route.params.pref;

    //get showtimes
    const getShowtimes = utilities.getFromApi('/movie/'+pref)

    Promise.resolve(getShowtimes).then((response) => {
      this.movie = response.data.data.movie

      //set video player
      this.setVideoPlayer()

      //set index
      let index = 0;

      //set previous date
      let prevDate: string;

      response.data.data.showtimes.forEach((showtime: any[any]) => {
        // set date
        let date = showtime.fechaHora.date.split(" ")[0];

        //format showtime data
        let showtimeData = {} as any;
        showtimeData.hora = showtime.fechaHora.date.split(" ")[1].slice(0, -10);
        showtimeData.formato = showtime.formato;
        showtimeData.idioma = showtime.lenguaje;
        showtimeData.fref = showtime.fref;
        showtimeData.sala = showtime.sala;
        showtimeData.tickets = showtime.tickets;

        // set date array
        if (prevDate != date) {
          // update date
          prevDate = date;

          //update index
          index++;

          //init array
          this.showtimes[index - 1] = [] as any[any];

          // set day
          let day = new Date(date);
          const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
          this.showtimes[index - 1]["day"] = days[day.getDay()];

          //set short date
          const shortDate = date.split("-");
          this.showtimes[index - 1]["date"] = shortDate[2] + "/" + shortDate[1];

          this.showtimes[index - 1]["shows"] = [] as any[any];
        }

        // push showtime data to date
        this.showtimes[index - 1]["shows"].push(showtimeData);
      });

      //defaut selected day
      if(this.showtimes.length > 0){
        this.selectedDay = this.showtimes[0];
      }

      this.loading = false
    });
  },
  mounted() {
    //scrollto top
    window.scrollTo(0, 0);
  },
  methods: {
    getTrailerId(url: string){
      //clean url
      url = url.replace(/"/g, "");

      //define id
      let id: string;

      //get domain
      let link = new URL(url);
      const domain = link.hostname;

      //get id
      if (domain == "youtu.be") {
        id = link.pathname.replace("/", "");
      } else if (link.searchParams.get("v")) {
        id = link.searchParams.get("v") as string;
      } else {
        id = url.split("/")[4];
      }

      return id
    },
    setVideoPlayer(){
      const trailerId = this.getTrailerId(this.movie.urlTrailer) as string
      if(this.$refs.youtube){
        (this.$refs.youtube as HTMLElement).innerHTML = '' as string
        (this.$refs.youtube as HTMLElement).innerHTML = '<iframe width="560" height="315" class="youtube w-full h-full position absolute top-0 left-0" src="https://www.youtube.com/embed/'+trailerId+'?autoplay=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' as string
      }
    },
    playVideo() {
      this.play = true
    },
    stopVideo() {
      this.setVideoPlayer()
      this.play = false
    },
    selectDay(index: number, data: any[any]) {
      //remove previous ticket prices
      this.selectedShow = [] as any[any]

      //remove border on previous date
      (this.$refs as any).date.forEach(
        (item: HTMLElement, itemIndex: number) => {
          if (itemIndex != index) {
            item.classList.remove("border-b-4");
          } else {
            item.classList.add("border-b-4");
          }
        }
      );

      this.selectedDay = data
    },
    selectShow(data: any[any]) {
      this.selectedShow = data;
    }
  },
});
</script>
