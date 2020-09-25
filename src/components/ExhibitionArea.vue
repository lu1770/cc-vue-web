<template>
  <div class="main-page">
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
    <div class="top-menu">

    </div>
    <b-container fluid="">
      <b-row>
        <b-col xs3 align-h="center" style="border: #222222 solid 1px;">
          {{ selected }}
          <b-form-group>
            <b-row class="icon3">
              <label>
                <b-form-radio v-model="selected" name="some-radios" value="展项">展项</b-form-radio>
                <img src="../assets/images/展项管理.png" alt="">
              </label>
            </b-row>
            <b-row class="icon3">
              <label>
                <b-form-radio v-model="selected" name="some-radios" value="主机">主机</b-form-radio>
                <img src="../assets/images/主机.png" alt="">
              </label>
            </b-row>
            <b-row class="icon3">
              <label>
                <b-form-radio v-model="selected" name="some-radios" value="投影仪">投影仪</b-form-radio>
                <img src="../assets/images/投影仪.png" alt="">
              </label>
            </b-row>
          </b-form-group>
        </b-col>
        <b-col style="margin: 0;padding: 0" v-if="selected==='展项'">
          <canvas ref="panel"
                  width="600"
                  height="600"
                  @mousedown="mouseDown"
                  @mousemove="mouseMove"
                  @mouseup="mouseUp"
          ></canvas>
        </b-col>
        <b-col v-if="selected==='主机'||selected==='投影仪'">
          <b-card>
            <b-table striped hover :items="deviceList" :fields="[{key:'Name', label:'设备名称'},{key:'HardwareInstructionList', label:'指令列表'}]">
              <template v-slot:cell(HardwareInstructionList)="data">
                <b-button v-for="instruction in data.item.HardwareInstructionList"
                          @click="exec({device, cmd:instruction})" variant="primary">
                  {{ instruction.InstructionName }}
                </b-button>
              </template>
            </b-table>
          </b-card>
        </b-col>
        <div class="dialog" v-if="showLeft && currentItem">
          <b-button @click="showLeft=false" letiant="primary">X</b-button>
          <b-col>
            <b-row><h3>{{ currentItem.Name }} {{ currentItem.Id }}</h3></b-row>
            <b-button-group>
              <b-button variant="success" @click="$alert('未实现')">展项开</b-button>
              <b-button variant="danger" @click="$alert('未实现')">展项关</b-button>
            </b-button-group>
            <b-row>
              <b-col v-if="currentItem && devices">
                <b-row><h3>设备列表</h3></b-row>
                <b-row v-for="device in devices">
                  <b-col>
                    <label>{{ device.Name }}</label>
                  </b-col>
                  <b-col>
                    <b-button-group>
                      <b-button variant="primary" v-for="cmd in device.HardwareInstructionList"
                                @click="exec({device, cmd})">
                        {{ cmd.InstructionName }}
                      </b-button>
                    </b-button-group>
                  </b-col>
                </b-row>
                <b-row v-if="devices && devices.length==0">
                  无设备
                </b-row>
              </b-col>
            </b-row>
          </b-col>
        </div>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "ExhibitionArea",
  props: {
    tab: {
      type: String,
      default: () => '展项'
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
  computed: {
    deviceList() {
      function flattenDeep(arr1) {
        return (arr1 || []).reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
      }

      return flattenDeep([
        this.selected === "主机" ? "HardwareEquipmentComputerList" : "HardwareEquipmentProjectorList",
        "NetworkDeviceComputers",
        "NetworkDeviceProjectors"
      ].map(k => this.areaListOptions.map(({value}) => ((value || {}).ExhibitionItemList || []).map(item => item[k]))));
    },
    devices() {
      return Array.prototype.concat.apply(...[
        "HardwareEquipmentComputerList",
        "HardwareEquipmentProjectorList",
        "NetworkDeviceComputers",
        "NetworkDeviceProjectors"
      ].map(k => (this.currentItem || {})[k]));
    }
  },
  watch: {
    selected: {
      handler() {
        this.paint()
      }
    },
    currentArea: {
      async handler(neo) {
        console.log({neo});
        this.currentItem = this.currentItem || neo.ExhibitionItemList[0]
        this.paint()
      },
      deep: true
    }
  },
  methods: {
    async exec({device, cmd}) {
      console.log({device, cmd})
      let {result} = await this.$postData("/Execute", cmd)
      this.$success(result)
    },
    getCanvas() {
      return this.$refs.panel
    },
    getContext() {
      return this.getCanvas().getContext('2d')
    },
    mouseDown(e) {
      this.down = true;
      this.showLeft = this;
      this.paint(e);
      let {width, height} = this.getCanvas();
      let lowestDistance = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))
      let lowest = null
      let itemList = this.currentArea.ExhibitionItemList;
      if (itemList) {
        for (let i in itemList) {
          let item = itemList[i];
          let {Name, X, Y} = item;
          let x = X * width;
          let y = Y * height;
          if (e) {
            let distance = this.calcOneDistance({e, x, y});
            if (distance < lowestDistance) {
              lowestDistance = distance;
              lowest = item;
            }
          }
        }
      }
      this.currentItem = lowest;
    },
    mouseUp(e) {
      this.down = false;
      this.paint(e);
    },
    strokeRect(x, y) {
      let canvas = this.getContext();
      canvas.strokeStyle = "rgba(0, 0, 200, 0.5)";
      canvas.strokeRect(x, y, 8, 4);
    },
    calcDistance: function ({x, mouseX, y, mouseY}) {
      return Math.round(Math.sqrt(Math.pow(x - mouseX, 2) + Math.pow(y - mouseY, 2)), 2);
    },
    calcOneDistance: function ({e, x, y}) {
      let {
        offsetX,
        offsetY,
      } = e;
      let mouseX = offsetX, mouseY = offsetY;
      return this.calcDistance({x, mouseX, y, mouseY});
    },
    paint(e) {
      let canvas = this.getCanvas();
      let context = this.getContext();
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height)
      let itemList = this.currentArea.ExhibitionItemList;
      if (itemList) {
        let {width, height} = this.getCanvas();
        for (let i in itemList) {
          let {Name, Text, X, Y} = itemList[i];
          let x = X * width;
          let y = Y * height;
          if (e) {
            let distance = this.calcOneDistance({e, x, y});
            let text = `${Text} (${distance})`;
            this.fillText({text, x, y})
          } else {
            this.fillText({text: Name, x: x, y: y})
          }
        }
      }
    },
    mouseMove(e) {
      this.paint(e);
    },
    smile() {
      let ctx = this.getContext();
      ctx.beginPath();
      ctx.arc(75, 75, 50, 0, Math.PI * 2, true); // Outer circle
      ctx.moveTo(110, 75);
      ctx.arc(75, 75, 35, 0, Math.PI, false);  // Mouth (clockwise)
      ctx.moveTo(65, 65);
      ctx.arc(60, 65, 5, 0, Math.PI * 2, true);  // Left eye
      ctx.moveTo(95, 65);
      ctx.arc(90, 65, 5, 0, Math.PI * 2, true);  // Right eye
      ctx.stroke();
    },
    doubleTriangles() {
      let ctx = this.getContext();
      ctx.beginPath();
      ctx.moveTo(25, 25);
      ctx.lineTo(105, 25);
      ctx.lineTo(25, 105);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(125, 125);
      ctx.lineTo(125, 45);
      ctx.lineTo(45, 125);
      ctx.closePath();
      ctx.stroke();
    },
    cycles() {
      let ctx = this.getContext();
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
          ctx.beginPath();
          let x = 25 + j * 50; // x coordinate
          let y = 25 + i * 50; // y coordinate
          let radius = 20; // Arc radius
          let startAngle = 0; // Starting point on circle
          let endAngle = Math.PI + (Math.PI * j) / 2; // End point on circle
          let anticlockwise = i % 2 !== 0; // clockwise or anticlockwise
          ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
          if (i > 1) {
            ctx.fill();
          } else {
            ctx.stroke();
          }
        }
      }
    },
    fillText: function ({text, x, y, fillStyle, font}) {
      let {width, height} = this.getCanvas();
      // console.log("fillText", {text, x, y, fillStyle, font}, {width, height})
      let ctx = this.getContext();
      ctx.fillStyle = fillStyle || "blue";
      ctx.font = font || '14px serif';
      ctx.fillText(text || 'Hello world', x || 10, y || 50)
    },
    onmessage({ws, args}) {
      // console.log(`onmessage ${this}`, args.data);
      this.$success(JSON.stringify(args, undefined, 4))
    },
    onopen({ws, args}) {
      ws.send(`on open ${this} ${JSON.stringify(args)}`);
      /*
              setInterval(() =>
                this.ws.send("展现界面准备完毕"), 1000)*/
      this.$success(args.data)
    },
    async reload() {
      this.areaListOptions = await this.$getData("/GetExhibitionAreaDropDownList");
      this.currentArea = this.currentArea || ((this.areaListOptions || [])[0] || {}).value;
      this.smile();
      this.doubleTriangles();
      this.cycles();
      this.startWebSocket();
    }
  },
  mounted() {
    this.reload();
  }
}
</script>

<style lang="less" scoped>
/*画布*/
canvas {
  border: black 1px solid;
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

.main-page {
  border: #222222 1px solid;
  height: 100%;
}

.top-menu {
  width: 100%;
  padding: 1%;
  border: #222222 1px solid;

  .settings-button {
    float: right;
  }
}

.dialog {
  position: fixed;
  z-index: 20;
  left: 0;
  top: 0;
  width: 30%;
  height: 100%;
  background: #ffffff;
  padding: 10px;
}

.icon3 {
  margin: auto;
  width: 120px;

  img {
    width: 120px;
    height: 120px;
  }
}
</style>
