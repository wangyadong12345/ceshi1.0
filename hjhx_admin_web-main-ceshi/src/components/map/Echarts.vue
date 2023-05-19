<template>
  <div>
    <!-- <el-button class="filter-item backBtn" type="primary" icon="el-icon-back" @click="backLevel">返回</el-button> -->
    <div ref="main" style="width: 100%;height:100%;" />
  </div>
</template>

<script>
const dataRouter = [
  {
    code: '140000',
    name: '山西省',
    namePy: 'shanxi'
  },
  {
    code: '140200',
    name: '大同市',
    namePy: 'datong'
  },
  {
    code: '140500',
    name: '晋城市',
    namePy: 'jincheng'
  },
  {
    code: '140700',
    name: '晋中市',
    namePy: 'jinzhong'
  },
  {
    code: '141000',
    name: '临汾市',
    namePy: 'linfen'
  },
  {
    code: '141100',
    name: '吕梁市',
    namePy: 'lvliang'
  },
  {
    code: '140600',
    name: '朔州市',
    namePy: 'shuozhou'
  },
  {
    code: '140100',
    name: '太原市',
    namePy: 'taiyuan'
  },
  {
    code: '140900',
    name: '忻州市',
    namePy: 'xinzhou'
  },
  {
    code: '140300',
    name: '阳泉市',
    namePy: 'yangquan'
  },
  {
    code: '140800',
    name: '运城市',
    namePy: 'yuncheng'
  },
  {
    code: '140400',
    name: '长治市',
    namePy: 'changzhi'
  }
]
export default {
  name: 'Echarts',
  props: {
    mapData: {
      default: () => { return [] },
      type: Array
    }
    // 地区名
    // regionName: {
    //   default: () => { return [] },
    //   type: String
    // }
  },
  data() {
    return {
      dataRouter,
      mapJson: '',
      totalData: [], // 全部数据
      name: '山西省',
      nameArr: ['山西省'], // 标题
      regionName: []// 地区名
      // moni: [['112.53	', '37.87', 12],
      //   ['112.65', '38.05', 23],
      //   ['112.33', '37.62', 34], ['113.08', '36.18', 5], ['114.2', '39.47', 45]]
      // moni: [
      //   { name: '1', value: ['112.53', '37.87'] },
      //   { name: '2', value: ['112.65', '38.05'] }
      // ]
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
    // // 点击展开区县级地区
    // this.map.on('click', (param) => {
    //   //
    //   event.stopPropagation()// 阻止冒泡

    //   const cur = this.dataRouter.some((item, index) => {
    //     return item.name === param.name
    //   })

    //   if (cur) {
    //     this.name = param.name
    //     this.nameArr.push(this.name)
    //     // //
    //     this.map.dispose()
    //     this.map = this.$echarts.init(this.$refs.main)

    //     this.toNewMap()
    //   }
    // })

    // 地区的点击事件
    // this.map.on('click', (param) => {
    //   console.log(param.region.name)
    // })

    this.mapJson = require(`@/static/${this.name}.json`)
    this.initMap()
    this.setOptions()
    this.getRegionClick()
  },
  methods: {
    backLevel() {
      // //
      if (this.nameArr.length > 1) {
        this.nameArr.pop()
        this.name = this.nameArr[this.nameArr.length - 1]
        // this.toNewMap()
      }
    },
    // 经纬度
    // toNewMap() {
    //   this.mapJson = require(`@/static/${this.name}.json`)
    //   this.initMap()
    // },
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
          text: this.nameArr.join('-'),
          textStyle: {
            color: '#333333',
            fontStyle: 'normal',
            fontSize: 20
          },
          // textAlign: 'center', // 标题文本居中
          left: 'center', // 标题水平居中
          top: '20px'
        },
        // 视觉映射组件
        // visualMap: {
        //   min: 0,
        //   max: 50,
        //   show: false,
        //   splitNumber: 5,
        //   itemWidth: '40px',
        //   itemHeight: '20px',
        //   top: '20px',
        //   inRange: {
        //     color: ['#FACD91', '#74DFB2', '#81D3F8', '#768FDE', '#e9969f'].reverse()
        //   },
        //   textStyle: {
        //     color: '#333'
        //   }
        // },
        geo: {
          map: this.name,

          label: {
            show: true,
            color: '#333333'
            // emphasis: {
            //   show: true,
            //   color: '#457980'
            // }
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
              // return `<div>名称:${p.name}</div><div>经度:${p.value[0]}</div><div>纬度:${p.value[1]}</div><div>级别:${p.value[2]}</div>`
              return `<div>城市：${p.name}</div>  <div>数量：105</div>`
            }

          },
          left: '15%',
          right: '10%',
          top: '10%',
          bottom: '5%'
        },
        tooltip: {
          // trigger: 'item',
          // formatter: function(p) {
          //   // return `<div>名称:${p.name}</div><div>经度:${p.value[0]}</div><div>纬度:${p.value[1]}</div><div>级别:${p.value[2]}</div>`
          // }
        },
        // 左侧图例组件
        // legend: {
        //   orient: 'vertical',
        //   top: 'top',
        //   left: 'right',
        //   data: this.nameArr,
        //   textStyle: {
        //     color: '#000'
        //   }
        // },
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
          // name: this.name,
          // type: 'scatter',
          // coordinateSystem: 'geo',
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

</style>
