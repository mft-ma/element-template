<template>
  <div>
    <el-dialog
      title="添加"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      append-to-body
      @open="queryUser"
    >
      <span>
        <el-form ref="addForm" :model="addForm" label-width="100px" class="demo-addForm">
          <el-form-item label="供应商名称" prop="name">
            <el-input v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="addForm.phone" />
          </el-form-item>

          <el-form-item label="微信或QQ" prop="wechat">
            <el-input v-model="addForm.wechat" />
          </el-form-item>
          <el-form-item label="日期选择" style="width: 100%;" prop="createTime">
            <el-date-picker
              v-model="addForm.createTime"
              type="date"
              placeholder="日期"
              style="width: 100%;"
              format="yyyy-MM-dd"
              @change="getTime"
            />
          </el-form-item>
          <el-form-item label="业务员" prop="userId">
            <el-select v-model="addForm.userId" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="us in user"
                :key="us.uid"
                :label="us.username"
                :value="us.uid"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="备注" prop="remark">
            <el-input v-model="addForm.remark" type="textarea" />
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
  data() {
    return {
      addForm: {
        name: '',
        phone: '',
        wechat: '',
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
      axios.post('http://localhost:7001/addSupplier', this.addForm)
        .then((response) => {
          this.$message('添加成功')
          this.$emit('update')
          this.dialogVisible = false
        })
        .catch(function(error) {
          console.log(error)
          this.$message('添加失败')
        })
    },

    getTime(date) {
      this.createTime = date
    },
    // 重置form
    rest() {
      this.$refs.addForm.resetFields()
    },
    queryUser() {
      axios.get('http://localhost:7001/userQuery')
        .then((response) => {
          console.log(response.data)
          this.user = response.data
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
