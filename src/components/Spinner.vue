<template>
    <div class="spinner-container">
        <div class="spinner"></div>
    </div>
</template>

<script>
    export default{
        name: 'Spinner'
    }
</script>


<style scoped>
    .spinner-container{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .spinner {
        border: 8px solid rgba(0, 0, 0, 0.1);
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border-left-color: #fcaf17;
        animation: spin 1s ease infinite;
    }

    @keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
    }
</style>