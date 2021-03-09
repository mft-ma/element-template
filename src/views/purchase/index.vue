<template>
  <div class="app-container">
    <el-form ref="form" align="center" :model="form" label-width="100px" :inline="true" size="small">
      <el-form-item label="品名">
        <el-input v-model="form.name" style="width: 120px" />
      </el-form-item>
      <el-form-item label="cas号">
        <el-input v-model="form.cas" style="width: 120px" />
      </el-form-item>
      <el-form-item label="供应商名称">
        <el-input v-model="form.supplierName" style="width: 120px" />
      </el-form-item>
      <el-form-item label="物流单号">
        <el-input v-model="form.trackingNumber" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
      <el-button type="primary" size="small" @click="onadd">添加</el-button>
      <Add ref="addRef" class="inline-block" @changeShow="showadd" @update="update" />&nbsp;&nbsp;

      <el-button type="primary" size="small" @click="onUpd">修改</el-button>
      <Upd ref="updRef" :updinfo="updinfo" class="inline-block" @changeShow="showUpd" @update="update" />&nbsp;&nbsp;

      <el-button type="danger" size="small" @click="del">删除</el-button>
    </el-form>

    <el-table
      :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      border
      height="550px"
      style="width: 100%"
      @row-click="singleElection"
    >
      <el-table-column width="30" :resizable="false">
        <template slot-scope="scope">
          <el-radio v-model="radio" class="radio" :label="scope.$index">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column
        prop="formatId"
        label="编号"
        width="100"
      />
      <el-table-column
        prop="user.username"
        label="业务员"
        width="100"
      />
      <el-table-column
        prop="name"
        label="产品名称"
        width="100"
      />
      <el-table-column
        prop="cas"
        label="cas号"
        width="80"
      />
      <el-table-column
        prop="amount"
        label="数量"
        width="80"
      />
      <el-table-column
        prop="price"
        label="单价"
        width="100"
      />
      <el-table-column
        prop="priceStatus"
        label="是否含税"
        :formatter="priceStatusFormatter"
        width="100"
      />
      <el-table-column
        prop="sumPrice"
        label="总价"
        width="100"
      />
      <el-table-column
        prop="supplierName"
        label="供应商名称"
        width="100"
      />
      <el-table-column
        prop="supplierPhone"
        label="供应商电话"
        width="120"
      />
      <el-table-column
        prop="trackingNumber"
        label="物流单号"
        width="100"
      />
      <el-table-column
        prop="createTime"
        label="创建日期"
        width="100"
      />
      <el-table-column
        prop="ann"
        :formatter="annFormatter"
        label="发票"
        width="100"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="150"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleClick(scope.row)">添加物流编号</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="信息"
      :visible.sync="dialog"
      :modal="false"
      width="30%"
    >
      <el-form ref="form" align="center" :model="iform" label-width="100px" :inline="true" size="small">
        <el-form-item label="物流单号">
          <el-input v-model="iform.tracking" style="width: 120px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onTracking">确定</el-button>
        </el-form-item><br>
      </el-form>
    </el-dialog>

    <!-- 分页   -->
    <el-pagination
      background
      layout="total,sizes,prev,pager,next,jumper"
      :total="total"
      :current-age="currentPage"
      :page-size="pagesize"
      :page-sizes="[1,3,5]"
      @size-change="sizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import axios from 'axios'
import Add from '@/views/purchase/add'
import Upd from '@/views/purchase/upd'

export default {
  name: 'Order',
  components: { // 注册
    Add,
    Upd
  },
  data() {
    return {
      form: {
        name: '',
        cas: '',
        supplierName: '',
        trackingNumber: ''
      },
      iform: {
        tracking: ''
      },
      tableData: [{}],
      radio: -1,
      serial: '', // 序号
      selectedInfo: '',
      updinfo: 0,
      dialogVisible: false,
      dialog: false,
      currentPage: 1, // 初始页
      pagesize: 5, // 每页显示页数
      total: 100,
      cid: ''
    }
  },
  // 页面加载后
  mounted: function() {
    axios.get('http://localhost:7001/queryPurchase')
      .then((response) => {
        this.tableData = response.data
        this.total = response.data.length
      })
      .catch(function(error) {
        console.log(error)
      })
  },
  methods: {
    annFormatter(row) {
      if (row.ann === '1') {
        return '收到'
      } else {
        return '未收到'
      }
    },
    onTracking() {
      this.dialog = false
      axios.post('http://localhost:7001/updPurcahseTrackingNumber', {
        cid: this.cid,
        trackingNumber: this.iform.tracking
      })
        .then((response) => {
          this.$message('添加成功')
          axios.get('http://localhost:7001/queryPurchase')
            .then((response) => {
              this.tableData = response.data
              this.total = response.data.length
              this.iform.tracking = ''
            })
            .catch(function(error) {
              console.log(error)
            })
        })
        .catch(function(error) {
          console.log(error)
          this.$message('修改失败')
        })
    },
    priceStatusFormatter(row) {
      if (row.priceStatus === '0') {
        return '含税'
      } else {
        return '不含税'
      }
    },
    // 联合查询
    onSubmit() {
      axios.get('http://localhost:7001/queryPurchase', {
        params: {
          name: this.form.name,
          cas: this.form.cas,
          supplierName: this.form.supplierName,
          trackingNumber: this.form.trackingNumber
        }
      }).then((response) => {
        this.tableData = response.data
        this.total = response.data.length
        this.form.name = ''
        this.form.cas = ''
        this.form.supplierName = ''
        this.form.trackingNumber = ''
      })
        .catch(function(error) {
          console.log(error)
        })
    },

    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    handleClick(row) {
      this.dialog = true
      this.cid = row.cid
    },
    // 点击行选中单选按钮
    singleElection(row) {
      this.radio = this.tableData.indexOf(row)
      this.selectedInfo = row
      console.log(this.radio)
    },
    // 添加按钮跳转
    onadd() {
      this.$refs.addRef.dialogVisible = true
    },
    onUpd() {
      if (this.radio === -1) {
        this.$message('您还未选中')
      } else {
        this.updinfo = this.selectedInfo.cid
        this.$refs.updRef.dialogVisible = true
      }
    },

    showadd(data) {
      if (data === 'false') {
        this.dialogVisible = false
      } else {
        this.dialogVisible = true
      }
    },
    showUpd(data) {
      if (data === 'false') {
        this.dialogVisible = false
      } else {
        this.dialogVisible = true
      }
    },

    // 关闭添加模板后调用此函数
    update() {
      axios.get('http://localhost:7001/queryPurchase')
        .then((response) => {
          this.tableData = response.data
          this.total = response.data.length
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    // 删除
    del() {
      if (this.radio != -1) {
        axios.get('http://localhost:7001/delPurchase', {
          params: {
            cid: this.selectedInfo.cid
          }
        })
          .then((response) => {
            this.$message('删除成功')
            axios.get('http://localhost:7001/queryPurchase')
              .then((response) => {
                this.tableData = response.data
                this.total = response.data.length
              })
              .catch(function(error) {
                console.log(error)
              })
          })
          .catch(function(error) {
            console.log(error)
          })
      } else {
        this.$message('您还未选中')
      }
    },
    // 分页
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage
    },
    sizeChange: function(size) {
      this.pagesize = size
    }

  }
}
</script>

<style scoped>
    .line{
        text-align: center;
    }
    .inline-block{
        display: inline-block;
    }
</style>
