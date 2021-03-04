<template>
    <div>
        <el-dialog title="信息" :visible.sync="dialogFormVisible" width="28%">
            <el-form :model="form" :rules="rule" ref="mode">

                <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
                   <!--autocomplete="off" input表单输入框不记录输入过信息-->
                    <el-input v-model="form.username" style="width:220px " autocomplete="off" placeholder="请输入用户名"></el-input>
                </el-form-item>

                <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
                    <el-input v-model="form.password" style="width:220px " autocomplete="off" placeholder="请输入密码"></el-input>
                </el-form-item>

                <el-form-item label="授权等级" :label-width="formLabelWidth" prop="type">
                    <el-select v-model="form.type" placeholder="请选择" autocomplete="off">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.lable"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item :label-width="formLabelWidth">
                    <el-button type="primary" @click="onadd()">立即添加</el-button>
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
                    value: '0',
                    lable: '管理员',
                },
                {
                    value: '1',
                    lable: '业务员',
                }],
                //窗口关闭状态
                dialogFormVisible:false,
                formLabelWidth: '120px',
                form:{
                    username:'',
                    password:'',
                    type:''
                },
                rule:{
                    username:[ { required: true, message: '请输入用户名称', trigger: 'blur' }],
                    password:[ { required: true, message: '请输入用户密码', trigger: 'blur' }],
                    type:[ { required: true, message: '请选择授权等级', trigger: 'change' }],
                }
            }
        },

        methods:{
            //添加新业务员
            onadd:function () {
                //表单验证 this.$refs[""].validate((valid) 文本框不能为空
                this.$refs["mode"].validate((valid) => {
                    if (valid) {
                        axios.post('http://localhost:7001/addUser', this.form)
                            .then((response) => {
                                console.log(response.data);
                                if(response.data){
                                    this.$message('添加成功');
                                    //关闭窗口
                                    this.dialogFormVisible=false;
                                    //子组件调查父组件查询所有刷新页面
                                    this.$emit('add');
                                }else{
                                    this.$message('添加失败');
                                }
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    }else {
                        return;
                    }
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
