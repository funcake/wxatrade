<template>
  <div>
    <ul >
      <ul >
        <div class="btn-group btn-group-sm" role="group" >
        <button type="button" class="btn btn-default" @click="$emit('upShopCat',cat.catId)">></button> 
        <button type="button"  class="btn btn-default" @click="$emit('update',cat.productId)">{{cat.name}}

        </button>
        <span class="badge">{{cat.productId.length}}</span>
        </div>
      </ul>
      <ShopCat
        v-for="(child, index) in cat.children"
        :key="index"
        :cat="child"
        @update="$emit('update',cat.productId)"
        @upShopCat="$emit('upShopCat',cat.catId)"
      ></ShopCat>
    </ul>
  </div>
</template>
<script>
export default {
  name: "ShopCat",
  props: {
    cat: Object,
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