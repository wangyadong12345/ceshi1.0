<template>
  <div class="app-container">
    <!-- 按钮栏 -->
    <div class="block">
      <el-button v-if="!$route.meta.readOnly" class="filter-item" type="primary" icon="el-icon-circle-plus" @click="addAccount">添加客户经理
      </el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-refresh" :loading="loading" @click="fetchData">刷新
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="list" border fit highlight-current-row>
      <el-table-column align="center" label="编号">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" prop="user_name" />
      <el-table-column align="center" label="联系手机号" prop="user_no" />
      <el-table-column align="center" label="更新时间" prop="last_update_time" />
      <el-table-column align="center" label="更新操作人" prop="last_update_user" />
      <el-table-column align="center" label="创建时间" prop="create_time" />
      <el-table-column align="center" label="创建操作人" prop="create_user" />
      <el-table-column v-if="!$route.meta.readOnly" align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="update(scope.row)">修改
          </el-button>
          <el-popconfirm confirm-button-text="确认" cancel-button-text="不用了" title="删除后该用户无法登陆，确认要删除吗?" @confirm="remove(scope.row.id)">
            <el-button slot="reference" type="danger" plain size="mini" style="margin-left:5px;">删除
            </el-button>
          </el-popconfirm>
          <el-button type="primary" plain size="mini" style="margin-left:5px;" @click="resetPassword(scope.row,scope.$index)">重置密码
          </el-button>
          <el-button type="primary" plain size="mini" style="margin-left:5px;" @click="updateAgency(scope.row,scope.$index)">更换所属机构
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        background
        layout="total, sizes, prev, pager, next"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>

    <!-- 新增或修改 -->
    <el-dialog width="40%" :title="dialogTitle" :visible.sync="dialogFormVisible" class="user-dialog">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item prop="userName" label="姓名">
          <el-input v-model="form.userName" maxlenth="20" placeholder="请填写姓名" auto-complete="off" class="input-tx" />
        </el-form-item>

        <el-form-item prop="mobilePhone" label="手机号">
          <el-input v-model="form.mobilePhone" placeholder="请填写手机号" auto-complete="off" class="input-tx" />
        </el-form-item>

        <el-form-item v-if="id===''" prop="password" label="密码">
          <el-input v-model="form.password" maxlenth="20" placeholder="12-18位数字大小写字母特殊符号组合" type="password" auto-complete="off" class="input-tx" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" :loading="saveLoading" @click="saveAccount">{{ $t('button.submit') }}</el-button>
      </div>
    </el-dialog>

    <!-- 重置密码 -->
    <el-dialog width="40%" title="重置密码" :visible.sync="dialogPd" class="user-dialog">
      <el-form ref="formPd" :model="formPd" :rules="rulesPd" label-width="120px">
        <el-form-item prop="password" label="新密码">
          <el-input v-model="formPd.password" maxlenth="20" placeholder="12-18位数字大小写字母特殊符号组合" type="password" auto-complete="off" class="input-tx" />
        </el-form-item>

        <el-form-item prop="confirmPassword" label="再次确认密码">
          <el-input v-model="formPd.confirmPassword" placeholder="再次确认密码" type="password" auto-complete="off" class="input-tx" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelPd">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" :loading="pdLoading" @click="saveNewPd">{{ $t('button.submit') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog width="40%" title="更换所属机构" :visible.sync="dialogAgency" class="user-dialog">
      <!-- 所属机构树 -->
      <el-tree
        ref="treeForm"
        v-loading="treeloading"
        :data="treedata"
        default-expand-all
        node-key="agency_no"
        empty-text="暂无数据"
        highlight-current
        show-checkbox
        check-strictly
        @check-change="handleNodeClick"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>{{ data.agency_name }}({{ data.bank_agency_no }})</span>
        </span>
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAgency = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" :loading="agencyLoading" @click="saveAgency">{{ $t('button.submit') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./customer.js"></script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
