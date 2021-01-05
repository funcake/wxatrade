import Vue from 'vue'
import App from './App.vue'

let node = document.createElement("LI")
node.setAttribute('id','My')
document.getElementsByTagName('body')[0].appendChild(node)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#My')
 