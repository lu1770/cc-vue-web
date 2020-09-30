<template>
<div>
    <top-bar v-model="current"></top-bar>
    <h1>Settings</h1>
</div>
</template>

<script>
import TopBar from './TopBar.vue'
    export default {
        name: "Settings",
        data(){
            return {
                current:null
            }
        }
    }
</script>

<style scoped>

</style>
