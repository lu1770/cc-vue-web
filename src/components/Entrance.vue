<template>
  <b-container class="bg">
    <b-row>
      <h1>某企业中控控制系统</h1>
    </b-row>
    <b-card>
      <b-row>
        <b-col xs4>
          <router-link to="/nav/TurnOnAll">
            <b-button variant="primary">全开</b-button>
          </router-link>
        </b-col>
        <b-col xs4>
          <router-link to="/nav/TurnOffAll">
            <b-button variant="primary">全关</b-button>
          </router-link>
        </b-col>
        <b-col xs4>
          <router-link to="/nav/ExhibitionArea?tab=展项">
            <b-button variant="primary">展区</b-button>
          </router-link>
        </b-col>
      </b-row>
    </b-card>
    <b-card>
      <b-row>
        <b-col xs4>
          <router-link to="/nav/ExhibitionArea?tab=投影仪">
            <b-button variant="primary">投影</b-button>
          </router-link>
        </b-col>
        <b-col xs4>
          <router-link to="/nav/ExhibitionArea?tab=主机">
            <b-button variant="primary">主机</b-button>
          </router-link>
        </b-col>
        <b-col xs4>
          <router-link to="/nav/Commentator">
            <b-button variant="primary">讲解员</b-button>
          </router-link>
        </b-col>
      </b-row>
    </b-card>
    <b-card>
      <b-row>
        <b-col xs4>
          <router-link to="/nav/LampControl">
            <b-button variant="primary">灯控</b-button>
          </router-link>
        </b-col>
        <b-col xs4>
          <router-link to="/nav/StrongCurrent">
            <b-button variant="primary">强电</b-button>
          </router-link>
        </b-col>
        <b-col xs4>
          <router-link to="/nav/ExtendedFunction">
            <b-button variant="primary">扩展功能</b-button>
          </router-link>
        </b-col>
      </b-row>
    </b-card>
  </b-container>
</template>

<script>
export default {
  name: 'Entrance',
}
</script>

<style scoped>

</style>
