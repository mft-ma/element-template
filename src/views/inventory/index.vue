<template>
    <div><!--库存管理-->
        <br>
        <el-form :inline="true" class="demo-form-inline">
            &nbsp;&nbsp;&nbsp;&nbsp;
            <el-form-item label="商品名称">
                <el-input v-model="commodityName" placeholder="商品名称"></el-input>
            </el-form-item>&nbsp;&nbsp;&nbsp;&nbsp;
            <el-form-item label="cas号">
              <el-input v-model="inventory_cas" placeholder="cas号"></el-input>
            </el-form-item>&nbsp;&nbsp;&nbsp;&nbsp;
            <el-form-item label="库存编号">
              <el-input v-model="inventoryNumber" placeholder="库存编号"></el-input>
            </el-form-item>&nbsp;&nbsp;&nbsp;&nbsp;
            <el-form-item>
                <el-button type="success" @click="queryList">查询</el-button>
                <el-button type="success" @click="queryAmountList">查询0库存</el-button>
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
            <el-table-column prop="number" label="库存编号" width="150"></el-table-column>
            <el-table-column prop="name" label="商品名称" width="150"></el-table-column>
            <el-table-column prop="cas" label="cas号" width="100"></el-table-column>
            <el-table-column prop="amount" label="库存数量" width="150"></el-table-column>
            <el-table-column prop="remark" label="备注" width="250"></el-table-column>
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
                               @click="handleAddAmount(scope.row)">增加数量</el-button>&nbsp;
                    <el-dialog title="增加数量" :visible.sync="addAmountVisible" width="30%" @close="handleClose" append-to-body>
                      <el-form>
                        <el-form-item label="库存数量" :label-width="formLabelWidth" prop="gender">
                          <el-input v-model="addAmount" placeholder="请输入增加数量"></el-input>
                        </el-form-item><br>
                      </el-form>
                      <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="addAmountOnSubmit">确 定</el-button>
                        <el-button @click="addAmountVisible=false">取 消</el-button>
                      </div>
                    </el-dialog>

                    <el-button size="mini" type="info" plain
                             @click="handleReduceAmount(scope.row)">减少数量</el-button>&nbsp;
                    <el-dialog title="减少数量" :visible.sync="reduceAmountVisible" width="30%" @close="handleClose" append-to-body>
                      <el-form>
                        <el-form-item label="库存数量" :label-width="formLabelWidth" prop="gender">
                          <el-input v-model="reduceAmount" placeholder="请输入减少数量"></el-input>
                        </el-form-item><br>
                      </el-form>
                      <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="reduceAmountOnSubmit">提 交</el-button>
                        <el-button @click="reduceAmountVisible=false">取 消</el-button>
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
                user_id:'',
                user_rule:'',
                listId:'',
                commodityName:'',
                inventory_cas:'',
                inventoryNumber:'',
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
                infoVisible:false,
                updVisible:false,
                infoId:0,
                addAmount:'',
                reduceAmount:'',
                addAmountVisible:false,
                reduceAmountVisible:false,
                addAmountKid:0,
                reduceAmountKid:0
            }
        },
        // 使用子组件
        components:{
            Add,
            Update
        },
        methods: {
            //设置退货订单背景为红色
            tableRowStyleName({row}) {
                if(row.amount <= 0){
                    return 'background-color: #f8a9a0';
                }
            },
            // 任意点击某处选中此行
            handle(row, column, event) {
              /*// list -- 已选的数据
              let index = this.list.findIndex(item => {
                // 判断已选数组中是否已存在该条数据
                return item.id == row.id
              })
              if (index == -1) {
                // 如果未存在，设置已选状态，并在list中添加这条数据
                this.$refs.multipleTable.toggleRowSelection(row, true); //设置复选框为选中状态
                this.list.push(row)
              } else {
                // 如果已存在，设置未选状态，并在list中删除这条数据
                this.$refs.multipleTable.toggleRowSelection(row, false); //设置复选框为未选状态
                this.list.splice(index, 1)
              }*/
              this.$refs.table.toggleRowSelection(row);
            },
            // 按钮点击事件 显示新增编辑弹窗组件
            saveUser(){
                this.addVisible = true
            },
            //修改
            handleEdit:function(row) {
                this.updVisible = true
                this.infoId=row.kid
            },
            //增加数量
            handleAddAmount:function(row) {
              this.addAmountVisible = true
              console.log(row)
              this.addAmountKid=row.kid
            },
            //减少数量
            handleReduceAmount:function(row) {
              this.reduceAmountVisible = true
              this.reduceAmountKid=row.kid
            },
            //刷新表格
            refresh:function(){
                //刷新table
                axios({
                    url:'http://localhost:7001/inventoryList',
                    method:'post' ,
                    data:{
                        page:this.currentPage,
                        limit:this.pageSize,
                        // user_id:Cookies.get("user_id"),
                        // user_rule:Cookies.get("rules")
                    }
                }).then(res=>{
                    console.log(res)
                    this.tableData=res.data.data;
                    this.total=res.data.count;
                })
            },
            //删除order
            handleDelete:function(row) {
                axios.get("http://localhost:7001/delInventory?id="+row.kid).then(res=>{
                    if(res.data){
                        //刷新table
                        this.refresh();
                    }
                }).catch(function (error) {
                    console.log(error);
                })
            },
            //query按钮
            queryList:function () {
                axios({
                    url:'http://localhost:7001/inventoryList',
                    method:'post' ,
                    data: {
                        page:this.currentPage,
                        limit:this.pageSize,
                        commodityName:this.commodityName,
                        inventory_cas:this.inventory_cas,
                        inventoryNumber:this.inventoryNumber,
                        // user_id:Cookies.get("user_id"),
                        // user_rule:Cookies.get("rules")
                    }
                }).then(res=>{
                    this.tableData=res.data.data;
                    this.total=res.data.count;
                }).catch(function (error) {
                    console.log(error)
                })
            },
            //查询0库存数据
            queryAmountList:function () {
              axios({
                url:'http://localhost:7001/queryAmountList',
                method:'post' ,
                data: {
                  page:this.currentPage,
                  limit:this.pageSize,
                }
              }).then(res=>{
                this.tableData=res.data.data;
                this.total=res.data.count;
              }).catch(function (error) {
                console.log(error)
              })
            },
            //重置
            reset:function () {
                this.commodityName='';
                this.inventory_cas='';
                this.inventoryNumber='';
                //刷新table
                this.refresh();
            },
            //pageSize改变触发事件
            handleSizeChange:function(val) {
                console.log('当前页数量: '+val);
                this.pageSize=val;
                axios({
                    url:'http://localhost:7001/inventoryList',
                    method:'post' ,
                    data: {
                        page:1,
                        limit:val,
                        commodityName:this.commodityName,
                        inventory_cas:this.inventory_cas,
                        inventoryNumber:this.inventoryNumber,
                        // user_id:Cookies.get("user_id"),
                        // user_rule:Cookies.get("rules")
                    }
                }).then(res=>{
                    console.log("切换每页数量后=="+res.data.data.length)
                    this.tableData=res.data.data;
                    this.total=res.data.count;
                }).catch(function (error) {
                    console.log(error)
                })
            },
            //点击当前页数触发事件
            handleCurrentChange:function(val) {
                console.log('当前页: '+val);
                axios({
                    url:'http://localhost:7001/inventoryList',
                    method:'post' ,
                    data: {
                        page:val,
                        limit:this.pageSize,
                        commodityName:this.commodityName,
                        inventory_cas:this.inventory_cas,
                        inventoryNumber:this.inventoryNumber,
                        // user_id:Cookies.get("user_id"),
                        // user_rule:Cookies.get("rules")
                    }
                }).then(res=>{
                    this.tableData=res.data.data;
                    this.total=res.data.count;
                }).catch(function (error) {
                    console.log(error)
                })
            },
            //全选
            selsChange:function(sels) {
                this.sels = sels
            },
            //批量删除
            delBatch:function () {
                var ids= this.sels.map(item => item.kid).join()//获取所有选中行的id组成的字符串，以逗号分隔
                console.log("ids==="+ids)
                this.$confirm('此操作将永久删除该文件及其子文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios.get("http://localhost:7001/delBatchInventory?ids="+ids).then(res=>{
                        //刷新table
                        this.refresh();
                    }).catch(function (error) {
                        console.log(error);
                    })
                    console.log("删除成功")
                })
            },
            // 监听添加功能 子组件弹窗关闭后触发，有子组件调用
            showAdd(data){
                if(data === 'false'){
                    this.addVisible = false
                }else{
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
            // 增加数量弹出框关闭后触发
            handleClose(){
              // 子组件调用父组件方法，并传递参数
              this.$emit('changeShow','false')
            },
            // 提交增加数量
            addAmountOnSubmit:function () {
              console.log(this.addAmount)
              axios({
                url: 'http://localhost:7001/addAmount',
                method: 'get',
                params:{
                  amount:this.addAmount,
                  kid:this.addAmountKid
                }
              }).then(res => {
                console.log(res)
                if(res.data){
                  this.$message('添加数量成功');
                  this.addAmountVisible=false;
                  this.addAmount=''
                  //刷新table
                  this.refresh();
                }else{
                  this.$message('添加数量失败');
                }
              }).catch(function (error) {
                console.log(error);
              })
            },
            // 提交减少数量
            reduceAmountOnSubmit:function () {
              console.log(this.reduceAmount)
              axios({
                url: 'http://localhost:7001/reduceAmount',
                method: 'get',
                params:{
                  amount:this.reduceAmount,
                  kid:this.reduceAmountKid
                }
              }).then(res => {
                console.log(res)
                if(res.data){
                  this.$message('减少数量成功');
                  this.reduceAmountVisible=false;
                  this.reduceAmount=''
                  //刷新table
                  this.refresh();
                }else{
                  this.$message('减少数量失败');
                }
              }).catch(function (error) {
                console.log(error);
              })
          }
        },
        //文档就绪
        beforeCreate:function() {
            console.log("rules:"+Cookies.get("rules"))
            console.log("user_id:"+Cookies.get("user_id"))
            this.user_id=Cookies.get("user_id");
            this.user_rule=Cookies.get("rules");
            //查询order list
            axios({
                url:'http://localhost:7001/inventoryList',
                method:'post' ,
                data:{
                    page:1, //this.currentPage,
                    limit:5, //this.pageSize,
                    commodityName:this.commodityName,
                    inventory_cas:this.inventory_cas,
                    inventoryNumber:this.inventoryNumber,
                    // user_id:Cookies.get("user_id"),
                    // user_rule:Cookies.get("rules")
                }
            }).then(res=>{
                console.log(res)
                console.log(res.data)
                console.log(res.data.data)
                this.tableData=res.data.data;
                this.total=res.data.count;
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
