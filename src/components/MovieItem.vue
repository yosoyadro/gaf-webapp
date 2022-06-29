<template>
	<!-- movie -->
	<div class="movieItem">
		<!-- poster -->
		<div v-if="poster" class="poster relative bg-gray-300 rounded-md" :style="poster ? { backgroundImage: 'url(' + poster + ')' } : null">
		</div>
		<!-- poster keleton -->
		<div v-else class="poster bg-white bg-opacity-25 rounded-md animate-pulse">
		</div>
		<!-- title -->
		<p v-if="title && showTitle" class="text-white truncate font-semibold text-sm mt-2 opacity-75 lg:text-lg">{{ title }}</p>
		<!-- titleskeleton -->
		<p v-else-if="showTitle" class="h-4 w-full bg-white bg-opacity-25 rounded-sm mt-3 animate-pulse"></p>
	</div>     
</template>

<script lang="ts">
import './components.css'

export default {
	name: 'MovieItem',
	props: {
		title: {
			type: String
		},
		poster: {
			type: String
		},
		showTitle: {
			type: Boolean,
			default: true
		}
	},
	methods: {
		trimTitle: function(title: string){
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
.movieItem{
	width: 100%;
	display: flex;
	flex-direction: column;   
	flex-shrink: 0;
	text-decoration: none;
	color: black;
}

.movieItem h3{
	height: 27px;
}

.poster{
	width: 100%;
	padding-top: 142.8%;
	position: relative;
	background-size: cover;
	background-position: center;
	box-shadow: 0 0 8px rgba(0, 0, 0, 0.2)
}

.estreno{
	-webkit-mask-image: url('/assets/icons/bookmark-solid.svg');
	mask-image: url('/assets/icons/bookmark-solid.svg');
	-webkit-mask-repeat: no-repeat;
	mask-repeat: no-repeat; 
	mask-position: center;
	mask-size: cover;
}

h3.loading{
	width: 100%;
	height: 25px;
}

@media (max-width: 768px){
	.movieItem h3{
			height: 40px;
	}
}
</style>
