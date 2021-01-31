<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder='序号'
                class="filter-item search-item" v-model="queryParams.model.serialNumber"/>
      <el-input placeholder='任务名称'
                class="filter-item search-item" v-model="queryParams.model.taskName"/>
      <el-date-picker
        v-model="queryParams.model.beforeDeadline"
        type="datetime"
        placeholder="人员信息上报截止时间"
        align="right"
        class="filter-item search-item"
        value-format="yyyy-MM-dd HH:mm:ss"
        :picker-options="pickerOptions">
      </el-date-picker>
      <el-button @click="search" class="filter-item" plain type="primary">
        {{ $t("table.search") }}
      </el-button>
      <el-button @click="reset" class="filter-item" plain type="warning">
        {{ $t("table.reset") }}
      </el-button>
      <el-button @click="add" class="filter-item" plain type="danger" v-has-permission="['user:add']">
        {{ $t("table.add") }}
      </el-button>
    </div>
    <el-table
      :data="tableData.records"
      :key="tableKey"
      border fit row-key="id"
      ref="table"
      style="width: 100%;"
      v-loading="loading"
    >
      <el-table-column
        label="序号"
        align="center"
        prop="serialNumber"
        width="70"
      >
      </el-table-column>
      <el-table-column
        label="任务名称"
        :show-overflow-tooltip="true"
        align="center"
        width="200"
        prop="taskName"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.taskName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="人员信息上报截止时间"
        :show-overflow-tooltip="true"
        align="center"
        width="200"
        prop="beforeDeadline"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.beforeDeadline }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="检测开始时间"
        :show-overflow-tooltip="true"
        align="center"
        width="200"
        prop="startTime"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.startTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="检测结束时间"
        :show-overflow-tooltip="true"
        align="center"
        width="200"
        prop="endTime"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="检测结果上报截止时间"
        :show-overflow-tooltip="true"
        align="center"
        width="200"
        prop="afterDeadline"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.afterDeadline }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="任务描述"
        :show-overflow-tooltip="true"
        align="center"
        prop="requestIp"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.describe }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        column-key="operation"
        align="center"
        class-name="small-padding fixed-width"
        width="100px"
      >
        <template slot-scope="{ row }">
          <i
            @click="edit(row)"
            class="el-icon-edit table-operation"
            style="color: #2db7f5;"
            title="修改"
            v-hasPermission="['role:update']"
          />
          <i
            @click="view(row)"
            class="el-icon-view table-operation"
            style="color: #87d068;"
            title="修改"
            v-hasPermission="['role:update']"
          />
          <i
            @click="Delete(row.id)"
            class="el-icon-delete table-operation"
            style="color: #f50;"
            title="删除"
            v-hasPermission="['role:delete']"
          />
          <el-link class="no-perm" v-has-no-permission="['loginLog:delete']">{{
            $t("tips.noPermission")
            }}
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :limit.sync="queryParams.size"
      :page.sync="queryParams.current"
      :total="Number(tableData.total)"
      @pagination="fetch"
      v-show="tableData.total > 0"
    />
    <edit
      :dialog-visible="dialog.isVisible"
      :type="dialog.type"
      @close="editClose"
      @success="editSuccess"
      ref="edit"
    />
  </div>
</template>
<script>
  import Pagination from "@/components/Pagination";
  import taskApi from "@/api/task.js";
  import {initQueryParams} from '@/utils/commons'
  import Edit from "./Edit";

  export default {
    name: "LoginLog",
    components: {Pagination,Edit},
    filters: {},
    data() {
      return {
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },

        queryParams: initQueryParams(),
        selection: [],
        tableKey: 0,
        loading: false,
        tableData: {
          total: 0
        },
        dialog: {
          isVisible: false,
          type: "add"
        },
      };
    },
    computed: {
      user() {
        return this.$store.state.account.user;
      },
    },
    mounted() {
      this.fetch();
    },
    methods: {
      add() {
        this.dialog.type = "add";
        this.dialog.isVisible = true;
        this.$refs.edit.setUser(false,this.user.orgId);
      },
      editClose() {
        this.dialog.isVisible = false;
      },
      editSuccess() {
        this.search();
      },
      fetch(params = {}) {
        this.loading = true;
        if (this.queryParams.timeRange) {
          this.queryParams.map.createTime_st = this.queryParams.timeRange[0];
          this.queryParams.map.createTime_ed = this.queryParams.timeRange[1];
        }

        this.queryParams.current = params.current ? params.current : this.queryParams.current;
        this.queryParams.size = params.size ? params.size : this.queryParams.size;

        taskApi.page(this.queryParams).then(response => {
          const res = response.data;
          if (res.isSuccess) {
            this.tableData = res.data;
          }
        }).finally(() => this.loading = false);
      },
      edit(row){
        this.$refs.edit.setUser(row,this.user.orgId);
        this.dialog.type = "edit";
        this.dialog.isVisible = true;
      },
      view(row){
        this.$router.push({
          path:'/perInfoment',
          query:row
        })
      },
      clearSelections() {
        this.$refs.table.clearSelection();
      },
      Delete(val){
        const vm = this;
        let istrue = Array.isArray(val)
        if (!istrue){
          vm.$confirm('确定要删除此条数据?', '删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let ids = [];
            ids.push(val)
            vm.DeleteApi(ids);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }else {
          vm.DeleteApi(val);
        }
      },
      // 调用删除的接口
      DeleteApi(val){
        const vm = this;
        taskApi.delete({ids:val}).then(response =>{
          const res = response.data;
          if (res.isSuccess) {
            vm.$message({
              message: this.$t("tips.deleteSuccess"),
              type: "success"
            });
            vm.clearSelections();
          }
          vm.search();
        });
      },
      search() {
        this.fetch({
          ...this.queryParams
        });
      },
      reset() {
        this.queryParams = initQueryParams();
        this.$refs.table.clearSort();
        this.$refs.table.clearFilter();
        this.search();
      },
    }
  };
</script>
<style lang="scss" scoped>
  .item {
    margin-top: 7px;
  }
</style>
