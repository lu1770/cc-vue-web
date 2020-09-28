<template>
  <div class="bg">
    <div class="debug" style="display:none; color: white; position: fixed; top:0;right:0;z-index: 9999">
      <div>网页可见区域宽： {{ ((document || {}).body || {}).clientWidth }}</div>
      <div>网页可见区域高： {{ ((document || {}).body || {}).clientHeight }}</div>
      <div>网页可见区域高： {{ ((document || {}).body || {}).offsetWidth }}</div>
      <div>网页可见区域高： {{ ((document || {}).body || {}).offsetHeight }}</div>
      <div>网页正文全文宽： {{ ((document || {}).body || {}).scrollWidth }}</div>
      <div>网页正文全文高： {{ ((document || {}).body || {}).scrollHeight }}</div>
      <div>网页被卷去的高： {{ ((document || {}).body || {}).scrollTop }}</div>
      <div>网页被卷去的左： {{ ((document || {}).body || {}).scrollLeft }}</div>
      <div>网页正文部分上： {{ (window || {}).screenTop }}</div>
      <div>网页正文部分左： {{ (window || {}).screenLeft }}</div>
      <div>屏幕分辨率的高： {{ ((window || {}).screen || {}).height }}</div>
      <div>屏幕分辨率的宽： {{ ((window || {}).screen || {}).width }}</div>
      <div>屏幕可用工作区高度： {{ ((window || {}).screen || {}).availHeight }}</div>
      <div>屏幕可用工作区宽度： {{ ((window || {}).screen || {}).availWidth }}</div>
    </div>
    <div class="title-bar">
      <h3 class="title">科奥展馆智能中控系统</h3>
      <p class="title">KIO INTELLIGENT CENTRAL CONTROL SYSTEM OF EXHIBITION HALL</p>
    </div>
    <div class="icon-w-buttons" @click="scrolled = true" @scroll="scrolled = true">
      <div class="icon-w-buttons-row">
        <router-link to="/nav/TurnOnAll" class="btn-w-icon">
          <div class="btn-w-icon-border"></div>
          <img src="../assets/images/全开.png">
          <div class="btn-w-button">全开</div>
        </router-link>
        <router-link to="/nav/TurnOffAll" class="btn-w-icon">
          <div class="btn-w-icon-border"></div>
          <img src="../assets/images/全关.png">
          <div class="btn-w-button">全关</div>
        </router-link>
        <router-link to="/nav/ExhibitionArea?tab=展项" class="btn-w-icon">
          <div class="btn-w-icon-border"></div>
          <img src="../assets/images/展区.png">
          <div class="btn-w-button">展区</div>
        </router-link>
      </div>
      <div class="icon-w-buttons-row">
        <router-link to="/nav/ExhibitionArea?tab=投影仪" class="btn-w-icon">
          <div class="btn-w-icon-border"></div>
          <img src="../assets/images/投影仪.png">
          <div class="btn-w-button">投影</div>
        </router-link>
        <router-link to="/nav/ExhibitionArea?tab=主机" class="btn-w-icon">
          <div class="btn-w-icon-border"></div>
          <img src="../assets/images/主机.png">
          <div class="btn-w-button">主机</div>
        </router-link>
      </div>
      <div class="icon-w-buttons-row" v-show="scrolled">
        <router-link to="/nav/Commentator" class="btn-w-icon">
          <div class="btn-w-icon-border"></div>
          <img src="../assets/images/讲解员.png">
          <div class="btn-w-button">讲解员</div>
        </router-link>
        <router-link to="/nav/LampControl" class="btn-w-icon">
          <div class="btn-w-icon-border"></div>
          <img src="../assets/images/讲解员.png">
          <div class="btn-w-button">灯控</div>
        </router-link>
        <router-link to="/nav/StrongCurrent" class="btn-w-icon">
          <div class="btn-w-icon-border"></div>
          <img src="../assets/images/讲解员.png">
          <div class="btn-w-button">强电</div>
        </router-link>
      </div>
      <div class="icon-w-buttons-row">
        <router-link to="/nav/ExtendedFunction" class="btn-w-icon" v-show="scrolled">
          <div class="btn-w-icon-border"></div>
          <img src="../assets/images/全开.png">
          <div class="btn-w-button">扩展功能</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Entrance',
  computed: {
    document() {
      return document;
    },
    window() {
      return window;
    }
  },
  data() {
    return {
      scrolled: false,
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  color: white;
  text-align: center;
  width: 100%;
}

.title-bar {
  position: fixed;
  width: 100%;
  top: 30px;
}

.icon-w-buttons {
  position: fixed;
  top: 170px;
  left: 177px;
  height: 800px;
  overflow-y: scroll;
}


.icon-w-buttons-row {
  clear: both;
  margin-left: 35px;
  position: relative;
  top: 11px;
  height: 30px;

  &:nth-child(even) {
    margin-left: 110px;
  }

  &:nth-child(even) {

  }

  &:last-child {
    .btn-w-icon:last-child {
      .btn-w-button {
        margin-left: 18px;
      }
    }
  }

  .btn-w-icon {
    //border: #3daefa 1px solid !important;
    float: left;
    width: 156px;
    height: 86px;

    .btn-w-button {
      color: white;
      height: 80%;
      font-size: 16px;
      margin-top: -49px;
      margin-left: 30px;
    }

    .btn-w-icon-border {
      position: relative;
      top: 9px;
      left: -8px;
      border: rgb(61, 174, 250) 1px solid !important;
      border-radius: 10px;
      transform: rotate(45deg);
      width: 105px;
      height: 107px;
    }

    img {
      margin-top: -141px;
      margin-left: 32px;
      width: 30px;
    }
  }
}

</style>
