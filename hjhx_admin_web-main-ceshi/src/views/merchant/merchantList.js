import {
  freezeMerchant,
  getMerchantList,
  normalMerchant,
  putOpenSplitAuth,
  changeLimit,
  putOpenWx,
  putOpenAli,
  putOpenUnion,
  changePayRate,
  changeMess,
  wxStatusApi,
  rejectChangeApi,
  allinpayStatusApi,
  allinpayElectSignStatusApi,
  allinpayElectSignApi,
  // repaircusrgcApi,
  changePhone,
  heguizhuangTai
} from '@/api/merchant/merchantApi'
import { getToken } from '@/utils/auth'

export default {
  name: 'merchantListIndex',
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      page: 1,
      pageSize: 10,
      supMerchantArr: [],
      merchantLevel: 1,
      Showhide1: false, // 状态切换
      Showhide2: false,
      Showhide3: false,
      Showhide4: false,
      Showhide5: false,
      Showhide6: false,
      // 搜索方式切换
      // dropdownItems: [
      //   { command: 'a', label: '商户名称', Showhide1: false, },
      //   { command: 'b', label: '通联渠道号', Showhide2: false, },
      //   { command: 'c', label: '商户手机号', Showhide3: false, },
      //   { command: 'd', label: '信用代码', Showhide4: false, },
      //   { command: 'e', label: '法人姓名', Showhide5: false, },
      //   { command: 'f', label: '时间', Showhide6: false, }
      // ],
      // 起始结束时间
      params: {
        createTime: '',
        endTime: '',
        date: ''
      },
      merchantStatus: [
        { value: 1, label: '正常' },
        { value: 2, label: '冻结' },
        { value: 3, label: '驳回修改' },
        { value: 4, label: '降低风控状态' }
      ],
      search: {
        status: 1
      },
      splitLoading: false,
      alterLoading: false,
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible3: false,
      dialogVisible4: false,
      codeData: {
        amount: 0,
        merchant_id: '',
        rate: 0.002,
        agent: 0.00001,
        trade_limit: 1000
      },
      rateCodeData: {
        id: '',
        amount: 0.0,
        rate: 0.002,
        agent: 0.00001,
        trade_limit: 1000
      },
      submitLoading: false,
      bankRules: {
        bankCardNo: [
          { required: true, message: '请输入银行卡号', trigger: 'blur' },
          {
            pattern: /^[1-9]\d{9,29}$/,
            message: '请输入正确的银行卡号',
            trigger: 'blur'
          }
        ]
        // bankName: [
        //   {required: true, message: '请输入银行名称', trigger: 'blur'}
        // ],
        // bankNameSub: [
        //   {required: true, message: '请输入支行名称', trigger: 'blur'}
        // ]
      },
      phoneRules: {
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
      },
      bankCodeData: {
        id: '',
        bankCardNo: '',
        bankName: '',
        bankNameSub: ''
      },
      id: 0,
      dialogTitle: '确定冻结商户么?',
      merchant_status: 1,
      loadingText: '',
      repaircusrgcVisible: false,
      repaircusrgcUrl: '',
      phoneData: {
        id: '',
        phone: ''
      },
      dialogVisible2: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 查询下拉菜单
    // handleCommand(c) {
    //   switch (c) {
    //     case 'shopNum':
    //       console.log(2)
    //       break
    //     case 'ditchNum':
    //       console.log(3)
    //       break
    //     case 'Manager':
    //       console.log(4)
    //       break
    //     case 'shopPhone':
    //       console.log(5)
    //   }
    // },
    // 查询
    search1() {
      this.page = 1
      this.fetchData()
    },
    // 开通分账权限
    openSplitAuth(row) {
      this.splitLoading = true
      putOpenSplitAuth({ merchant_id: row.id })
        .then((res) => {
          this.splitLoading = false
          this.$message({
            message: this.$t('alert.optionSuccess'),
            type: 'success'
          })
        })
        .catch(() => {
          this.splitLoading = false
        })
    },
    // 打开限额
    alter(row) {
      this.dialogVisible = true
      this.codeData = {
        amount: row.trading_limit,
        merchant_id: row.id
      }
    },
    // 提交限额
    submit() {
      this.$refs.codeForm.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          const data = {
            amount: this.codeData.amount,
            merchant_id: this.codeData.merchant_id
          }
          changeLimit(data)
            .then((res) => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.fetchData()
              this.submitLoading = false
              this.dialogVisible = false
              this.resetForm()
            })
            .catch(() => {
              this.submitLoading = false
            })
        }
      })
    },
    // 重置限额
    resetForm() {
      this.$refs.codeForm.resetFields()
      this.codeData = {
        amount: 0,
        merchant_id: ''
      }
    },
    // 关闭限额
    close() {
      this.dialogVisible = false
      this.resetForm()
    },
    // 打开费率
    modifyPaymentRate(row) {
      this.dialogVisible3 = true
      this.rateCodeData = {
        amount: row.pay_rate,
        rate: 0.002,
        agent: 0.00001,
        trade_limit: 1000,
        id: row.id
      }
    },
    // 提交费率
    rateSubmit() {
      this.$refs.rateCodeForm.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          const data = {
            id: this.rateCodeData.id,
            payRate: this.rateCodeData.amount
          }
          changePayRate(data)
            .then((res) => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.fetchData()
              this.submitLoading = false
              this.dialogVisible3 = false
              this.resetRateForm()
            })
            .catch(() => {
              this.submitLoading = false
            })
        }
      })
    },
    // 重置费率
    resetRateForm() {
      this.$refs.rateCodeForm.resetFields()
      this.rateCodeData = {
        amount: 0.0,
        id: '',
        rate: 0.002,
        agent: 0.00001,
        trade_limit: 1000
      }
    },
    // 关闭费率
    rateClose() {
      this.dialogVisible3 = false
      this.resetRateForm()
    },
    // 打开银行卡
    alterModifyBankCardNum(row) {
      this.dialogVisible1 = true
      this.bankCodeData = {
        id: row.id
      }
    },
    // 提交银行卡
    bankSubmit() {
      this.$refs.codeForm1.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          const data = {
            id: this.bankCodeData.id,
            // bankName: this.bankCodeData.bankName,
            // bankNameSub: this.bankCodeData.bankNameSub,
            bankCardNo: this.bankCodeData.bankCardNo
          }
          changeMess(data)
            .then((res) => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.fetchData()
              this.submitLoading = false
              this.dialogVisible1 = false
              this.resetBankForm()
            })
            .catch(() => {
              this.submitLoading = false
            })
        }
      })
    },
    // 打开修改手机
    alterModifyPhone(row) {
      this.dialogVisible2 = true
      this.phoneData.id = row.id
    },
    phoneSubmit() {
      this.$refs.codeForm2.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          changePhone(this.phoneData)
            .then((res) => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.fetchData()
              this.submitLoading = false
              this.dialogVisible2 = false
              this.resetPhoneForm()
            })
            .catch(() => {
              this.submitLoading = false
            })
        }
      })
    },
    // 重置银行卡
    resetBankForm() {
      this.$refs.codeForm1.resetFields()
      this.bankCodeData = {
        id: '',
        bankCardNo: '',
        bankName: '',
        bankNameSub: ''
      }
    },
    // 关闭银行卡
    bankClose() {
      this.dialogVisible1 = false
      this.resetBankForm()
    },
    resetPhoneForm() {
      this.$refs.codeForm2.resetFields()
      this.bankCodeData = {
        id: '',
        phone: ''
      }
    },
    phoneClose() {
      this.dialogVisible2 = false
      this.resetPhoneForm()
    },
    handleCurrentChange(page) {
      this.page = page
      this.fetchData()
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.fetchData()
    },
    // 数据列表
    fetchData() {
      console.log(this.params.date)
      const data = {
        page_num: this.page,
        page_size: this.pageSize,
        // 商户名
        merchantName: this.search.merchantName,
        // 商户对应通联商户号
        uninNo: this.search.uninNo,
        // 商户手机号
        contactPhone: this.search.contactPhone,
        // 社会统一信用代码
        businessLicense: this.search.businessLicense,
        // 商户注册时间(开始时间)
        createTime: this.params.date[0],
        // 商户注册时间(结束时间)
        endTime: this.params.date[1],
        // 客户经理
        busconactperson: this.search.busconactperson,
        // 商户法人姓名
        contactName: this.search.contactName,
        status: this.search.status
      }

      this.loading = true
      this.loadingText = '加载数据中...'
      getMerchantList(data)
        .then((res) => {
          this.loading = false
          this.list = res.data
          this.total = res.total
          console.log(res)
          console.log(data)
          console.log(this.list)
        })
        .catch(() => {
          this.loading = false
        })
    },

    subTradeTerminal(id) {
      this.$parent.openPage('merchant-tradeTerminal-list', {
        merchant_id: id
      })
    },
    tradeDeviceList(id) {
      this.$parent.openPage('merchant-tradeDevice-list', {
        merchant_id: id
      })
    },
    info(id) {
      this.$parent.openPage('merchant-info', {
        merchant_id: id
      })
    },
    normalMerchant(row) {
      this.$confirm('确定解冻商户么?', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '解冻',
        cancelButtonText: '放弃'
      })
        .then(() => {
          normalMerchant(row.id).then((res) => {
            this.$message({
              message: '解冻商户成功',
              type: 'success'
            })
            this.fetchData()
          })
        })
        .catch((action) => {})
    },
    freezeMerchant(row) {
      this.$confirm('确定冻结商户么?', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '冻结',
        cancelButtonText: '放弃'
      })
        .then(() => {
          freezeMerchant(row.id).then((res) => {
            this.$message({
              message: '冻结商户成功',
              type: 'success'
            })
            this.fetchData()
          })
        })
        .catch((action) => {})
    },
    openingWechant(id) {
      this.loading = true
      this.loadingText = '开通微信支付中...'
      putOpenWx({ merchant_id: id })
        .then((res) => {
          this.$message({
            message: '开通微信支付成功',
            type: 'success'
          })
          this.fetchData()
        })
        .catch((err) => {
          this.$message({
            message: err.message,
            type: 'error'
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    openingAlipay(id) {
      this.loading = true
      this.loadingText = '开通支付宝支付中...'
      putOpenAli({ merchant_id: id })
        .then((res) => {
          this.$message({
            message: '开通支付宝支付成功',
            type: 'success'
          })
          this.fetchData()
        })
        .catch((err) => {
          this.$message({
            message: err.message,
            type: 'error'
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    openingUnoin(id) {
      this.loading = true
      this.loadingText = '开通支付中...'
      putOpenUnion({ merchant_id: id })
        .then((res) => {
          this.$message({
            message: '开通支付成功,等待通联审核',
            type: 'success'
          })
          this.fetchData()
        })
        .catch((err) => {
          this.$message({
            message: err.message,
            type: 'error'
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    wxStatus(row) {
      const h = this.$createElement
      wxStatusApi(row.id).then((res) => {
        this.$msgbox({
          title: '报文信息',
          message: h('div', null, [
            h('strong', null, '申请编号: '),
            h(
              'span',
              {
                style: {
                  color: 'teal',
                  'word-break': 'normal',
                  'word-wrap': 'break-word !important'
                }
              },
              res.data.wx_applyment_id
            ),
            h('br'),
            h('strong', null, '请求结果: '),
            h(
              'span',
              {
                style: {
                  color: 'teal',
                  'word-break': 'normal',
                  'word-wrap': 'break-word !important'
                }
              },
              res.data.wx_upload_status
            )
          ]),
          confirmButtonText: '关闭',
          callback: (action) => {}
        })
      })
    },
    rejectChange(row) {
      rejectChangeApi(row.id).then((res) => {
        this.$message({
          message: '驳回修改成功',
          type: 'success'
        })
        this.fetchData()
      })
    },
    // 查看通联商户状态
    allinpayStatus(row) {
      const h = this.$createElement
      allinpayStatusApi(row.id).then((res) => {
        const status = {
          '00': '受理成功待提交审核',
          '01': '审核中',
          '02': '审核通过',
          '03': '审核失败',
          '04': '提交审核失败',
          '06': '已冻结',
          '07': '已关闭'
        }
        console.log(res.data)
        this.$msgbox({
          title: '通联商户状态',
          message: h('div', null, [
            h('strong', null, '状态值: '),
            h(
              'span',
              {
                style: {
                  color: 'teal',
                  'word-break': 'normal',
                  'word-wrap': 'break-word !important'
                }
              },
              status[res.data.auditstatus]
            ),
            //
            h('br'),
            h('strong', null, '描述:'),
            h('span', {
              style: {
                'color': 'teal',
                'word-break': 'normal',
                'word-wrap': 'break-word !important'
              }
            }, res.data.retmsg = res.data.auditstatus === '03' ? '请扫描合规性补录二维码查询' : res.data.retmsg),

            h('br'),
            h('strong', null, '通联商户编号: '),
            h(
              'span',
              {
                style: {
                  color: 'teal',
                  'word-break': 'normal',
                  'word-wrap': 'break-word !important'
                }
              },
              res.data.mchid
            )
          ]),
          confirmButtonText: '关闭',
          callback: (action) => {}
        })
      })
    },
    allinpayElectSignStatus(row) {
      const h = this.$createElement
      allinpayElectSignStatusApi(row.id).then((res) => {
        const status = {
          0: '成功',
          1: '失败',
          2: '签约中',
          9: '未签约'
        }
        let msg = ''
        let state = ''
        if (res.data.retcode === 'FAIL') {
          msg = res.data.retmsg
          state = '失败'
        } else {
          msg = res.data.errmsg
          state = status[res.data.electsignstatus]
        }
        this.$msgbox({
          title: '通联签约状态',
          message: h('div', null, [
            h('strong', null, '状态值: '),
            h(
              'span',
              {
                style: {
                  color: 'teal',
                  'word-break': 'normal',
                  'word-wrap': 'break-word !important'
                }
              },
              state
            ),
            h('br'),
            h('strong', null, '描述: '),
            h(
              'span',
              {
                style: {
                  color: 'teal',
                  'word-break': 'normal',
                  'word-wrap': 'break-word !important'
                }
              },
              msg
            )
          ]),
          confirmButtonText: '关闭',
          callback: (action) => {}
        })
      })
    },
    allinpayElectSign(row) {
      allinpayElectSignApi(row.id).then((res) => {
        this.$message({
          message: '重新下发电子协议成功',
          type: 'success'
        })
      })
    },
    repaircusrgc(row) {
      this.repaircusrgcUrl =
        '/ldyf/hjjf/admin/merchant/repaircusrgc/' +
        row.id +
        '?token=' +
        getToken()
      // this.repaircusrgcUrl = 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
      this.repaircusrgcVisible = true
    },

    // 合规性状态查询
    async compliance(row) {
      // console.log(row);
      const h = this.$createElement
      heguizhuangTai(row.id).then((res) => {
        // console.log(res);
        const status = {
          '00': '待审核状态',
          '02': '审核完毕',
          '03': '已补录待审核',
          '04': '待二次补充',
          '05': '补充完毕',
          '09': '七天未处理系统延迟冻结'
        }
        const jieguo = {
          0: '正常',
          2: '降低风控',
          3: '延迟冻结',
          4: '冻结'
        }
        const headresult = {
          1: '完全一致',
          4: '无招牌经营内容一致',
          6: '照片无法体现门头',
          7: '疑似截图/翻拍',
          8: '商户简称不一致',
          9: '疑似冒用',
          0: '其他不一致'
        }
        const innerresult = {
          1: '完全一致',
          5: 'MCC选择错误',
          6: '疑似截图/翻拍',
          7: '场景未体现经营范围',
          8: '疑似冒用',
          0: '其他不一致'
        }
        const handpickresult = {
          1: '一致',
          3: '疑似截图/翻拍',
          5: '身份证未手持或不清晰',
          6: '疑似冒用',
          0: '其他不一致'
        }
        const peasonheadresult = {
          1: '一致',
          3: '疑似截图/翻拍',
          4: '未与店铺合照',
          5: '疑似冒用',
          0: '其他不一致'
        }
        const legalidresult = {
          1: '完全一致',
          4: '复印件正、反需盖章',
          5: '疑似截图/翻拍',
          6: '疑似冒用',
          7: '证件日期不一致',
          0: '其他不一致'
        }
        const rentctresult = {
          1: '完全一致',
          4: '合同不规范/无合同',
          5: '合同缺少盖章或签字',
          6: '疑似冒用',
          7: '租赁地址/承租人与系统内不一致',
          8: '免审',
          0: '其他不一致'
        }
        const clearparamresult = {
          1: '一致',
          2: '不一致（废止）',
          3: '无照片（废止）',
          4: '缺少银行章',
          5: '账号不清晰',
          6: '疑似截图/翻拍',
          7: '复印件未盖公司章',
          8: '疑似冒用',
          0: '其他不一致'
        }
        const authresult = {
          1: '合规',
          3: '授权必须为法人',
          4: '具体业务未明确',
          5: '被授权人未签字',
          6: '授权日期不规范',
          7: '疑似冒用',
          0: '其他不一致'
        }
        const subbranchresult = {
          1: '省市一致',
          2: '注册地与经营地不一致',
          3: '经营地与门店不一致'
        }

        const tishi = ''

        if (res.data.handledetail !== '') {
          this.tishi =
            res.data.handledetail +
            headresult +
            innerresult +
            handpickresult +
            peasonheadresult +
            legalidresult +
            rentctresult +
            clearparamresult +
            authresult +
            subbranchresult
        }
        // console.log(res.data.handledetail);
        // console.log(tishi);

        this.$msgbox({
          title: '合规性状态',
          message: h('div', null, [
            h('strong', null, '审核状态: '),
            h(
              'span',
              {
                style: {
                  color: 'teal',
                  'word-break': 'normal',
                  'word-wrap': 'break-word !important'
                }
              },
              status[res.data.cfstate]
            ),
            h('br'),
            h('strong', null, '审核结果: '),
            h(
              'span',
              {
                style: {
                  color: 'teal',
                  'word-break': 'normal',
                  'word-wrap': 'break-word !important'
                }
              },
              jieguo[res.data.handlestate]
            ),
            h('br'),
            h('strong', null, '审核异常错误信息: '),
            h(
              'span',
              {
                style: {
                  color: 'teal',
                  'word-break': 'normal',
                  'word-wrap': 'break-word !important'
                }
              },
              res.data.handlemsg
            ),
            h('br'),
            h('strong', null, '审核详情: '),
            h(
              'span',
              {
                style: {
                  color: 'teal',
                  'word-break': 'normal',
                  'word-wrap': 'break-word !important'
                }
              },
              tishi
            )
          ]),
          confirmButtonText: '关闭',
          callback: (action) => {}
        })
      })
    },
    // 搜索方式切换
    handleCommand(command) {
      const showhideMap = {
        'a': 'Showhide1',
        'b': 'Showhide2',
        'c': 'Showhide3',
        'd': 'Showhide4',
        'e': 'Showhide5',
        'f': 'Showhide6'
      }
      const showhideKey = showhideMap[command]
      if (showhideKey) {
        this[showhideKey] = !this[showhideKey]
      }
    }
  }
}

