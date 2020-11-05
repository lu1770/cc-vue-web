<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-link to="/nav/Home" class="back-button">
        <b-button variant="dark"><</b-button>
      </b-link>
      <b-navbar-nav class="ml-auto">
        <b-button v-b-modal.areaSelection variant="dark">{{
          areaName
        }}</b-button>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-link to="/nav/Settings" class="settings-button">
          <b-button variant="dark">设置</b-button>
        </b-link>
      </b-navbar-nav>
    </b-navbar>
    <b-modal id="areaSelection" title="请选择展区">
      <b-button
        v-for="area in areaListOptions"
        @click="(currentArea = area.value), $bvModal.hide('areaSelection')"
        v-bind:key="area.value.Id"
        :variant="area.value === currentArea ? 'primary' : 'outline-primary'"
      >
        {{ area.text }}
      </b-button>
    </b-modal>
  </div>
</template>
<script>
export default {
  name: "TopBar",
  props: {
    value: {},
  },
  computed: {
    areaName() {
      return (this.currentArea || {}).Name || "展区名称";
    },
  },
  watch: {
    currentArea: {
      async handler(neo) {
        this.$emit("input", neo);
      },
      deep: true,
    },
  },
  data() {
    return {
      down: false,
      selected: this.$route.query.tab || "展项",
      showLeft: false,
      areaListOptions: [],
      currentArea: null,
      currentItem: null,
    };
  },
  async mounted() {
    this.areaListOptions = await this.$getData(
      "/GetExhibitionAreaDropDownList"
    );
    this.currentArea =
      this.currentArea || ((this.areaListOptions || [])[0] || {}).value;
    this.areaListOptions.forEach(({ value }) => {
      let img = new Image();
      img.src = `/upload/${value.BackgroundImageFile}`;
    });
  },
};
</script>
<style lang="less" scoped>
/*画布*/
canvas {
  //border: black 1px solid;
  margin: 0;
  padding: 0;
}

/* 单选框 */
[type="radio"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.navbar {
  overflow: hidden;
}
.dropdown-menu,
.show {
  z-index: 99999;
}
</style>
