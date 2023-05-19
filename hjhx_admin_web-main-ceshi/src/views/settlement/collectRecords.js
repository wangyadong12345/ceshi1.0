import { getCollectRecordsList, nameSearch } from '@/api/settlement/settlement'
import { isNotBlank } from '@/utils/utils'
import moment from 'moment'

export default {
  name: 'settlementCollectRecords',
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      page: 1,
      pageSize: 10,
      searchKey: { merchant_id: '', completeTime: [] },
      settle_batch_id: '',
      selectloading: false,
      options: []
    }
  },
  created() {
    this.initCompleteTime()

    const merchantId = this.$route.params.merchant_id
    this.searchKey.merchant_id = merchantId

    const settle_batch_id = this.$route.params.settle_batch_id
    this.settle_batch_id = settle_batch_id

    this.fetchData()
  },
  methods: {
    search() {
      this.page = 1
      this.fetchData()
    },
    // 远程搜索值变化
    remoteMethod(query) {
      if (query !== '') {
        this.selectloading = true
        const data = {
          page_num: this.page,
          page_size: this.pageSize,
          name: query
        }
        nameSearch(data).then(res => {
          this.selectloading = false
          this.options = res.data
        }).catch(() => {
          this.selectloading = false
        })
      } else {
        this.options = []
      }
    },
    // 查看应收明细
    viewReceive(row) {
      this.$parent.openPage('settlement-receivable', {
        collect_record_id: row.id
      })
    },
    // 初始数据获取
    fetchData() {
      this.loading = true
      const data = {
        page_num: this.page,
        page_size: this.pageSize,
        merchant_id: isNotBlank(this.searchKey.merchant_id) ? this.searchKey.merchant_id : '',
        settle_batch_id: isNotBlank(this.settle_batch_id) ? this.settle_batch_id : ''
      }
      if (isNotBlank(this.searchKey.completeTime) && this.searchKey.completeTime.length === 2) {
        data['start_date'] = moment(this.searchKey.completeTime[0]).format('YYYY-MM-DD HH:mm:ss')
        data['end_date'] = moment(this.searchKey.completeTime[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      getCollectRecordsList(data).then(res => {
        this.loading = false
        this.list = res.data
        this.total = res.total
      }).catch(() => {
        this.loading = false
      })
    },
    handleCurrentChange(page) {
      this.page = page
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
    },
    initCompleteTime() {
      this.searchKey.completeTime = []
      this.searchKey.completeTime.push(moment().startOf('day').toDate())
      this.searchKey.completeTime.push(moment().endOf('day').toDate())
    }
  },
  filters: {
    settlementStatusDict(value) {
      const map = {
        1: '已结算',
        0: '未结算'
      }
      return map[value]
    }
  }
}
