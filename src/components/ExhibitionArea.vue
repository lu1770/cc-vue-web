<template>
  <div class="main-page">
    <TopBar v-model="currentArea"/>
    <div>
      <div>
        <div class="left-btn-group">
          <b-link to="/nav/ExhibitionArea?tab=展项" class="btn1 btn-left">
            <div>
              <img src="../assets/images/展区.png"/>
            </div>
            <div for="展项">展项</div>
          </b-link>
          <b-link to="/nav/ExhibitionArea?tab=主机" class="btn2 btn-left">
            <div>
              <img src="../assets/images/主机.png"/>
            </div>
            <div for="主机">主机</div>
          </b-link>
          <b-link to="/nav/ExhibitionArea?tab=投影仪" class="btn3 btn-left">
            <div>
              <img src="../assets/images/投影仪.png"/>
            </div>
            <div for="投影仪">投影仪</div>
          </b-link>
        </div>
        <div style="margin: 0;padding: 0" v-show="selected==='展项'" xs9>
          <canvas ref="panel"
                  width="600"
                  height="600"
                  @mousedown="mouseDown"
                  @mousemove="mouseMove"
                  @mouseup="mouseUp"></canvas>
        </div>
        <div v-if="selected==='主机'||selected==='投影仪'" xs9>
          <b-card>
            <b-table striped hover :items="deviceList"
                     :fields="[{key:'Name', label:'设备名称'},{key:'HardwareInstructionList', label:'指令列表'}]">
              <template v-slot:cell(HardwareInstructionList)="data">
                <template v-if="data.item.HardwareInstructionList">
                  <div v-for="instruction in data.item.HardwareInstructionList">
                    <b-button @click="exec({device, cmd:instruction})" variant="primary">
                      {{ instruction.InstructionName }}
                    </b-button>
                  </div>
                </template>
              </template>
            </b-table>
          </b-card>
        </div>
        <div class="dialog" v-if="showLeft && currentItem">
          <b-button @click="showLeft=false" letiant="primary">X</b-button>
          <div>
            <div><h3>{{ currentItem.Name }} {{ currentItem.Id }}</h3></div>
            <b-button-group>
              <b-button variant="success" @click="$alert('未实现')">展项开</b-button>
              <b-button variant="danger" @click="$alert('未实现')">展项关</b-button>
            </b-button-group>
            <div>
              <div v-if="currentItem && devices">
                <div><h3>设备列表</h3></div>
                <div v-for="device in devices">
                  <div>
                    <label>{{ device.Name }}</label>
                  </div>
                  <div>
                    <b-button-group>
                      <b-button variant="primary" v-for="cmd in device.HardwareInstructionList"
                                @click="exec({device, cmd})">
                        {{ cmd.InstructionName }}
                      </b-button>
                    </b-button-group>
                  </div>
                </div>
                <div v-if="devices && devices.length==0">
                  无设备
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopBar from "./TopBar";

export default {
  name: "ExhibitionArea",
  components: {TopBar},
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
      currentArea: null,
      currentItem: null,
      areaListOptions: [],
    }
  },
  computed: {
    document() {
      return document;
    },
    deviceList() {
      function flattenDeep(arr1) {
        return (arr1 || []).reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
      }

      let vm = this;
      return flattenDeep([
        vm.selected === "主机" ? "HardwareEquipmentComputerList" : "HardwareEquipmentProjectorList",
        "NetworkDeviceComputers",
        "NetworkDeviceProjectors"
      ].map(k => vm.areaListOptions.map(({value}) => ((value || {}).ExhibitionItemList || []).map(item => item[k]))));
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
      }
    },
    currentArea: {
      async handler(neo) {
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
      return this.$refs.panel.getContext('2d')
    },
    mouseDown(e) {
      this.down = true;
      this.showLeft = this;
      this.paint(e);
      let {width, height} = this.getCanvas();
      let lowestDistance = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))
      let lowest = null
      let itemList = (this.currentArea || {}).ExhibitionItemList;
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
      let itemList = (this.currentArea || {}).ExhibitionItemList;
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
      console.log(`onmessage ${this}`, args.data);
      this.$success(JSON.stringify(args.data, undefined, 4))
    },
    onopen({ws, args}) {
      ws.send(`on open ${this} ${JSON.stringify(args)}`);
      /*
              setInterval(() =>
                this.ws.send("展现界面准备完毕"), 1000)*/
      this.$success(args.data)
    },
    async reload() {
      this.smile();
      this.doubleTriangles();
      this.cycles();
      this.startWebSocket();
      this.areaListOptions = await this.$getData("/GetExhibitionAreaDropDownList");
      this.currentArea = this.currentArea || ((this.areaListOptions || [])[0] || {}).value;
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

.main-page {
  //border: #222222 1px solid;
  height: 100%;
}

.top-menu {
  width: 100%;
  padding: 1%;
  //border: #222222 1px solid;

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

.left-btn-group {
  width: 30%;
  height: 100%;
  overflow: hidden;
}

@width: 160px;
@height: 160px;
@margin: 15px;

.btn-left {
  text-align: center;
  line-height: @height;
  color: #e1e1e1;
  background-repeat: no-repeat;
  background-position: 0 0;
  background-image: url("../assets/images/框框.png");
  background-size: @width @height;
  width: @width;
  height: @height;
  margin: @margin;

  div {
    img {
      width: 120%;
      height: 120%;
    }

    margin: auto;
    width: 30%;
    height: 30%;
  }
}

.btn2 {
}

.btn3 {
}

</style>
