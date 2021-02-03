<template>
  <div>
    <div v-show="this.user.code != 'SECONDARY_USER'">
      <el-select
        :multiple="false"
        clearable
        class="filter-item search-item"
        placeholder="请选择单位"
        v-model="queryParams.compan"
      >
        <el-option
          :key="item.id"
          :label="item.label"
          :value="item.id"
          v-for="item in unitList"
        />
      </el-select>
      <el-button @click="search" class="filter-item" plain type="primary">
        {{ $t("table.search") }}
      </el-button>
      <el-button @click="reset" class="filter-item" plain type="warning">
        {{ $t("table.reset") }}
      </el-button>
      <el-button type="info" plain @click="returnPage" class="filter-item">返回</el-button>
    </div>
    <el-table
      :data="tableData"
      :key="tableKey"
      border fit row-key="id"
      ref="table"
      style="width: 100%;margin-top: 10px"
      v-loading="loading"
    >
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="80">
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
        prop="total"
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
          prop="sjsubtotal"
        >
        </el-table-column>
        <el-table-column
          label="再唐人员"
          :show-overflow-tooltip="true"
          align="center"
          prop="sjzt"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.sjzt }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="在编人员"
          :show-overflow-tooltip="true"
          align="center"
          prop="sjzb"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.sjzb?scope.row.sjzb:'' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="辅警"
          :show-overflow-tooltip="true"
          align="center"
          prop="sjfj"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.sjfj }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="临时人员"
          :show-overflow-tooltip="true"
          align="center"
          prop="sjls"
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
          prop="dwsubtotal"
        >
        </el-table-column>
        <el-table-column
          label="再唐人员"
          :show-overflow-tooltip="true"
          align="center"
          prop="dwzt"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.dwzt }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="在编人员"
          :show-overflow-tooltip="true"
          align="center"
          prop="dwzb"
        >
        </el-table-column>
        <el-table-column
          label="辅警"
          :show-overflow-tooltip="true"
          align="center"
          prop="dwfj"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.dwfj }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="临时人员"
          :show-overflow-tooltip="true"
          align="center"
          prop="dwls"
        >
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import stationApi from "@/api/Station.js";
  import afterPerInforApi from "@/api/afterPerInfor.js";
  export default {
    name: "statisticalAfter.vue",
    data(){
      return{
        tableKey: 0,
        loading: false,
        tableData: [],
        queryParams:{
          accountingTestTaskId: this.$route.query.id,
          sj:'105',
          dw:'106',
          isMove:true,
          sjzt:'101',
          sjzb:'102',
          sjfj:'103',
          sjls:'104',
        },
        unitList:[],
      }
    },
    mounted() {
      this.search();
      this.findCompany();
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
        let data = JSON.parse(JSON.stringify(this.queryParams));
        data.orgId = this.user.orgId;
        afterPerInforApi.afterStatisticalPage(data).then(response =>{
          let res = response.data;
          this.tableData = res.data;
        })
      },
      findCompany(){
        stationApi.findCompany().then(response =>{
          let res = response.data;
          if (res.data && res.data.length){
            this.unitList = res.data;
          }
        })
      },
      reset(){
        this.queryParams={
          accountingTestTaskId: this.$route.query.id,
          sj:'105',
          isMove:true,
          dw:'106',
          sjzt:'101',
          sjzb:'102',
          sjfj:'103',
          sjls:'104',
        }
        this.fetch();
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
