<!-- 商户管理 -->
<template>
  <div class="app-container">
    <div class="block">
      <el-row :gutter="10" type="flex">
        <el-dropdown @command="handleCommand">
          <el-button type="primary">
            搜索方式：<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a"><i v-show="Showhide1 = true" class="el-icon-check" /> 商户名称</el-dropdown-item>
            <el-dropdown-item command="b"><i v-show="Showhide2" class="el-icon-check" />通联渠道号</el-dropdown-item>
            <el-dropdown-item command="c"><i v-show="Showhide3" class="el-icon-check" />商户手机号</el-dropdown-item>
            <el-dropdown-item command="d"><i v-show="Showhide4" class="el-icon-check" />信用代码</el-dropdown-item>
            <el-dropdown-item command="e"><i v-show="Showhide5" class="el-icon-check" />法人姓名</el-dropdown-item>
            <el-dropdown-item command="f"><i v-show="Showhide6" class="el-icon-check" />时间</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-col v-show="Showhide1 = true" :span="5">
          <el-input v-model="search.merchantName" clearable class="filter-item input-tx" placeholder="请输入商户名称" />
        </el-col>
        <el-col v-show="Showhide2" :span="5">
          <el-input v-model="search.uninNo" clearable class="filter-item input-tx" placeholder="请输入通联渠道号" />
        </el-col>
        <el-col v-show="Showhide3" :span="5">
          <el-input v-model="search.contactPhone" clearable class="filter-item input-tx" placeholder="请输入商户手机号" />
        </el-col>
        <el-col v-show="Showhide4" :span="5">
          <el-input v-model="search.businessLicense" clearable class="filter-item input-tx" placeholder="请输入信用代码" />
        </el-col>
        <el-col v-show="Showhide5" :span="5">
          <el-input v-model="search.contactName" clearable class="filter-item input-tx" placeholder="请输入法人姓名" />
        </el-col>
        <div v-show="Showhide6">
          <el-col :span="3">
            <el-date-picker
              v-model="params.date"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-col>
        </div>
        <el-col :span="3">
          <el-select v-model="search.status" placeholder="请选择商户状态">
            <el-option
              v-for="item in merchantStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>

        <el-col :span="2">
          <el-button class="filter-item" type="primary" icon="el-icon-search" :loading="loading" @click="search1">查询
          </el-button>
        </el-col>
      </el-row>
    </div>
    <el-table
      v-loading="loading"
      :element-loading-text="loadingText"
      :data="list"
      border
      fit
      highlight-current-row
    >
      <el-table-column
        align="center"
        label="商户编号"
        min-width="200"
        prop="merchant_no"
      />
      <el-table-column
        align="center"
        label="商户名称"
        min-width="300"
        prop="merchant_name"
      />
      <el-table-column
        align="center"
        label="法人姓名"
        width="120"
        prop="contact_name"
      />
      <el-table-column
        align="center"
        label="商户手机号"
        min-width="150"
        prop="contact_phone"
      />
      <!--      <el-table-column-->
      <!--        align="center"-->
      <!--        label="微信渠道号"-->
      <!--        width="100"-->
      <!--        prop="wechat_no"-->
      <!--      />-->
      <!--      <el-table-column-->
      <!--        align="center"-->
      <!--        label="支付宝渠道号"-->
      <!--        width="120"-->
      <!--        prop="alipay_no"-->
      <!--      />-->
      <el-table-column
        align="center"
        label="通联渠道号"
        width="170"
        prop="union_no"
      />
      <!-- 客户经理数据-->
      <el-table-column
        align="center"
        label="客户经理"
        width="120"
        prop="busconactperson"
      />
      <el-table-column
        align="center"
        label="商户费率"
        width="120"
        prop="pay_rate"
      />
      <!-- 商品限额 -->
      <!-- <el-table-column align="center" label="商户限额" width="120">
        <template slot-scope="scope">
          ￥{{ $common.jeFormat(scope.row.trading_limit, 2) }}
        </template>
      </el-table-column> -->
      <el-table-column
        align="center"
        label="创建时间"
        width="160"
        prop="create_time"
      />
      <el-table-column
        v-if="!$route.meta.readOnly"
        align="center"
        label="操作"
        fixed="right"
        width="100"
      >
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <el-button class="el-dropdown-link" type="primary" size="small" plain>
              更多
              <i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="openingUnoin(scope.row.id)">
                开通支付
              </el-dropdown-item>
              <el-dropdown-item @click.native="allinpayStatus(scope.row)">
                查看通联商户状态
              </el-dropdown-item>
              <el-dropdown-item @click.native="allinpayElectSignStatus(scope.row)">
                查看通联商户电子协议状态
              </el-dropdown-item>
              <el-dropdown-item @click.native="allinpayElectSign(scope.row)">
                通联商户电子协议重新下发
              </el-dropdown-item>
              <el-dropdown-item @click.native="repaircusrgc(scope.row)">
                合规性补录二维码
              </el-dropdown-item>
              <!-- <el-dropdown-item @click.native="compliance(scope.row)">
                合规性状态查询
              </el-dropdown-item> -->
              <el-dropdown-item @click.native="info(scope.row.id)">
                查看详情
              </el-dropdown-item>
              <el-dropdown-item v-if="scope.row.split_status===2" @click.native="openSplitAuth(scope.row)">
                开通分账权限
              </el-dropdown-item>
              <!-- <el-dropdown-item @click.native="alter(scope.row)">
                商户修改限额
              </el-dropdown-item> -->
              <el-dropdown-item @click.native="modifyPaymentRate(scope.row)">
                修改支付费率
              </el-dropdown-item>
              <!-- <el-dropdown-item @click.native="alterModifyBankCardNum(scope.row)">
                修改银行卡信息
              </el-dropdown-item> -->
              <el-dropdown-item @click.native="alterModifyPhone(scope.row)">
                修改手机号
              </el-dropdown-item>
              <el-dropdown-item @click.native="tradeDeviceList(scope.row.id)">
                门店管理
              </el-dropdown-item>
              <el-dropdown-item v-if="scope.row.merchant_status===1" @click.native="freezeMerchant(scope.row)">
                冻结
              </el-dropdown-item>
              <el-dropdown-item v-if="scope.row.merchant_status===2 || scope.row.merchant_status===4" @click.native="normalMerchant(scope.row)">
                解冻
              </el-dropdown-item>
              <el-dropdown-item v-if="scope.row.merchant_status===1" @click.native="rejectChange(scope.row)">
                驳回修改
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-container block">
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
    <!-- 商户限额 -->
    <el-dialog title="商户修改限额" :visible.sync="dialogVisible" width="30%">
      <el-form ref="codeForm" :model="codeData" label-width="60px">
        <el-form-item label="限额" prop="amount">
          <el-input-number v-model="codeData.amount" :precision="2" :max="999999999" :min="0" :step="100" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submit">{{ $t('button.sure') }}</el-button>
      </span>
    </el-dialog>
    <!--    费率-->
    <el-dialog title="商户修改费率" :visible.sync="dialogVisible3" width="30%">
      <el-form ref="rateCodeForm" :model="rateCodeData" label-width="60px">
        <el-form-item label="费率" prop="amount">
          <el-input-number v-model="rateCodeData.amount" :precision="4" :step="0.0001" :min="0.0000" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rateClose">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" :loading="submitLoading" @click="rateSubmit">{{ $t('button.sure') }}</el-button>
      </span>
    </el-dialog>
    <!--  修改银行卡号  -->
    <el-dialog title="修改银行卡信息" :visible.sync="dialogVisible1" width="30%">
      <el-form ref="codeForm1" :model="bankCodeData" :rules="bankRules" label-width="100px">
        <el-form-item label="银行卡号" prop="bankCardNo">
          <el-input v-model="bankCodeData.bankCardNo" />
        </el-form-item>
        <!--        <el-form-item label="银行名称" prop="bankName">-->
        <!--          <el-input v-model="bankCodeData.bankName"/>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="支行名称" prop="bankNameSub">-->
        <!--          <el-input v-model="bankCodeData.bankNameSub"/>-->
        <!--        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bankClose">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" :loading="submitLoading" @click="bankSubmit">{{ $t('button.sure') }}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="通联合规性补录二维码"
      :visible.sync="repaircusrgcVisible"
      width="250px"
    >
      <el-image style="width: 200px; height: 200px" :src="repaircusrgcUrl" fit="cover">
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="repaircusrgcVisible = false">关 闭</el-button>
        </span>
      </el-image></el-dialog>
    <!--  修改手机号  -->
    <el-dialog title="修改商户手机号" :visible.sync="dialogVisible2" width="30%">
      <el-form ref="codeForm2" :model="phoneData" :rules="phoneRules" label-width="100px">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="phoneData.phone" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="phoneClose">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" :loading="submitLoading" @click="phoneSubmit">{{ $t('button.sure') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="./merchantList.js"/>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>
<style lang="scss" scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
  font-size: 12px;
}

.sup-merchant-item {
  margin-right: 20px;
}

// 下拉菜单样式
.el-dropdown {
     vertical-align: top;
}
.el-dropdown + .el-dropdown {
     margin-left: 15px;
}
.el-icon-arrow-down {
     font-size: 12px;
}
</style>
