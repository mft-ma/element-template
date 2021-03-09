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
          <el-form-item label="供应商名称" prop="name">
            <el-input v-model="updForm.name" />
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="updForm.phone" />
          </el-form-item>

          <el-form-item label="微信或QQ" prop="wechat">
            <el-input v-model="updForm.wechat" />
          </el-form-item>
          <el-input v-model="updForm.status" type="hidden" />
          <el-form-item label="日期选择" style="width: 100%;" prop="createTime">
            <el-date-picker
              v-model="updForm.createTime"
              type="date"
              placeholder="日期"
              style="width: 100%;"
              format="yyyy-MM-dd"
              @change="getTime"
            />
          </el-form-item>
          <el-form-item label="业务员" prop="userId">
            <el-select v-model="updForm.userId" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="us in user"
                :key="us.uid"
                :label="us.username"
                :value="us.uid"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="备注" prop="remark">
            <el-input v-model="updForm.remark" type="textarea" />
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
    updinfo: String
  },
  data() {
    return {
      updForm: {
        name: '',
        phone: '',
        wechat: '',
        status: '',
        createTime: '',
        userId: '',
        remark: ''
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
      axios.post('http://localhost:7001/updSupplier', this.updForm)
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
      axios.get('http://localhost:7001/userQuery')
        .then((response) => {
          this.user = response.data
        })
        .catch(function(error) {
          console.log(error)
        })

      axios.get('http://localhost:7001/querySupplierById?gid=' + this.updinfo)
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
