<template>
    <div>
        <!-- Items -->
        <div class="newsItem" v-if="item">
            <div class="img bg-white bg-opacity-25" :style="{ backgroundImage: 'url(' + item.portada.data.thumbnails[3].url + ')' }"></div>
            <p class="text-white font-semibold text-sm opacity-75 h-10 ellipsis overflow-hidden mt-2 lg:text-xl lg:h-14">{{item.titulo}}</p>
            <span class="date-tag text-white text-sm opacity-50 mt-2 lg:text-md">{{item.creado}}</span>  
        </div>

        <!-- skeleton -->
        <div class="newsItem animate-pulse" v-else>
            <div class="img bg-white bg-opacity-25"></div>
            <p class="h-5 w-full bg-white bg-opacity-25 rounded-sm mt-4"></p>
            <p class="h-5 w-3/5 bg-white bg-opacity-25 rounded-sm mt-1"></p>
            <span class="h-4 w-1/5 bg-white bg-opacity-25 rounded-sm mt-4"></span> 
        </div>
    </div>        
</template>

<script>
export default {
    name:'NewsItem',
    props:{
        item: Object
    },
}
</script>

<style scoped>
.newsItem {
    width: 100%;
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
}

.newsItem .img{
    border-radius: 4px;
    padding-top: 56.26%;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
}

.newsItem .img.loading{
    margin-bottom: 8px !important;
}

.newsItem .h3-placeholder{
    width: 100%;
    height: 20px;
    margin-bottom: 8px;
}

.newsItem .h3-placeholder:nth-child(4){
    width: 50% !important;
}

.newsItem .date-tag.loading{
    margin-top: 16px !important;
}
</style>