<template>
    <div class="h-screen flex gap-10 items-center justify-center px-4 lg:px-10">
        <div class="mpForm w-full md:w-1/2">
          <form id="form-checkout">
              <div class="row">
                  <input type="text" name="cardNumber" id="form-checkout__cardNumber" />
              </div>
              <div class="row flex gap-4">
                  <input type="text" name="expirationDate" id="form-checkout__expirationDate" />
                  <input type="text" name="securityCode" id="form-checkout__securityCode" />
              </div>
              <div class="row">
                  <input type="text" name="cardholderName" id="form-checkout__cardholderName"/>
              </div>
              <div class="row">
                  <input type="email" name="cardholderEmail" id="form-checkout__cardholderEmail"/>
              </div>
              
              <select name="issuer" id="form-checkout__issuer"></select>
              <select name="identificationType" id="form-checkout__identificationType"></select>
              <input type="text" name="identificationNumber" id="form-checkout__identificationNumber"/>
              <select name="installments" id="form-checkout__installments"></select>
              <button type="submit" id="form-checkout__submit">Pagar</button>
              <progress value="0" class="progress-bar">Cargando...</progress>
          </form>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'Pay',
    data() {
      return {
        ticketCode: '',
        keyPad: [7, 8, 9, 4, 5, 6, 1, 2, 3, 'Borrar', 0, 'Continuar'],
      }
    },
    mounted(){

        /*let cardData = '';

        let typingTimer:any             //timer identifier
        const doneTypingInterval = 500;  //time in ms, 5 seconds for example
        var input = (document as any)

        //on keyup, start the countdown
        input.addEventListener('keyup', function (event: any) {
          cardData = cardData + (event as any).key
          clearTimeout(typingTimer);
          typingTimer = setTimeout(doneTyping, doneTypingInterval);
        });

        //on keydown, clear the countdown 
        input.addEventListener('keydown', function () {
          clearTimeout(typingTimer);
        });

        //user is "finished typing," do something
        function doneTyping () {
          console.log(cardData)
        }*/

        const mp = new (window as any).MercadoPago('TEST-bbe7c118-402e-4323-8972-3480162742a9');

        const cardForm = mp.cardForm({
        amount: '100.5',
        iframe: false,
        form: {
          id: 'form-checkout',
          cardholderName: {
            id: 'form-checkout__cardholderName',
            placeholder: "Titular de la tarjeta",
          },
          cardholderEmail: {
            id: 'form-checkout__cardholderEmail',
            placeholder: 'E-mail'
          },
          cardNumber: {
            //id: 'form-checkout__cardNumber',
            id: 'form-checkout__cardNumber',
            placeholder: 'Número de la tarjeta',
          },
          securityCode: {
            id: 'form-checkout__securityCode',
            placeholder: 'Código de seguridad'
          },
          installments: {
            id: 'form-checkout__installments',
            placeholder: 'Cuotas'
          },
          expirationDate: {
            id: 'form-checkout__expirationDate',
            placeholder: 'Vencimiento (MM/YYYY)',
          },
          identificationType: {
            id: 'form-checkout__identificationType',
            placeholder: 'Tipo de documento'
          },
          identificationNumber: {
            id: 'form-checkout__identificationNumber',
            placeholder: 'Número de documento'
          },
          issuer: {
            id: 'form-checkout__issuer',
            placeholder: 'Banco emisor'
          }
        },
        callbacks: {
          onFormMounted: function (error: any) {
            if (error) return console.log('Callback para tratar o erro: montando o cardForm ', error)
          },
          onSubmit: function (event: Event) {
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
              identificationType
            } = cardForm.getCardFormData();
      
              fetch('/process_payment', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  token,
                  issuer_id,
                  payment_method_id,
                  transaction_amount: Number(amount),
                  installments: Number(installments),
                  description: 'product description',
                  payer: {
                    email,
                    identification: {
                      type: identificationType,
                      number: identificationNumber
                  }
                }
              })
            })
          },
          onFetching: function (resource: any) {
            console.log('fetching... ', resource)
            const progressBar = (document as any).querySelector('.progress-bar')
            progressBar.removeAttribute('value')
      
            return () => {
              progressBar.setAttribute('value', '0')
            }
          }
        }
      });
    }
})
</script>

<style>
  #form-checkout {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
  }

  .row{
    width: 100%;
  }

  input, select, #cardNumber{
    width: 100%;
    color: black;
    padding: 8px;
    border-radius: 8px;
  }

  button{
    width: 50%;
    background: #212121;
    padding: 8px 0;
    border-radius: 8px;
  }
</style>
