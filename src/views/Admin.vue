<template>
    <div class="page admin">
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'


export default defineComponent({
  name: 'Admin',
  created(){
    window.location.href = "https://gaf.adro.studio";
  }
})

</script>

<style>
section{
    margin-left: 220px;
}

.section-header{
    position: fixed;
    top:0;
    left: 220px;
}
</style>