<template>
  <el-dialog
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    :title="title"
    :type="type"
    :visible.sync="isVisible"
    :width="width"
    top="50px"
  >
    <el-form
      :model="summaryData"
      :rules="rules"
      class="taskStyle"
      label-position="right"
      label-width="120px"
      ref="form"
    >
      <el-row>
        <el-col :sm="12" :xs="24">
          <!--序号 -->
          <el-form-item label="序号:" prop="serialNumber">
            <el-input
              placeholder="请输入序号"
              v-input-limit='0'
              style="width: 92%"
              v-model="summaryData.serialNumber"
              clearable
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <!--单位部门 -->
          <el-form-item label="单位部门:" prop="filed">
            <el-cascader
              style="width: 92%"
              :props="{ value: 'id' }"
              :options="orgList"
              :show-all-levels="false"
              @change="orgFiled"
              v-model="summaryData.filed"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="12" :xs="24">
          <!--职务级别 -->
          <el-form-item label="职务级别:" prop="post.key">
            <el-select
              style="width: 92%"
              :multiple="false"
              clearable
              placeholder="请输入关键词"
              v-model="summaryData.post.key"
            >
              <el-option
                :key="item.id"
                :label="item.name"
                :value="item.id"
                v-for="item in stationList"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <!--姓名 -->
          <el-form-item label="姓名:" prop="userName">
            <el-input
              placeholder="请输入姓名"
              style="width: 92%"
              v-model="summaryData.userName"
              clearable
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="12" :xs="24">
          <!--性别 -->
          <el-form-item label="性别:" prop="sex.code">
            <el-select style="width: 92%" clearable v-model="summaryData.sex.code" placeholder="请选择">
              <el-option
                v-for="item in genderData"
                :key="item.code"
                :label="item.label"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <!--出生年月 -->
          <el-form-item label="出生年月:" prop="dateOfBirth">
            <el-date-picker
              v-model="summaryData.dateOfBirth"
              value-format="yyyyMMdd"
              style="width: 92%"
              type="date"
              placeholder="请选择出生年月">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="12" :xs="24">
          <!--人员类别 -->
          <el-form-item label="人员类别:" prop="personnelType.key">
            <el-select style="width:92%"  placeholder="请输入人员类别" v-model="summaryData.personnelType.key" value>
              <el-option :key="index" :label="item.name" :value="item.id" v-for="(item, key, index) in dicts.PERSONNEL_TYPE" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <!--身份证号 -->
          <el-form-item label="身份证号:" prop="idNumber">
            <el-input
              placeholder="请输入身份证号"
              style="width: 92%"
              v-model="summaryData.idNumber"
              clearable
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="12" :xs="24">
          <!--家庭住址 -->
          <el-form-item label="家庭住址:" prop="homeAddress">
            <el-input
              placeholder="请输入家庭住址"
              style="width: 92%"
              v-model="summaryData.homeAddress"
              clearable
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <!--婚否 -->
          <el-form-item label="婚否:" prop="marriage">
            <el-select style="width: 92%" clearable v-model="summaryData.marriage" placeholder="请选择">
              <el-option
                v-for="item in maritalData"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="12" :xs="24">
          <!--借调类型 -->
          <el-form-item label="借调类型:" prop="secondmentType">
            <el-input
              placeholder="请输入借调类型"
              style="width: 92%"
              v-model="summaryData.secondmentType"
              clearable
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <!--原单位 -->
          <el-form-item label="原单位:" prop="beforeCompany">
            <el-input
              placeholder="请输入原单位"
              style="width: 92%"
              v-model="summaryData.beforeCompany"
              clearable
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="12" :xs="24">
          <!--疫苗接种类别 -->
          <el-form-item label="疫苗接种类别:" prop="inoculateType">
            <el-input
              placeholder="请输入疫苗接种类别"
              style="width: 92%"
              v-model="summaryData.inoculateType"
              clearable
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <!--联系电话 -->
          <el-form-item label="联系电话:" prop="phone">
            <el-input
              placeholder="请输入联系电话"
              style="width: 92%"
              v-model="summaryData.phone"
              clearable
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="12" :xs="24">
          <!--标本编号 -->
          <el-form-item label="标本编号:" prop="specimenNumber">
            <el-input
              placeholder="请输入标本编号"
              style="width: 92%"
              v-model="summaryData.specimenNumber"
              clearable
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <!--人员状态 -->
          <el-form-item label="人员状态:" prop="personnelStatus">
            <el-input
              placeholder="请输入人员状态"
              style="width: 92%"
              v-model="summaryData.personnelStatus"
              clearable
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="12" :xs="24">
          <!--检测类型 -->
          <el-form-item label="检测类型:" prop="checkType">
            <el-select style="width:92%" clearable placeholder="请选择检测类型" v-model="summaryData.checkType.key" value>
              <el-option :key="index" :label="item.name" :value="item.id" v-for="(item, key, index) in dicts.CHECK_TYPE" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <!--个人签名 -->
          <el-form-item label="个人签名:" prop="personalSignature">
            <el-input
              placeholder="请输入个人签名"
              style="width: 92%"
              v-model="summaryData.personalSignature"
              clearable
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="12" :xs="24">
          <!--检测时间 -->
          <el-form-item label="检测时间:" prop="checkTime">
            <el-date-picker
              v-model="summaryData.checkTime"
              type="date"
              style="width: 92%"
              placeholder="请选择检测时间"
              align="right"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <!--检测结果 -->
          <el-form-item label="检测结果:" prop="checkResult">
            <el-input
              placeholder="请输入检测结果"
              style="width: 92%"
              v-model="summaryData.checkResult"
              clearable
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="12" :xs="24">
          <!--是否异常 -->
            <el-form-item label="是否异常:" prop="isAbnormal">
              <el-select style="width: 92%" clearable v-model="summaryData.isAbnormal" placeholder="请选择检测是否异常">
                <el-option
                  v-for="item in isAbnormalList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <!--是否异常 -->
          <el-form-item label="检测途径:" prop="checkChannel">
              <el-input
                placeholder="请输入检测途径"
                style="width: 92%"
                v-model="summaryData.checkChannel"
                clearable
              />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="12" :xs="24">
          <!--未检测原因 -->
          <el-form-item label="未检测原因:" prop="notDetectedReason">
            <el-input
              placeholder="请输入未检测原因"
              style="width: 92%"
              type="textarea"
              :rows="2"
              v-model="summaryData.notDetectedReason"
              clearable
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <!--检测地址 -->
          <el-form-item label="检测地址:" prop="checkAddress">
            <el-input
              placeholder="请输入检测地址"
              style="width: 92%"
              type="textarea"
              :rows="2"
              v-model="summaryData.checkAddress"
              clearable
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="12" :xs="24">
          <!--结果证明 -->
          <el-form-item label="结果证明:" prop="checkAddress">
            <el-input
              placeholder="请输入检测结果证明"
              style="width: 92%"
              type="textarea"
              :rows="2"
              v-model="summaryData.checkResultProve"
              clearable
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <!--备注 -->
          <el-form-item label="备注:" prop="remarks">
            <el-input
              placeholder="请输入备注"
              type="textarea"
              :rows="2"
              style="width: 92%"
              v-model="summaryData.remarks"
              clearable
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="dialog-footer" slot="footer">
      <el-button @click="isVisible = false" plain type="warning">{{
        $t("common.cancel")
        }}</el-button>
      <el-button @click="submitForm" plain type="primary">{{
        $t("common.confirm")
        }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import taskApi from "@/api/task.js";
  import stationApi from "@/api/Station.js";
  import afterPerInforApi from "@/api/afterPerInfor.js";
  export default {
    name: "UserEdit",
    props: {
      dialogVisible: {
        type: Boolean,
        default: false,
      },
      type: {
        type: String,
        default: "add",
      },
    },
    data() {
      return {
        orgList:[],
        genderData:[
          {code:'M',label:'男'},
          {code:'W',label:'女'},
        ],
        maritalData:[
          {value:true,label:'是'},
          {value:false,label:'否'},
        ],
        isAbnormalList:[
          {value:false,label:'否'},
          {value:true,label:'是'},
        ],
        summaryData: {
          filed:[],
          orgId:'',
          serialNumber:'',
          status: 1,
          company:{
            key:'',
            data:{}
          },
          departMent:{
            key:'',
            data:{}
          },
          personnelType:{
            key:'',
            data:'',
          },
          post:{
            key:''
          },
          sex:{
            code:'',
          },
          checkType:{
            key:''
          },
          isDelete: false,
        },
        dicts:{
          PERSONNEL_TYPE:{},
          CHECK_TYPE:{}
        },
        filed:[],
        stationList:[],
        screenWidth: 0,
        width: this.initWidth(),
        rules: {
          serialNumber:{
            required: true,
            message: this.$t("rules.require"),
            trigger: "blur",
          },
          filed:{
            required: true,
            message: this.$t("rules.require"),
            trigger: "change",
          },
          'post.key':[{
            required: true,
            message: this.$t("rules.require"),
            trigger: "blur",
          },
            {
              validator: (rule, value, callback) => {
                if (this.summaryData.filed.length == 0) {
                  callback("请先选择单位部门");
                } else {
                  callback();
                }
              },
              trigger: "blur",
            },
          ],
          idNumber:[{
            required: true,
            message: this.$t("rules.require"),
            trigger: "blur",
          },{
            validator: (rule, value, callback) => {
              let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
              console.log(reg.test(value));
              if (reg.test(value)) {
                callback();
              } else {
                callback('请输入正确的身份证号码');
              }
            },
            trigger: "blur",
          }
          ],
          userName:{
            required: true,
            message: this.$t("rules.require"),
            trigger: "blur",
          },
          'sex.code':{
            required: true,
            message: this.$t("rules.require"),
            trigger: "blur",
          },
          dateOfBirth:{
            required: true,
            message: this.$t("rules.require"),
            trigger: "blur",
          },
          idCard:[{
            required: true,
            message: this.$t("rules.require"),
            trigger: "blur",
          },
            {
              validator: (rule, value, callback) => {
                let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                console.log(reg.test(value));
                if (reg.test(value)) {
                  callback();
                } else {
                  callback('请输入正确的身份证号码');
                }
              },
              trigger: "blur",
            }
          ],
          homeAddress:{
            required: true,
            message: this.$t("rules.require"),
            trigger: "blur",
          },
          phone:[{
            required: true,
            message: this.$t("rules.require"),
            trigger: "blur",
          },
            {
              validator: (rule, value, callback) => {
                let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
                console.log(reg.test(value));
                if (reg.test(value)) {
                  callback();
                } else {
                  callback('请输入正确的手机号码');
                }
              },
              trigger: "blur",
            }
          ],
          'personnelType.key':{
            required: true,
            message: this.$t("rules.require"),
            trigger: "blur",
          }
        },
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
        return this.type === "add" ? "添加人员信息" : "修改人员信息";
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
      orgFiled(val){
        this.summaryData.company.key = val.length>0?val[0]:'';
        this.summaryData.departMent.key = val.length>0?val[1]:'';
        this.summaryData.post.key = '';
        if (val.length > 0 ){
          this.findStaByIds(val);
        }else {
          this.stationList = [];
        }
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
          return "800px";
        } else {
          return "800px";
        }
      },
      setUser(org ,list,orgID,dicts) {
        this.orgList = list;
        if (org) {
          this.summaryData = { ...org };
          this.summaryData.filed = [org.company.key,org.departMent.key];
          this.findStaByIds(this.summaryData.filed)
        }
        this.dicts = { ...dicts };
        // this.taskData.orgId = val;
        this.summaryData.orgId = orgID;
      },
      close() {
        this.$emit("close");
      },
      reset() {
        this.summaryData = {
          filed:[],
          orgId:'',
          serialNumber:'',
          status: 1,
          company:{
            key:'',
            data:{}
          },
          departMent:{
            key:'',
            data:{}
          },
          personnelType:{
            key:'',
            data:'',
          },
          post:{
            key:''
          },
          sex:{
            code:'',
          },
          checkType:{
            key:''
          },
          isDelete: false,
        }
        this.stationList = [];
        // 先清除校验，再清除表单，不然有奇怪的bug
        this.$refs.form.clearValidate();
        this.$refs.form.resetFields();
      },
      submitForm() {
        const vm = this;
        this.$refs.form.validate((valid) => {
          console.log(valid);
          if (valid) {
            vm.editSubmit();
          } else {
            return false;
          }
        });
      },
      editSubmit() {
        const vm = this;
        let data = JSON.parse(JSON.stringify(this.summaryData));
        delete data.filed;
        data.specimenNumber = Number(data.specimenNumber);
        data.serialNumber = Number(data.serialNumber);
        data.accountingTestTaskId = this.$route.query.id;
        if (vm.type === "add") {
          vm.save(data);
        } else {
          vm.update(data);
        }
      },
      save(list) {
        const vm = this;
        afterPerInforApi.afterPersonnel(list).then((response) => {
          const res = response.data;
          console.log(res.data);
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
      update(list) {
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
          }
        });
      },
    },
  };
</script>
<style lang="scss" scoped>
</style>
