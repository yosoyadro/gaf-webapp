<template>
    <div class="counter-container flex gap-2">
        <div class="minus border border-gray-400 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer" :class="(counter == 0) ? 'opacity-20' : 'opacity-75'" @click="minus()">
            <img src="/assets/icons/minus-solid.svg" class="w-.5 h-3.5"/>
        </div>
        <div class="counter bg-gray-180 w-7 h-7 flex items-center justify-center">{{counter}}</div>
        <div class="plus border border-gray-400 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer" :class="(counter == $props.limit) ? 'opacity-20' : 'opacity-75'" @click="plus()">
            <img src="/assets/icons/plus-solid.svg" class="w-3.5 h-3.5"/>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: "Counter",
    emits: ['counterUpdated' ,'onZero'],
    data(){
        return{
            counter: 0
        }
    },
    /*updated(){
        this.counter = this.$props.quantity
    },*/
    methods: {
        plus: function(){
            if( this.counter < this.$props.limit){
                this.counter++
                this.$emit('counterUpdated', this.counter)
            }            
        },
        minus: function(){
            if(this.counter >= 1){
                this.counter--
                this.$emit('counterUpdated', this.counter)
            }
        }
    },
    props:{
        limit:{
            type: Number,
            default: 10
        },
        quantity:{
            type: Number,
            default: 0
        }
    }
})
</script>

