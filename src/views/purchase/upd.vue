<template>
  <div>
    <el-dialog
      title="修改"
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
        <el-form ref="updForm" :model="updForm" label-width="100px" class="demo-updForm">
          <el-form-item label="名称" prop="name">
            <el-input v-model="updForm.name" />
          </el-form-item>
          <el-form-item label="cas号" prop="cas">
            <el-input v-model="updForm.cas" />
          </el-form-item>

          <el-form-item label="数量" prop="amount">
            <el-input v-model="updForm.amount" />
          </el-form-item>
          <el-form-item label="单价" prop="price">
            <el-input v-model="updForm.price" style="width: 100px" />
          </el-form-item>
          <el-form-item label="是否含税" prop="priceStatus">
            <el-select v-model="updForm.priceStatus" placeholder="请选择是否含税" style="width: 150px;">
              <el-option
                v-for="op in options"
                :key="op.value"
                :label="op.label"
                :value="op.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="供应商名称" prop="supplierName">
            <el-select v-model="updForm.supplierName" placeholder="请选择" style="width: 150px;" @change="ForPhone">
              <el-option
                v-for="op in supplier"
                :key="op.gid"
                :label="op.name"
                :value="op.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="联系电话" prop="supplierPhone">
            <el-input v-model="updForm.supplierPhone" />
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
import Cookies from 'js-cookie'

export default {
  data() {
    return {
      form: {
        suppliername: ''
      },
      updForm: {
        name: '',
        cas: '',
        amount: '',
        price: '',
        priceStatus: '',
        supplierName: '',
        supplierPhone: '',
        userId: ''
      },
      userId: '',
      dialogVisible: false,
      supplier: [],
      options: [{
        value: '0',
        label: '含税'
      }, {
        value: '1',
        label: '不含税'
      }]
    }
  },
  props: {
    updinfo: Number
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
    ForPhone() {
      axios.get('http://localhost:7001/querySupplierByName', {
        params: {
          name: this.updForm.supplierName
        }
      })
        .then((response) => {
          console.log(response.data.phone)
          this.updForm.supplierPhone = response.data.phone
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    // 获取当前登录的用户并保存到采购表
    onSave() {
      this.updForm.userId = Cookies.get('user_id')
      axios({
        url: 'http://localhost:7001/updPurcahse',
        method: 'post',
        data: this.updForm
      })
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
    onSelect() {
      axios.get('http://localhost:7001/querySupplierByName', {
        params: {
          name: this.form.suppliername
        }
      })
        .then((response) => {
          this.updForm.supplierName = response.data.name
          this.updForm.supplierPhone = response.data.phone
          // this.supplier = response.data
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

      axios.get('http://localhost:7001/queryPurchaseById?cid=' + this.updinfo)
        .then((response) => {
          console.log(response.data)
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
