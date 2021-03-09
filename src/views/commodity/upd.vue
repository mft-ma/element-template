<template>
  <div>
    <el-dialog
      title="修改"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      append-to-body
      @open="queryUser"
    >
      <span>
        <el-form ref="updForm" :model="updForm" label-width="100px" class="demo-addForm">
          <el-form-item label="品名" prop="name">
            <el-input v-model="updForm.name" />
          </el-form-item>
          <el-form-item label="cas号" prop="cas">
            <el-input v-model="updForm.cas" />
          </el-form-item>

          <el-form-item label="报价信息" prop="priceInfo">
            <el-input v-model="updForm.priceInfo" />
          </el-form-item>
          <el-form-item label="商品介绍" prop="commodityInfo">
            <el-input v-model="updForm.commodityInfo" type="textarea" />
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="rest">重 置</el-button>
        <el-button type="primary" @click="onSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    updinfo: Number
  },
  data() {
    return {
      updForm: {
        name: '',
        cas: '',
        priceInfo: '',
        commodityInfo: '',
        sid: ''
      },
      dialogVisible: false,
      user: []
    }
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    onSave() {
      axios.post('http://localhost:7001/updCommodity', this.updForm)
        .then((response) => {
          this.$message('修改成功')
          this.$emit('update')
          this.dialogVisible = false
        })
        .catch(function(error) {
          console.log(error)
          this.$message('修改失败')
        })
    },

    getTime(date) {
      this.createTime = date
    },
    // 重置form
    rest() {
      this.$refs.updForm.resetFields()
    },
    queryUser() {
      axios.get('http://localhost:7001/queryCommodityBySid?sid=' + this.updinfo)
        .then((response) => {
          this.updForm = response.data
        })
        .catch(function(error) {
          console.log(error)
        })
    }

  }
}

</script>

<style scoped>

</style>
