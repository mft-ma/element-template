<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="100px" :inline="true" size="small">
      <el-form-item label="产品名称">
        <el-input v-model="form.name" style="width: 100px"/>
      </el-form-item>
      <el-form-item label="Cas号">
        <el-input v-model="form.cas" style="width: 100px"/>
      </el-form-item>
      <el-form-item label="日期">
        <el-col :span="11">
          <el-date-picker v-model="form.startdate" type="date" placeholder="开始时间" style="width: 100%;"/>
        </el-col>
        <el-col :span="2" class="line">-</el-col>
        <el-col :span="11">
          <el-date-picker v-model="form.enddate" type="date" placeholder="结束时间" style="width: 100%;"/>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>

      <el-button type="primary" size="small" @click="onadd">添加</el-button>
      <Add ref="addRef" class="inline-block" @changeShow="showadd" @update="update"/>&nbsp;&nbsp;

      <el-button type="primary" size="small" @click="onUpd">修改</el-button>
      <Upd ref="updRef" :updinfo="updinfo" class="inline-block" @changeShow="showUpd" @update="update"/>&nbsp;&nbsp;

      <el-button type="danger" size="small" @click="del">删除</el-button>
    </el-form>
    <el-table
      :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      border
      height="500px"
      :row-class-name="changeColor"
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
        label="商品编号"
        width="120"
      />
      <el-table-column
        prop="name"
        label="产品名称"
        width="120"
      />
      <el-table-column
        prop="cas"
        label="cas号"
        width="120"
      />
      <el-table-column
        prop="priceInfo"
        label="报价信息"
        width="120"
      />
      <el-table-column
        prop="user.username"
        label="业务员名称"
        width="120"
      />
      <el-table-column
        prop="updateTime"
        label="更新日期"
        width="120"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="500"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleClick(scope.row)">查看供应商</el-button>
          <el-button type="primary" size="small" @click="oncommodityInfo(scope.row)">商品介绍</el-button>
          <!-- 上传图片 -->
          <el-upload
            class="inline-block"
            action="http://localhost:7001/upload/"
            multiple
            :limit="3"
            :on-success="success"
            :data="{id:scope.row.sid}"
            v-show="scope.row.imgStatus == 1 ? false : true"
            :on-exceed="handleExceed"
          >
            <el-button v-show="scope.row.imgStatus == 1 ? false : true" size="small" type="primary">
              {{ scope.row.imgStatus==1?'已上传':'上传图片' }}
            </el-button>
          </el-upload>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <el-button
            v-show="scope.row.imgStatus == 1 ? true : false"
            size="small"
            type="primary"
            @click="handleShowImage(scope.row)"
          >已上传
          </el-button>

          <el-dialog title="显示图片" :visible.sync="showImageVisible" width="30%" append-to-body @close="handleClose">
            <img :src="showImagePath" style="max-height: 500px;max-width: 400px"><!--:src="'/assets/'+showImagePath"-->
            <div slot="footer" class="dialog-footer">
              <el-button type="primary">
                <a
                  class="download"
                  :href="showImagePath"
                  download=""
                  title="下载"
                >下 载</a>
              </el-button>
              <el-button @click="showImageVisible=false">取 消</el-button>
            </div>
          </el-dialog>

          <!-- 上传文件 -->
          <el-upload
            class="inline-block"
            action="http://localhost:7001/upload/"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
          >
            <el-button size="small" type="primary" class="inline-block">上传文件</el-button>
          </el-upload>
        </template>
      </el-table-column>
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
    <!--      供应商信息-->
    <el-dialog
      title="信息"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>
        <el-form label-width="100px">
          <el-form-item label="供应商名称" size="small">
            <el-input :value="supplierName" readonly/>
          </el-form-item>
          <el-form-item label="电话" size="small">
            <el-input :value="phone" readonly/>
          </el-form-item>
        </el-form>
      </span>
    </el-dialog>

    <!--        //商品信息-->
    <el-dialog
      title="信息"
      :visible.sync="dialog"
      width="30%"
    >
      <span>
        <el-form label-width="100px">
          <el-form-item label="业务员名称" size="small">
            <el-input :value="username" readonly/>
          </el-form-item>
          <el-form-item label="产品名称" size="small">
            <el-input :value="commodityname" readonly/>
          </el-form-item>
          <el-form-item label="cas号" size="small">
            <el-input :value="commoditycas" readonly/>
          </el-form-item>
          <el-form-item label="创建日期" size="small">
            <el-input :value="createTime" readonly/>
          </el-form-item>
          <el-form-item label="更新日期" size="small">
            <el-input :value="updateTime" readonly/>
          </el-form-item>
          <el-form-item label="报价信息" size="small">
            <el-input :value="priceInfo" readonly/>
          </el-form-item>
          <el-form-item label="商品介绍" size="small">
            <el-input :value="commodity" readonly/>
          </el-form-item>
          <el-form-item label="图片" size="small">
            <el-image
              style="width: 100px; height: 100px"
              :src="url"
            />
          </el-form-item>
        </el-form>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import Add from '@/views/commodity/add'
  import Upd from '@/views/commodity/upd'

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
          startdate: '',
          enddate: ''
        },
        updinfo: 0,
        radio: -1,
        tableData: [{}],
        currentPage: 1, // 初始页
        pagesize: 5, // 每页显示页数
        total: 100,
        dialogVisible: false,
        supplierName: '',
        phone: '',
        supplierId: '',
        dialog: false,
        username: '',
        commodityname: '',
        commoditycas: '',
        createTime: '',
        updateTime: '',
        priceInfo: '',
        commodity: '',
        imageName: '',
        url: '',
        headers: '',
        showImageValue: false,
        showImageVisible: false,
        showImagePath: '',
        showImage: ''
      }
    },
    mounted: function () {
      this.initTable()
    },
    methods: {
      // 初始化表格
      initTable() {
        axios.get('http://localhost:7001/queryCommodity')
          .then((response) => {
            console.log(response.data)
            this.tableData = response.data
            this.total = response.data.length
            this.supplierId = response.data.supplierId
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      changeColor({row}) {
        if (row.inventory !== null) {
          return 'red';
        } else {
            return 'blue'
          }
      },
      // 打开添加修改组件
      onadd() {
        this.$refs.addRef.dialogVisible = true
      },
      onUpd() {
        if (this.radio === -1) {
          this.$message('您还未选中')
        } else {
          this.updinfo = this.selectedInfo.sid
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
        axios.get('http://localhost:7001/queryCommodity')
          .then((response) => {
            console.log(response.data)
            this.tableData = response.data
            this.total = response.data.length
          })
          .catch(function (error) {
            console.log(error)
          })
      },

      onSubmit() {
        axios.get('http://localhost:7001/queryCommodity', {
          params: {
            name: this.form.name,
            cas: this.form.cas,
            startdate: this.form.startdate,
            enddate: this.form.enddate
          }
        })
          .then((response) => {
            console.log(response.data)
            this.tableData = response.data
            this.supplierId = response.data.supplierId
            this.form.name = ''
            this.form.cas = ''
            this.form.startdate = ''
            this.form.enddate = ''
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      // 点击单选
      singleElection(row) {
        this.radio = this.tableData.indexOf(row)
        this.selectedInfo = row
        console.log(this.radio)
      },
      onCancel() {
        this.$message({
          message: 'cancel!',
          type: 'warning'
        })
      },
      // 点击查看按钮进行供应商查询
      handleClick(row) {
        this.dialogVisible = true
        axios.get('http://localhost:7001/querySupplierById', {
          params: {
            gid: row.supplierId
          }
        })
          .then((response) => {
            this.supplierName = response.data.name
            this.phone = response.data.phone
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      // 点击查看商品信息
      oncommodityInfo(row) {
        this.dialog = true
        this.username = row.user.username
        this.commodityname = row.name
        this.commoditycas = row.cas
        this.createTime = row.createTime
        this.updateTime = row.updateTime
        this.priceInfo = row.priceInfo
        this.commodity = row.commodityInfo
        this.url = '/image/' + row.imgPath
      },

      del() {
        if (this.radio !== -1) {
          axios.get('http://localhost:7001/delCommodity', {
            params: {
              sid: this.selectedInfo.sid
            }
          })
            .then((response) => {
              this.$message('删除成功')
              axios.get('http://localhost:7001/queryCommodity')
                .then((response) => {
                  console.log(response.data)
                  this.tableData = response.data
                  this.total = response.data.length
                })
                .catch(function (error) {
                  console.log(error)
                })
            })
            .catch(function (error) {
              console.log(error)
            })
        } else {
          this.$message('您还未选中')
        }
      },
      // 文件超出个数限制时的钩子
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
      },
      // 分页
      handleCurrentChange: function (currentPage) {
        this.currentPage = currentPage
      },
      sizeChange: function (size) {
        this.pagesize = size
      },

      handleShowImage(row) {
        this.showImageVisible = true
        console.log('row.imgPath===' + row.imgPath)
        // this.showImagePath='http://localhost:7001/image/'+row.imgPath;
        // this.showImagePath=this.publicPath+row.imgPath;
        this.showImagePath = '/image/' + row.imgPath
        console.log('this.showImagePath===' + this.showImagePath)
      },
      // 上传成功后的勾子函数
      success() {
        // this.$message('上传成功')
        this.initTable()
      },
      // 上传图片按钮点击事件
      // uploadImage(row) {
      //   console.log(row)
      //   if (row.imgStatus === 1) {
      //     this.showImageValue = true
      //     this.showImage = row.imgPath
      //     console.log('是否显示图片：' + this.showImageValue + '   图片：' + this.showImage)
      //   }
      // },
      handleClose() {
        this.$emit('changeShow', 'false')
      }
      // upload3(row) {
      //   if (row.imgStatus === 1) {
      //     this.upload1 = false
      //     // this.upload2 = true
      //   }
      // }
    }
  }
</script>

<style>
  .line {
    text-align: center;
  }

  .inline-block {
    display: inline-block;
    margin-left: 5px;
  }

  .red {
    background: #c1edee !important;
  }

  .blue {
    background: #cdf6dc !important;
  }
</style>
