import MerchantInfo from '@/components/merchant/merchantInfo'
import {
  agreeMerchantApprove,
  getMerchantApproveInfo,
  rejectMerchantApprove
} from '@/api/merchant/merchantApi'

export default {
  name: 'merchantApproveIndex',
  components: { MerchantInfo },
  data() {
    return {
      merchantInfo: {
        'merchant_info': {
          'alipay_no': '',
          'approve_status': 0,
          'merchant_name': '', // 用户名称
          'merchant_no': '',
          'merchant_out_no': '', // 商户第三方编号
          'wechat_no': '', // 双虎内部编号
          'merchant_short_name': ''
        },
        'merchant_info_ext': {
          'bank_card_no': '',
          'bank_name': '',
          'bank_name_sub': '',
          'bank_photo': '',
          'bank_type': '',
          'business_address': '',
          'business_area': '',
          'business_city': '',
          'business_license': '',
          'business_period_begin': '',
          'business_period_end': '',
          'business_person': '',
          'business_photo': '',
          'business_province': '',
          'contact_email': '',
          'contact_id_card': '',
          'contact_id_card_after': '',
          'contact_id_card_before': '',
          'contact_id_card_period_begin': '',
          'contact_id_card_period_end': '',
          'contact_name': '',
          'contact_phone': '',
          'contact_type': '',
          'create_time': '',
          'create_user': ''
        }
      },
      splitForm: {
        rate: 0.0023,
        agent: 0.00001,
        trade_limit: 1000
      },
      agentUser: {},
      loading: false
    }
  },
  created() {
    const merchantId = this.$route.params.merchant_id
    if (merchantId) {
      this.merchantId = merchantId
      this.fetchData()
    } else {
      this.$message.error('获取商户信息错误')
    }
  },
  methods: {
    fetchData() {
      getMerchantApproveInfo(this.merchantId).then(res => {
        this.merchantInfo = res.data
      })
    },
    agree() {
      this.loading = true
      const data = {
        rate: this.splitForm.rate,
        agent_rate: this.splitForm.agent,
        trade_limit: this.splitForm.trade_limit
      }
      console.log(data)
      agreeMerchantApprove(this.merchantId, data).then(res => {
        this.$message({
          message: '审批同意成功',
          type: 'success'
        })
        // this.$router.push('../../../views/merchant/merchantListIndex')
        // 跳转
        this.$router.push({ name: 'merchant-list' })
        this.fetchData()
      })
    },
    reject() {
      this.loading = true
      rejectMerchantApprove(this.merchantId).then(res => {
        this.$message({
          message: '审批驳回成功',
          type: 'success'
        })
        this.$router.go(-1)
        this.fetchData()
      })
    }
  }
}

