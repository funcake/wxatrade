<template>
  <div>
    <ul >
      <ul >
        <div class="btn-group btn-group-sm" role="group" >
        <button type="button" class="weui-desktop-btn button" @click="$emit('upShopCat',cat.catId)">></button> 
        <button type="button"  class="weui-desktop-btn button" @click="$emit('update',cat.productId)">{{cat.name}}</button>
        <span class="badge">{{cat.productIdNum}}</span>
        </div>
      </ul>
      <ul>
      <ShopCat
        v-for="(child, index) in cat.children"
        :key="index"
        :cat="child"
        @upShopCat="$emit('upShopCat',child.catId)"
        @update="$emit('update',child.productId)"
      ></ShopCat>
      </ul>
    </ul>
  </div>
</template> 
<script>
export default {
  name: "ShopCat",
  props: [
    'cat',
    // 'productId'
  ],
  mounted() {
    let that = this 
      fetch(
      `https://mp.weixin.qq.com/wxatrade/cgi/shop/getShopCatGoods?token=${localStorage.getItem('token')}&lang=zh_CN&catId=${this.cat.catId}&pageSize=15&pageNum=1&random=0.035186182237724406`
      ).then((r) => r.json().then((cat) => {
        if(cat.shopCats[0].productId) {
          let productId = cat.shopCats[0].productId
          that.cat.productId = productId.map(Number)
        }
      }));
  },
  data: function () {
    return {};
  },
  computed: {},
  methods: {
  },
};
</script>
<style scoped>
</style> 