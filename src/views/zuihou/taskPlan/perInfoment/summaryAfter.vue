<template>
  <div>
    <treeselect
      :clear-value-text="$t('common.clear')"
      :load-options="loadListOptions"
      :normalizer="normalizer"
      :multiple="false"
      :options="orgList"
      placeholder="请选择单位部门"
      :searchable="true"
      class="filter-item search-item"
      v-model="queryParams.model.filed"
    />
    <el-select
      :multiple="false"
      clearable
      class="filter-item search-item"
      placeholder="请选择职务"
      v-model="queryParams.model.post.key"
    >
      <el-option
        :key="item.id"
        :label="item.name"
        :value="item.id"
        v-for="item in stationList"
      />
    </el-select>
    <el-date-picker
      v-model="queryParams.model.checkTime"
      type="date"
      placeholder="请选择检测时间"
      align="right"
      class="filter-item search-item"
      value-format="yyyy-MM-dd"
    >
    </el-date-picker>
    <el-select class="filter-item search-item" clearable v-model="queryParams.model.isAbnormal.key" placeholder="请选择检测是否异常">
      <el-option
        v-for="item in isAbnormalList"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <div style="display: inline" v-show = 'seniorType'>
      <el-input placeholder='请输入姓名' class="filter-item search-item" v-model="queryParams.model.userName"/>
      <el-select class="filter-item search-item" placeholder="请输入人员类别" v-model="queryParams.model.personnelType.key" value>
        <el-option :key="index" :label="item.name" :value="item.id" v-for="(item, key, index) in dicts.PERSONNEL_TYPE" />
      </el-select>
      <el-select class="filter-item search-item" clearable v-model="queryParams.model.sex.code" placeholder="请选择性别">
        <el-option
          v-for="item in genderData"
          :key="item.code"
          :label="item.label"
          :value="item.code">
        </el-option>
      </el-select>
      <el-input placeholder='请输入身份证号' class="filter-item search-item" v-model="queryParams.model.idNumber"/>
      <el-input placeholder='请输入借调类型' class="filter-item search-item" v-model="queryParams.model.secondmentType"/>
      <el-input placeholder='请输入疫苗接种类别' class="filter-item search-item" v-model="queryParams.model.inoculateType"/>
      <el-input placeholder='请输入联系电话' class="filter-item search-item" v-model="queryParams.model.phone"/>
      <el-input placeholder='请输入标本编号' class="filter-item search-item" v-model="queryParams.model.specimenNumber"/>
      <el-select class="filter-item search-item"  placeholder="请选择检测类型" v-model="queryParams.model.checkType.key" value>
        <el-option :key="index" :label="item.name" :value="item.id" v-for="(item, key, index) in dicts.CHECK_TYPE" />
      </el-select>
    </div>
    <el-button @click="search" class="filter-item" plain type="primary">
      {{ $t("table.search") }}
    </el-button>
    <el-button @click="reset" class="filter-item" plain type="warning">
      {{ $t("table.reset") }}
    </el-button>
<!--    <el-button @click="add" class="filter-item" plain type="danger" v-has-permission="['user:add']">-->
<!--      {{ $t("table.add") }}-->
<!--    </el-button>-->
    <el-button type="info" plain @click="returnPage" class="filter-item">返回</el-button>
<!--    <el-dropdown class="filter-item" trigger="click"-->
<!--                 v-has-any-permission="[-->
<!--            'user:delete',-->
<!--            'user:rest',-->
<!--            'user:export',-->
<!--            'user:import',-->
<!--          ]">-->
<!--      <el-button>-->
<!--        {{ $t("table.more") }}-->
<!--        <i class="el-icon-arrow-down el-icon&#45;&#45;right"/>-->
<!--      </el-button>-->
<!--      <el-dropdown-menu slot="dropdown">-->
<!--        <el-dropdown-item @click.native="exportExcel" v-has-permission="['user:delete']">-->
<!--          导出-->
<!--        </el-dropdown-item>-->
<!--        <el-dropdown-item @click.native="exportPreviewExcel" v-has-permission="['user:delete']">-->
<!--          导出预览-->
<!--        </el-dropdown-item>-->
<!--        <el-dropdown-item @click.native="addExcel" v-has-permission="['user:export']">-->
<!--          新增-->
<!--        </el-dropdown-item>-->
<!--        <el-dropdown-item @click.native="updateExcel" v-has-permission="['user:export']">-->
<!--          更新-->
<!--        </el-dropdown-item>-->
<!--        <el-dropdown-item @click.native="stencilExcel" v-has-permission="['user:import']">-->
<!--          模板下载-->
<!--        </el-dropdown-item>-->
<!--      </el-dropdown-menu>-->
<!--    </el-dropdown>-->
    <el-button type="primary" plain class="filter-item" @click="seniorChange" :icon="seniorSearch.icon">{{seniorSearch.text}}</el-button>
    <el-table
      :data="tableData.records"
      :key="tableKey"
      class="testTable"
      border fit row-key="id"
      ref="table"
      style="width: 100%;margin-top: 10px"
      v-loading="loading"
    >
      <el-table-column
        label="序号"
        align="center"
        prop="serialNumber"
        width="80"
      >
      </el-table-column>
      <el-table-column
        label="单位"
        :show-overflow-tooltip="true"
        align="center"
        width="150"
        prop="company"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.company.data?scope.row.company.data:'' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="部门"
        :show-overflow-tooltip="true"
        align="center"
        width="120"
        prop="departMent"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.departMent.data?scope.row.departMent.data:'' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="职务"
        :show-overflow-tooltip="true"
        align="center"
        width="120"
        prop="post"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.post.data?scope.row.post.data:'' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="姓名"
        :show-overflow-tooltip="true"
        align="center"
        width="80"
        prop="userName"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="性别"
        :show-overflow-tooltip="true"
        align="center"
        width="80"
        prop="sex"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.sex.desc?scope.row.sex.desc:'' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="出生年月"
        :show-overflow-tooltip="true"
        align="center"
        width="120"
        prop="dateOfBirth"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.dateOfBirth }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="人员类别"
        :show-overflow-tooltip="true"
        align="center"
        width="120"
        prop="personnelType"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.personnelType.data?scope.row.personnelType.data:'' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="身份证号"
        :show-overflow-tooltip="true"
        align="center"
        width="200"
        prop="idNumber"
      >
      </el-table-column>
      <el-table-column
        label="家庭住址"
        :show-overflow-tooltip="true"
        align="center"
        width="200"
        prop="homeAddress"
      >
      </el-table-column>
      <el-table-column
        label="婚否"
        :show-overflow-tooltip="true"
        align="center"
        width="80"
        prop="marriage"
      >
        <template slot-scope="{row}">
          <span>{{row.marriage?'是':'否'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="借调类型"
        :show-overflow-tooltip="true"
        align="center"
        width="120"
        prop="secondmentType"
      >
      </el-table-column>
      <el-table-column
        label="原单位"
        :show-overflow-tooltip="true"
        align="center"
        width="200"
        prop="beforeCompany"
      >
      </el-table-column>
      <el-table-column
        label="疫苗接种类别"
        :show-overflow-tooltip="true"
        align="center"
        width="120"
        prop="inoculateType"
      >
      </el-table-column>
      <el-table-column
        label="联系电话"
        :show-overflow-tooltip="true"
        align="center"
        width="120"
        prop="phone"
      >
      </el-table-column>
      <el-table-column
        label="标本编号"
        :show-overflow-tooltip="true"
        align="center"
        width="120"
        prop="specimenNumber"
      >
      </el-table-column>
      <el-table-column
        label="人员状态"
        :show-overflow-tooltip="true"
        align="center"
        width="120"
        prop="personnelStatus"
      >
      </el-table-column>
      <el-table-column
        label="检测类型"
        :show-overflow-tooltip="true"
        align="center"
        width="120"
        prop="checkType"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.checkType.data?scope.row.checkType.data:'' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="检测地址"
        :show-overflow-tooltip="true"
        align="center"
        width="150"
        prop="checkAddress"
      >
      </el-table-column>
      <el-table-column
        label="检测时间"
        align="center"
        width="170"
        prop="checkTime"
      >
        <template slot-scope="{row}">
          <el-date-picker
            v-model="row.checkTime"
            type="date"
            placeholder="检测时间"
            align="right"
            @change ='update(row,1)'
            style="width: 100%"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column
        label="检测结果"
        :show-overflow-tooltip="true"
        align="center"
        width="150"
        prop="checkResult"
      >
        <template slot-scope="scope">
          <el-input
            placeholder="检测结果"
            @change ='update(scope.row,2)'
            style="width: 100%"
            v-model="scope.row.checkResult"
          >
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="是否异常"
        :show-overflow-tooltip="true"
        align="center"
        width="140"
        prop="isAbnormal"
      >
        <template slot-scope="{row}">
          <el-select style="width: 100%" @change ='update(row,3)' v-model="row.isAbnormal" placeholder="是否异常">
            <el-option
              v-for="item in isAbnormalList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="检测途径"
        :show-overflow-tooltip="true"
        align="center"
        width="180"
        prop="checkChannel"
      >
        <template slot-scope="{row}">
          <el-input
            @change ='update(row,4)'
            placeholder="检测途径"
            type="textarea"
            :rows="2"
            style="width: 100%"
            v-model="row.checkChannel"
            clearable
          />
        </template>
      </el-table-column>
      <el-table-column
        label="未检测原因"
        :show-overflow-tooltip="true"
        align="center"
        width="180"
        prop="notDetectedReason"
      >
        <template slot-scope="{row}">
          <el-input
            @change ='update(row,5)'
            placeholder="未检测原因"
            type="textarea"
            :rows="2"
            style="width: 100%"
            v-model="row.notDetectedReason"
            clearable
          />
        </template>
      </el-table-column>
      <el-table-column
        label="结果证明"
        :show-overflow-tooltip="true"
        align="center"
        width="180"
        prop="checkResultProve"
      >
        <template slot-scope="{row}">
          <el-input
            placeholder="结果证明"
            @change ='update(row,6)'
            type="textarea"
            :rows="2"
            style="width: 100%"
            v-model="row.checkResultProve"
            clearable
          />
        </template>
      </el-table-column>
      <el-table-column
        label="个人签名"
        :show-overflow-tooltip="true"
        align="center"
        width="200"
        prop="personalSignature"
      >
      </el-table-column>
      <el-table-column
        label="备注"
        :show-overflow-tooltip="true"
        align="center"
        width="200"
        prop="remarks"
      >
      </el-table-column>
<!--      <el-table-column-->
<!--        label="操作"-->
<!--        column-key="operation"-->
<!--        align="center"-->
<!--        class-name="small-padding fixed-width"-->
<!--        width="100px"-->
<!--      >-->
<!--        <template slot-scope="{ row }">-->
<!--          <i-->
<!--            @click="edit(row)"-->
<!--            class="el-icon-edit table-operation"-->
<!--            style="color: #021E8C;"-->
<!--            title="修改"-->
<!--            v-hasPermission="['role:update']"-->
<!--          />-->
<!--          <el-link class="no-perm" v-has-no-permission="['loginLog:delete']">{{-->
<!--            $t("tips.noPermission")-->
<!--            }}-->
<!--          </el-link>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>
    <pagination
      :limit.sync="queryParams.size"
      :page.sync="queryParams.current"
      :total="(Number(tableData.total))"
      @pagination="fetch"
      v-show="tableData.total > 0"
    />
<!--    <edit-->
<!--      :dialog-visible="dialog.isVisible"-->
<!--      :type="dialog.type"-->
<!--      @close="editClose"-->
<!--      @success="editSuccess"-->
<!--      ref="edit"-->
<!--    />-->
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      title="预览"
      width="80%"
      class="dialo_scroll"
      top="50px"
      :visible.sync="preview.isVisible"
      v-el-drag-dialog
    >
      <el-scrollbar>
        <div v-html="preview.context"></div>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
  // import Edit from "./afterEdit";
  import orgApi from '@/api/Org.js'
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import afterPerInforApi from "@/api/afterPerInfor.js";
  import { initQueryParams,downloadFile ,getDictsKey,assignment} from '@/utils/commons';
  import Pagination from "@/components/Pagination";
  import stationApi from "@/api/Station.js";
  import elDragDialog from '@/directive/el-drag-dialog';
  export default {
    name: "summaryAgo.vue",
    components:{Pagination,Treeselect},
    directives: { elDragDialog },
    filters:{
      isAbnormalFilter(val){
        if (val == null || val == undefined){
          return ''
        }else if(val == false){
          return '否'
        }else if (val == true) {
          return '是'
        }
      }
    },
    data(){
      return{
        tableKey: 0,
        loading: false,
        tableData: {
          total: 0
        },
        orgList:[],
        isAbnormalList:[
          {value:false,label:'否'},
          {value:true,label:'是'},
        ],
        queryParams:initQueryParams({
          model:{
            "accountingTestTaskId": this.$route.query.id,
            "company": {
              "data": "",
              "key": ''
            },
            "departMent": {
              "data": "",
              "key": ''
            },
            personnelType:{
              key:''
            },
            checkType:{
              key:'',
              data:''
            },
            isAbnormal:{
              key:''
            },
            "isDelete": true,
            "post": {
              "data": "",
              "key": ''
            },
            "sex": {
              "code": "",
              "desc": ""
            },
            "status": true,
            filed:null,
          }
        }),
        genderData:[
          {code:'M',label:'男'},
          {code:'W',label:'女'},
        ],
        seniorSearch:{
          icon:'el-icon-search',
          text:'高级搜索'
        },
        seniorType:false,
        stationList:[],
        dialog: {
          isVisible: false,
          type: "add"
        },
        preview: {
          isVisible: false,
          context: ''
        },
        dicts:{
          PERSONNEL_TYPE:{},
          CHECK_TYPE:{}
        }
      }
    },
    mounted() {
      this.initOrg();
      this.search();
      console.log(this.$route.query.type)
      getDictsKey(
        ["PERSONNEL_TYPE",'CHECK_TYPE'],
        this.dicts
      );
    },
    computed: {
      user() {
        return this.$store.state.account.user;
      },
    },
    methods:{
      search(){
        this.fetch();
      },
      // 高级搜索
      seniorChange(){
        if (this.seniorType){
          this.seniorType = false;
          this.seniorSearch = {
            icon:'el-icon-search',
            text:'高级搜索'
          }
        }else {
          this.seniorType = true;
          this.seniorSearch = {
            icon:'el-icon-circle-close',
            text:'关闭'
          }
        }
      },
      fetch(){
        let queryParam = this.disposeData();
        afterPerInforApi.afterPage(queryParam).then(response =>{
          let res = response.data;
          this.tableData = res.data;
        })
      },
      // 监听部门单位数据变化
      orgFiled(val){
        let data = "";
        data = assignment(
          this.getNode(
            this.orgList,
            "children",
            this.queryParams.model.filed
          ),
          val
        );
        this.queryParams.model.company.key = val ? data[0] : null;
        this.queryParams.model.departMent.key = val ? data[1] : null;
        this.queryParams.model.post.key = '';
        if (val){
          stationApi.findStaByIds(data[1]?data[1]:data[0]?data[0]:'').then(response => {
            const res = response.data;
            this.stationList = res.data;
          });
        }else {
          this.stationList = [];
        }
      },
      initOrg() {
        orgApi.allTree({status: true})
          .then((response) => {
            const res = response.data
            this.orgList = res.data
          })
      },
      editClose() {
        this.dialog.isVisible = false;
      },
      editSuccess() {
        this.search();
      },
      reset(){
        this.queryParams.model={
          "accountingTestTaskId": this.$route.query.id,
          "company": {
            "data": "",
            "key": ''
          },
          "departMent": {
            "data": "",
            "key": ''
          },
          personnelType:{
            key:''
          },
          checkType:{
            key:'',
            data:''
          },
          isAbnormal:{
            key:''
          },
          "isDelete": true,
          "post": {
            "data": "",
            "key": ''
          },
          "sex": {
            "code": "",
            "desc": ""
          },
          "status": true,
          filed:[],
        }
        this.stationList = [];
        this.search();
      },
      edit(row){
        // this.dialog.type = "edit";
        // this.dialog.isVisible = true;
        // this.$refs.edit.setUser(row,this.orgList,this.user.orgId,this.dicts);
      },
      // add(){
      //   this.dialog.type = "add";
      //   this.dialog.isVisible = true;
      //   this.$refs.edit.setUser(false,this.orgList,this.user.orgId,this.dicts);
      // },
      disposeData(){
        let data = JSON.parse(JSON.stringify(this.queryParams));
        delete data.model.filed;
        if (!data.model.company.key) delete data.model.company;
        if (!data.model.departMent.key) delete data.model.departMent;
        if (!data.model.personnelType.key) delete data.model.personnelType;
        if (!data.model.post.key) delete data.model.post;
        if (!data.model.isAbnormal.key) delete data.model.isAbnormal;
        if (!data.model.checkType.key) delete data.model.checkType;
        if (!data.model.sex.code) delete data.model.sex;
        return data;
      },
      // 导出excel
      exportExcel(){
        if (this.queryParams.timeRange) {
          this.queryParams.map.createTime_st = this.queryParams.timeRange[0];
          this.queryParams.map.createTime_ed = this.queryParams.timeRange[1];
        }
        let queryParam = this.disposeData();
        queryParam.map.fileName = '检测后人员信息汇总'
        afterPerInforApi.export(queryParam).then(response => {
          downloadFile(response);
        });
      },
      // 导出预览
      exportPreviewExcel(){
        if (this.queryParams.timeRange) {
          this.queryParams.map.createTime_st = this.queryParams.timeRange[0];
          this.queryParams.map.createTime_ed = this.queryParams.timeRange[1];
        }
        let queryParam = this.disposeData();
        queryParam.map.fileName = '检测后人员信息汇总预览'
        afterPerInforApi.preview(queryParam).then(response => {
          const res = response.data;
          this.preview.isVisible = true;
          this.preview.context = res.data;
        });
      },
      // 新增表格
      addExcel(){

      },
      // 更新表格
      updateExcel(){

      },
      // 数据更新
      update(row,val){
        let list = JSON.parse(JSON.stringify(row))
        list.company.data = {};
        list.departMent.data = {};
        list.post.data = {};
        afterPerInforApi.afterUpdatePersonnel(list).then((response) => {
          const res = response.data;
          if (res.isSuccess) {
            this.isVisible = false;
            this.$message({
              message: this.$t("tips.updateSuccess"),
              type: "success",
            });
            this.$emit("success");
          }else {
            this.search();
          }
        });

      },
      // 模板下载
      stencilExcel(){
        let queryParam = this.disposeData();
        queryParam.map.fileName = '检测后人员信息汇总模板'
        queryParam.page = 0;
        queryParam.size = 0;
        afterPerInforApi.export(queryParam).then(response => {
          downloadFile(response);
        });
      },
      // 返回上一个页面
      returnPage() {
        this.$router.go(-1)
      },
      loadListOptions({callback}) {
        callback();
      },
      normalizer(node){
        if(node.children == null){
          delete node.children;
        }
        return node;
      },
      // list 要遍历的数组对象
      // children 子节点名字
      // value 对比的值
      getNode(list, children, val) {
        list.forEach((item) => {
          if (item.id == val) {
            this.treePath = item.treePath;
            return item.treePath;
          }
          if (item[children] && item[children].length > 0) {
            this.getNode(item[children], children, val);
          }
        });
        return this.treePath;
      },
    }
  }
</script>

<style lang="scss" scoped>
  .testTable {
  >>> .el-input__inner{
    text-align: center !important;
    padding: 0px 5px !important;
  }
  >>> .el-form-item{
    margin-bottom: 0px;
  }
  }
</style>
