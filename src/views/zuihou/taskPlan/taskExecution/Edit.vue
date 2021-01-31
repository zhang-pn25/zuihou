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
      :model="taskData"
      :rules="rules"
      class="taskStyle"
      label-position="right"
      label-width="200px"
      ref="form"
    >
      <el-form-item label="序号:" prop="serialNumber">
        <el-input
          placeholder="请输入序号"
          style="width: 85%"
          v-input-limit='0'
          v-model="taskData.serialNumber"
          clearable
        >
        </el-input>
      </el-form-item>
      <el-form-item label="任务名称:" prop="taskName">
        <el-input
          placeholder="请输入任务名称"
          :disabled="type == 'edit'"
          style="width: 85%"
          v-model="taskData.taskName"
          clearable
        >
        </el-input>
      </el-form-item>
      <el-form-item label="人员信息上报截止时间:" prop="beforeDeadline">
        <el-date-picker
          v-model="taskData.beforeDeadline"
          type="datetime"
          placeholder="请选择人员信息上报截止时间"
          align="right"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 85%"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="检测开始时间:" prop="startTime">
        <el-date-picker
          v-model="taskData.startTime"
          type="datetime"
          placeholder="请选择检测开始时间"
          align="right"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 85%"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="检测结束时间:" prop="endTime">
        <el-date-picker
          v-model="taskData.endTime"
          type="datetime"
          placeholder="请选择检测结束时间"
          align="right"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 85%"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="检测结果上报截止时间:" prop="afterDeadline">
        <el-date-picker
          v-model="taskData.afterDeadline"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择检测结果上报截止时间"
          align="right"
          style="width: 85%"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="任务描述:" prop="describe">
        <el-input
          placeholder="请输入任务描述"
          type="textarea"
          :rows="4"
          style="width: 85%"
          v-model="taskData.describe"
          clearable
        ></el-input>
      </el-form-item>
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
      pickerOptions: {
        shortcuts: [
          {
            text: "明天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "三天后",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 3);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周后",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
      taskData: {
        beforeDeadline: "",
        afterDeadline: "",
        describe: "",
        taskName: "",
        startTime: "",
        serialNumber:'',
        endTime: "",
        checkAddress: "",
        status: 1,
        isDelete: 0,
      },
      screenWidth: 0,
      width: this.initWidth(),
      rules: {
        serialNumber:{
          required: true,
          message: this.$t("rules.require"),
          trigger: "blur",
        },
        taskName:{
            required: true,
            message: this.$t("rules.require"),
            trigger: "blur",
        },
        beforeDeadline: [
          {
            required: true,
            message: this.$t("rules.require"),
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              let newDate = this.getTime();
              console.log(newDate);
              console.log(value);
              if (newDate > value){
                callback("人员信息上报截止时间需大于当前日期");
              } else {
                if (this.taskData.startTime) {
                  if (this.taskData.startTime <= value) {
                    callback("人员信息上报截止时间需小于检测开始时间");
                  }else {
                    callback();
                  }
                } else {
                  callback();
                }
              }
            },
            trigger: "blur",
          },
        ],
        startTime: [
          {
            required: true,
            message: this.$t("rules.require"),
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              if (!this.taskData.beforeDeadline) {
                callback("请选择人员信息上报截止时间");
              } else if (this.taskData.beforeDeadline >= value) {
                callback("检测开始时间需大于人员信息上报截止时间");
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        endTime: [
          {
            required: true,
            message: this.$t("rules.require"),
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              if (!this.taskData.startTime) {
                callback("请选择检测开始时间");
              } else if (this.taskData.startTime >= value) {
                callback("检测结束时间需大于检测开始时间");
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        afterDeadline: [
          {
            required: true,
            message: this.$t("rules.require"),
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              if (!this.taskData.endTime) {
                callback("请选择检测结束时间");
              } else if (this.taskData.endTime >= value) {
                callback("检测结果上报截止时间需大于检测结束时间");
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ]
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
      return this.type === "add" ? "新建任务" : "修改任务";
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
    getTime(){
      var date=new Date();
      var year=date.getFullYear();
      var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
      var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
      var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
      var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
      var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
      // 拼接
      return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
    },
    initWidth() {
      this.screenWidth = document.body.clientWidth;
      if (this.screenWidth < 991) {
        return "90%";
      } else if (this.screenWidth < 1400) {
        return "800px";
      } else {
        return "750px";
      }
    },
    setUser(org, val) {
      if (org) {
        this.taskData = { ...org };
      }
      console.log(this.taskData);
      this.taskData.orgId = val;
    },
    close() {
      this.$emit("close");
    },
    reset() {
      this.taskData = {
        beforeDeadline: "",
        afterDeadline: "",
        describe: "",
        taskName: "",
        startTime: "",
        serialNumber:'',
        endTime: "",
        checkAddress: "",
        status: 1,
        isDelete: 0,
      };
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
      if (vm.type === "add") {
        vm.save();
      } else {
        vm.update();
      }
    },
    save() {
      const vm = this;
      console.log(this.taskData);
      taskApi.save(this.taskData).then((response) => {
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
    update() {
      taskApi.update(this.taskData).then((response) => {
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
/*.taskStyle {*/
/*  /deep/ .el-form-item__label{*/
/*    font-size: 0.9rem;*/
/*    font-weight: 500;*/
/*  }*/
/*  /deep/ .el-input__icon{*/
/*      line-height: 45px;*/
/*  }*/
/*  /deep/ el-input__inner{*/
/*    height: 45px !important;*/
/*  }*/
/*}*/
</style>
