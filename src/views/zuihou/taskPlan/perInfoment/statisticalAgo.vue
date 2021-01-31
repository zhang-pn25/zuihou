<template>
  <div>
    <el-input placeholder='请输入序号' class="filter-item search-item" v-model="queryParams.model.serialNumber"/>
    <el-input placeholder='请选择单位' class="filter-item search-item" v-model="queryParams.model.serialNumber"/>
    <el-button @click="search" class="filter-item" plain type="primary">
      {{ $t("table.search") }}
    </el-button>
    <el-button @click="reset" class="filter-item" plain type="warning">
      {{ $t("table.reset") }}
    </el-button>
    <el-button @click="add" class="filter-item" plain type="danger" v-has-permission="['user:add']">
      导出
    </el-button>
    <el-button type="info" plain @click="returnPage" class="filter-item">返回</el-button>
<!--    <el-button type="primary" plain class="filter-item" icon="el-icon-search">高级搜索</el-button>-->
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
        label="合计"
        align="center"
        width="120"
        prop="heji"
      >
      </el-table-column>



      <el-table-column
        label="参与市局统一组织的核酸检测人员"
        align="center"
      >
        <el-table-column
          label="小计"
          :show-overflow-tooltip="true"
          align="center"
          prop="post"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.post.data?scope.row.post.data:'' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="再唐人员"
          :show-overflow-tooltip="true"
          align="center"
          prop="userName"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.userName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="在编人员"
          :show-overflow-tooltip="true"
          align="center"
          prop="sex"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.sex.desc?scope.row.sex.desc:'' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="辅警"
          :show-overflow-tooltip="true"
          align="center"
          prop="dateOfBirth"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.dateOfBirth }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="临时人员"
          :show-overflow-tooltip="true"
          align="center"
          prop="personnelType"
        >
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="单位自行组织的核酸检测人员"
        align="center"
      >
        <el-table-column
          label="小计"
          :show-overflow-tooltip="true"
          align="center"
          prop="post"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.postCopy.data?scope.row.postCopy.data:'' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="再唐人员"
          :show-overflow-tooltip="true"
          align="center"
          prop="userName"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.userNameCopy }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="在编人员"
          :show-overflow-tooltip="true"
          align="center"
          prop="sex"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.sexCopy.desc?scope.row.sexCopy.desc:'' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="辅警"
          :show-overflow-tooltip="true"
          align="center"
          prop="dateOfBirth"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.dateOfBirthCopy }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="临时人员"
          :show-overflow-tooltip="true"
          align="center"
          prop="personnelTypeCopy"
        >
        </el-table-column>
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
<!--            style="color: #2db7f5;"-->
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
          {
            "serialNumber": 10026,
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
            heji:'12',
            "post": {
              "data": "2",
              "key": 0
            },
            "postCopy": {
              "data": "2",
              "key": 0
            },
            "userName": "李超",
            "userNameCopy": "李超",
            "sex": {
              "code": "0",
              "desc": "0"
            },
            "sexCopy": {
              "code": "0",
              "desc": "1"
            },
            "dateOfBirth": "5",
            "dateOfBirthCopy": "6",
            "personnelType": "5",
            "personnelTypeCopy": "7",
            },
          {
            "serialNumber": 10027,
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
            heji:'11',
            "post": {
              "data": "2",
              "key": 0
            },
            "postCopy": {
              "data": "3",
              "key": 0
            },
            "userName": "李超",
            "userNameCopy": "李超",
            "sex": {
              "code": "W",
              "desc": "4"
            },
            "sexCopy": {
              "code": "W",
              "desc": "3"
            },
            "dateOfBirth": "7",
            "dateOfBirthCopy": "5",
            "personnelType": "3",
            "personnelTypeCopy": "7",
          },
          {
            "serialNumber": 10028,
            "company": {
              "data": {
                "abbreviation": "",
                "createTime": "",
                "createUser": 0,
                "describe": "",
                "id": 0,
                "label": "河西区警署分队",
                "parentId": 0,
                "sortValue": 0,
                "status": true,
                "treePath": "",
                "updateTime": "",
                "updateUser": 0
              },
              "key": 0
            },
            heji:'10',
            "post": {
              "data": "0",
              "key": 0
            },
            "postCopy": {
              "data": "2",
              "key": 0
            },
            "userName": "李超",
            "userNameCopy": "李超",
            "sex": {
              "code": "W",
              "desc": "7"
            },
            "sexCopy": {
              "code": "W",
              "desc": "5"
            },
            "dateOfBirth": "7",
            "dateOfBirthCopy": "1",
            "personnelType": "5",
            "personnelTypeCopy": "7",
          },
          {
            "serialNumber": 10029,
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
            heji:'9',
            "post": {
              "data": "0",
              "key": 0
            },
            "postCopy": {
              "data": "6",
              "key": 0
            },
            "userName": "李超",
            "userNameCopy": "李超",
            "sex": {
              "code": "W",
              "desc": "1"
            },
            "sexCopy": {
              "code": "W",
              "desc": "8"
            },
            "dateOfBirth": "4",
            "dateOfBirthCopy": "5",
            "personnelType": "2",
            "personnelTypeCopy": "5",
          },
          {
            "serialNumber": 10030,
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
            heji:'15',
            "post": {
              "data": "4",
              "key": 0
            },
            "postCopy": {
              "data": "5",
              "key": 0
            },
            "userName": "李超",
            "userNameCopy": "李超",
            "sex": {
              "code": "W",
              "desc": "3"
            },
            "sexCopy": {
              "code": "W",
              "desc": "0"
            },
            "dateOfBirth": "5",
            "dateOfBirthCopy": "4",
            "personnelType": "1",
            "personnelTypeCopy": "7",
          },
          {
            "serialNumber": 10031,
            "company": {
              "data": {
                "abbreviation": "",
                "createTime": "",
                "createUser": 0,
                "describe": "",
                "id": 0,
                "label": "河东区警署分队",
                "parentId": 0,
                "sortValue": 0,
                "status": true,
                "treePath": "",
                "updateTime": "",
                "updateUser": 0
              },
              "key": 0
            },
            heji:'16',
            "post": {
              "data": "4",
              "key": 0
            },
            "postCopy": {
              "data": "1",
              "key": 0
            },
            "userName": "李超",
            "userNameCopy": "李超",
            "sex": {
              "code": "W",
              "desc": "1"
            },
            "sexCopy": {
              "code": "W",
              "desc": "4"
            },
            "dateOfBirth": "7",
            "dateOfBirthCopy": "5",
            "personnelType": "1",
            "personnelTypeCopy": "6",
          },

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
