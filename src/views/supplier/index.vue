<template>
  <div class="app-container">
    <el-form ref="form" align="center" :model="form" label-width="100px" :inline="true" size="small">
      <el-form-item label="供应商">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="业务员">
        <el-input v-model="form.username" />
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
      :cell-style="changeColor"
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
        label="序号"
        width="160"
      />
      <el-table-column
        prop="user.username"
        label="业务员"
        width="150"
      />
      <el-table-column
        prop="name"
        label="供应商名称"
        width="160"
      />
      <el-table-column
        prop="phone"
        label="电话"
        width="160"
      />
      <el-table-column
        prop="wechat"
        label="微信或QQ"
        width="160"
      />
      <el-table-column
        prop="status"
        label="商品关联状态"
        width="150"
      />
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="150"
      />
      <el-table-column
        prop="remark"
        label="备注"
        width="160"
      />
    </el-table>

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
import Add from '@/views/supplier/add'
import Upd from '@/views/supplier/upd'

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
        username: ''
      },
      tableData: [{}],
      radio: -1,
      serial: '', // 序号
      selectedInfo: '',
      updinfo: '',
      currentPage: 1, // 初始页
      pagesize: 5, // 每页显示页数
      total: 100
    }
  },
  // 页面加载后
  mounted: function() {
    axios.get('http://localhost:7001/querySupplier')
      .then((response) => {
        console.log(response.data)
        this.tableData = response.data
        this.total = response.data.length
      })
      .catch(function(error) {
        console.log(error)
      })
  },
  methods: {
    // 联合查询
    onSubmit() {
      axios.get('http://localhost:7001/querySupplier', {
        params: {
          name: this.form.name,
          username: this.form.username
        }
      })
        .then((response) => {
          this.tableData = response.data
          this.total = response.data.length
          this.form.name = ''
          this.form.username = ''
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
    changeColor({ row }) {
      console.log('=======' + row.status)
      if (row.status === '未关联') {
        return 'background-color: #FF6600'
      }
    },

    handleClick() {},
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
        this.updinfo = this.selectedInfo.gid
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
      axios.get('http://localhost:7001/querySupplier')
        .then((response) => {
          console.log(response.data)
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
        axios.get('http://localhost:7001/delSupplier', {
          params: {
            gid: this.selectedInfo.gid
          }
        })
          .then((response) => {
            this.$message('删除成功')
            axios.get('http://localhost:7001/querySupplier')
              .then((response) => {
                console.log(response.data)
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
      console.log(this.currentPage) // 点击第几页
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
