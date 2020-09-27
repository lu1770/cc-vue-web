import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let routes = [];
const componentsContext = require.context('../components', true, /.+\.vue$/);
componentsContext.keys().forEach(component => {
  // 获取文件中的 default 模块
  const componentConfig = componentsContext(component).default;
  if (componentConfig.name) {
    routes.push(
      {
        path: `/nav/${(componentConfig.name || '').toLowerCase()}`,
        component: componentConfig,
        props: (route) => {
          return route.query;
        }
      }
    );
    Vue.component(componentConfig.name, componentConfig);
  }
});

routes = [...new Set(routes), {
  path: "/", name: "Entrance", component: () => import("../components/Entrance")
}];

export default new Router({
  // routes: [
  //   {
  //     path: '/',
  //     name: 'HelloWorld',
  //     component: HelloWorld
  //   }
  // ]
  routes
})
//npm install --save vue-echarts
