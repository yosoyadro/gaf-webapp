<template>
    <div class="h-screen flex gap-10 items-center justify-center lg:px-10 pt-14">
        <div class="left-col w-1/2 flex flex-col gap-y-8 items-center">
            <p class="text-2xl">Ingrese su nro de retiro</p>
            <input type="text" name="ticketNumber" id="ticketNumber" ref="ticketNumber" maxlength="6" placeholder="012345" readonly class="w-1/2 p-2 rounded-lg text-center text-3xl text-black" v-model="ticketCode">
            <div class="numKeypad w-full grid grid-cols-3 gap-4">
                <div class="key bg-white rounded-full text-black text-center p-4 select-none" :class="(typeof key == 'number') ? 'font-bold' : 'bg-blue-800 text-white'" v-for="(key, index) in keyPad" :key="index" @click="keyPress(key)">
                    <p class="text-xl">{{key}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'TicketPickUpPage',
    data() {
      return {
        ticketCode: '',
        keyPad: [7, 8, 9, 4, 5, 6, 1, 2, 3, 'Borrar', 0, 'Continuar'],
      }
    },
    methods:{
        keyPress(key: number|string){
            if(this.ticketCode.length < 6 || typeof key === 'string'){
                if( typeof key === 'number'){
                    this.ticketCode = (this.ticketCode+key).toString()
                }else{
                    if(key == 'Borrar'){
                        this.ticketCode = this.ticketCode.slice(0, -1)
                    }else{
                        console.log(this.ticketCode)
                    }
                }
            }
        }
    }
})
</script>
