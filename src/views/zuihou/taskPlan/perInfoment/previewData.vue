<template>
  <el-dialog
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    :title="title"
    :visible.sync="isVisible"
    :width="width"
    top="50px"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
    >
    <el-table
      :data="form.tableData"
      style="width: 100%;margin-top: 10px;"
      height="600"
      :key="tableKey"
      border fit row-key="id"
      ref="table"
      class="testTable"
      v-loading="loading"
    >
      <el-table-column
        label="错误信息"
        align="center"
        prop="reason"
        :show-overflow-tooltip="true"
        width="180"
      >
        <template slot-scope="scope">
            <span>{{scope.row.reason?scope.row.reason:'无'}}</span>
        </template>
      </el-table-column>
<!--      <el-table-column-->
<!--        label="序号"-->
<!--        align="center"-->
<!--        prop="serialNumber"-->
<!--        width="80"-->
<!--      >-->
<!--        <template slot-scope="scope">-->
<!--          <el-form-item :prop=" 'tableData.' + scope.$index + '.serialNumber' " :rules="rules.serialNumber">-->
<!--            <el-input-->
<!--              placeholder="序号"-->
<!--              v-input-limit='0'-->
<!--              @change="updateRow(scope.row)"-->
<!--              style="width: 100%;text-align: center"-->
<!--              v-model="scope.row.serialNumber"-->
<!--            >-->
<!--            </el-input>-->
<!--          </el-form-item>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column
        label="单位"
        :show-overflow-tooltip="true"
        align="center"
        width="120"
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
        width="180"
        prop="departMent"
      >
        <template slot-scope="scope">
          <el-form-item :prop=" 'tableData.' + scope.$index + '.filed' " :rules="rules.filed">
            <el-cascader
              style="width: 100%"
              :props="{ value: 'id' }"
              :options="orgList"
              :show-all-levels="false"
              @change="orgFiled(scope.row)"
              v-model="scope.row.filed"
            ></el-cascader>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column
        label="职务"
        :show-overflow-tooltip="true"
        align="center"
        width="150"
        prop="post"
      >
        <template slot-scope="scope">
          <el-form-item :prop=" 'tableData.' + scope.$index + '.post.key' " :rules="rules.post">
            <el-select
              style="width: 100%"
              :multiple="false"
              clearable
              @change="updateRow(scope.row)"
              placeholder="职务"
              @focus="getPostList(scope.row)"
              v-model="scope.row.post.key"
            >
              <el-option
                :key="item.id"
                :label="item.name"
                :value="item.id"
                v-for="item in scope.row.stationList"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column
        label="姓名"
        :show-overflow-tooltip="true"
        align="center"
        width="100"
        prop="userName"
      >
        <template slot-scope="scope">
          <el-form-item :prop=" 'tableData.' + scope.$index + '.userName' " :rules="rules.userName">
            <el-input
              @change="updateRow(scope.row)"
              placeholder="姓名"
              style="width: 100%"
              v-model="scope.row.userName"
            >
            </el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column
        label="性别"
        :show-overflow-tooltip="true"
        align="center"
        width="90"
        prop="sex"
      >
        <template slot-scope="scope">
          <el-form-item :prop=" 'tableData.' + scope.$index + '.sex.desc' " :rules="rules.sex">
            <el-select style="width: 100%" @change="updateRow(scope.row)" v-model="scope.row.sex.code" placeholder="性别">
              <el-option
                v-for="item in genderData"
                :key="item.code"
                :label="item.label"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column
        label="出生年月"
        align="center"
        width="150"
        prop="dateOfBirth"
      >
        <template slot-scope="scope">
          <el-form-item :prop=" 'tableData.' + scope.$index + '.dateOfBirth' " :rules="rules.dateOfBirth">
            <el-date-picker
              v-model="scope.row.dateOfBirth"
              @change="updateRow(scope.row)"
              value-format="yyyyMMdd"
              style="width: 100%"
              type="date"
              :clearable="false"
              placeholder="出生年月">
            </el-date-picker>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column
        label="人员类别"
        :show-overflow-tooltip="true"
        align="center"
        width="130"
        prop="personnelType"
      >
        <template slot-scope="scope">
          <el-form-item :prop=" 'tableData.' + scope.$index + '.personnelType.key' " :rules="rules.personnelType">
            <el-select style="width: 100%" @change="updateRow(scope.row)" clearable placeholder="人员类别" v-model="scope.row.personnelType.key" value>
              <el-option :key="index" :label="item.name" :value="item.id" v-for="(item, key, index) in dicts.PERSONNEL_TYPE" />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column
        label="身份证号"
        :show-overflow-tooltip="true"
        align="center"
        width="200"
        prop="idNumber"
      >
        <template slot-scope="scope">
          <el-form-item  :prop=" 'tableData.' + scope.$index + '.idNumber' " :rules="rules.idNumber">
            <el-input
              @change="updateRow(scope.row)"
              placeholder="身份证号"
              style="width: 100%"
              v-model="scope.row.idNumber"
            >
          </el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column
        label="家庭住址"
        :show-overflow-tooltip="true"
        align="center"
        width="200"
        prop="homeAddress"
      >
        <template slot-scope="scope">
          <el-form-item :prop=" 'tableData.' + scope.$index + '.homeAddress' " :rules="rules.homeAddress">
            <el-input
              @change="updateRow(scope.row)"
              placeholder="家庭住址"
              style="width: 100%"
              v-model="scope.row.homeAddress"
            >
            </el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column
        label="婚否"
        :show-overflow-tooltip="true"
        align="center"
        width="80"
        prop="marriage"
      >
        <template slot-scope="{row}">
          <el-select style="width: 100%" @change="updateRow(scope.row)" v-model="row.marriage" placeholder="性别">
            <el-option
              v-for="item in maritalData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="借调类型"
        :show-overflow-tooltip="true"
        align="center"
        width="120"
        prop="secondmentType"
      >
        <template slot-scope="scope">
          <el-input
            @change="updateRow(scope.row)"
            placeholder="借调类型"
            style="width: 100%"
            v-model="scope.row.secondmentType"
          >
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="原单位"
        :show-overflow-tooltip="true"
        align="center"
        width="200"
        prop="beforeCompany"
      >
        <template slot-scope="scope">
          <el-input
            placeholder="原单位"
            style="width: 100%"
            type="textarea"
            :rows="2"
            @change="updateRow(scope.row)"
            v-model="scope.row.beforeCompany"
          >
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="疫苗接种类别"
        :show-overflow-tooltip="true"
        align="center"
        width="120"
        prop="inoculateType"
      >
        <template slot-scope="scope">
          <el-input
            placeholder="疫苗接种类别"
            style="width: 100%"
            @change="updateRow(scope.row)"
            v-model="scope.row.inoculateType"
          >
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="联系电话"
        :show-overflow-tooltip="true"
        align="center"
        width="150"
        prop="phone"
      >
          <template slot-scope="scope">
            <el-form-item :prop=" 'tableData.' + scope.$index + '.phone' " :rules="rules.phone">
              <el-input
                placeholder="联系电话"
                style="width: 100%"
                @change="updateRow(scope.row)"
                v-model="scope.row.phone"
              >
              </el-input>
            </el-form-item>
          </template>
      </el-table-column>
      <el-table-column
        label="标本编号"
        :show-overflow-tooltip="true"
        align="center"
        width="120"
        prop="specimenNumber"
      >
        <template slot-scope="scope">
          <el-input
            @change="updateRow(scope.row)"
            placeholder="标本编号"
            style="width: 100%"
            v-model="scope.row.specimenNumber"
          >
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="人员状态"
        :show-overflow-tooltip="true"
        align="center"
        width="120"
        prop="personnelStatus"
      >
        <template slot-scope="scope">
          <el-input
            @change="updateRow(scope.row)"
            placeholder="人员状态"
            style="width: 100%"
            v-model="scope.row.personnelStatus"
          >
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="检测类型"
        :show-overflow-tooltip="true"
        align="center"
        width="140"
        prop="checkType"
      >
        <template slot-scope="{row}">
          <el-select style="width: 100%" @change="updateRow(scope.row)" clearable placeholder="人员类别" v-model="row.checkType.key" value>
            <el-option :key="index" :label="item.name" :value="item.id" v-for="(item, key, index) in dicts.CHECK_TYPE" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="检测地址"
        :show-overflow-tooltip="true"
        align="center"
        width="200"
        prop="checkAddress"
      >
        <template slot-scope="scope">
          <el-input
            placeholder="检测地址"
            style="width: 100%"
            @change="updateRow(scope.row)"
            type="textarea"
            :rows="2"
            v-model="scope.row.checkAddress"
          >
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="个人签名"
        :show-overflow-tooltip="true"
        align="center"
        width="120"
        prop="personalSignature"
      >
        <template slot-scope="scope">
          <el-input
            placeholder="个人签名"
            @change="updateRow(scope.row)"
            style="width: 100%"
            v-model="scope.row.personalSignature"
          >
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="备注"
        :show-overflow-tooltip="true"
        align="center"
        width="200"
        prop="remarks"
      >
        <template slot-scope="scope">
          <el-input
            placeholder="备注"
            type="textarea"
            @change="updateRow(scope.row)"
            :rows="2"
            style="width: 100%"
            v-model="scope.row.remarks"
          >
          </el-input>
        </template>
      </el-table-column>
    </el-table>
    </el-form>
    <div class="dialog-footer" slot="footer">
      <el-button @click="cancelForm" plain type="warning">{{
        $t("common.cancel")
        }}</el-button>
      <el-button @click="submitForm" plain type="primary">{{
        $t("common.confirm")
        }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import Pagination from "@/components/Pagination";
  import stationApi from "@/api/Station.js";
  import perInforApi from "@/api/perInfor.js";
  import { initQueryParams } from '@/utils/commons';
  export default {
    name: "UserEdit",
    components:{Pagination},
    props: {
      dialogVisible: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        orgList:[],
        genderData:[
          {code:'M',label:'男'},
          {code:'W',label:'女'},
        ],
        queryParams:initQueryParams({
            model:{
              // "accountingTestTaskId": this.$route.query.id,
              "isDelete": true,
              "status": true,
            },
           size:'-1'
        }),
        maritalData:[
          {value:true,label:'是'},
          {value:false,label:'否'},
        ],
        tableKey: 0,
        loading: false,
        form:{
          tableData: [],
        },
        rules: {
          // serialNumber: { required: true,message: '不能为空',trigger: "blur", },
          filed:{ required: true,message: '不能为空',trigger: "change" },
          post:{ required: true,message: '不能为空',trigger: "change"},
          userName:{ required: true,message: '不能为空',trigger: "blur" },
          sex:{ required: true,message: '不能为空',trigger: "change" },
          idNumber:[{ required: true, message: this.$t("rules.require"), trigger: "blur",},
            {
              validator: (rule, value, callback) => {
                let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                if (reg.test(value)) {
                  callback();
                } else {
                  callback('请输入正确的身份证号码');
                }
              },
              trigger: "blur",
            }
          ],
          personnelType:{ required: true,message: '不能为空',trigger: "change" },
          dateOfBirth: { required: true,message: '不能为空',trigger: "change" },
          homeAddress:{ required: true,message: '不能为空',trigger: "blur" }
        },
        dicts:{
          PERSONNEL_TYPE:{},
          CHECK_TYPE:{}
        },
        screenWidth: 0,
        width: this.initWidth(),
      };
    },
    computed: {
      isVisible: {
        get() {
          return this.dialogVisible;
        },
        set() {
          this.close();
          this.reset();
        },
      },
      title() {
        return "预览";
      },
    },
    mounted() {
      window.onresize = () => {
        return (() => {
          this.width = this.initWidth();
        })();
      };
    },
    methods: {
      orgFiled(row){
        row.company.data = row.filed.length>0 ?this.getNode(this.orgList,row.filed[0]):'';
        row.company.key = row.filed.length>0?row.filed[0]:'';
        row.departMent.key = row.filed.length>0?row.filed[1]:'';
        row.post.key = '';
        row.stationList = [];
        this.updateRow(row);
      },
      // 根据部门获取职务
      getPostList(row){
        stationApi.findStaByIds(row.filed[1]?row.filed[1]:row.filed[0]?row.filed[0]:'').then(response => {
          const res = response.data;
          row.stationList = res.data;
        });
      },
      fetch(){
        perInforApi.beforePage(this.queryParams).then(response => {
          let res = response.data;
          let data = JSON.parse(JSON.stringify(res.data))
          for (let item of data.records){
            item.filed = [item.company?item.company.key:'',item.departMent?item.departMent.key:''];
            item.stationList = [{id:item.post.key,name:item.post.data}];
            item.checkTypeBtn = false;
           }
          this.form.tableData = data.records;
        })
      },
      // 点击保存修改
      // keep(scope) {
      //   let that = this;
      //   let data  = scope.row;
      //   if (data.serialNumber && data.company.key && data.departMent.key && data.post.key && data.userName && data.sex.code &&
      //   data.dateOfBirth && data.idNumber && data.personnelType.key && data.homeAddress){
      //     this.updateRow(scope.row);
      //   }else {
      //     this.$message({
      //       type:'warning',
      //       message:'此条数据不完整'
      //     })
      //   }
      // },
      updateRow(row){
        let data = (JSON.parse(JSON.stringify(row)))
        delete data.filed;
        delete data.stationList;
        data.company.data = {};
        data.departMent.data = {};
        data.post.data = {};
        perInforApi.beforeUpdatePersonnel(data).then((response) => {
          const res = response.data;
          if (res.isSuccess) {
            this.$message({
              message: this.$t("tips.updateSuccess"),
              type: "success",
            });
          }else {
            this.fetch()
          }
        });
      },
      // 获取职务级别的数据
      findStaByIds(val){
        stationApi.findStaByIds(val[1]?val[1]:val[0]?val[0]:'').then(response => {
          const res = response.data;
          this.stationList = res.data;
        });
      },
      initWidth() {
        this.screenWidth = document.body.clientWidth;
        if (this.screenWidth < 991) {
          return "92%";
        } else if (this.screenWidth < 1400) {
          return "1200px";
        } else {
          return "1200px";
        }
      },
      setUser(org ,list,orgID,dicts) {
        this.orgList = list;
        let data = JSON.parse(JSON.stringify(org))
        for (let item of data){
          item.filed = [item.company?item.company.key:'',item.departMent?item.departMent.key:''];
          item.stationList = [{id:item.post.key,name:item.post.data}];
          item.checkTypeBtn = false;
        }
        this.form.tableData = data;
        this.dicts = { ...dicts };
        // this.summaryData.orgId = orgID;
      },
      close() {
        this.$emit("close");
      },
      reset() {
        // 先清除校验，再清除表单，不然有奇怪的bug
        // this.$refs.form.clearValidate();
        // this.$refs.form.resetFields();
      },
      submitForm() {
        const vm = this;
        this.$refs.form.validate((valid) => {
          if (valid) {
            vm.editSubmit();
          } else {
            this.$message({
              type:'warning',
              message:'数据不完整'
            })
            return false;
          }
        });
      },
      editSubmit() {
        perInforApi.determineSaveBach().then(response =>{
            let res = response.data;
            if (res.data){
              this.isVisible = false;
              this.$emit("success");
            }
        })
        // const vm = this;
        // let data = JSON.parse(JSON.stringify(this.summaryData));
        // delete data.filed;
        // data.specimenNumber = Number(data.specimenNumber);
        // data.serialNumber = Number(data.serialNumber);
        // data.accountingTestTaskId = this.$route.query.id;
        // if (vm.type === "add") {
        //   vm.save(data);
        // } else {
        //   vm.update(data);
        // }
      },
      cancelForm(){
        // this.isVisible = false;
        perInforApi.cancelSaveBach().then(response =>{
          let res = response.data;
          if (res.data){
            this.isVisible = false;
            this.$emit("success");
          }
        })
      },
      save(list) {
        const vm = this;
        perInforApi.afterPersonnel(list).then((response) => {
          const res = response.data;
          if (res.isSuccess) {
            vm.isVisible = false;
            vm.$message({
              message: vm.$t("tips.createSuccess"),
              type: "success",
            });
            vm.$emit("success");
          }
        });
      },
      // update(list) {
      //   list.company.data = {};
      //   list.departMent.data = {};
      //   list.post.data = {};
      //   perInforApi.afterUpdatePersonnel(list).then((response) => {
      //     const res = response.data;
      //     if (res.isSuccess) {
      //       this.isVisible = false;
      //       this.$message({
      //         message: this.$t("tips.updateSuccess"),
      //         type: "success",
      //       });
      //       this.$emit("success");
      //     }
      //   });
      // },
      getNode(data,id){
        let result;
        if (!data) {
          return;
        }
        let children = (data,id) => {
          for (var i = 0; i < data.length; i++) {
            result = this.nodeChildren(data[i],id);
            if(result){
              return result;
            }
          }
        }
        result = children(data, id);
        return result;
      },
      nodeChildren(data,id){
        let result = '';
        if (data.id === id) {
          return data.label;
        } else if(data.children && data.children.length > 0) {
          for (var j = 0; j < data.children.length; j++) {
            var flagId = this.nodeChildren(data.children[j], id);
            if (flagId) {
              return flagId;
            }
          }
        }
        return false;
      }
    },
  };
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
