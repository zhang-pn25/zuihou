<template>
  <div>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-row>
        <el-col :span="24">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
            <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
            <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
            <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row> -->
      <el-row>
        <el-col :span="24">
          <!-- <el-row>
            <el-col :span="6" v-for="(item,index) in tabList" :key="index">
              <div class="tab_Moda" @click="toggleTab(item.path,index)">
                <span class="tab_text" :class="item.path == cut?'isActive':''">
                  {{item.name}}
                </span>
              </div>
            </el-col>
          </el-row> -->
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="人员信息汇总-检测前" name="first">
              <summary-ago ref="first"></summary-ago>
            </el-tab-pane>
            <el-tab-pane label="人员信息汇总-检测后" name="second">
              <summary-after ref="second"></summary-after>
            </el-tab-pane>
            <el-tab-pane label="人员信息统计-检测前" name="third">
              <statistical-ago ref="third"></statistical-ago>
            </el-tab-pane>
            <el-tab-pane label="人员信息统计-检测后" name="fourth">
              <statistical-after ref="fourth"></statistical-after>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
      <div class="prompt">
          <div style="float: right;">
            <span style="font-size: 14px;margin-top: 13px;display: block">距离<label style="color: red;font-size:18px">{{this.$route.query.taskName}}</label>任务的检测结果上报截止时间还有<label style="color: red;font-size:18px">{{day}}</label>天，请尽快上传</span>
          </div>
<!--            <div v-else>-->
<!--              <el-button  class="filter-item" style="margin-bottom: 5px" plain type="danger" v-has-permission="['user:add']">重新激活</el-button>-->
<!--            </div>-->
      </div>
      <!-- <el-row>
        <el-col :span="24">
          <div style="margin-top: 30px">
            <component v-bind:is="cut" keep-alive></component>
          </div>
        </el-col>
      </el-row> -->
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
  import moment from "moment";
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
          timer:'',
          curStartTime: '',
          day: '0',
          hour: '00',
          min: '00',
          second: '00',
          cut:'summaryAgo',
          queryParams:initQueryParams({
            model:{
            }
          }),
        }
      },
      beforeDestroy(){
        clearTimeout(this.timer);
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
          switch (tab.index) {
            case '0':
                this.$refs.first.setData(true);
              break;
              case '1':
                this.$refs.second.setData(true)
              break;
              case '2':
                this.$refs.third.setData(true)
              break;
              case '3':
                this.$refs.fourth.setData(true)
              break;
            default:
              break;
          }
        },
        // toggleTab(tab){
        //   this.cut = tab;
        // },
        countTime () {
          // 获取当前时间
          let date = new Date()
          let now = date.getTime()
          // 设置截止时间
          let end = moment(this.curStartTime).valueOf();
          // 时间差
          let leftTime = end - now
          // 定义变量 d,h,m,s保存倒计时的时间
          if (leftTime >= 0) {
            // 天
            this.day = Math.floor(leftTime / 1000 / 60 / 60 / 24)
          } else {
            this.day = 0
          }
          // 等于0的时候不调用
          if (Number(this.day) === 0 ) {
            return
          } else {
            // 递归每秒调用countTime方法，显示动态时间效果,
            this.timer = setTimeout(this.countTime, 1000)
          }
        },
      }
    }
</script>

<style lang="scss" scoped>
.filter-container{
  position: relative;
}
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
  border-bottom: 3px solid #021E8C;
  color: #021E8C;
  background: none;
  margin-top: -1.1px;
}
.prompt{
  position: absolute;
  top:-1px;
  right: 40px;
}
@media screen and (max-width: 1366px) {
    .prompt span{
      width: 50%;
      float: right;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
}
</style>
