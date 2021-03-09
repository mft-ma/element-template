<template>
    <div>
        <el-dialog title="修改业务员信息" :visible.sync="dialogFormVisible" width="28%">
            <el-form :model="form">
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <!--autocomplete="off" input表单输入框不记录输入过信息-->
                    <el-input v-model="form.username" style="width:220px " autocomplete="off" placeholder="请输入用户名"></el-input>
                </el-form-item>

                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input v-model="form.password" style="width:220px " autocomplete="off" placeholder="请输入密码"></el-input>
                </el-form-item>

                <el-form-item label="权限等级" :label-width="formLabelWidth">
                    <el-select v-model="form.type" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.lable"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item :label-width="formLabelWidth">
                    <el-button type="primary" @click="onupd()">立即修改</el-button>
                    <el-button type="primary" @click="restSub('form')">重 置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        data(){
            return{
                options: [{
                        value: 0,
                        lable: '管理员',
                    },
                    {
                        value: 1,
                        lable: '业务员',
                    }],
                //窗口关闭状态
                dialogFormVisible:false,
                formLabelWidth: '120px',
                form:{
                    uid: '',
                    username:'',
                    password:'',
                    type:''
                },
            }
        },

        methods:{
            //修改业务员信息
            onupd:function () {
                axios.put('http://localhost:7001/updateUser',this.form).then((response) => {
                    console.log(response.data);
                    this.$message('修改成功');
                    //关闭窗口
                    this.dialogFormVisible=false;
                    //子组件调查父组件查询所有刷新页面
                    this.$emit('add');
                }).catch(function (error) {
                    this.$message('修改失败');
                    console.log(error);
                });
            },

            //重置
            restSub(subForm){
                this[subForm] = {};
                this.$refs[subForm].resetFields()
            },
        },
    }
</script>

<style scoped>

</style>
