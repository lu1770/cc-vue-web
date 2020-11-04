import Vue from 'vue'
import axios from 'axios';

let VueResource = require('vue-resource');
Vue.use(VueResource);
let host = "";
if (process.env.NODE_ENV === 'production') {
  host = ""
} else {
  host = "http://192.168.5.158"
}
host += "/Kiosoft.Serial.Web.Api"

function init() {
  // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  // axios.defaults.headers.post['Authorization'] = `Bearer ${localStorage['token']}`;
  // axios.defaults.headers.post['current_user'] = localStorage.getItem('current_user');
  // axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
  // axios.defaults.headers.get['Authorization'] = `Bearer ${localStorage['token']}`;
  // axios.defaults.headers.get['current_user'] = localStorage.getItem('current_user');
}

async function $getData(url, data) {
  let [err, result] = await this.$get(url, data);
  return result.data;
}

async function $get(url, data) {
  init();
  let uri = url;
  console.log(`$get(${uri},${JSON.stringify(data)})`);
  if (uri && uri.indexOf(host) === -1) uri = host + uri;
  let result = await axios.get(uri, {
    params: data,
    withCredentials: true,
  })
    .then(resp => [null, resp.data])
    .catch(err => [err, null]);
  this.$processResult({result, url});
  return result;
}

function $processResult({result, url}) {
  let [err, resp] = result;
  if (this.$alertIfError({err, resp, url})) {
    console.log({
      err,
      ...resp
    })
    let msg = err || (resp || {}).message || resp;
    msg = `${msg}`;
    if (msg
      && msg.indexOf('登陆') > -1
      || msg.indexOf('登录') > -1
      || msg.indexOf('401') > -1) {
      this.$router.push('/loginPage');
    }
    throw Error(`发现服务器端异常：${msg}`);
  }
}

async function $getFull(url, data) {
  init();
  let uri = url;
  console.log(`$getFull(${uri},${JSON.stringify(data)})`);
  if (uri && uri.indexOf(host) === -1) uri = host + uri;
  let result = await axios.get(uri, {
    params: data,
    withCredentials: true,
  })
    .then(resp => [null, resp.data])
    .catch(err => [err, null]);
  this.$processResult({result, uri});
  return result;
}

/**
 * 请求分页数据
 * @param url 地址
 * @returns {Promise<[null, any] | TResult|undefined>}
 */
async function $postPaging(url) {
  return this.$post(url, this.$pagingFormData())
}

async function $postData(url, data) {
  let [err, result] = await this.$post(url, data);
  return result.data;
}
async function $post(url, data) {
  try {
    init();
    let uri = url;
    console.log(`$post(${uri},${JSON.stringify(data)})`);
    if (uri && uri.indexOf(host) === -1) uri = host + uri;
    let result = await axios.post(uri, data, {
      withCredentials: true,
    })
      .then(resp => [null, resp.data])
      .catch(err => [err, null]);
    this.$processResult({result, uri});
    return result
  } catch (e) {
    console.error(e);
  }
}

export {
  $get, $post, host, $getFull, $processResult, $postPaging, $getData, $postData
}
