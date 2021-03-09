<template>
    <div>
        <el-button type="primary" @click.stop="addUser">授权新业务员</el-button>
        <addUserVue ref="addUserVue" @add="queryList"></addUserVue>
        <el-table
                :data="tableData"
                height="400"
                border
                style="width: 100%">

            <el-table-column
                    type="index"
                    label="ID"
                    width="180">
            </el-table-column>

            <!--<el-table-column
                    prop="uid"
                    label="uid"
                    width="180">
            </el-table-column>-->

            <el-table-column
                    prop="username"
                    label="账号"
                    width="180"
                    >
            </el-table-column>

            <el-table-column
                    prop="password"
                    label="密码"
                    width="180"
                    >
            </el-table-column>

            <el-table-column
                    prop="type"
                    label="权限级别"
                    :formatter="typeFormatter">
            </el-table-column>

            <el-table-column
                    fixed="right"
                    label="操作"
                    width="180">
                <template slot-scope="scope">
                    <!--slot-scope="scope" 来取得作用域插槽:data绑定的数据,只是定义对象来代表取得的data数据-->
                    <el-button type="primary" @click.stop="updateUser(scope.row)">修改</el-button>
                    <el-button type="warning" @click="del(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <updateUserVue ref="updateUserVue" @add="queryList"></updateUserVue>

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
    import addUserVue from "./addUserVue.vue";
    import updateUserVue from "./updateUserVue.vue";
    import Cookies from 'js-cookie'

    export default {
        data() {
            return {
                formLabelWidth: '120px',
                user_id: '',
                user_rule: '',
                listId: '',
                tableData: [{}],
                // 所有页面的数据
                total: null,
                // 每页显示数量
                pageSize: 5,
                // 默认当前显示第一页
                currentPage: 1,
                // 控制新增编辑弹窗的显示与隐藏
                dialogFormVisible:false,
                form:{
                    uid:'',
                    username:'',
                    password:'',
                    type:''
                }
            }
        },

        //自动查询所有
        mounted:function () {
          //刷新table
          axios({
            url: 'http://localhost:7001/queryUser',
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

        //使用子组件
        components:{
            addUserVue,
            updateUserVue,
        },

        //方法
        methods:{
            //添加页面开启
            addUser(){
                this.$refs.addUserVue.dialogFormVisible = true;
            },
            //修改页面开启
            updateUser(data){
                this.$refs.updateUserVue.dialogFormVisible = true;
                //向子窗口传递数据
                this.$refs.updateUserVue.form = data;
            },

            //自动刷新表格
            queryList:function(){
                //刷新table
                axios({
                    url: 'http://localhost:7001/queryUser',
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

            //pageSize改变触发事件
            handleSizeChange: function (val) {
                console.log('当前页数量: ' + val);
                this.pageSize = val;
                axios({
                    url: 'http://localhost:7001/queryUser',
                    method: 'post',
                    data: {
                    page: 1,
                    limit: val,
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
                    url: 'http://localhost:7001/queryUser',
                    method: 'post',
                    data: {
                        page: val,
                        limit: this.pageSize,
                    }
                }).then(res => {
                    this.tableData = res.data.data;
                    this.total = res.data.count;
                }).catch(function (error) {
                    console.log(error)
                })
            },

            /*删除及刷新*/
            del(row){
                this.$confirm('删除该账号, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios.get('http://localhost:7001/deleteUser?uid='+row.uid)
                        .then((response)=>{
                            console.log(response.data);
                            this.queryList();
                            this.$message('删除成功');
                        }).catch(function (error) {
                            this.$message('删除失败');
                            console.log(error);
                            console.log("删除失败")
                    })
                })
            },

            //类型转换
            typeFormatter(row, column) {
            var s = row.type;
            var s1 = '业务员';
            if (s == '0') {
                 s1 = '管理员';
            }
            return s1;
            },

            //文档就绪
            beforeCreate:function() {
                console.log("rules:"+Cookies.get("rules"))
                console.log("user_id:"+Cookies.get("user_id"))
                this.user_id=Cookies.get("user_id");
                this.user_rule=Cookies.get("rules");
                //查询order list
                axios({
                    url:'http://localhost:7001/queryUser',
                    method:'post' ,
                    data:{
                        page:1, //this.currentPage,
                        limit:5, //this.pageSize,
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
        },
    }
</script>

<style scoped>
</style>
