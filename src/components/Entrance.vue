<template>
  <b-container class="bg">
    <b-row>
      <h1>某企业中控控制系统</h1></b-row>
    <b-row>
      <b-col xs4>
        <router-link to="/nav/TurnOnAll">全开</router-link>
      </b-col>
      <b-col xs4>
        <router-link to="/nav/TurnOffAll">全关</router-link>
      </b-col>
      <b-col xs4>
        <router-link to="/nav/ExhibitionArea">展区</router-link>
      </b-col>
    </b-row>
    <b-row>
      <b-col xs4>
        <router-link to="/nav/Projector">投影</router-link>
      </b-col>
      <b-col xs4>
        <router-link to="/nav/Hosts">主机</router-link>
      </b-col>
      <b-col xs4>
        <router-link to="/nav/Commentator">讲解员</router-link>
      </b-col>
    </b-row>
    <b-row>
      <b-col xs4>
        <router-link to="/nav/LampControl">灯控</router-link>
      </b-col>
      <b-col xs4>
        <router-link to="/nav/StrongCurrent">强电</router-link>
      </b-col>
      <b-col xs4>
        <router-link to="/nav/ExtendedFunction">扩展功能</router-link>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  export default {
    name: 'Entrance',
  }
</script>

<style scoped>

</style>
