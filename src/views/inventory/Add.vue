<template>
  <el-dialog title="添加库存" :visible.sync="showDialog" width="40%" @close="handleClose" append-to-body>
    <el-form :model="form">
      <el-form-item label="库存编号" :label-width="formLabelWidth" prop="gender">
        <el-input v-model="form.number" placeholder="请输入库存编号"></el-input>
      </el-form-item><br>
      <el-form-item label="商品名称" :label-width="formLabelWidth" prop="gender">
        <el-input v-model="form.name" placeholder="请输入商品名称"></el-input>
      </el-form-item><br>
      <el-form-item label="cas号" :label-width="formLabelWidth" prop="gender">
        <el-input v-model="form.cas" placeholder="请输入cas号"></el-input>
      </el-form-item><br>
      <el-form-item label="数量" :label-width="formLabelWidth" prop="gender">
        <el-input v-model="form.amount" placeholder="请输入数量"></el-input>
      </el-form-item><br>
      <el-form-item label="备注" :label-width="formLabelWidth">
        <el-input type="textarea" v-model="form.remark" placeholder="请输入备注"></el-input>
      </el-form-item><br>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit">提 交</el-button>
      <el-button @click="reset">重 置</el-button>
    </div>

  </el-dialog>
</template>

<script>
  import axios from "axios";
  import Cookies from 'js-cookie'

  export default {
    // 接受父组件传递的值
    props:{
      addVisible:{
        type: Boolean,
        default: false
      }
    },
    data(){
      return{
        // 控制弹出框显示隐藏
        showDialog:false,
        formLabelWidth: '70px',
        form: {
          kid:'',             //主键
          number:'',           //库存编号
          name:'',            //商品名称
          cas:'',             //cas号
          create_time:'',     //创建时间
          update_time:'',     //更新时间
          amount:'',          //数量
          remark:''           //备注
        },
      }
    },
    methods:{
      // 弹出框关闭后触发
      handleClose(){
        // 子组件调用父组件方法，并传递参数
        this.$emit('changeShow','false')
      },
      //重置
      reset:function () {
        // this.$refs.formRef.resetFields()
        this.form=this.$options.data.call(this).form
      },
      //提交按钮  添加订单
      onSubmit:function () {
        this.form.bill=this.form.bill?1:0
        axios({
          url: 'http://localhost:7001/addInventory',
          method: 'post',
          data:this.form
        }).then(res => {
          console.log(res)
          if(res.data){
            this.$message('添加成功');
            this.showDialog=false;
            // this.$emit('refreshList');
          }else{
            this.$message('添加失败');
          }
        }).catch(function (error) {
          console.log(error);
        })
      }
    },
    watch:{
      // 监听 addOrUpdateVisible 改变
      addVisible(oldVal,newVal){
        this.showDialog = this.addVisible
      },
    }
  }
</script>

<style scoped>

</style>
