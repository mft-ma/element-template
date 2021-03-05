<template>
    <div><!--发票管理-->
        <br>
        <el-form :inline="true" class="demo-form-inline">
            &nbsp;&nbsp;&nbsp;&nbsp;
            <el-form-item label="商品名称">
                <el-input v-model="commodityName" placeholder="商品名称"></el-input>
            </el-form-item>&nbsp;&nbsp;&nbsp;&nbsp;
            <el-form-item label="cas号">
              <el-input v-model="invoice_cas" placeholder="cas号"></el-input>
            </el-form-item>&nbsp;&nbsp;&nbsp;&nbsp;
            <el-form-item>
                <el-button type="success" @click="queryList">查询</el-button>
                <el-button @click="reset">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row>&nbsp;&nbsp;&nbsp;&nbsp;
            <el-button @click="delBatch(sels)" :disabled="this.sels.length === 0">批量删除</el-button>
            <el-button @click="saveUser">添加</el-button>
            <!-- 新增编辑弹框子组件 -->
            <Add :addVisible="addVisible" @changeShow="showAdd" @refreshList="queryList" ref="addRef"></Add>
        </el-row>

        <el-table border style="width: 100%" :data="tableData" max-height="470px" min-height="470px"
                  tooltip-effect="dark" @selection-change="selsChange"
                  :cell-style="tableRowStyleName" highlight-current-row
                  @row-click="handle" ref="table"><!--:summary-method="summary" -->
            <el-table-column fixed type="selection" width="55"></el-table-column>
            <el-table-column type="index" label="序号" width="100"></el-table-column>
            <el-table-column prop="name" label="商品名称" width="150"></el-table-column>
            <el-table-column prop="cas" label="cas号" width="100"></el-table-column>
            <el-table-column prop="number" label="数量" width="150"></el-table-column>
            <el-table-column prop="price" label="价格" width="150"></el-table-column>
            <el-table-column prop="createtime" label="创建时间" width="250"></el-table-column>
            <el-table-column prop="unit" label="单位" width="150"></el-table-column>
            <el-table-column fixed="right" label="操作" width="350">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" plain
                               @click="handleEdit(scope.row)">编辑</el-button>&nbsp;
                    <!-- 新增编辑弹框子组件 -->
                    <update :updVisible="updVisible" @changeShow="showUpd" :updValue="infoId"
                            @refreshList="queryList" ref="updRef"></update>

                    <el-button size="mini" type="danger" plain
                               @click="handleDelete(scope.row)">删除</el-button>&nbsp;

                  <el-button size="mini" type="info" plain
                             @click="handleAmount(scope.row)">自动计算数量</el-button>&nbsp;
                  <el-dialog title="增加数量" :visible.sync="amountVisible" width="30%" @close="handleClose" append-to-body>
                    <el-form>
                      <el-form-item label="库存数量" :label-width="formLabelWidth" prop="gender">
                        <el-input v-model="amount" placeholder="请输入增加数量"></el-input>
                      </el-form-item><br>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                      <el-button type="primary" @click="amountOnSubmit">确 定</el-button>
                      <el-button @click="amountVisible=false">取 消</el-button>
                    </div>
                  </el-dialog>
                </template>
            </el-table-column>
        </el-table>

        <div class="block">
            &nbsp;&nbsp;&nbsp;
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[5, 10, 20, 50]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import Add from "./Add"
    import Update from "./Update";
    import Cookies from 'js-cookie'

    export default {
      data() {
        return {
          formLabelWidth: '70px',
          user_id: '',
          user_rule: '',
          listId: '',
          commodityName: '',
          invoice_cas: '',
          tableData: [{}],
          // 所有页面的数据
          total: null,
          // 每页显示数量
          pageSize: 5,
          // 默认当前显示第一页
          currentPage: 1,
          sels: [],//选中的值显示
          // 控制新增编辑弹窗的显示与隐藏
          addVisible: false,
          updVisible: false,
          infoId: 0,
          amountVisible:false,
          amount:'',
          amountSid:''
        }
      },
      // 使用子组件
      components: {
        Add,
        Update
      },
      methods: {
        // 任意点击某处选中此行
        handle(row, column, event) {
          this.$refs.table.toggleRowSelection(row);
        },
        // 按钮点击事件 显示新增编辑弹窗组件
        saveUser() {
          this.addVisible = true
        },
        //修改
        handleEdit: function (row) {
          this.updVisible = true
          this.infoId = row.sid
        },
        //刷新表格
        refresh: function () {
          //刷新table
          axios({
            url: 'http://localhost:7001/invoiceList',
            method: 'post',
            data: {
              page: this.currentPage,
              limit: this.pageSize,
            }
          }).then(res => {
            console.log(res)
            this.tableData = res.data.data;
            this.total = res.data.count;
          })
        },
        //删除order
        handleDelete: function (row) {
          axios.get("http://localhost:7001/delInvoice?id=" + row.sid).then(res => {
            if (res.data) {
              //刷新table
              this.refresh();
            }
          }).catch(function (error) {
            console.log(error);
          })
        },
        //自动计算数量order
        handleCount: function (row) {
          axios.get("http://localhost:7001/delInvoice?id=" + row.sid).then(res => {
            if (res.data) {
              //刷新table
              this.refresh();
            }
          }).catch(function (error) {
            console.log(error);
          })
        },
        //query按钮
        queryList: function () {
          axios({
            url: 'http://localhost:7001/invoiceList',
            method: 'post',
            data: {
              page: this.currentPage,
              limit: this.pageSize,
              commodityName: this.commodityName,
              invoice_cas: this.invoice_cas,
            }
          }).then(res => {
            this.tableData = res.data.data;
            this.total = res.data.count;
          }).catch(function (error) {
            console.log(error)
          })
        },
        //重置
        reset: function () {
          this.commodityName = '';
          this.invoice_cas = '';
          //刷新table
          this.refresh();
        },
        //pageSize改变触发事件
        handleSizeChange: function (val) {
          console.log('当前页数量: ' + val);
          this.pageSize = val;
          axios({
            url: 'http://localhost:7001/invoiceList',
            method: 'post',
            data: {
              page: 1,
              limit: val,
              commodityName: this.commodityName,
              invoice_cas: this.invoice_cas,
            }
          }).then(res => {
            console.log("切换每页数量后==" + res.data.data.length)
            this.tableData = res.data.data;
            this.total = res.data.count;
          }).catch(function (error) {
            console.log(error)
          })
        },
        //点击当前页数触发事件
        handleCurrentChange: function (val) {
          console.log('当前页: ' + val);
          axios({
            url: 'http://localhost:7001/invoiceList',
            method: 'post',
            data: {
              page: val,
              limit: this.pageSize,
              commodityName: this.commodityName,
              invoice_cas: this.invoice_cas,
            }
          }).then(res => {
            this.tableData = res.data.data;
            this.total = res.data.count;
          }).catch(function (error) {
            console.log(error)
          })
        },
        //全选
        selsChange: function (sels) {
          this.sels = sels
        },
        //批量删除
        delBatch: function () {
          var ids = this.sels.map(item => item.sid).join()//获取所有选中行的id组成的字符串，以逗号分隔
          console.log("ids===" + ids)
          this.$confirm('此操作将永久删除该文件及其子文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            axios.get("http://localhost:7001/delBatchInvoice?ids=" + ids).then(res => {
              //刷新table
              this.refresh();
            }).catch(function (error) {
              console.log(error);
            })
            console.log("删除成功")
          })
        },
        // 监听添加功能 子组件弹窗关闭后触发，有子组件调用
        showAdd(data) {
          if (data === 'false') {
            this.addVisible = false
          } else {
            this.addVisible = true
          }
        },
        // 监听修改功能 子组件弹窗关闭后触发，有子组件调用
        showUpd(data) {
          if (data === 'false') {
            this.updVisible = false
          } else {
            this.updVisible = true
          }
        },
        //计算数量
        handleAmount:function(row) {
          this.amountVisible = true
          console.log(row)
          this.amountSid=row.sid
        },
        // 提交增加数量
        amountOnSubmit:function () {
          console.log(this.amount)
          axios({
            url: 'http://localhost:7001/updateAmount',
            method: 'get',
            params:{
              amount:this.amount,
              sid:this.amountSid
            }
          }).then(res => {
            console.log(res)
            if(res.data){
              this.$message('计算数量成功');
              this.amountVisible=false;
              this.amount=''
              //刷新table
              this.refresh();
            }else{
              this.$message('计算数量失败');
            }
          }).catch(function (error) {
            console.log(error);
          })
        },
        // 计算数量弹出框关闭后触发
        handleClose(){
          // 子组件调用父组件方法，并传递参数
          this.$emit('changeShow','false')
        },
      },
      //文档就绪
      beforeCreate: function () {
        console.log("rules:" + Cookies.get("rules"))
        console.log("user_id:" + Cookies.get("user_id"))
        this.user_id = Cookies.get("user_id");
        this.user_rule = Cookies.get("rules");
        //查询order list
        axios({
          url: 'http://localhost:7001/invoiceList',
          method: 'post',
          data: {
            page: 1, //this.currentPage,
            limit: 5, //this.pageSize,
            commodityName: this.commodityName,
            invoice_cas: this.invoice_cas,
          }
        }).then(res => {
          console.log(res)
          console.log(res.data)
          console.log(res.data.data)
          this.tableData = res.data.data;
          this.total = res.data.count;
        }).catch(function (error) {
          console.log(error)
        })
      }
    }
</script>

<style scoped>
    .el-table .warning-row {
        background: #f8a9a0;
    }

    .el-table .success-row {
        background: #f0f9eb;
    }
</style>
