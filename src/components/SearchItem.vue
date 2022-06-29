<template name="search-item">
	<div name="card" class="w-full flex md:flex-col gap-4">
		<div name="card-image" class="w-2/5 flex-none md:w-full">
			<div
			class="
				w-full
				rounded-sm
				bg-white
				bg-opacity-25
			"
			:style="(movie && movie.portada) ? { backgroundImage: 'url(' + movie.portada.data.thumbnails[5].url+ ')' } : { backgroundImage: 'url(/assets/img/main.jpg)' } ">
			</div>
		</div>
		<div name="card-text" class="flex flex-col justify-center">
			<p class="text-md font-semibold text-white truncate opacity-75" v-if="movie">{{movie.titulo}}</p>
			<p class="h-4 w-full bg-white bg-opacity-25 rounded-sm" v-else></p>
			<p class="text-sm text-white opacity-75" v-if="movie">{{movie.titulo_original}}</p>
			<span class="h-4 w-3/4 bg-white bg-opacity-25 rounded-sm mt-3" v-else></span>
		</div>	
	</div>             
</template>

<script>
	export default {
		name: 'SearchItem',
		props: {
			showPlay: {
				type: Boolean
			},
			showTitle: {
				type: Boolean
			},
			showDateTag: {
				type: Boolean
			},
			movie: Object
		},
		methods: {
			trimTitle: function(title){
				if(title.length > 30){
					return title.substring(0, 30) + '...'
				}else{
					return title
				}
			}
		}
	}
</script>

<style scoped>
/*-------MEDIDA PREESTABLECIDA PARA POSTERS/ AFICHES---------*/

div[name="card-image"] div{
	padding-top: 56.6%;
	background-size: cover;
}
</style>
