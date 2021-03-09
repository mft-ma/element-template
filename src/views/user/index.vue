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
    </div>
</template>

<script>
    import axios from 'axios'
    import addUserVue from "./addUserVue.vue";
    import updateUserVue from "./updateUserVue.vue";

    export default {
        data() {
            return {
                tableData: [{}],
                dialogFormVisible:false,
                formLabelWidth: '120px',
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
            axios.get('http://localhost:7001/queryUser')
                .then((Response)=>{
                    console.log(Response.data);
                    this.tableData=Response.data;
                })
                .catch(function (error) {
                    console.log(error);
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

            queryList:function(){
                axios.get('http://localhost:7001/queryUser')
                    .then((Response)=>{
                        console.log(Response.data);
                        this.tableData=Response.data;
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            },

            /*删除及刷新*/
            del(row){
                axios.get('http://localhost:7001/deleteUser?uid='+row.uid)
                    .then((response)=>{
                        console.log(response.data);

                        axios.get('http://localhost:7001/queryUser')
                            .then((response)=>{
                                console.log(response.data.length);
                                this.total=response.data.length;
                                this.tableData=response.data;
                            })
                            .catch(function (error) {

                                console.log(error);
                            });
                        this.$message('删除成功');
                    })
                    .catch(function (error) {
                        this.$message('删除失败');
                        console.log(error);
                    });
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
        },
    }
</script>

<style scoped>
</style>
