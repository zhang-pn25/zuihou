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
      :model="summaryData"
      :rules="rules"
      class="taskStyle"
      label-position="right"
      label-width="120px"
      ref="form"
    >
      <el-row>
        <el-col :sm="24" :xs="24">
          <!--单位部门 -->
          <el-form-item label="单位部门:" prop="filed">
            <el-cascader
              style="width: 92%"
              :props="{ value: 'id' }"
              :options="orgList"
              :show-all-levels="false"
              placeholder="单位部门"
              @change="orgFiled"
              v-model="summaryData.filed"
              clearable
            ></el-cascader>
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
  import perInforApi from "@/api/perInfor.js";
  export default {
    name: "UserEdit",
    props: {
      dialogVisible: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        orgList:[],
        summaryData: {
          filed:[],
        },
        screenWidth: 0,
        btnFlag:'',
        width: this.initWidth(),
        rules: {
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
        return '调整';
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
        this.summaryData.org = val.length>0?val[1]:val[0]?'':''
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
      setUser(org ,list) {
        this.orgList = list;
        if (org) {
          this.summaryData = JSON.parse(JSON.stringify(org));
          this.$set(this.summaryData,'filed',[this.summaryData.company.key,this.summaryData.departMent.key])
          this.btnFlag = org.departMent.key;
        }
      },
      close() {
        this.$emit("close");
      },
      reset() {
        this.summaryData ={
          filed: [],
        }
        this.btnFlag = '';
        // 先清除校验，再清除表单，不然有奇怪的bug
        this.$refs.form.clearValidate();
        this.$refs.form.resetFields();
      },
      submitForm() {
        let vm = this;
        this.$refs.form.validate((valid) => {
          if (valid) {
            if(this.btnFlag == this.summaryData.departMent.key){
              this.$message({
                type:'warning',
                message:'不能向本单位部门调整，请选择其他部门'
              })
              return false;
            }
            vm.editSubmit();
          } else {
            return false;
          }
        });
      },
      editSubmit() {
        const vm = this;
        vm.update();
      },
      update() {
        const vm = this;
        let data = JSON.parse(JSON.stringify(this.summaryData));
        delete data.filed;
        data.company.data = {};
        data.departMent.data = {};
        data.post.data = {};
        data.orgId.data = {};
        data.tableId = data.id;
        perInforApi.updateAndSave(data).then((response) => {
          const res = response.data;
          if (res.isSuccess) {
            vm.isVisible = false;
            vm.$message({
              message: '调整成功',
              type: "success",
            });
            vm.$emit("success");
          }
        });
      },
    },
  };
</script>
<style lang="scss" scoped>
</style>
