<template>
  <div>
  <div class="app-container">
    <div class="filter-container">
      <el-row style="border-bottom: 1px solid #D6D8DE">
        <el-col :span="14">
          <el-row>
            <el-col :span="4" v-for="(item,index) in tabList" :key="index">
              <div class="tab_Moda" @click="toggleTab(item.path,index)">
                <span class="tab_text" :class="item.path == cut?'isActive':''">
                  {{item.name}}
                </span>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="10">
          <div style="float: right;">
            <div v-if="this.$route.query.type == true">
              <span style="font-size: 16px;margin-top: 13px;display: block">距离<label style="color: red">核酸检测</label>任务的检测结果上报截止时间还有<label style="color: red">{{day}}</label>天<label style="color: red">{{hour}}</label>时<label style="color: red">{{min}}</label>分<label style="color: red">{{second}}</label>秒，请尽快上传</span>
            </div>
            <div v-else>
              <el-button  class="filter-item" style="margin-bottom: 5px" plain type="danger" v-has-permission="['user:add']">重新激活</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div style="margin-top: 30px">
            <component v-bind:is="cut" keep-alive></component>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
<div>
</div>
  </div>
</template>

<script>
  import { initQueryParams } from '@/utils/commons';
  import summaryAfter from './summaryAfter';
  import statisticalAgo from "./statisticalAgo";
  import summaryAgo from './summaryAgo';
  // import summaryRecord from './summaryRecord';
  import statisticalAfter from "./statisticalAfter";
    export default {
        name: "Index",
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
          btnType:false,
          curStartTime: '',
          day: '0',
          hour: '00',
          min: '00',
          second: '00',
          tabList:[
            {path:'summaryAgo',name:'人员信息汇总-检测前'},
            {path:'summaryAfter',name:'人员信息汇总-检测后'},
            // {path:'summaryRecord',name:'人员信息检测记录'},
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
      computed: {
        user() {
          return this.$store.state.account.user;
        },
      },
      mounted() {
        this.$setCookie('org',this.user.orgId);
        this.$setCookie('task',this.$route.query.id);
      },
      methods:{
        handleClick(tab, event) {
          console.log(tab, event);
        },
        toggleTab(tab){
          this.cut = tab;
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
            this.$route.query.type = false;
            return
          } else {
            this.$route.query.type = true;
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
