<template>
  <div
    class="
      h-screen
      flex flex-col
      gap-10
      items-center
      justify-center
      px-4
      lg:px-10
      pt-14
    "
  >
    <!-- PAY FORM -->
    <div v-show="view == 'pay'" class="mpForm w-full md:w-1/2 lg:w-1/3">
      <form id="form-checkout">
        <div class="row">
          <input
            type="text"
            name="cardNumber"
            id="form-checkout__cardNumber"
          />
        </div>
        <div class="row flex gap-4">
          <input
            type="text"
            name="expirationDate"
            id="form-checkout__expirationDate"
          />
          <input
            type="text"
            name="securityCode"
            id="form-checkout__securityCode"
          />
        </div>
        <div class="row">
          <input
            type="text"
            name="cardholderName"
            id="form-checkout__cardholderName"
            required
          />
        </div>
        <div class="row">
          <input
            type="email"
            name="cardholderEmail"
            id="form-checkout__cardholderEmail"
            required
          />
        </div>

        <select name="issuer" id="form-checkout__issuer"></select>
        <select
          name="identificationType"
          id="form-checkout__identificationType"
        ></select>
        <input
          type="text"
          name="identificationNumber"
          id="form-checkout__identificationNumber"
          required
        />
        <select name="installments" id="form-checkout__installments"></select>
        <button type="submit" id="form-checkout__submit">Pagar</button>
        <img class="h-8" src="https://http2.mlstatic.com/frontend-assets/mp-web-navigation/ui-navigation/5.19.1/mercadopago/logo__large.png" alt="Mercado Pago">
      </form>
    </div>

    <!-- EMPTY CART -->
    <div
      v-show="view == 'emptyCart'"
      class="emptyCart flex flex-col gap-8 items-center justify-center"
    >
      <div class="printing-icon w-40 h-40 bg-neutral p-8 rounded-full">
        <img src="/assets/icons/ticket-outline.svg" alt="Vacío" />
      </div>
      <p class="text-2xl">No tienes entradas por pagar</p>
      <!-- BACK BUTTON -->
      <router-link to="/" class="buttonContainer flex justify-center">
        <Button class="bg-neutral">Volver al inicio</Button>
      </router-link>
    </div>

    <!-- ERROR -->
    <div
      v-show="view == 'error'"
      class="emptyCart flex flex-col gap-8 items-center justify-center"
    >
      <div class="printing-icon w-40 h-40 bg-neutral p-8 rounded-full">
        <img src="/assets/icons/alert-outline.svg" alt="Error" />
      </div>
      <p class="text-2xl">Hubo un error al conectarse a Mercado Pago</p>
      <!-- RETRY BUTTON -->
      <div class="buttonContainer flex justify-center">
        <Button class="bg-neutral" @click="retryPay()">Rententar</Button>
      </div>
    </div>

    <!-- APPROVED -->
    <div
      v-show="view == 'approved'"
      class="emptyCart flex flex-col gap-8 items-center justify-center"
    >
      <div class="printing-icon w-40 h-40 bg-neutral p-8 rounded-full">
        <img src="/assets/icons/checkmark-outline.svg" alt="Acreditado" />
      </div>
      <p class="text-2xl">¡Pago realizado!</p>
      <p class="text-xl">Podés retirar tus entrada con el código:</p>
      <p class="text-4xl">{{$store.state.cart.saleId}}</p>
      <!-- BACK BUTTON -->
      <router-link to="/" class="buttonContainer flex justify-center">
        <Button class="bg-neutral">Volver al inicio</Button>
      </router-link>
    </div>

    <!-- REJECTED -->
    <div
      v-show="view == 'rejected'"
      class="emptyCart flex flex-col gap-8 items-center justify-center"
    >
      <div class="printing-icon w-40 h-40 bg-neutral p-8 rounded-full">
        <img src="/assets/icons/close-outline.svg" alt="Acreditado" />
      </div>
      <p class="text-2xl">No pudimos procesar tu pago</p>
      <!-- RETRY BUTTON -->
      <div class="buttonContainer flex justify-center">
        <Button class="bg-neutral" @click="retryPay()">Rententar</Button>
      </div>
    </div>

    <!-- LOADING -->
    <Spinner v-show="view == 'loading'" class="h-screen fixed" />
  </div>
</template>

<script lang="ts">
//custom components
import Spinner from "@/components/Spinner.vue";
import Button from "@/components/Button.vue";

//utilities
import utilities from "@/utilities";

import { defineComponent } from "vue";

//Mercado Pago
const { MercadoPago } = window as any;
let cardForm: any;

export default defineComponent({
  name: "Pay",
  data() {
    return {
      view: "",
      amount: this.$store.state.cart.total ? this.$store.state.cart.total.toString() : 0,
      description: this.$store.state.cart.movie ? 'Entradas para '+this.$store.state.cart.movie.nombre : ''
    };
  },
  components: {
    Spinner,
    Button,
  },
  async mounted() {
    //this.cardSwipeInit();

    //show loading
    this.view = "loading";

    //check cart
    if (this.$store.state.cart.total) {

      //mount MP Form
      this.mountMpForm(this.amount, this.description);

      //show pay
      setTimeout(() => {
        this.view = "pay";
      }, 2000);
    } else {
      //empty cart
      this.view = "emptyCart";
    }
  },
  methods: {
    mountMpForm(amount: string, description: string) {
      //transfer current instance
      const vm = this

      //get current cinema id
      const cinemaId = this.$store.state.cinemaInfo.id;

      //get current sale id
      const saleId = this.$store.state.cart.saleId;


      //create mp instance
      const mpPublicKey = (process.env.NODE_ENV === 'production')
                          ? 'APP_USR-c631463c-0b6d-4d92-8aef-dab69c9adf00'
                          : 'TEST-bbe7c118-402e-4323-8972-3480162742a9'
      
      //init mp instance
      const mp = new MercadoPago(mpPublicKey);

      //create cardForm
      cardForm = mp.cardForm({
        amount: amount,
        iframe: false,
        form: {
          id: "form-checkout",
          cardholderName: {
            id: "form-checkout__cardholderName",
            placeholder: "Titular de la tarjeta",
          },
          cardholderEmail: {
            id: "form-checkout__cardholderEmail",
            placeholder: "E-mail",
          },
          cardNumber: {
            id: "form-checkout__cardNumber",
            placeholder: "Número de la tarjeta",
          },
          securityCode: {
            id: "form-checkout__securityCode",
            placeholder: "Código de seguridad",
          },
          installments: {
            id: "form-checkout__installments",
            placeholder: "Cuotas",
          },
          expirationDate: {
            id: "form-checkout__expirationDate",
            placeholder: "MM/YYYY",
          },
          identificationType: {
            id: "form-checkout__identificationType",
            placeholder: "Tipo de documento",
          },
          identificationNumber: {
            id: "form-checkout__identificationNumber",
            placeholder: "Número de documento",
          },
          issuer: {
            id: "form-checkout__issuer",
            placeholder: "Banco emisor",
          },
        },
        callbacks: {
          onFormMounted: function (error: any) {
            if (error)
              return console.log(
                "Callback para tratar o erro: montando o cardForm ",
                error
              );
          },
          onSubmit: async function (event: Event) {
            event.preventDefault();

            const {
              cardNumber: cardNumber,
              paymentMethodId: payment_method_id,
              issuerId: issuer_id,
              cardholderEmail: email,
              amount,
              token,
              installments,
              identificationNumber,
              identificationType,
            } = cardForm.getCardFormData();

            const data = {
              cinemaId: cinemaId,
              saleId: saleId,
              token,
              issuer_id,
              payment_method_id,
              transaction_amount: Number(amount),
              installments: Number(installments),
              description: description,
              payer: {
                email,
                identification: {
                  type: identificationType,
                  number: identificationNumber,
                },
              },
            }

            vm.processPayment(data)
          },
          onFetching: function (resource: any) {
            console.log("fetching... ", resource);
          },
        },
      });
    },
    unmountMpForm() {
      cardForm.unmount();
    },
    async processPayment(data:Record<string, unknown>){
      //show loading
      this.view = 'loading'

      //send to mp
      const payment = await utilities.postToApi("/mpPay", data);

      //set view
      this.view = payment.data.status
    },
    retryPay(){
      //unmount current instance
        this.unmountMpForm()

      //mount new instance
      this.mountMpForm(this.amount, this.description)

      //set pay view
      this.view = 'pay'
    }
  },
  watch: {
    $route() {
      if (typeof cardForm != "undefined") {
        //unmount current instance
        this.unmountMpForm()
      }
    },
  },
});
</script>

<style>
#form-checkout {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.row {
  width: 100%;
}

input,
select,
#cardNumber {
  width: 100%;
  color: black;
  padding: 8px;
  border-radius: 8px;
}

button {
  width: 50%;
  background: #212121;
  padding: 8px 0;
  border-radius: 8px;
}
</style>
