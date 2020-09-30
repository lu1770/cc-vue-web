<template>
  <div class="main-page">
    <TopBar v-model="currentArea" />
    <div>
      <div>
        <div class="left-btn-group">
          <div @click="switch_tab('展项')" class="btn1 btn-left">
            <div class="btn-icon btn-icon-1">展项</div>
            <div
              class="btn-w-icon-border"
              :class="selected === '展项' ? 'active' : ''"
            >
              <div class="inner"></div>
            </div>
          </div>
          <div @click="switch_tab('主机')" class="btn2 btn-left">
            <div class="btn-icon btn-icon-2">主机</div>
            <div
              class="btn-w-icon-border"
              :class="selected === '主机' ? 'active' : ''"
            >
              <div class="inner"></div>
            </div>
          </div>
          <div
            @click="switch_tab('投影仪')"
            class="btn3 btn-left"
            v-for="i in 5"
          >
            <div class="btn-icon btn-icon-3">投影仪</div>
            <div
              class="btn-w-icon-border"
              :class="selected === '投影仪' ? 'active' : ''"
            >
              <div class="inner"></div>
            </div>
          </div>
        </div>
        <div class="rightPanel">
          <div v-show="selected === '展项'">
            <canvas
              ref="panel"
              width="694"
              height="478"
              @mousedown="mouseDown"
              @mousemove="mouseMove"
              @mouseup="mouseUp"
            >
            </canvas>
          </div>
          <div v-show="isDeviceListTab" xs9>
            <b-card>
              <b-table
                striped
                hover
                :items="deviceList"
                :fields="[
                  { key: 'Name', label: '设备名称' },
                  { key: 'HardwareInstructionList', label: '指令列表' },
                ]"
              >
                <template v-slot:cell(HardwareInstructionList)="data">
                  <template v-if="data.item.HardwareInstructionList">
                    <div
                      v-for="instruction in data.item.HardwareInstructionList"
                      v-bind:key="instruction.Id"
                    >
                      <b-button
                        @click="exec({ device, cmd: instruction })"
                        variant="primary"
                      >
                        {{ instruction.InstructionName }}
                      </b-button>
                    </div>
                  </template>
                </template>
              </b-table>
            </b-card>
          </div>
        </div>
        <div class="dialog" v-if="showLeft && currentItem">
          <b-button
            class="close-dialog"
            @click="showLeft = false"
            variant="outline-primary"
            >X</b-button
          >
          <div>
            <div>
              <h3>{{ currentItem.Name }} ({{ currentItem.Id }})</h3>
            </div>
            <b-button-group>
              <b-button variant="success" @click="$alert('未实现')"
                >展项开</b-button
              >
              <b-button variant="danger" @click="$alert('未实现')"
                >展项关</b-button
              >
            </b-button-group>
            <div>
              <div v-if="currentItem && devices">
                <div><h3>设备列表</h3></div>
                <div v-for="device in devices" v-bind:key="device.Id">
                  <div>
                    <label>{{ device.Name }}</label>
                  </div>
                  <div>
                    <b-button-group>
                      <b-button
                        variant="primary"
                        v-for="cmd in device.HardwareInstructionList"
                        @click="exec({ device, cmd })"
                        v-bind:key="cmd.InstructionName"
                      >
                        {{ cmd.InstructionName }}
                      </b-button>
                    </b-button-group>
                  </div>
                </div>
                <div v-if="devices && devices.length == 0">无设备</div>
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
  components: { TopBar },
  props: {
    tab: {
      type: String,
      default: () => "展项",
    },
  },
  data() {
    return {
      down: false,
      selected: this.$route.query.tab || "展项",
      showLeft: false,
      currentArea: null,
      currentItem: null,
      areaListOptions: [],
    };
  },
  computed: {
    isDeviceListTab() {
      let { selected } = this;
      return selected === "主机" || selected === "投影仪";
    },
    document() {
      return document;
    },
    deviceList() {
      function flattenDeep(arr1) {
        return (arr1 || []).reduce(
          (acc, val) =>
            Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val),
          []
        );
      }

      let vm = this;
      return flattenDeep(
        [
          vm.selected === "主机"
            ? "HardwareEquipmentComputerList"
            : "HardwareEquipmentProjectorList",
          "NetworkDeviceComputers",
          "NetworkDeviceProjectors",
        ].map((k) =>
          vm.areaListOptions.map(({ value }) =>
            ((value || {}).ExhibitionItemList || []).map((item) => item[k])
          )
        )
      );
    },
    devices() {
      return Array.prototype.concat.apply(
        ...[
          "HardwareEquipmentComputerList",
          "HardwareEquipmentProjectorList",
          "NetworkDeviceComputers",
          "NetworkDeviceProjectors",
        ].map((k) => (this.currentItem || {})[k])
      );
    },
  },
  watch: {
    selected: {
      handler() {},
    },
    currentArea: {
      async handler(neo) {
        this.currentItem = this.currentItem || neo.ExhibitionItemList[0];
        this.paint();
      },
      deep: true,
    },
  },
  methods: {
    switch_tab(chs) {
      this.$router.push(`/nav/ExhibitionArea?tab=${chs}`).catch((err) => {
        err;
      });
      this.selected = chs;
      this.showLeft = false;
    },
    async exec({ device, cmd }) {
      console.log({ device, cmd });
      // let { result } = await this.$postData("/Execute", cmd);
      // this.$success(result);
      this.ws.send(JSON.stringify(cmd));
    },
    getCanvas() {
      return this.$refs.panel;
    },
    getContext() {
      return this.$refs.panel.getContext("2d");
    },
    /**
     * 鼠标点下去
     */
    mouseDown(e) {
      this.down = true;
      this.showLeft = this;
      this.paint(e);
      let { width, height } = this.getCanvas();
      let lowestDistance = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
      let lowest = null;
      let itemList = (this.currentArea || {}).ExhibitionItemList;
      if (itemList) {
        for (let i in itemList) {
          let item = itemList[i];
          let { Name, X, Y } = item;
          let x = X * width;
          let y = Y * height;
          if (e) {
            let distance = this.calcOneDistance({ e, x, y });
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
    calcDistance: function ({ x, mouseX, y, mouseY }) {
      return Math.round(
        Math.sqrt(Math.pow(x - mouseX, 2) + Math.pow(y - mouseY, 2)),
        2
      );
    },
    calcOneDistance: function ({ e, x, y }) {
      let { offsetX, offsetY } = e;
      let mouseX = offsetX,
        mouseY = offsetY;
      return this.calcDistance({ x, mouseX, y, mouseY });
    },
    paint(e) {
      let canvas = this.getCanvas();
      let context = this.getContext();
      context.clearRect(0, 0, canvas.width, canvas.height);
      let area = this.currentArea || {};
      let itemList = area.ExhibitionItemList;
      canvas.style = "background:rgba(255,255,255,0);";
      if (area.BackgroundImageFile) {
        let src = `/Kiosoft.Serial.Web.Api/upload/${area.BackgroundImageFile}`,
          vm = this;
        let img = new Image();
        img.onerror = () => vm.$alert(`加载底图失败 ${src}`);
        img.src = src;
        console.log(img.src);
        context.drawImage(img, 0, 0, 694, 478);
      }

      if (itemList) {
        let { width, height } = this.getCanvas();
        for (let i in itemList) {
          const item = itemList[i];
          if (item && item.Id) {
            console.log(JSON.stringify(item));
            let { Name, Text, X, Y } = item;
            let x = X * width;
            let y = Y * height;
            if (e) {
              let distance = this.calcOneDistance({ e, x, y });
              let text = `${Text || Name} (${distance})`;
              this.fillText({ text, x, y });
            } else {
              this.fillText({ text: Name || Text, x: x, y: y });
            }
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
      ctx.arc(75, 75, 35, 0, Math.PI, false); // Mouth (clockwise)
      ctx.moveTo(65, 65);
      ctx.arc(60, 65, 5, 0, Math.PI * 2, true); // Left eye
      ctx.moveTo(95, 65);
      ctx.arc(90, 65, 5, 0, Math.PI * 2, true); // Right eye
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
    fillText: function ({ text, x, y, fillStyle, font }) {
      if (text) {
        let { width, height } = this.getCanvas();
        // console.log("fillText", {text, x, y, fillStyle, font}, {width, height})
        let ctx = this.getContext();
        ctx.fillStyle = fillStyle || "blue";
        ctx.font = font || "14px serif";
        ctx.fillText(text || "", x || 10, y || 50);
      }
    },
    onmessage({ ws, args }) {
      this.$success(JSON.stringify(args.data, undefined, 4));
    },
    onopen({ ws, args }) {
      // ws.send({InstructionContent:`(+ 1 1 1)`});
    },
    async reload() {
      this.startWebSocket();
      // this.smile();
      // this.doubleTriangles();
      // this.cycles();
      // 默认值
      this.areaListOptions = [
        {
          value: {
            Id: 7,
            Name: "序厅",
            Count: 1,
            ExhibitionItemList: [
              {
                HardwareEquipmentComputerList: [
                  {
                    HardwareInstructionList: [
                      {
                        Id: 25,
                        InstructionName: "开机",
                        InstructionContent: '(send "PC ON")',
                        Enable: true,
                        HardwareEquipmentId: 14,
                      },
                      {
                        Id: 26,
                        InstructionName: "关机",
                        InstructionContent: '(send "PC OFF")',
                        Enable: true,
                        HardwareEquipmentId: 14,
                      },
                    ],
                    HardwareProjector: null,
                    DeviceType: "硬件受控主机",
                    ProjectorName: null,
                    Id: 14,
                    CentralControllerPortId: 101,
                    IsRunning: 1,
                    Name: "PC 01",
                    ExhibitionItemName: null,
                    ExhibitionItemId: null,
                    CentralControllerId: 14,
                    Remark: null,
                    SerialPortControllerId: null,
                    Order: 3,
                    TransactionNo: "f264968f3b9147579aa89ff500f8326d",
                    VersionNo: 1,
                    CreatedBy: "科奥中控控制系统（体验版）",
                    CreationDate: "2020-09-24T17:38:43",
                    LastUpdatedBy: null,
                    LastUpdateDate: null,
                  },
                ],
                HardwareEquipmentProjectorList: [
                  {
                    HardwareInstructionList: [
                      {
                        Id: 27,
                        InstructionName: "开机",
                        InstructionContent: '(send "PC ON")',
                        Enable: true,
                        HardwareEquipmentId: 15,
                      },
                      {
                        Id: 28,
                        InstructionName: "关机",
                        InstructionContent: '(send "PC OFF")',
                        Enable: true,
                        HardwareEquipmentId: 15,
                      },
                    ],
                    DeviceType: "硬件受控投影仪",
                    Id: 15,
                    CentralControllerPortId: 201,
                    IsRunning: 1,
                    Name: "Projector 01",
                    ExhibitionItemName: null,
                    ExhibitionItemId: null,
                    CentralControllerId: 14,
                    Remark: null,
                    SerialPortControllerId: null,
                    Order: 5,
                    TransactionNo: "f264968f3b9147579aa89ff500f8326d",
                    VersionNo: 1,
                    CreatedBy: "科奥中控控制系统（体验版）",
                    CreationDate: "2020-09-24T17:38:43",
                    LastUpdatedBy: null,
                    LastUpdateDate: null,
                  },
                ],
                NetworkDeviceComputers: [],
                NetworkDeviceProjectors: [],
                Id: 8,
                Name: "小火车",
                ExhibitionAreaId: 7,
                Count: 0,
                Icon: "Icon/alert.png",
                X: 0.0,
                Y: 0.0,
                TextX: 0.0,
                TextY: 0.0,
                GraphicWidth: 0,
                GraphicHeight: 0,
                Location: "0, 0",
                Text: "未命名绘图点",
                TextLocation: "0, 60",
                TransactionNo: "f264968f3b9147579aa89ff500f8326d",
                VersionNo: 1,
                CreatedBy: "科奥中控控制系统（体验版）",
                CreationDate: "2020-09-24T17:38:43",
                LastUpdatedBy: null,
                LastUpdateDate: null,
                Order: 2,
              },
            ],
            X: 0,
            Y: 0,
            Location: "0, 0",
            BackgroundImageFile: null,
            Order: 1,
            TransactionNo: "f264968f3b9147579aa89ff500f8326d",
            VersionNo: 1,
            CreatedBy: "科奥中控控制系统（体验版）",
            CreationDate: "2020-09-24T17:38:43",
            LastUpdatedBy: null,
            LastUpdateDate: null,
          },
          text: "序厅",
        },
      ];
      this.currentArea =
        this.currentArea || ((this.areaListOptions || [])[0] || {}).value;

      // 网络获取
      this.areaListOptions = await this.$getData(
        "/GetExhibitionAreaDropDownList"
      );
      this.currentArea =
        this.currentArea || ((this.areaListOptions || [])[0] || {}).value;
      this.paint();
    },
  },
  mounted() {
    this.reload();
  },
};
</script>

<style lang="less" scoped>
.rightPanel {
  position: fixed;
  top: 56px;
  left: 160px;
  width: 694px;
  height: 478px;
}
canvas {
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

.main-page {
  //border: #222222 1px solid;
  height: 100%;
  overflow: hidden;
}

.top-menu {
  width: 100%;
  padding: 1%;
  //border: #222222 1px solid;
}

.dialog {
  color: white;
  position: fixed;
  z-index: 20;
  right: 0;
  top: 0;
  width: 30%;
  height: 100%;
  background: rgba(17, 21, 49, 0.8);
  padding: 10px;
  overflow-y: scroll;

  button.close-dialog {
    position: fixed;
    top: 8px;
    right: 8px;
  }
}

.left-btn-group {
  width: 30%;
  /* height: 103%; */
  margin-top: 0;
  /* overflow-y: scroll; */
  position: relative;
  top: 22px;
}

@width: 160px;
@height: 160px;
@margin: 15px;

.btn-left {
  width: @width;
  height: 129px;
  .btn-icon {
    position: relative;
    top: 0;
    left: 0;
    width: @width;
    height: 140px;
    text-align: center;
    padding-top: 75px;
    color: white;
    z-index: 999999;
    width: @width;
    height: 140px;
    background-size: 40px 40px;
    background-position: 60px 35px;
    background-repeat: no-repeat;
  }

  .btn-icon-1 {
    background-image: url("../assets/images/展区.png");
  }

  .btn-icon-2 {
    background-image: url("../assets/images/主机.png");
  }

  .btn-icon-3 {
    background-image: url("../assets/images/投影仪.png");
  }
}

.btn-w-icon-border {
  z-index: 0;
  position: relative;
  top: -127px;
  left: 27px;
  border: rgb(61, 174, 250) 1px solid !important;
  border-radius: 10px;
  transform: rotate(60deg);
  width: @width*0.65;
  height: @height*0.65;
  &.active {
    border: rgb(61, 174, 250) 1px dashed !important;
    .inner {
      background-color: #203a5ec4;
      position: relative;
      border-radius: 10px;
      width: @width*0.56;
      height: @height*0.56;
      margin: 6px;
    }
  }
}
</style>
