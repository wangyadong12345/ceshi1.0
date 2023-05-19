<template>
  <div>
    <div id="regionNameTitle">{{ regionName ? regionName : "山西省" }}各行业数据分析</div>
    <div ref="chart" style="width:100%;height:100%" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Pieecharts',
  data() {
    return {
    }
  },
  computed: {
    ...mapState(['regionName'])
  },
  created() {
  },
  mounted() {
    this.getEchartData()
  },
  methods: {
    // 饼状图
    getEchartData() {
      const chart = this.$refs.chart
      if (chart) {
        const myChart = this.$echarts.init(chart)
        const option = {
          // title: {
          //   // 点击地图区域切换城市名
          //   text: `${this.regionName}各行业数据分析`,
          //   subtext: '',
          //   left: 'center'
          // },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'horizontal',
            top: 'bottom'
          },
          series: [
            {
              name: '',
              type: 'pie',
              radius: '60%',
              data: [
                { value: 1048, name: '农、林、牧、渔业' },
                { value: 735, name: '采矿业' },
                { value: 580, name: '制造业' },
                { value: 484, name: '电力、热力、燃气及水生产和供应业' },
                { value: 300, name: '建筑业' },
                { value: 1048, name: '交通运输、仓储和邮政业' },
                { value: 735, name: '信息传输、软件和信息技术服务业' },
                { value: 580, name: '批发和零售业' },
                { value: 484, name: '住宿和餐饮业' },
                { value: 300, name: '金融业' },
                { value: 1048, name: '房地产业' },
                { value: 735, name: '租赁和商务服务业' },
                { value: 580, name: '科学研究和技术服务业' },
                { value: 484, name: '水利、环境和公共设施管理业' },
                { value: 300, name: '居民服务、修理和其他服务业' },
                { value: 300, name: '教育' },
                { value: 1048, name: '卫生和社会工作' },
                { value: 735, name: '文化、体育和娱乐业' },
                { value: 580, name: '公共管理、社会保障和社会组织' },
                { value: 484, name: '国际组织' }
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
        myChart.setOption(option)
        window.addEventListener('resize', function() {
          myChart.resize()
        })
        this.$on('hook:destroyed', () => {
          window.removeEventListener('resize', function() {
            myChart.resize()
          })
        })
      }
    }
  }
}
</script>

<style scoped>
#regionNameTitle{
     font-size: 19px;
     font-weight: 700;
     text-align: center;
}
</style>
