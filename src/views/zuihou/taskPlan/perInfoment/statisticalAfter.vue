<template>
  <div>
    <el-input placeholder='请选择单位' class="filter-item search-item" v-model="queryParams.model.serialNumber"/>
    <el-input placeholder='请选择部门' class="filter-item search-item" v-model="queryParams.model.serialNumber"/>
    <el-input placeholder='请选择职务' class="filter-item search-item" v-model="queryParams.model.serialNumber"/>
    <el-input placeholder='请选择姓名' class="filter-item search-item" v-model="queryParams.model.serialNumber"/>
    <el-button @click="search" class="filter-item" plain type="primary">
      {{ $t("table.search") }}
    </el-button>
    <el-button @click="reset" class="filter-item" plain type="warning">
      {{ $t("table.reset") }}
    </el-button>
    <el-button @click="add" class="filter-item" plain type="danger" v-has-permission="['user:add']">
      {{ $t("table.add") }}
    </el-button>
    <el-button type="info" plain @click="returnPage" class="filter-item">返回</el-button>
    <el-dropdown class="filter-item" trigger="click"
                 v-has-any-permission="[
            'user:delete',
            'user:rest',
            'user:export',
            'user:import',
          ]">
      <el-button>
        {{ $t("table.more") }}
        <i class="el-icon-arrow-down el-icon--right"/>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="batchDelete" v-has-permission="['user:delete']">
          导出
        </el-dropdown-item>
        <el-dropdown-item @click.native="exportExcel" v-has-permission="['user:export']">
          新增
        </el-dropdown-item>
        <el-dropdown-item @click.native="exportExcelPreview" v-has-permission="['user:export']">
          更新
        </el-dropdown-item>
        <el-dropdown-item @click.native="importExcel" v-has-permission="['user:import']">
          模板下载
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-button type="primary" plain class="filter-item" icon="el-icon-search">高级搜索</el-button>
    <el-table
      :data="tabList"
      :key="tableKey"
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
          <span>{{ scope.row.company.data?scope.row.company.data.label:'' }}</span>
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
          <span>{{ scope.row.departMent.data?scope.row.departMent.data.label:'' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="职务"
        :show-overflow-tooltip="true"
        align="center"
        width="80"
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
      </el-table-column>
      <el-table-column
        label="备注"
        :show-overflow-tooltip="true"
        align="center"
        width="200"
        prop="remarks"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        column-key="operation"
        align="center"
        class-name="small-padding fixed-width"
        width="100px"
      >
        <template slot-scope="{ row }">
          <i
            @click="edit(row)"
            class="el-icon-edit table-operation"
            style="color: #2db7f5;"
            title="修改"
            v-hasPermission="['role:update']"
          />
          <el-link class="no-perm" v-has-no-permission="['loginLog:delete']">{{
            $t("tips.noPermission")
            }}
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :limit.sync="queryParams.size"
      :page.sync="queryParams.current"
      :total="6"
      @pagination="fetch"
      v-show="tableData.total > 0"
    />
    <edit
      :dialog-visible="dialog.isVisible"
      :type="dialog.type"
      @close="editClose"
      @success="editSuccess"
      ref="edit"
    />
  </div>
</template>

<script>
  import Edit from "./agoEdit";
  import orgApi from '@/api/Org.js'
  import perInforApi from "@/api/perInfor.js";
  import { initQueryParams } from '@/utils/commons';
  import Pagination from "@/components/Pagination";
  export default {
    name: "summaryAgo.vue",
    components:{Edit,Pagination},
    data(){
      return{
        tableKey: 0,
        loading: false,
        tableData: {
          total: 0
        },
        orgList:[],
        queryParams:initQueryParams({

        }),
        tabList:[
          {"accountingTestTaskId": 0,
            "beforeCompany": "",
            "checkAddress": "天津市河西区",
            "checkType": "鼻拭子",
            "company": {
              "data": {
                "abbreviation": "",
                "createTime": "",
                "createUser": 0,
                "describe": "",
                "id": 0,
                "label": "河西区警署大队",
                "parentId": 0,
                "sortValue": 0,
                "status": true,
                "treePath": "",
                "updateTime": "",
                "updateUser": 0
              },
              "key": 0
            },
            "dateOfBirth": "19840306",
            "departMent": {
              "data": {
                "abbreviation": "",
                "createTime": "",
                "createUser": 0,
                "describe": "",
                "id": 0,
                "label": "河西分区",
                "parentId": 0,
                "sortValue": 0,
                "status": true,
                "treePath": "",
                "updateTime": "",
                "updateUser": 0
              },
              "key": 0
            },
            "homeAddress": "河西区四信公寓",
            "idNumber": "412726198403060562",
            "image": "",
            "inoculateType": "初次疫苗",
            "isDelete": true,
            "marriage": true,
            "orgId": "",
            "personalSignature": "李超",
            "personnelStatus": "无异状",
            "personnelType": "技术人员",
            "phone": "13592251259",
            "post": {
              "data": "UI设计师",
              "key": 0
            },
            "reason": "",
            "remarks": "",
            "secondmentType": "无",
            "serialNumber": 10026,
            "sex": {
              "code": "W",
              "desc": "男"
            },
            "specimenNumber": 0,
            "status": true,
            "userName": "李超"},
          {"accountingTestTaskId": 0,
            "beforeCompany": "",
            "checkAddress": "天津市河东区",
            "checkType": "咽拭子",
            "company": {
              "data": {
                "abbreviation": "",
                "createTime": "",
                "createUser": 0,
                "describe": "",
                "id": 0,
                "label": "河东区警署大队",
                "parentId": 0,
                "sortValue": 0,
                "status": true,
                "treePath": "",
                "updateTime": "",
                "updateUser": 0
              },
              "key": 0
            },
            "dateOfBirth": "19740514",
            "departMent": {
              "data": {
                "abbreviation": "",
                "createTime": "",
                "createUser": 0,
                "describe": "",
                "id": 0,
                "label": "河东分区",
                "parentId": 0,
                "sortValue": 0,
                "status": true,
                "treePath": "",
                "updateTime": "",
                "updateUser": 0
              },
              "key": 0
            },
            "homeAddress": "河西东区张亮麻辣烫",
            "idNumber": "412726198403060562",
            "image": "",
            "inoculateType": "无疫苗",
            "isDelete": true,
            "marriage": true,
            "orgId": "",
            "personalSignature": "王迪",
            "personnelStatus": "无异状",
            "personnelType": "幼儿教师",
            "phone": "15912567845",
            "post": {
              "data": "幼儿教师",
              "key": 0
            },
            "reason": "",
            "remarks": "",
            "secondmentType": "无",
            "serialNumber": 10027,
            "sex": {
              "code": "W",
              "desc": "男"
            },
            "specimenNumber": 123666,
            "status": true,
            "userName": "李超"},
          {"accountingTestTaskId": 0,
            "beforeCompany": "",
            "checkAddress": "天津市滨海新区",
            "checkType": "鼻拭子",
            "company": {
              "data": {
                "abbreviation": "",
                "createTime": "",
                "createUser": 0,
                "describe": "",
                "id": 0,
                "label": "滨海新区警署大队",
                "parentId": 0,
                "sortValue": 0,
                "status": true,
                "treePath": "",
                "updateTime": "",
                "updateUser": 0
              },
              "key": 0
            },
            "dateOfBirth": "19981103",
            "departMent": {
              "data": {
                "abbreviation": "",
                "createTime": "",
                "createUser": 0,
                "describe": "",
                "id": 0,
                "label": "滨海新区分区",
                "parentId": 0,
                "sortValue": 0,
                "status": true,
                "treePath": "",
                "updateTime": "",
                "updateUser": 0
              },
              "key": 0
            },
            "homeAddress": "滨海新区宜家公寓",
            "idNumber": "412726199811030562",
            "image": "",
            "inoculateType": "无疫苗",
            "isDelete": true,
            "marriage": true,
            "orgId": "",
            "personalSignature": "张东",
            "personnelStatus": "无异状",
            "personnelType": "医护人员",
            "phone": "13592251259",
            "post": {
              "data": "主任",
              "key": 0
            },
            "reason": "",
            "remarks": "",
            "secondmentType": "无",
            "serialNumber": 10026,
            "sex": {
              "code": "W",
              "desc": "男"
            },
            "specimenNumber": 0,
            "status": true,
            "userName": "张东"},
          {"accountingTestTaskId": 0,
            "beforeCompany": "",
            "checkAddress": "天津市南开区",
            "checkType": "鼻拭子",
            "company": {
              "data": {
                "abbreviation": "",
                "createTime": "",
                "createUser": 0,
                "describe": "",
                "id": 0,
                "label": "南开区警署大队",
                "parentId": 0,
                "sortValue": 0,
                "status": true,
                "treePath": "",
                "updateTime": "",
                "updateUser": 0
              },
              "key": 0
            },
            "dateOfBirth": "19971013",
            "departMent": {
              "data": {
                "abbreviation": "",
                "createTime": "",
                "createUser": 0,
                "describe": "",
                "id": 0,
                "label": "南开区分区",
                "parentId": 0,
                "sortValue": 0,
                "status": true,
                "treePath": "",
                "updateTime": "",
                "updateUser": 0
              },
              "key": 0
            },
            "homeAddress": "南开区天方小区",
            "idNumber": "412726199811030562",
            "image": "",
            "inoculateType": "无疫苗",
            "isDelete": true,
            "marriage": true,
            "orgId": "",
            "personalSignature": "张冬冬",
            "personnelStatus": "无异状",
            "personnelType": "医护人员",
            "phone": "13592251259",
            "post": {
              "data": "护士",
              "key": 0
            },
            "reason": "",
            "remarks": "",
            "secondmentType": "无",
            "serialNumber": 10029,
            "sex": {
              "code": "W",
              "desc": "女"
            },
            "specimenNumber": 0,
            "status": true,
            "userName": "张冬冬"},
          {"accountingTestTaskId": 0,
            "beforeCompany": "",
            "checkAddress": "天津市河东区",
            "checkType": "咽拭子",
            "company": {
              "data": {
                "abbreviation": "",
                "createTime": "",
                "createUser": 0,
                "describe": "",
                "id": 0,
                "label": "河东区警署大队",
                "parentId": 0,
                "sortValue": 0,
                "status": true,
                "treePath": "",
                "updateTime": "",
                "updateUser": 0
              },
              "key": 0
            },
            "dateOfBirth": "19740514",
            "departMent": {
              "data": {
                "abbreviation": "",
                "createTime": "",
                "createUser": 0,
                "describe": "",
                "id": 0,
                "label": "河东分区",
                "parentId": 0,
                "sortValue": 0,
                "status": true,
                "treePath": "",
                "updateTime": "",
                "updateUser": 0
              },
              "key": 0
            },
            "homeAddress": "河西东区张亮麻辣烫",
            "idNumber": "412726198403060562",
            "image": "",
            "inoculateType": "无疫苗",
            "isDelete": true,
            "marriage": true,
            "orgId": "",
            "personalSignature": "王迪",
            "personnelStatus": "无异状",
            "personnelType": "幼儿教师",
            "phone": "15912567845",
            "post": {
              "data": "幼儿教师",
              "key": 0
            },
            "reason": "",
            "remarks": "",
            "secondmentType": "无",
            "serialNumber": 10027,
            "sex": {
              "code": "W",
              "desc": "男"
            },
            "specimenNumber": 123666,
            "status": true,
            "userName": "李超"},
          {"accountingTestTaskId": 0,
            "beforeCompany": "",
            "checkAddress": "天津市南开区",
            "checkType": "鼻拭子",
            "company": {
              "data": {
                "abbreviation": "",
                "createTime": "",
                "createUser": 0,
                "describe": "",
                "id": 0,
                "label": "南开区警署大队",
                "parentId": 0,
                "sortValue": 0,
                "status": true,
                "treePath": "",
                "updateTime": "",
                "updateUser": 0
              },
              "key": 0
            },
            "dateOfBirth": "19971013",
            "departMent": {
              "data": {
                "abbreviation": "",
                "createTime": "",
                "createUser": 0,
                "describe": "",
                "id": 0,
                "label": "南开区分区",
                "parentId": 0,
                "sortValue": 0,
                "status": true,
                "treePath": "",
                "updateTime": "",
                "updateUser": 0
              },
              "key": 0
            },
            "homeAddress": "南开区天方小区",
            "idNumber": "412726199811030562",
            "image": "",
            "inoculateType": "无疫苗",
            "isDelete": true,
            "marriage": true,
            "orgId": "",
            "personalSignature": "张冬冬",
            "personnelStatus": "无异状",
            "personnelType": "医护人员",
            "phone": "13592251259",
            "post": {
              "data": "护士",
              "key": 0
            },
            "reason": "",
            "remarks": "",
            "secondmentType": "无",
            "serialNumber": 10029,
            "sex": {
              "code": "W",
              "desc": "女"
            },
            "specimenNumber": 0,
            "status": true,
            "userName": "张冬冬"},
        ],
        dialog: {
          isVisible: false,
          type: "add"
        },
      }
    },
    mounted() {
      this.initOrg();
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
      fetch(){
        perInforApi.beforPage(this.queryParams).then(response =>{
          let res = response.data;
          console.log(res.data)
          this.tableData = res.data;
        })
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

      },
      edit(row){
        this.dialog.type = "edit";
        this.dialog.isVisible = true;
        this.$refs.edit.setUser(row,this.orgList,this.user.orgId);
      },
      add(){
        this.dialog.type = "add";
        this.dialog.isVisible = true;
        this.$refs.edit.setUser(false,this.orgList,this.user.orgId);
      },
      batchDelete(){

      },
      exportExcel(){

      },
      exportExcelPreview(){

      },
      importExcel(){

      },
      // 返回上一个页面
      returnPage() {
        this.$router.go(-1)
      },
    }
  }
</script>

<style scoped>

</style>
