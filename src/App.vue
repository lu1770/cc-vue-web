<template>
  <div class="app">
    <router-view @alert="alert" @success="success"></router-view>
    <b-alert v-model="showDismissibleAlert" :variant="messageVariant" dismissible
             style="position: fixed;top:0px;width: 100%;z-index: 2000 !important;">
      {{ errorMessage }}
    </b-alert>
    <b-modal id="remove-if"
             ref="modal"
             title="确认"
             @ok="remove(removeItem),$bvModal.hide('remove-if')"
             ok-title="删除" ok-variant="danger"
             cancel-title="取消">
      <b-card-text>
        确认是否删除？
      </b-card-text>
    </b-modal>
  </div>
</template>

<script>

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Entrance from "./components/Entrance";

export default {
  name: 'app',
  components: {Entrance},
  data() {
    return {
      removeItem: null,
      keys: [],
      messageVariant: '',
      showDismissibleAlert: false, errorMessage: '',
      showModifyPassword: false,
      currentLv1Menu: '',
      currentLv2Menu: '',
      subNav: null,
      currentManager: null,
      items: [],
      defaultOpenLevel: 1,
      nav: {},
    }
  },
  watch: {
    $route(to, from) {
      // this.loadNavPath();
    }
  },
  methods: {
    alert(env) {
      this.$alert(env)
    },
    success(env) {
      this.$success(env)
    }, 
    async reload() {
      this.listenKeyEvent();
      // setTimeout(()=>location.reload(), 5000)
    },
    renderResize() {
      location.reload();
    },
    listenKeyEvent() {
      let vm = this;
      document.onkeydown = e => {
        let {keyCode, which, charCode} = e || event;
        let key = keyCode || which || charCode;
        this.keys.push(key)
        this.keys = [...new Set(this.keys)]
        let [a, b, c] = this.keys;
        // ctrl+q
        // this.$success(this.keys.join('+'))
        if (a === 17 && b === 81) {
          this.jump();
        }
      };
      document.onkeyup = e => {
        let evn = e || event;
        let key = evn.keyCode || evn.which || evn.charCode;
        this.keys.pop();
      };
      window.addEventListener("resize", this.renderResize, false);
    },
  },
  async mounted() {
    await this.reload();
  },
  computed: {
    currentPath() {
      return this.$route.path
    },
    fullScreenList() {
      return [
        '/',
        '/login',
        '/machinedetail',
      ]
    },
    fullScreen() {
      return this.fullScreenList.indexOf(this.$route.path) !== -1;
    }
  }
}
</script>


<style lang="less" scoped>
@import url('./assets/global');

.alert-success {
  z-index: 2000;
}

</style>
