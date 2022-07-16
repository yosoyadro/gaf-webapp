<template>
  <div class="page tickets-page px-4 lg:px-8 pt-14 min-h-screen pb-10" :class="loading ? 'flex items-center justify-center' : ''">
    <div class="content flex gap-8" v-if="!loading">
      <!-- TICKETS SELECTOR-->
      <section
        class="tickets-selector hidden gap-4 md:w-1/2 md:flex md:flex-col"
      >
        <!-- tickets list -->
        <div
          class="
            ticket
            w-full
            h-16
            bg-neutral
            px-4
            flex
            items-center
            justify-between
            rounded-md
          "
          v-for="ticket in selectedShow.tickets"
          :key="ticket.id"
          v-show="selectedShow.tickets.length > 0"
        >
          <p>{{ ticket.detalle }}</p>
          <p>$ {{ ticket.precio }}</p>
          <Counter @counterUpdated="addToCart(ticket, $event)" />
        </div>

        <!-- no tickets -->
        <div
          class="
            ticket
            w-full
            h-16
            bg-neutral
            px-4
            flex
            items-center
            justify-center
            rounded-md
          "
          v-show="selectedShow.length == 0"
        >
          <p>No se encontraron tickets disponbles</p>
        </div>
      </section>

      <section class="cart w-full md:w-1/2">
        <!-- MOVIE -->
        <div class="movie w-full flex gap-4 pb-4">
          <div class="movie-poster flex-none w-1/3 lg:w-1/5">
            <MovieItem
              :showTitle="false"
              :poster="
                selectedShow.movie.poster ? selectedShow.movie.poster : noPoster
              "
            />
          </div>
          <div class="movie-details w-2/3 flex flex-col gap-4">
            <div class="movie-title">
              <p class="text-xl font-bold md:text-4xl truncate">
                {{ selectedShow.movie.nombre }}
              </p>
            </div>
            <div class="movie-language-format flex gap-2">
              <p class="format px-2 py-1 border rounded-md text-xs">
                {{ selectedShow.movie.lenguaje }}
              </p>
              <p class="format px-2 py-1 border rounded-md text-xs">
                {{ selectedShow.movie.formato }}
              </p>
            </div>
            <div class="movie-screeningroom">
              <p>{{ selectedShow.movie.nombreCine }}</p>
              <p>Sala: {{ selectedShow.movie.sala }}</p>
            </div>
          </div>
        </div>

        <!-- TICKETS SELECTOR MOBILE -->
        <section class="tickets-selector flex flex-col gap-4 w-full md:hidden mb-4">
          <!-- tickets list -->
          <div
            class="
              ticket
              w-full
              h-16
              bg-neutral
              px-4
              flex
              items-center
              justify-between
              rounded-md
            "
            v-for="ticket in selectedShow.tickets"
            :key="ticket.id"
            v-show="selectedShow.tickets.length > 0"
          >
            <p>{{ ticket.detalle }}</p>
            <p>$ {{ ticket.precio }}</p>
            <Counter @counterUpdated="addToCart(ticket, $event)" />
          </div>

          <!-- no tickets -->
          <div
            class="
              ticket
              w-full
              h-16
              bg-neutral
              px-4
              flex
              items-center
              justify-center
              rounded-md
            "
            v-show="selectedShow.length == 0"
          >
            <p>No se encontraron tickets disponbles</p>
          </div>
        </section>

        <div class="divider w-full border-b border-gray-600 mb-4"></div>

        <!-- RESUME -->
        <div class="resume flex flex-col gap-4 mb-8">
          <!-- Items List -->
          <div
            class="
              item
              w-full
              flex
              items-center
              justify-between
              border-b border-gray-600
              pb-4
            "
            v-for="(item, index) in cart.items"
            :key="index"
            v-show="cart.items.length > 0"
          >
            <div class="item-detail">
              <p class="text-xl">
                {{
                  item.cantidad == 1
                    ? item.cantidad + " Entrada"
                    : item.cantidad + " Entradas"
                }}
              </p>
              <p class="text-sm">{{ item.detalle }}</p>
            </div>
            <div class="item-total">
              <p>$ {{ item.total }}</p>
            </div>
          </div>

          <!-- no items -->
          <div
            class="
              ticket
              w-full
              flex flex-col
              items-center
              justify-center
              border-b border-gray-600
              pb-4
            "
            v-show="cart.items.length == 0"
          >
            <p class="text-xl">Su compra se encuenta vacía</p>
            <p class="text-sm">Comience agregando entradas</p>
          </div>

          <!-- Subtotal -->
          <!--div class="subtotal flex items-center justify-between">
                  <p class="text-xl">Subtotal</p>
                  <p class="text-xl">$0</p>
              </div-->

          <!-- Service Charges -->
          <!--div class="service-charges flex items-center justify-between">
                  <p class="text-xl">Cargos por servicio</p>
                  <p class="text-xl">$0</p>
              </div-->

          <!-- Total -->
          <div class="total flex items-center justify-between">
            <p class="text-xl font-bold">TOTAL</p>
            <p class="text-xl font-bold">${{ cart.total }}</p>
          </div>
        </div>

        <!-- PAY BUTTON -->
        <div class="buttonContainer flex justify-center" v-if="!kioskMode">
          <Button
            class="bg-neutral"
            :class="cart.items.length > 0 ? 'opacity-100' : 'opacity-20'"
            @click="continueToPay()"
            >Finalizar</Button
          >
        </div>
      </section>

      <!-- FOOTER KIOSK -->
      <section
        class="
          footer
          w-full
          fixed
          bottom-0
          left-0
          bg-neutral
          px-10
          py-6
          flex flex-row
          gap-8
          items-center
          justify-between
          text-white
        "
        v-if="kioskMode"
      >
        <Button class="text-black" @click="$router.go(-1)">Volver</Button>
        <Button class="text-black" @click="continueToPay()">Pagar</Button>
      </section>
    </div>

    <!-- loading spinner -->
    <Spinner v-else />

    <!-- Toast -->
    <Toast ref="toast" />
  </div>
</template>

<script lang="ts">
// utilities
import utilities from "@/utilities";

// custom components
import Spinner from "@/components/Spinner.vue"
import MovieItem from "@/components/MovieItem.vue"
import Counter from "@/components/Counter.vue"
import Button from "@/components/Button.vue"
import Toast from "@/components/Toast.vue"

import { defineComponent } from "vue";

export default defineComponent({
  name: "Entradas",
  components: {
    MovieItem,
    Counter,
    Button,
    Spinner,
    Toast,
  },
  data() {
    return {
      loading: true,
      selectedShow: [] as any[any],
      cart: {
        saleId: 0,
        movie: [] as any[any],
        items: [] as any[any],
        total: 0,
      },
      noPoster: "/assets/img/no_poster.jpg",
      showConfirmDialog: false
    };
  },
  async created() {
    // get pref
    const fref = this.$route.params.fref;

    //get showtimes
    const getShowtimes = utilities.getFromApi("/tickets/" + fref);

    Promise.resolve(getShowtimes).then((response) => {
      this.selectedShow = response.data;
      this.cart.movie = response.data.movie;
      this.loading = false;
    });
  },
  mounted() {
    //scrollto top
    window.scrollTo(0, 0);
  },
  methods: {
    addToCart(item: any[any], quantity: number) {
      let itemFound = false;

      //ON CART WITH ITEMS
      this.cart.items.forEach((cartItem: any[any], index: number) => {
        if (cartItem.id === item.id) {
          itemFound = true;
          if (quantity > 0) {
            this.cart.items[index].cantidad = quantity;
            this.cart.items[index].total =
              this.cart.items[index].precio * this.cart.items[index].cantidad;
          } else {
            console.log("removing item");
            this.cart.items.splice(index, 1);
          }
        }
      });

      //ON EMPTY CART OR ITEM NOR FOUND
      if ((this.cart.items.length === 0 && quantity > 0) || !itemFound) {
        item.cantidad = 1;
        item.total = item.precio * item.cantidad;
        this.cart.items.push(item);
      }

      //CART TOTAL

      //reset total
      this.cart.total = 0;

      //add every item
      this.cart.items.forEach((cartItem: any[any], index: number) => {
        this.cart.total += cartItem.total;
      });
    },
    async continueToPay() {

      //set loading
      this.loading = true

      //post sale
      const response = await utilities.postToApi("/sales", this.cart)
      .catch((error) => {
        const toast = (this.$refs as any).toast
        toast.show(error.response.data.message)
      })

      const cineId = response.data.data.idCine
      const codigoVenta = response.data.data.codigoVenta

      //add sale id to cart
      this.cart.saleId = codigoVenta

      //store cart
      this.$store.commit('setCart', this.cart)

      //push to pay
      this.$router.push('/pagar/'+cineId+'/'+codigoVenta)
    },
  },
});
</script>
