<template>
  <div>
  <div class="app-container">
    <div class="filter-container">
      <el-row style="border-bottom: 1px solid #D6D8DE">
        <el-col :span="12">
          <el-row>
            <el-col :span="5" v-for="(item,index) in tabList" :key="index">
              <div class="tab_Moda" @click="toggleTab(item.path,index)">
                <span class="tab_text" :class="item.path == cut?'isActive':''">
                  {{item.name}}
                </span>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <div style="float: right;">
            <span style="font-size: 16px;margin-top: 13px;display: block">距离<label style="color: red">核酸检测</label>任务的检测结果上报截止时间还有<label style="color: red">{{day}}</label>天<label style="color: red">{{hour}}</label>时<label style="color: red">{{min}}</label>分<label style="color: red">{{second}}</label>秒，请尽快上传</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div style="margin-top: 50px">
            <component v-bind:is="cut" keep-alive></component>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
<div>
  <el-button @click="DownloadExcel" class="filter-item" plain type="warning">
    导出</el-button>
  <el-dropdown-item @click.native="exportExcelPreview" v-has-permission="['user:export']">
    导出预览
  </el-dropdown-item>
  <el-button @click="newData" class="filter-item" plain type="danger">新增</el-button>
  <el-button @click="updateData" class="filter-item" plain type="danger">更新</el-button>
  <el-button @click="DownloadExcel" class="filter-item" plain type="danger">模板下载</el-button>
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
  import { initQueryParams ,downloadFile} from '@/utils/commons';
  import perInforApi from "@/api/perInfor.js";
  import elDragDialog from '@/directive/el-drag-dialog';
  import summaryAfter from './summaryAfter';
  import statisticalAgo from "./statisticalAgo";
  import summaryAgo from './summaryAgo';
  import statisticalAfter from "./statisticalAfter";
    export default {
        name: "Index",
      directives: { elDragDialog },
      components:{
        summaryAfter,
        statisticalAgo,
        summaryAgo,
        statisticalAfter
      },
      data(){
        return{
          activeName:'first',
          preview: {
            isVisible: false,
            context: ''
          },
          curStartTime: '',
          day: '0',
          hour: '00',
          min: '00',
          second: '00',
          tabList:[
            {path:'summaryAgo',name:'人员信息汇总-检测前'},
            {path:'summaryAfter',name:'人员信息汇总-检测后'},
            {path:'statisticalAgo',name:'人员信息统计-检测前'},
            {path:'statisticalAfter',name:'人员信息统计-检测后'}
            ],
          cut:'summaryAgo',
          queryParams:initQueryParams({
            model:{
            }
          }),
        }
      },
      created() {
        this.curStartTime = this.$route.query.afterDeadline;
        this.countTime()
      },
      methods:{
        handleClick(tab, event) {
          console.log(tab, event);
        },
        exportExcel(){

        },
        newData(){

        },
        updateData(){

        },
        toggleTab(tab){
          this.cut = tab;
        },
        DownloadExcel(){
            if (this.queryParams.timeRange) {
              this.queryParams.map.createTime_st = this.queryParams.timeRange[0];
              this.queryParams.map.createTime_ed = this.queryParams.timeRange[1];
            }
            let data =  JSON.parse(JSON.stringify(this.queryParams));
            data.size = '-1';
            // data.map.fileName = '导出';
            perInforApi.export(data).then(response => {
                downloadFile(response);
            });
        },
        // 导出预览
        exportExcelPreview(params = {}) {
          if (this.queryParams.timeRange) {
            this.queryParams.map.createTime_st = this.queryParams.timeRange[0];
            this.queryParams.map.createTime_ed = this.queryParams.timeRange[1];
          }
          // this.queryParams.map.fileName = '导出数据';
          perInforApi.preview(this.queryParams).then(response => {
            const res = response.data;
            this.preview.isVisible = true;
            this.preview.context = res.data;
          });
        },
        countTime () {
          // 获取当前时间
          let date = new Date()
          let now = date.getTime()
          // 设置截止时间
          let endDate = new Date(this.curStartTime) // this.curStartTime需要倒计时的日期
          let end = endDate.getTime()
          // 时间差
          let leftTime = end - now
          // 定义变量 d,h,m,s保存倒计时的时间
          if (leftTime >= 0) {
            // 天
            this.day = Math.floor(leftTime / 1000 / 60 / 60 / 24)
            // 时
            let h = Math.floor(leftTime / 1000 / 60 / 60 % 24)
            this.hour = h < 10 ? '0' + h : h
            // 分
            let m = Math.floor(leftTime / 1000 / 60 % 60)
            this.min = m < 10 ? '0' + m : m
            // 秒
            let s = Math.floor(leftTime / 1000 % 60)
            this.second = s < 10 ? '0' + s : s
          } else {
            this.day = 0
            this.hour = '00'
            this.min = '00'
            this.second = '00'
          }
          // 等于0的时候不调用
          if (Number(this.hour) === 0 && Number(this.day) === 0 && Number(this.min) === 0 && Number(this.second) === 0) {
            return
          } else {
            // 递归每秒调用countTime方法，显示动态时间效果,
            setTimeout(this.countTime, 1000)
          }
        },
      }
    }
</script>

<style lang="scss" scoped>
.tab_Moda{
  height: 48px;
  cursor: pointer;
  color: #7E8186;
  overflow-x: hidden;
  overflow-y: visible;
  .tab_text{
    width: 136px;
    line-height: 47px;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
  }
}
.tab_Moda:hover{
  color: #021E8C;
}
.isActive{
  border-bottom: 2px solid #021E8C;
  color: #021E8C;
  background: none;
  margin-top: -1px;
}
</style>
