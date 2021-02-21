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
        label="序号"
        align="center"
        width="70"
      >
        <template slot-scope="scope">
          <span>{{scope.row.seriNumber == '总计'? '总计': scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="单位"
        :show-overflow-tooltip="true"
        align="center"
        width="150"
        prop="company"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.company?scope.row.company.data.label:'' }}</span>
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
            <span>{{ scope.row.sjzb}}</span>
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
    computed: {
      user() {
        return this.$store.state.account.user;
      },
    },
    methods:{
      search(){
        this.fetch();
      },
      setData(val){
        if(val){
          this.reset();
          this.findCompany();
        }
      },
      fetch(){
        let data = JSON.parse(JSON.stringify(this.queryParams));
        data.orgId = this.user.orgId;
        data.roleCode = this.user.code,
        afterPerInforApi.afterStatisticalPage(data).then(response =>{
          let res = response.data;
          let obj ={
            dwfj:0,
            dwls:0,
            dwsubtotal:0,
            dwzb:0,
            dwzt:0,
            sjfj:0,
            sjls:0,
            sjsubtotal:0,
            sjzb:0,
            sjzt:0,
            total:0,
            seriNumber:'总计',
          }
          for (let item of res.data){
            obj.dwfj = Number(item.dwfj)  + Number(obj.dwfj);
            obj.dwls = Number(item.dwls) + Number(obj.dwls);
            obj.dwsubtotal = Number(item.dwsubtotal) + Number(obj.dwsubtotal);
            obj.dwzb = Number(item.dwzb) + Number(obj.dwzb);
            obj.dwzt = Number(item.dwzt) + Number(obj.dwzt);
            obj.sjfj = Number(item.sjfj) + Number(obj.sjfj);
            obj.sjls = Number(item.sjls) + Number(obj.sjls);
            obj.sjsubtotal = Number(item.sjsubtotal) + Number(obj.sjsubtotal);
            obj.sjzb = Number(item.sjzb) + Number(obj.sjzb);
            obj.sjzt = Number(item.sjzt) + Number(obj.sjzt);
            obj.total = Number(item.total) + Number(obj.total);
          }
          res.data.push(obj);
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
