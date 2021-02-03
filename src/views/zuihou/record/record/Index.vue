<template>
  <div class="app-container">
    <div class="filter-container">
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
    <el-input placeholder='请输入姓名' class="filter-item search-item" v-model="queryParams.model.userName"/>
    <el-button @click="search" class="filter-item" plain type="primary">
      {{ $t("table.search") }}
    </el-button>
    <el-button @click="reset" class="filter-item" plain type="warning">
      {{ $t("table.reset") }}
    </el-button>
    <el-button type="info" plain @click="returnPage" class="filter-item">返回</el-button>
    <el-dropdown class="filter-item" trigger="click"
                 v-has-any-permission="[
            'user:export',
            'user:import',
          ]">
      <el-button>
        {{ $t("table.more") }}
        <i class="el-icon-arrow-down el-icon--right"/>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="exportExcel" v-has-permission="['user:export']">
          导出
        </el-dropdown-item>
        <el-dropdown-item @click.native="exportPreviewExcel" v-has-permission="['user:import']">
          导出预览
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-table
      :data="tableData.records"
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
        label="检测时间"
        :show-overflow-tooltip="true"
        align="center"
        width="120"
        prop="checkTime"
      >
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
        label="检测结果"
        :show-overflow-tooltip="true"
        align="center"
        width="120"
        prop="checkResult"
      >
      </el-table-column>
      <el-table-column
        label="是否异常"
        :show-overflow-tooltip="true"
        align="center"
        width="120"
        prop="isAbnormal"
      >
        <template slot-scope="{row}">
          <span>
            {{ row.isAbnormal | isAbnormalFilter }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="未检测原因"
        :show-overflow-tooltip="true"
        align="center"
        width="120"
        prop="notDetectedReason"
      >
      </el-table-column>
      <el-table-column
        label="结果证明"
        :show-overflow-tooltip="true"
        align="center"
        width="120"
        prop="checkResultProve"
      >
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
    </el-table>
    <pagination
      :limit.sync="queryParams.size"
      :page.sync="queryParams.current"
      :total="(Number(tableData.total))"
      @pagination="fetch"
      v-show="tableData.total > 0"
    />
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
  </div>
</template>

<script>
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import orgApi from '@/api/Org.js'
  import afterPerInforApi from "@/api/afterPerInfor.js";
  import { initQueryParams,downloadFile ,getDictsKey,assignment} from '@/utils/commons';
  import Pagination from "@/components/Pagination";
  import elDragDialog from '@/directive/el-drag-dialog';
  export default {
    name: "summaryRecord.vue",
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
            "isDelete": true,
            "status": true,
            filed:null,
          }
        }),
        genderData:[
          {code:'M',label:'男'},
          {code:'W',label:'女'},
        ],
        seniorHidden:false,
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
    watch:{
      'queryParams.model.filed':'orgFiled'
    },
    methods:{
      search(){
        this.fetch();
      },
      // 高级搜索
      seniorSearch(){
        if (this.seniorHidden) this.seniorHidden = false;
        else this.seniorHidden = true;
      },
      fetch(){
        let queryParam = this.disposeData();
        afterPerInforApi.allPage(queryParam).then(response =>{
          let res = response.data;
          this.tableData = res.data;
        })
      },
      // 监听部门单位数据变化
      orgFiled(val){
        this.queryParams.model.company.key = val.length>0?val[0]:'';
        this.queryParams.model.departMent.key = val.length>0?val[1]:'';
        let data = "";
        data = assignment(
          this.getNode(
            this.orgList,
            "children",
            this.queryParams.model.filed
          ),
          val
        );
        console.log(data);
        this.queryParams.model.company.key = val ? data[0] : null;
        this.queryParams.model.departMent.key = val ? data[1] : null;
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
          "isDelete": true,
          "status": true,
          filed:[],
        }
        this.search();
      },
      edit(row){
        this.dialog.type = "edit";
        this.dialog.isVisible = true;
        this.$refs.edit.setUser(row,this.orgList,this.user.orgId,this.dicts);
      },
      add(){
        this.dialog.type = "add";
        this.dialog.isVisible = true;
        this.$refs.edit.setUser(false,this.orgList,this.user.orgId,this.dicts);
      },
      disposeData(){
        let data = JSON.parse(JSON.stringify(this.queryParams));
        delete data.model.filed;
        if (!data.model.company.key) delete data.model.company;
        if (!data.model.departMent.key) delete data.model.departMent;
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

<style scoped>

</style>
