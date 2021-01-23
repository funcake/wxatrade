<template>
  <div @click="$emit('select', index)" :class="{selected:product.selected}" class="cell">
     <div style="width:100%">
    <img :src="product.headImg" style="width: 100%;height:8rem;object-fit:cover" />
     </div>
    <div style="padding:0.25rem">{{ product.title }}  <strong>{{ product.price / 100 }}</strong></div>
    <div style="position:absolute;bottom:0;right:0.25rem;color: skyblue;" v-show="product.selected"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></div>
  <!-- 商品管理选项 -->
    <div class="options">
      <button   
              v-if="product.status == 5"
        class="weui-desktop-btn button"
        @click.stop="$emit('BatchUnListing', product.key, index)"
      ><span class="arrows_downward"></span>下</button>
      <button
        v-if="product.status != 5"
        class="weui-desktop-btn button"
        @click.stop="$emit('BatchListing', product.key, index)"
      >  <span class="arrows_upward"></span>上</button>
      <a :href="'https://mp.weixin.qq.com/wxatrade/goods/entry?productId='+product.key+'&token='+token+'&lang=zh_CN'" target="_blank" class="weui-desktop-btn button">
        <span class="weui-desktop-menu-icon__order
">编</span>
      </a>
      <button class="weui-desktop-btn button" @click.stop="$emit('BatchDel', product.key, index)">
        <span class="icon_delete">删</span>
      </button>
    <button 
    style="position: absolute;bottom: 0;right:0;" class="weui-desktop-btn button"
          @click.stop="$emit('multSelect',index)"
          v-if="!product.selected"  >
      <span class="icon_add">
      多选
      </span>
    </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Product",
  props: ["product","index"],
  data() {
    return {
      token:localStorage.getItem('token')
    }
  },
  methods: {
    
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.cell {
  width: 8rem;
  margin: 0.5rem;
  background: #fff;
  align-self: flex-end;
  position: relative;
}
.selected {
  color: skyblue;
 outline:solid ;
}
.options {
  position: absolute;
  top:0;
  bottom: 0;
  right: 0;
  margin: 0.25rem;
  visibility: hidden;
}
.cell:hover .options {
  visibility: visible;
}
</style>
