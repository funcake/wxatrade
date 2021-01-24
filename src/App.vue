<template>
  <div>
    <div   style="position: fixed; z-index: 100000; top: 90%; right: 0">
      <!-- <a
        :href="'https://mp.weixin.qq.com/wxatrade/goods/list?token='
          +token+'&lang=zh_CN'"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button class="weui-desktop-btn button">商品列表</button>
        </a> -->
      <button class="weui-desktop-btn button" style="z-index:100100;border:1px" @click="showM">商品管理</button>
    </div>
    <div v-if="showMessage">
      <div
        style="
          position: fixed;
          display: flex;
          flex-wrap: wrap;
          align-items: stretch;
          overflow: auto;
          width: 100%;
          height: 100%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        "
      >
        <div
          style="
            background-color: #eee;
            display: flex;
            flex-wrap: wrap;
            overflow: auto;
            flex: 1;
            justify-content: center;
            height: 100%;
          "
        >
              <div style="height:1rem;width:100%;">
           <input type="text" class="weui-desktop-form__input" style="width:8rem" @keyup.enter="searching" placeholder="搜索" v-model="search"/> 
        </div>
          <!-- 商品列表 -->
          <Product
            v-for="(product, index) in displayProducts"
            :key="product.key"
            :product="product"
            :index="index"
            @select="select"
            @multSelect="multSelect"
            @BatchListing="BatchListing"
            @BatchUnListing="BatchUnListing"
            @BatchDel="BatchDel"
          ></Product>
          <span class="pages">
            <span v-for="n in 10" class="weui-desktop-btn button" style="font-weight:bold;min-width: 0;" @click="page(n)" :key="n">{{n}}</span>
          </span>
        </div>
        <div class="opition" style="display: flex; flex-direction: column;background: white;">
          <button @click="clean" class="weui-desktop-btn button">clean</button>
          <hr>
          <button @click="BatchListingAll" class="weui-desktop-btn button">上架</button>
          <button @click="BatchUnListingAll" class="weui-desktop-btn button">下架</button>
          <button @click="BatchDelAll" class="weui-desktop-btn button">删除</button>
          <button
            @click="products = 上架"
            class="weui-desktop-btn button"
            style="margin-top: auto"
          >
            已上架
          </button>
          <hr>
          <button @click="products = 下架" class="weui-desktop-btn button">
            已下架
          </button>
        </div>

        <div class="sidebar">
          <ul>
            <button class="weui-desktop-btn button" @click="fresh()">
              全部
            </button>
          </ul>
          <shopCat
            v-for="(cat, index) in shopCat"
            :key="index"
            :cat="cat"
            @update="update"
            @upShopCat="upShopCat"
          ></shopCat>
        </div>
      </div>
    </div>
  </div>
</template>  

<script>
import Product from "./components/Product";
import ShopCat from "./components/shopCat";
// import sh(opCat from "./shopCat.json";
var products = []
var shopCat = []
var productKeys = new Map();
localStorage.setItem('token',decodeURIComponent(
        window.location.search
          .substr(1)
          .match(new RegExp("(^|&)token=([^&]*)(&|$)", "i"))[2]
      ))
export default {
  name: "App",
  components: {
    Product,
    ShopCat, 
  },
  data() {
    return {
      showMessage: false,
      //商品列表
      products,
      displayProducts:[],
      length:0,

      search:'',
      //分类管理
      shopCat,
      token: localStorage.getItem('token'),
      上架: [],
      下架: [],
      待上架:[],
      pageNum:1
    };
  },
  mounted: function () {
    let that = this;
    that.getShopSonCat();
    that.goodsList()
    localStorage.setItem('token',this.token)
  },
  computed: {
          selected: function() {
            return this.displayProducts.filter(p=>p.selected == true)
          }
  },
  methods: {
    showM() {
      this.showMessage = !this.showMessage;
      this.images = [];
    },
    goodsList() {
      let PageOne = new Promise(
        (resolve) =>
          fetch(
            `/wxatrade/cgi/goods/list?token=${this.token}&lang=zh_CN&sortType=8&pageSize=1000&pageNum=1&needTotalNum=true&needStockNum=true&nextKey=&random=0.8868823466231559`,
            { method: "GET", mode: "cors" }
          ).then((r) =>
            r.json().then((j) => {
              resolve(j.products);
            })
          )
      );
      let PageTwo = new Promise(
        (resolve) =>
          fetch(
            `/wxatrade/cgi/goods/list?token=${this.token}&lang=zh_CN&sortType=8&pageSize=1000&pageNum=2&needTotalNum=true&needStockNum=true&nextKey=&random=0.8868823466231559`,
            { method: "GET", mode: "cors" }
          ).then((r) =>
            r.json().then((j) => {
              resolve(j.products)
            })
          )
      );
      Promise.all([PageOne,PageTwo]).then((allProducts)=>{
        console.log(  )
            products = allProducts.flat()
            products.forEach((p, i) => {productKeys.set(p.key, i);p.selected = false})
            this.fresh()
      }
      )
    },
    page(n=1) {
      n--
      let start = n*100
      this.displayProducts = this.products.slice(start,start+100)
    },
    getShopSonCat() {
      fetch(
        `https://mp.weixin.qq.com/wxatrade/cgi/shop/getShopSonCat?token=${this.token}&lang=zh_CN&random=0.08448784704653667`
      ).then((r) => r.json().then((j) => this.shopCat = j.shopCats));
    },
    searching() {
      this.fresh(products.filter(p=>p.title.search(new RegExp(this.search)) !== -1 ))
      console.log(this.search,products[1].title)
    },
    fresh(updateProducts) {
      if(updateProducts) {
        this.products = updateProducts
      } else {    
        this.products = products
      }
  this.上架 = []
  this.下架 = []
  this.待上架 = []
products.forEach((p)=>{
  if(p.status == 5) {
    this.上架.push(p)
  } else if(p.status == 11) {
    this.下架.push(p)
  } else if(p.status != 6){
    this.待上架.push(p)
  }
})
      this.page()
    },
    select: function (i) {
      this.displayProducts[i].selected = !this.displayProducts[i].selected;
    },
    multSelect: function (i) {
      for (i; i >= 0; i--) {     
        if (this.displayProducts[i].selected) {
          break;
        }
        this.displayProducts[i].selected = true;
      }
    },
    BatchUnListing: function (key, i) {
      fetch(
        `https://mp.weixin.qq.com/wxatrade/cgi/goods/BatchUnListing?token=${this.token}&lang=zh_CN&random=0.04051991853536174`,
        {
          credentials: "include",
          headers:{"accept":"application/json, text/plain, */*","accept-language":"zh-CN,zh;q=0.9","content-type":"application/x-www-form-urlencoded","pragma":"no-cache","sec-fetch-mode":"cors","sec-fetch-site":"same-origin"},
          body: `ids%5B0%5D=${key}`,
          method: "POST",
          mode: "cors",    
        }
      ).then(() => {
        products[productKeys.get(key)].status = 11;
        this.products[i].status = 11;
        this.products.push();
      });
    },
    BatchListing: function (key, i) {
      fetch(
        `https://mp.weixin.qq.com/wxatrade/cgi/goods/BatchListing?token=${this.token}&lang=zh_CN&random=0.297591287066707`,
        {
          headers:{"accept":"application/json, text/plain, */*","accept-language":"zh-CN,zh;q=0.9","content-type":"application/x-www-form-urlencoded","pragma":"no-cache","sec-fetch-mode":"cors","sec-fetch-site":"same-origin"},
          body: `ids%5B0%5D=${key}`,
          method: "POST",
          mode: "cors",
        }
      ).then(() => {
        products[productKeys.get(key)].status = 5;
        this.products[i].status = 5;
        this.products.push();
      });
    },
    BatchDel: function (key, i) {
      fetch(
        `https://mp.weixin.qq.com/wxatrade/cgi/goods/BatchDel?token=${this.token}&lang=zh_CN&random=0.297591287066707`,
        {
           "headers":{"accept":"application/json, text/plain, */*","accept-language":"zh-CN,zh;q=0.9","content-type":"application/x-www-form-urlencoded","pragma":"no-cache","sec-fetch-mode":"cors","sec-fetch-site":"same-origin"},
          body: `ids%5B0%5D=${key}`,
          method: "POST",
          mode: "cors",
        }
      ).then(() => {
        products[productKeys.get(key)].status = 6;
        // statu:6 最近删除
        this.products[i].status = 6;
      });
    },
    BatchDelAll:function() {
      this.selected.forEach((s, i) => this.BatchDel(s.key, i));
    },
    BatchUnListingAll:function() {
      this.selected.forEach((s, i) => this.BatchUnListing(s.key, i));
    },
    BatchListingAll: function () {
      this.selected.forEach((s, i) => this.BatchListing(s.key, i));
    },
    // 侧栏工具
    clean: function () {
      this.displayProducts.forEach((p) => (p.selected = false));
    },
    update: function (keys) {
      console.log(keys)
        let updateProducts = [];
        keys.forEach((id) => {
          if (products[productKeys.get(id)]) {
            updateProducts.push(products[productKeys.get(id)]);
          }
        });
            console.log(updateProducts,keys,productKeys)
        this.fresh(updateProducts);
    },
    upShopCat: function (catId) {
      let keys = this.selected.map(p=>p.key).reduce((a,c)=>a+'%2C'+c)
        fetch(
          `https://mp.weixin.qq.com/wxatrade/cgi/shop/UpShopCatProduct?token=${this.token}&lang=zh_CN&random=0.618694497087614`,
          {
            headers:{"accept":"application/json, text/plain, */*","accept-language":"zh-CN,zh;q=0.9","content-type":"application/x-www-form-urlencoded","pragma":"no-cache","sec-fetch-mode":"cors","sec-fetch-site":"same-origin"},
            credentials: "include",
            body: `data=%7B%22catId%22%3A${catId}%2C%22opType%22%3A1%2C%22productId%22%3A%5B${keys}%5D%7D`,
            method: "POST",
            mode: "cors",
          }
        ).then(()=>{
          this.clean();
      this.getShopSonCat();
        })
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.sidebar {
  right: 0%;
  background: #fff;
}
.pages {
  position: absolute;
  left: 0%;
  bottom: 0%;
}
.button {
  background: white;
  min-width: 0 ! important; 
}
</style>
