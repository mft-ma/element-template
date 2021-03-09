<template>
  <div>
    <el-dialog
      title="添加"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      append-to-body
      @open="querySupplier"
    >
      <span>
        <el-form ref="form" align="center" :model="form" label-width="100px" :inline="true" size="small">
          <el-form-item label="供应商名称">
            <el-input v-model="form.suppliername" style="width: 120px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSelect">查询</el-button>
          </el-form-item><br>
        </el-form>
        <el-form ref="addForm" :model="addForm" label-width="100px" class="demo-addForm">
          <el-form-item label="产品名称" prop="name">
            <el-input v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="cas号" prop="cas">
            <el-input v-model="addForm.cas" />
          </el-form-item>
          <el-form-item label="业务员" prop="userId">
            <el-select v-model="addForm.userId" placeholder="请选择" style="width: 150px;">
              <el-option
                v-for="op in options"
                :key="op.uid"
                :label="op.username"
                :value="op.uid"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="供应商名称" prop="supplierId">
            <el-select v-model="addForm.supplierId" placeholder="请选择" style="width: 150px;">
              <el-option
                v-for="op in supplier"
                :key="op.gid"
                :label="op.name"
                :value="op.gid"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="报价信息" prop="priceInfo">
            <el-input v-model="addForm.priceInfo" />
          </el-form-item>
          <el-form-item label="商品介绍" prop="commodityInfo">
            <el-input v-model="addForm.commodityInfo" type="textarea" />
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
      form: {
        suppliername: ''
      },
      addForm: {
        name: '',
        cas: '',
        userId: '',
        supplierId: '',
        priceInfo: '',
        commodityInfo: ''
      },
      userId: '',
      dialogVisible: false,
      supplier: [],
      options: []
    }
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {
        })
    },
    // ForPhone() {
    //   axios.get('http://localhost:7001/querySupplierByName', {
    //     params: {
    //       name: this.addForm.supplierName
    //     }
    //   })
    //     .then((response) => {
    //       console.log(response.data.phone)
    //       this.addForm.supplierId = response.data.supplierId
    //     })
    //     .catch(function(error) {
    //       console.log(error)
    //     })
    // },
    // 获取当前登录的用户并保存到采购表
    onSave() {
      axios({
        url: 'http://localhost:7001/saveCommodity',
        method: 'post',
        data: this.addForm
      })
        .then((response) => {
          this.$message('添加成功')
          this.$emit('update')
          this.$refs.addForm.resetFields()
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
    onSelect() {
      axios.get('http://localhost:7001/querySupplierByName', {
        params: {
          name: this.form.suppliername
        }
      })
        .then((response) => {
          // this.addForm.supplierId = response.data.gid
          this.supplier = response.data
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    querySupplier() {
      axios.get('http://localhost:7001/querySupplier')
        .then((response) => {
          console.log(response.data)
          this.supplier = response.data
        })
        .catch(function(error) {
          console.log(error)
        })

      axios.get('http://localhost:7001/userQuery')
        .then((response) => {
          console.log(response.data)
          this.options = response.data
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
