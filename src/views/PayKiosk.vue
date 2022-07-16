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
    <div v-show="view == 'pay'" class="mpForm w-full md:w-1/2">
      <form id="form-checkout">
        <div class="row">
          <input
            type="text"
            name="cardNumber"
            id="form-checkout__cardNumber"
            v-model="cardNumber"
          />
        </div>
        <div class="row flex gap-4">
          <input
            type="text"
            name="expirationDate"
            id="form-checkout__expirationDate"
            v-model="cardExp"
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
            v-model="cardName"
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
      </form>
    </div>

    <!-- EMPTY CART -->
    <div v-show="view == 'emptyCart'" class="emptyCart flex flex-col gap-8 items-center justify-center">
      <div class="printing-icon w-40 h-40 bg-neutral p-8 rounded-full">
        <img src="/assets/img/ticket-machine.png" alt="Imprimiendo" />
      </div>
      <p class="text-2xl">Imprimiendo entradas</p>
      <!-- BACK BUTTON -->
      <router-link to="/" class="buttonContainer flex justify-center">
        <Button class="bg-neutral">Volver al inicio</Button>
      </router-link>
    </div>

    <!-- LOADING -->
    <Spinner v-show="view == 'loading'" class="h-screen fixed" />

    <input
      type="text"
      class="text-black hidden"
      ref="cardInput"
      v-model.lazy="rawCardData"
    />
  </div>
</template>

<script lang="ts">
//custom components
import Spinner from "@/components/Spinner.vue";
import Button from '@/components/Button.vue'

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
      rawCardData: "",
      cardNumber: "",
      cardExp: "",
      cardName: "",
    };
  },
  components: {
    Spinner,
    Button
  },
  mounted() {
    //this.cardSwipeInit();

    //show loading
    this.view = "loading";

    //check cart
    if (this.$store.state.cart.total) {
      //get cart total
      const amount = this.$store.state.cart.total.toString();

      //mount MP Form
      this.mountMpForm(amount);

      //show pay
      this.view = "pay";
    } else {
      //empty cart
      this.view = "emptyCart";
    }
  },
  methods: {
    mountMpForm(amount: string) {
      //get current cinema id
      const cinemaId = this.$store.state.cinemaInfo.id;

      //create mp instance
      const mp = new MercadoPago("TEST-bbe7c118-402e-4323-8972-3480162742a9");

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
            //id: 'form-checkout__cardNumber',
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
            placeholder: "Vencimiento (MM/YYYY)",
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
              token,
              issuer_id,
              payment_method_id,
              transaction_amount: Number(amount),
              installments: Number(installments),
              description: "product description",
              payer: {
                email,
                identification: {
                  type: identificationType,
                  number: identificationNumber,
                },
              },
            };

            const payment = await utilities.postToApi("/mpPay", data);

            console.log(payment);
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
    cardSwipeInit() {
      const cardInput = (this as any).$refs.cardInput;

      cardInput.focus();

      let timer: any;

      cardInput.addEventListener("keypress", () => {
        clearTimeout(timer);

        timer = setTimeout(() => {
          this.cardSwipeEnd(this.rawCardData);
          cardInput.value = "";
        }, 300);
      });
    },
    cardSwipeEnd(rawCardData: string) {
      console.log(rawCardData);

      //regex for ^
      const pattern1 = new RegExp(
        "^%B([0-9]{12,18})\\^([A-Z ,-/&]+)\\^([0-9]+)"
      );
      const match1 = pattern1.exec(rawCardData);

      //regex for &
      const pattern2 = new RegExp("^%B([0-9]{12,18})+&([A-Z ,-/&]+)+&([0-9]+)");
      const match2 = pattern2.exec(rawCardData);

      const delimiter = match1 ? "^" : "&";

      if (match1 || match2) {
        const cardData = rawCardData.replace(/  +/g, " ").split(delimiter);
        const cardNumber = cardData[0].replace("%B", "").trim();
        const cardName = cardData[1]
          .replace(",", "")
          .replace("-", " ")
          .replace("/", " ")
          .replace("&", " ")
          .trim();
        const cardExp = (
          cardData[2].substring(2, 4) +
          "/" +
          cardData[2].substring(0, 2)
        ).trim();

        this.cardNumber = cardNumber;
        this.cardName = cardName;
        this.cardExp = cardExp;
      } else {
        console.log("lectura incorrecta");
      }
    },
  },
  watch: {
    $route() {
      if( typeof cardForm != 'undefined'){
        this.unmountMpForm();
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
