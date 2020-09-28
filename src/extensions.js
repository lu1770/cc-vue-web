import Vue from "vue";

function $alertIfError({err, resp, url}) {
  if (err || !resp.success) {
    this.$alert(`发现服务器端异常: ${err || resp.message} ${url}`);
    return true;
  }
  return false;
}

function messageShow(variant, msg) {
  console.log(`toast://${msg}`)
  let vm = this;
  if (vm) {
    vm.messageVariant = variant;
    vm.showDismissibleAlert = true;
    vm.errorMessage = msg;
    setTimeout(() => {
      vm.showDismissibleAlert = false;
    }, 3000)
  }
}

function $alert(msg) {
  let vm = this;
  messageShow("danger", msg)
}

function $success(msg) {
  let variant = 'success';
  messageShow.call(this, variant, msg);
  this.$emit(variant, msg);
  console.log(`toast: ${msg}`)
}

Array.prototype.$set = function () {
  return [...new Set(this.map(JSON.stringify))].map(JSON.parse);
};

/**
 * 分页带条件
 * @returns {{[p: string]: any, data}}
 */
function $pagingFormData() {
  let vm = this || {};
  let $props = vm.$props || {};
  let condition = vm.condition || {};
  let payload = {
    ...$props,
    ...condition,
    data: {
      ...$props,
      ...condition,
    }
  };
  return payload
}

function setHome(obj, vrl) {
  try {
    obj.style.behavior = 'url(#default#homepage)';
    obj.setHomePage(vrl);
  } catch (e) {
    if (window.netscape) {
      try {
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
      } catch (e) {
        this.$alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入“about:config”并回车\n然后将 [signed.applets.codebase_principal_support]的值设置为'true',双击即可。");
      }
      var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
      prefs.setCharPref('browser.startup.homepage', vrl);
    } else {
      this.$alert("您的浏览器不支持，请按照下面步骤操作：1.打开浏览器设置。2.点击设置网页。3.输入：" + vrl + "点击确定。");
    }
  }
}

/**
 * 获取当前主题的中文名称
 * @param val 主题id
 * @returns {*}
 */
function getThemeName(val) {
  return [].concat.apply([],
    themeOptions.map(
      ({options}) =>
        options.map(({text, value}) =>
          value === val ? text : null))).filter(i => i)[0] || `未找到名为${val}的主题名称`
}

/**
 * 获取主题ID
 * @param name
 * @returns {*|string}
 */
function getThemeId(name) {
  return [].concat.apply([],
    themeOptions.map(
      ({options}) =>
        options.map(({text}) =>
          text === name ? text : null))).filter(i => i)[0] || `未找到名为${name}的主题`
}

/*
    使用api需要预先在页面上定义如下节点

 */

import {host, $get, $post, $postPaging, $processResult, $getData, $postData,} from "./http.js";

function extensions(Vue, options) {
  Vue.prototype.wsObserverList = [];
  Vue.prototype.startWebSocket = function () {
    let vue = this;

    function fire(webSocket, fn_name) {
      if (!fn_name) throw Error("方法名为空");
      if (!webSocket) throw Error("WebSocket对象为空");
      let webSocketInstance = webSocket;
      return function (args) {
        let ws = webSocketInstance;
        let observerList = vue.wsObserverList;
        for (let i in observerList) {
          let observer = observerList[i]
          if (fn_name && observer && observer[fn_name]) {
            observer[fn_name]({ws, args});
          } else {
            throw Error(`observer对象错误 ${typeof (observer)}`);
          }
        }
      }
    }

    vue.wsObserverList = [...new Set([vue, ...vue.wsObserverList])];
    const ws = new WebSocket("ws://192.168.5.158:8181");
    ws.onopen = fire(ws, "onopen");
    ws.onmessage = fire(ws, "onmessage");
    ws.onclose = fire(ws, "onclose");
    vue.ws = ws;
  };

  Vue.prototype.host = host;
  Vue.prototype.$get = $get;
  Vue.prototype.$post = $post;
  Vue.prototype.$postData = $postData;

  Vue.prototype.$alert = $alert;
  Vue.prototype.$getData = $getData;
  Vue.prototype.$postPaging = $postPaging;
  Vue.prototype.$processResult = $processResult;
  Vue.prototype.$alertIfError = $alertIfError;
  Vue.prototype.$pagingFormData = $pagingFormData;
  Vue.prototype.$success = $success;
  Vue.prototype.showDismissibleAlert = false;
  Vue.prototype.errorMessage = '';
  Vue.prototype.messageVariant = '';
  Vue.prototype.isDebugMode = window.location.href.indexOf('localhost') > -1;
  Vue.prototype.href = window.location.href;
  let userAgent = window.navigator.userAgent;
  Vue.prototype.userAgent = userAgent;
  let isTV = userAgent.indexOf("iPad;") > -1
    || userAgent.indexOf("Android 9;") > -1
    || userAgent.indexOf("like Mac OS X") > -1;
  Vue.prototype.isTV = isTV
  Vue.prototype.isMobile = userAgent.indexOf('iPhone OS') > -1;
  // if(isTV) setHome(this, window.location);

  Vue.prototype.getThemeName = getThemeName
  Vue.prototype.info = `屏幕分辨率为：${screen.width}*${screen.height}<br />屏幕可用大小：${screen.availWidth}*${screen.availHeight}<br />网页可见区域宽：${document.body.clientWidth}<br />网页可见区域高：${document.body.clientHeight}<br />网页可见区域宽(包括边线的宽)：${document.body.offsetWidth}<br />网页可见区域高(包括边线的宽)：${document.body.offsetHeight}<br />网页正文全文宽：${document.body.scrollWidth}<br />网页正文全文高：${document.body.scrollHeight}<br />网页被卷去的高：${document.body.scrollTop}<br />网页被卷去的左：${document.body.scrollLeft}<br />网页正文部分上：${window.screenTop}<br />网页正文部分左：${window.screenLeft}<br />屏幕分辨率的高：${window.screen.height}<br />屏幕分辨率的宽：${window.screen.width}<br />屏幕可用工作区高度：${window.screen.availHeight}<br />屏幕可用工作区宽度：${window.screen.availWidth}`;

  Vue.prototype.jump = function () {
    if (location.href.indexOf('/WeightManagement') > -1) {
      this.$router.push('/RankingList2')
    } else if (location.href.indexOf('/RankingList2') > -1) {
      location.href = "http://218.4.145.68:7001/financial_info_yl"
    } else {
      this.$router.push('/WeightManagement')
    }
  }
  Vue.prototype.removeIf = function (item) {
    this.removeItem = item;
    // this.$bvModal.show('remove-if');
    let vm = this;
    this.$bvModal.msgBoxConfirm('确认是否删除，将永久删除此记录.', {
      title: '请确认',
      size: 'sm',
      buttonSize: 'sm',
      okVariant: 'danger',
      okTitle: '删除',
      cancelTitle: '取消',
      footerClass: 'p-2',
      hideHeaderClose: false,
      centered: true
    })
      .then(value => {
        if (value) vm.remove(item)
        else vm.$success('撤销删除')
      })
      .catch(err => {
        console.error(err)
      })
  }
}

export default {
  extensions,
  install: extensions
}
