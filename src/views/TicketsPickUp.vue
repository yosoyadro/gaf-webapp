<template>
    <div class="h-screen flex flex-col gap-10 items-center justify-center lg:px-10 pt-14">
        <!-- PICK UP -->
        <div class="keyboard w-1/2" v-show="(view == 'pickup')">
            <!-- KEYBOARD -->
            <div class="flex flex-col gap-y-8 items-center border-b border-gray-600 pb-10 mb-10">
                <p class="text-2xl">Ingrese su nro de retiro</p>
                <input type="text" name="ticketCodeInput" id="ticketCodeInput" maxlength="6" placeholder="012345" readonly class="w-1/2 p-2 rounded-lg text-center text-3xl text-black" v-model="ticketCode">
                <div class="numKeypad w-full grid grid-cols-3 gap-4">
                    <div class="key bg-white rounded-full text-black text-center p-4 select-none" :class="(typeof key == 'number') ? 'font-bold' : 'bg-blue-800 text-white'" v-for="(key, index) in keyPad" :key="index" @click="keyPress(key)">
                        <p class="text-xl">{{key}}</p>
                    </div>
                </div>
            </div>

            <!-- BACK BUTTON -->
            <router-link to="/" class="buttonContainer flex justify-center">
            <Button
                class="bg-neutral"
                >Volver al inicio</Button
            >
            </router-link>
        </div>

        <!-- LOADING -->
        <Spinner v-show="(view == 'loading')" class="h-screen fixed" />

        <!-- PRINTING -->
        <div class="printing h-screen flex flex-col gap-8 items-center justify-center" v-show="(view == 'printing')">
            <div class="printing-icon w-40 h-40 bg-neutral p-8 rounded-full">
                <img
                    src="/assets/img/ticket-machine.png"
                    alt="Imprimiendo">
            </div>
            <p class="text-2xl">Imprimiendo entradas</p>
            <!-- BACK BUTTON -->
            <router-link to="/" class="buttonContainer flex justify-center">
            <Button
                class="bg-neutral"
                >Volver al inicio</Button
            >
            </router-link>
        </div>

        <!-- TOAST -->
        <Toast ref="toast" />
    </div>
</template>

<script lang="ts">
//custom components
import Button from '@/components/Button.vue'
import Toast from "@/components/Toast.vue"
import Spinner from "@/components/Spinner.vue";

import utilities from "@/utilities";

import { defineComponent } from 'vue'

export default defineComponent({
    name: 'TicketPickUpPage',
    data() {
      return {
        view: '',
        ticketCode: '',
        keyPad: [7, 8, 9, 4, 5, 6, 1, 2, 3, 'Borrar', 0, 'Continuar'],
      }
    },
    components:{
        Button,
        Toast,
        Spinner
    },
    mounted(){
        this.view = 'pickup'
    },
    methods:{
        keyPress(key: number|string){
            if(this.ticketCode.length < 8 || typeof key === 'string'){
                if( typeof key === 'number'){
                    this.ticketCode = (this.ticketCode+key).toString()
                }else{
                    if(key == 'Borrar'){
                        this.ticketCode = this.ticketCode.slice(0, -1)
                    }else{
                        this.printTicket()
                    }
                }
            }
        },
        async printTicket(){
            // get toast
            const toast = this.$refs.toast as any

            if( this.$store.state.printer == ''){
                toast.show("No se ha configurado una impresora")
            }else{

                if(this.ticketCode.length != 6 ){
                    toast.show("El número ingresado debe ser de al menos 8 digitos")
                }
                else{
                    this.view = 'loading'

                    const response = await utilities.getFromApi('/sales/'+this.ticketCode)

                    this.ticketCode = ''
                    
                    if(response.data.status == 'error'){
                        toast.show("No se encontaron tickets a retirar")
                        this.view = 'pickup'
                    }else{
                        //set electron api
                        const { electron } = window as any

                        const tickets = response.data.data

                        tickets.forEach( (ticket: any[any]) => {
                            const formattedTicket = utilities.getFormattedTicket(ticket)
                            const printData = {
                                printer: this.$store.state.printer,
                                ticket: formattedTicket
                            }
                            electron.send('print', printData )
                        });
                        
                        this.view = 'printing'
                    }
                    
                }
            }
        }
    }
})
</script>
