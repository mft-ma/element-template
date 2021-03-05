<template>
  <el-dialog title="修改发票" :visible.sync="showDialog" width="40%" @open="handleOpen" @close="handleClose" append-to-body>
    <el-form :model="form">
      <el-form-item label="商品名称" :label-width="formLabelWidth" prop="gender">
        <el-input v-model="form.name" placeholder="请输入商品名称"></el-input>
      </el-form-item><br>
      <el-form-item label="cas号" :label-width="formLabelWidth" prop="gender">
        <el-input v-model="form.cas" placeholder="请输入cas号"></el-input>
      </el-form-item><br>
      <el-form-item label="数量" :label-width="formLabelWidth" prop="gender">
        <el-input v-model="form.number" placeholder="请输入数量"></el-input>
      </el-form-item><br>
      <el-form-item label="价格" :label-width="formLabelWidth">
        <el-input v-model="form.price" placeholder="请输入价格"></el-input>
      </el-form-item><br>
      <el-form-item label="单位" :label-width="formLabelWidth">
        <el-input v-model="form.unit" placeholder="请输入单位"></el-input>
      </el-form-item><br>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit">修 改</el-button>
      <el-button @click="reset">重 置</el-button>
    </div>

  </el-dialog>
</template>

<script>
  import axios from "axios";
  import Cookies from 'js-cookie'

  export default {
    // 接受父组件传递的值
    props: {
      updVisible: {
        type: Boolean,
        default: false
      },
      updValue: {
        type: Number,
        default: function () {
          return 0
        }
      }
    },
    data() {
      return {
        // 控制弹出框显示隐藏
        showDialog:false,
        formLabelWidth: '120px',
        form: {
          sid:'',
          name:'',
          cas:'',
          number:'',
          price:'',
          unit:''
        },
      }
    },
    methods: {
      // 弹出框打开后触发
      handleOpen() {
        this.form.sid=this.updValue
        //查询commodityList
        axios({
          url:'http://localhost:7001/queryInvoiceById?id='+this.form.sid,
          method:'get'
        }).then(res=>{
          this.form=res.data;
        }).catch(function (error) {
          console.log(error);
        })
      },
      // 弹出框关闭后触发
      handleClose() {
        // 子组件调用父组件方法，并传递参数
        this.$emit('changeShow', 'false')
      },
      //重置
      reset: function () {
        this.form=this.$options.data.call(this).form
      },
      //提交按钮
      onSubmit: function () {
        axios({
          url: 'http://localhost:7001/udpInvoice',
          method: 'post',
          data:this.form
        }).then(res => {
          console.log(res)
          if(res.data){
            this.$message('修改成功');
            this.showDialog=false;
            this.$emit('refreshList');
          }else{
            this.$message('修改失败');
          }
        }).catch(function (error) {
          console.log(error);
        })
      }
    },
    watch: {
      // 监听 addOrUpdateVisible 改变
      updVisible(oldVal, newVal) {
        this.showDialog = this.updVisible
      },
    }
  }
</script>

<style scoped>

</style>
