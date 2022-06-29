<template>
    <!-- sidebar -->
    <div class="sidebar fixed top-0 left-0 h-full bg-neutral flex flex-col text-white ease-linear duration-100 z-20">
        <!-- header -->
        <div class="header w-full h-16 px-4 bg-zinc flex items-center justify-center">
            <p class=" text-xl font-bold">Logo</p>
        </div>
        <!-- body -->
        <div class="menu overflow-auto" v-if="menuOptions?.length > 0">
            <router-link :to="menuOption.link" v-for="(menuOption, index) in menuOptions" :key="index">
                <div class="menu-option flex gap-4 items-center p-4 cursor-pointer hover:text-blue-400">
                    <div class="icon w-5 h-5 bg-white" :style="'-webkit-mask-image: url('+menuOption.icon+'); -webkit-mask-repeat: no-repeat; -webkit-mask-position: center;'"></div>
                    <p>{{menuOption.label}}</p>
                </div>
            </router-link>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: "SideBar",
    props:{
        menuOptions:{
            type: Array
        }
    }
    
})
</script>

<style scoped>
.sidebar{
    width: 220px;
}
</style>
