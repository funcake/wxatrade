<template>
  <div>
    <div   style="position: fixed; z-index: 1000; top: 80vh; right: 0">
      <a
        :href="'https://mp.weixin.qq.com/wxatrade/goods/list?token='
          +token+'&lang=zh_CN'"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button class="weui-desktop-btn">商品列表</button></a
      >
      <button class="btn btn-primary" @click="showM">商品管理</button>
    </div>
    <div v-if="showMessage">
      <div
        style="
          position: fixed;
          display: flex;
          flex-wrap: wrap;
          align-items: stretch;
          overflow: auto;
          z-index: 1000; 
          width: 80%;
          height: 80%;
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
          <!-- 商品列表 -->
          <Product
            v-for="(product, index) in products"
            :key="product.key"
            :product="product"
            :index="index"
            @select="select"
            @multSelect="multSelect"
            @BatchListing="BatchListing"
            @BatchUnListing="BatchUnListing"
            @BatchDel="BatchDel"
          ></Product>
        </div>
        <div class="opition" style="display: flex; flex-direction: column">
          <button @click="clean" class="weui-desktop-btn">clean</button>
          <button @click="BatchListingAll" class="weui-desktop-btn">上架</button>
          <button
            @click="products = 上架"
            class="weui-desktop-btn"
            style="margin-top: auto"
          >
            已上架
          </button>
          <button @click="products = 下架" class="weui-desktop-btn">
            已下架
          </button>
        </div>

        <div class="sidebar">
          <ul>
            <ul @click="all">
              全部
            </ul>
          </ul>
          <shopCat
            v-for="(cat, index) in shopCat"
            :key="index"
            :cat="cat"
            @update="update"
          ></shopCat>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import vue from '../vue-temp/vue-editor-bridge';
import Product from "./components/Product";
import ShopCat from "./components/shopCat";
// import products from "./products.json";
// import shopCat from "./shopCat.json";
var products = []
var shopCat = []
// var token = "";
var productKeys = new Map();
// products.forEach((p, i) => {productKeys.set(p.key, i);p.selected = false});
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
      //分类管理
      shopCat,
      token: decodeURIComponent(
        window.location.search
          .substr(1)
          .match(new RegExp("(^|&)token=([^&]*)(&|$)", "i"))[2]
      ),
      selected: [],
      上架: [],
      下架: [],
      pageNum:1
    };
  },
  mounted: function () {
    let that = this;
    that.getShopSonCat();
    that.goodsList()
    localStorage.setItem('token',this.token)
  },

  methods: {
    showM() {
      this.showMessage = !this.showMessage;
      this.images = [];
    },
    all() {
      this.products = products;
      this.fresh();
    },
    goodsList() {
          fetch(
      `/wxatrade/cgi/goods/list?token=${this.token}&lang=zh_CN&sortType=4&pageSize=100&pageNum=${this.pageNum}&needTotalNum=true&needStockNum=true&nextKey=&random=0.8868823466231559`,
      { method: "GET", mode: "cors" }
    ).then((r) =>
      r.json().then((j) => {
       products = j.products;
        products.forEach((p, i) => {productKeys.set(p.key, i); p.selected = false;
          this.$set(this.products,i,p)
        });
        this.fresh();
      })
    );
    },
    getShopSonCat() {
      fetch(
        `https://mp.weixin.qq.com/wxatrade/cgi/shop/getShopSonCat?token=${this.token}&lang=zh_CN&random=0.08448784704653667`
      ).then((r) => r.json().then((j) => this.shopCat = j.shopCats));
    },
    fresh() {
      this.上架 = this.products.filter((p) => p.status == 5);
      this.下架 = this.products.filter((p) => p.status == 11);
    },
    select: function (i) {
      this.products[i].selected = !this.products[i].selected;
      this.products[i].index = i;
    },
    multSelect: function (i) {
      for (i; i >= 0; i--) {
        if (this.products[i].selected) {
          break;
        }
        this.products[i].selected = true;
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
        this.products.push();
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
      this.products.forEach((p) => (p.selected = false));
    },
    add: function () {
      this.selected = this.selected.concat(
        this.products.filter((s) => s.selected)
      );
      this.products = this.products.filter((s) => s.selected == false);
    },
    update: function (keys) {
      this.selected = [];
      let updateProducts = [];
      keys.forEach((id) => {
        if (products[productKeys.get(id)]) {
          updateProducts.push(products[productKeys.get(id)]);
        }
      });
      this.products = updateProducts;
      this.fresh();
    },
    upShopCat: function (catId) {
      this.selected = this.products.filter((p) => p.selected);
      this.selected.forEach((p) =>
        fetch(
          `https://mp.weixin.qq.com/wxatrade/cgi/shop/UpShopCatProduct?token=${this.token}&lang=zh_CN&random=0.618694497087614`,
          {
            credentials: "include",
            body: `data=%7B%22catId%22%3A${catId}%2C%22opType%22%3A1%2C%22productId%22%3A%5B${p.key}%5D%7D`,
            method: "POST",
            mode: "cors",
          }
        )
      );
      this.clean();
      this.getShopSonCat();
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
}
</style>
