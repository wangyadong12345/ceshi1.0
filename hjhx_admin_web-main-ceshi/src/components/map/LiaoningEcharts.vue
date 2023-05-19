<template>
  <div>
    <!-- <div class="title">辽宁省朝阳市</div> -->
    <div ref="main" style="width: 100%;height:100%;" />
  </div>
</template>

<script>
const dataRouter = [
  {
    code: '211381',
    name: '北票市',
    namePy: 'beipiao'
  }
]
export default {
  name: 'Echarts',
  props: {
    mapData: {
      default: () => { return [] },
      type: Array
    }
  },
  data() {
    return {
      dataRouter,
      mapJson: '',
      totalData: [], // 全部数据
      name: '北票市',
      nameArr: ['北票市'], // 标题
      regionName: []// 地区名
    }
  },
  watch: {
    mapData() {
      this.setOptions()
    }
    // 监听地区点击事件
    // regionName() {
    //   this.getRegionClick()
    // }
  },
  mounted() {
    this.map = this.$echarts.init(this.$refs.main)
    window.onresize = this.map.resize
    this.mapJson = require(`@/static/${this.name}.json`)
    this.initMap()
    this.setOptions()
    this.getRegionClick()
  },
  methods: {
    backLevel() {
      if (this.nameArr.length > 1) {
        this.nameArr.pop()
        this.name = this.nameArr[this.nameArr.length - 1]
      }
    },
    // 初始化地图
    initMap() {
      this.$echarts.registerMap(this.name, this.mapJson)
      const option = this.getMapOpt()
      if (option && typeof option === 'object') {
        this.map.setOption(option, true)
      }
      this.map.setOption(option)
      this.setOptions()
    },
    // 地图属性
    getMapOpt() {
      return {
        title: {
          // text: this.nameArr.join('-'),
          textStyle: {
            color: '#333333',
            fontStyle: 'normal',
            fontSize: 20
          },
          // textAlign: 'center', // 标题文本居中
          left: 'center', // 标题水平居中
          top: '20px'
        },
        geo: {
          map: this.name,
          label: {
            show: true,
            color: '#333333'
          },
          roam: false,
          itemStyle: {
            areaColor: '#fff',
            borderColor: '#333333',
            borderWidth: 1,
            emphasis: {
              areaColor: '#d0ebea', // hover效果
              borderColor: '#457980'
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: function(p) {
              return `<div>城市：${p.name}</div>  <div>数量：105</div>`
            }

          },
          left: '20%',
          right: '5%',
          top: '10%',
          bottom: '5%'
        },
        tooltip: {

        },

        series: [{
          type: 'scatter',
          coordinateSystem: 'geo',
          geoIndex: 0,
          symbol: 'pin',
          symbolSize: [20, 30],
          data: []
        }]
      }
    },

    setOptions() {
      const option = {
        series: [{
          data: this.mapData
        }]
      }
      this.$nextTick(() => {
        this.map.setOption(option)
      })
    },

    // 地区点击事件
    getRegionClick() {
      this.map.on('click', (param) => {
        this.regionName = param.region.name
        // console.log(this.regionName)
        this.$store.commit('updateRegionName', this.regionName)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.title{
    position: absolute;
    left: 0;
    top: 0;
}
</style>
