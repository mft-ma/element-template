<template>
  <div class="dashboard-container">
    <!-- 幻灯片 开始 -->
    <template>
      <el-carousel :interval="4000" type="card" height="330px">
        <el-carousel-item v-for="banner in bannerList" :key="banner.id">
          <!--          <h3 class="medium">{{ banner.title }}</h3>-->
          <router-link :to="banner.linkUrl">
            <img width="100%"
                 :src="banner.imageUrl"
                 :alt="banner.title"/>
          </router-link>
        </el-carousel-item>
      </el-carousel>
    </template>
    <!-- 幻灯片 结束 -->
    <div class="dashboard-text">name: {{ name }}</div>
    <div class="dashboard-text">user_id: {{ name }}</div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import axios from 'axios'

  export default {
    name: 'Dashboard',
    computed: {
      ...mapGetters([
        'name'
      ])
    },
    data() {
      return {
        bannerList: [{}]
      }
    },
    created() {
      this.initDataBanner()
    },
    methods: {
      initDataBanner() {
        axios({
          url: 'http://localhost:7001/bannerList',
          method: 'get'
        }).then(response => {
          // console.log('banner:title:' + response.data[0].title + ' imageUrl:' + response.data[0].imageUrl + ' linkUrl:' + response.data[0].linkUrl)
          this.bannerList = response.data.map(item => ({
            ...item,
            linkUrl: item.linkUrl.substring(2)
          }))
          console.log(this.bannerList)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }

    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }

  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
