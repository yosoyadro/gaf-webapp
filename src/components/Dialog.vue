<template>
<div class="backdrop fixed top-0 left-0 h-full w-full bg-black bg-opacity-90 ease-linear duration-100 z-10" :class="(open) ? 'block' : 'hidden'" />
<div class="fixed top-0 left-0 w-full h-full flex items-center justify-center z-40" :class="(open) ? 'block' : 'hidden'">
    <div class="dialog-container bg-neutral p-4 text-center rounded-lg"> 
        <div class="dialog-text mb-4">
            <p v-html="message"></p>
        </div>
        <div class="buttons-container flex gap-4 justify-center">
           <Button class="cancel border bg-neutral border-gray-600 text-whhite" @click="cancel()">Cancelar</Button>
           <Button class="confirm text-black" @click="confirm()">Continuar</Button>
        </div>
    </div>
</div>

</template>

<script lang="ts">

import { defineComponent } from 'vue'
import Button from "@/components/Button.vue"

export default defineComponent({
    name: "Dialog",
    emits: ['onConfirm' ,'onCancel'],
    components:{
        Button
    },
    methods: {
        confirm: function(){
            this.$emit('onConfirm')
        },
        cancel: function(){
            this.$emit('onCancel')
        }
    },
    props:{
        open: {
            type: Boolean,
            default: false
        },
        message: {
            type: String
        }
    }  
})


</script>