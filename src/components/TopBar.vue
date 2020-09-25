<template>
  <b-navbar toggleable="lg" type="dark" variant="dark">
    <b-link to="/nav/Home" class="back-button">
      <b-button letiant="default">返回</b-button>
    </b-link>
    <b-navbar-nav class="ml-auto">
      <b-nav-item-dropdown :text="(currentArea||{}).Name||'展区名称'" left>
        <b-dropdown-item v-for="area in areaListOptions" @click="currentArea=area.value">{{ area.text }}
        </b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
    <b-navbar-nav class="ml-auto">
      <b-link to="/nav/Settings" class="settings-button">
        <b-button letiant="primary">设置</b-button>
      </b-link>
    </b-navbar-nav>
  </b-navbar>
</template>
<script>
export default {
  name: 'TopBar',
  props: {
    value: {},
  },
  watch: {
    currentArea: {
      async handler(neo) {
        this.$emit('input', neo);
      },
      deep: true
    }
  },
  data() {
    return {
      down: false,
      selected: this.$route.query.tab || '展项',
      showLeft: false,
      areaListOptions: [],
      currentArea: null,
      currentItem: null
    }
  },
  async mounted() {
    this.areaListOptions = await this.$getData("/GetExhibitionAreaDropDownList");
    this.currentArea = this.currentArea || ((this.areaListOptions || [])[0] || {}).value;
  }
}
</script>
<style lang="less" scoped>
/*画布*/
canvas {
  //border: black 1px solid;
  margin: 0;
  padding: 0;
}

/* 单选框 */
[type=radio] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

</style>
