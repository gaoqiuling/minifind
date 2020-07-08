import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Map, ScrollView, CoverView, Block } from '@tarojs/components'
import './index.styl'
import QQMapWX from './qqmap-wx-jssdk'

const qqmapsdk = new QQMapWX({
  key: 'NRFBZ-YM4K2-GQXUQ-C6Y5E-NJE6Z-ZQF5V'
});

export default class Index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mapCtx: Taro.createMapContext("myMap"),
      addListShow: false,
      chooseCity: false,
      regionShow: {
        province: false,
        city: false,
        district: true
      },
      regionData: {},
      currentRegion: {
        province: '选择城市',
        city: '选择城市',
        district: '选择城市',
      },
      currentProvince: '选择城市',
      currentCity: '选择城市',
      currentDistrict: '选择城市',
      latitude: '',
      longitude: '',
      centerData: {},
      nearList: [],
      suggestion: [],
      selectedId: 0,
      defaultKeyword: '房产小区',
      keyword: ''
    }
  }

  componentDidMount() {
    this.showMap();
  }

  showMap = () => {
    const self = this;
    const { defaultKeyword } = this.state;
    Taro.showLoading({ title: "加载中" });
    Taro.getLocation({
      type: 'wgs84',
      success(res) {
        console.log(res)
        const latitude = res.latitude
        const longitude = res.longitude
        //你地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            //console.log(res)
            self.setState({
              latitude: latitude,
              longitude: longitude,
              currentRegion: res.result.address_component,
              keyword: defaultKeyword
            })
            // 调用接口
            self.nearby_search();
          },
        });
      },
      fail(err) {
        Taro.hideLoading({});
        Taro.showToast({
          title: '定位失败',
          icon: 'none',
          duration: 1500
        })
        setTimeout(function () {
          Taro.navigateBack({
            delta: 1
          })
        }, 1500)
      }
    });

  }

  //监听拖动地图，拖动结束根据中心点更新页面
  mapChange = (e) => {
    if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
      this.state.mapCtx.getCenterLocation({
        success: function (res) {
          //console.log(res)
          this.setState({
            nearList: [],
            latitude: res.latitude,
            longitude: res.longitude,
          })
          this.nearby_search();
        }
      })
    }

  };
  //重新定位
  reload = () => {
    this.showMap();
  };
  //整理目前选择省市区的省市区列表
  getRegionData = () => {
    let self = this;
    //调用获取城市列表接口
    qqmapsdk.getCityList({
      success: function (res) {//成功后的回调
        //console.log(res)
        let provinceArr = res.result[0];
        let cityArr = [];
        let districtArr = [];
        for (var i = 0; i < provinceArr.length; i++) {
          var name = provinceArr[i].fullname;
          if (self.state.currentRegion.province == name) {
            if (name == '北京市' || name == '天津市' || name == '上海市' || name == '重庆市') {
              cityArr.push(provinceArr[i])
            } else {
              qqmapsdk.getDistrictByCityId({
                // 传入对应省份ID获得城市数据，传入城市ID获得区县数据,依次类推
                id: provinceArr[i].id,
                success: function (res) {//成功后的回调
                  //console.log(res);
                  cityArr = res.result[0];
                  self.setState({
                    regionData: {
                      province: provinceArr,
                      city: cityArr,
                      district: districtArr
                    }
                  })
                },
                fail: function (error) {
                  //console.error(error);
                },
                complete: function (res) {
                  //console.log(res);
                }
              });
            }
          }
        }
        for (var i = 0; i < res.result[1].length; i++) {
          var name = res.result[1][i].fullname;
          if (self.state.currentRegion.city == name) {
            qqmapsdk.getDistrictByCityId({
              // 传入对应省份ID获得城市数据，传入城市ID获得区县数据,依次类推
              id: res.result[1][i].id,
              success: function (res) {//成功后的回调
                //console.log(res);
                districtArr = res.result[0];
                self.setState({
                  regionData: {
                    province: provinceArr,
                    city: cityArr,
                    district: districtArr
                  }
                })
              },
              fail: function (error) {
                //console.error(error);
              },
              complete: function (res) {
                //console.log(res);
              }
            });
          }
        }
      },
      fail: function (error) {
        //console.error(error);
      },
      complete: function (res) {
        //console.log(res);
      }
    });
  };
  //地图标记点
  addMarker = (data) => {
    //console.log(data)
    //console.log(data.title)
    var mks = [];
    mks.push({ // 获取返回结果，放到mks数组中
      title: data.title,
      id: data.id,
      addr: data.addr,
      province: data.province,
      city: data.city,
      district: data.district,
      latitude: data.latitude,
      longitude: data.longitude,
      iconPath: "/images/my_marker.png", //图标路径
      width: 25,
      height: 25
    })
    this.setState({ //设置markers属性，将搜索结果显示在地图中
      markers: mks,
      currentRegion: {
        province: data.province,
        city: data.city,
        district: data.district,
      }
    })
    Taro.hideLoading({});
  };
  //点击选择搜索结果
  backfill = (e) => {
    var id = e.currentTarget.id;
    let name = e.currentTarget.dataset.name;
    for (var i = 0; i < this.state.suggestion.length; i++) {
      if (i == id) {
        //console.log(this.state.suggestion[i])
        this.setState({
          centerData: this.state.suggestion[i],
          addListShow: false,
          latitude: this.state.suggestion[i].latitude,
          longitude: this.state.suggestion[i].longitude
        });
        this.nearby_search();
        return;
        //console.log(this.state.centerData)
      }
    }
  };
  //点击选择地图下方列表某项
  chooseCenter = (e) => {
    var id = e.currentTarget.id;
    let name = e.currentTarget.dataset.name;
    for (var i = 0; i < this.state.nearList.length; i++) {
      if (i == id) {
        this.setState({
          selectedId: id,
          centerData: this.state.nearList[i],
          latitude: this.state.nearList[i].latitude,
          longitude: this.state.nearList[i].longitude,
        });
        this.addMarker(this.state.nearList[id]);
        return;
        //console.log(this.state.centerData)
      }
    }
  };
  //显示搜索列表
  showAddList = () => {
    this.setState({
      addListShow: true
    })
  };
  // 根据关键词搜索附近位置
  nearby_search = () => {
    var self = this;
    Taro.hideLoading();
    Taro.showLoading({
      title: '加载中'
    });
    // 调用接口
    qqmapsdk.search({
      keyword: self.state.keyword,  //搜索关键词
      //boundary: 'nearby(' + self.state.latitude + ', ' + self.state.longitude + ', 1000, 16)',
      location: self.state.latitude + ',' + self.state.longitude,
      page_size: 20,
      page_index: 1,
      success: function (res) { //搜索成功后的回调
        //console.log(res.data)
        var sug = [];
        for (var i = 0; i < res.data.length; i++) {
          sug.push({ // 获取返回结果，放到sug数组中
            title: res.data[i].title,
            id: res.data[i].id,
            addr: res.data[i].address,
            province: res.data[i].ad_info.province,
            city: res.data[i].ad_info.city,
            district: res.data[i].ad_info.district,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng
          });
        }
        self.setState({
          selectedId: 0,
          centerData: sug[0],
          nearList: sug,
          suggestion: sug
        })
        self.addMarker(sug[0]);
      },
      fail: function (res) {
        //console.log(res);
      },
      complete: function (res) {
        //console.log(res);
      }
    });
  };
  //根据关键词搜索匹配位置
  getsuggest = (e) => {
    var _this = this;
    var keyword = e.detail.value;
    _this.setState({
      addListShow: true
    })
    //调用关键词提示接口
    qqmapsdk.getSuggestion({
      //获取输入框值并设置keyword参数
      keyword: keyword, //用户输入的关键词，可设置固定值,如keyword:'KFC'
      location: _this.data.latitude + ',' + _this.data.longitude,
      page_size: 20,
      page_index: 1,
      //region:'北京', //设置城市名，限制关键词所示的地域范围，非必填参数
      success: function (res) {//搜索成功后的回调
        //console.log(res);
        var sug = [];
        for (var i = 0; i < res.data.length; i++) {
          sug.push({ // 获取返回结果，放到sug数组中
            title: res.data[i].title,
            id: res.data[i].id,
            addr: res.data[i].address,
            province: res.data[i].province,
            city: res.data[i].city,
            district: res.data[i].district,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng
          });
        }
        _this.setState({ //设置suggestion属性，将关键词搜索结果以列表形式展示
          suggestion: sug,
          nearList: sug,
          keyword: keyword
        });
      },
      fail: function (error) {
        //console.error(error);
      },
      complete: function (res) {
        //console.log(res);
      }
    });
  };
  //打开选择省市区页面
  chooseCity = () => {
    let self = this;
    self.getRegionData();
    self.setState({
      chooseCity: true,
      regionShow: {
        province: false,
        city: false,
        district: true
      },
      currentProvince: self.state.currentRegion.province,
      currentCity: self.state.currentRegion.city,
      currentDistrict: self.state.currentRegion.district,
    })
  };
  //选择省
  showProvince = () => {
    this.setState({
      regionShow: {
        province: true,
        city: false,
        district: false
      }
    })
  };
  //选择城市
  showCity = () => {
    this.setState({
      regionShow: {
        province: false,
        city: true,
        district: false
      }
    })
  };
  //选择地区
  showDistrict = () => {
    this.setState({
      regionShow: {
        province: false,
        city: false,
        district: true
      }
    })
  };
  //选择省之后操作
  selectProvince = (e) => {
    //console.log(e)
    let self = this;
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    self.setState({
      currentProvince: name,
      currentCity: '请选择城市',
    })
    if (name == '北京市' || name == '天津市' || name == '上海市' || name == '重庆市') {
      var provinceArr = self.state.regionData.province;
      var cityArr = [];
      for (var i = 0; i < provinceArr.length; i++) {
        if (provinceArr[i].fullname == name) {
          cityArr.push(provinceArr[i])
          self.setState({
            regionData: {
              province: self.state.regionData.province,
              city: cityArr,
              district: self.state.regionData.district
            }
          })
          self.showCity();
          return;
        }
      }
    } else {
      let bj = self.state.regionShow;
      self.getById(id, name, bj)
    }
  };
  //选择城市之后操作
  selectCity = (e) => {
    let self = this;
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    self.setState({
      currentCity: name,
      currentDistrict: '请选择城市',
    })
    let bj = self.state.regionShow;
    self.getById(id, name, bj)
  };
  //选择区县之后操作
  selectDistrict = (e) => {
    let self = this;
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    let latitude = e.currentTarget.dataset.latitude;
    let longitude = e.currentTarget.dataset.longitude;
    self.setState({
      currentDistrict: name,
      latitude: latitude,
      longitude: longitude,
      currentRegion: {
        province: self.state.currentProvince,
        city: self.state.currentCity,
        district: name
      },
      chooseCity: false,
      keyword: self.state.defaultKeyword
    })
    self.nearby_search();
  };
  //根据选择省市加载市区列表
  getById = (id, name, bj) => {
    let self = this;
    qqmapsdk.getDistrictByCityId({
      // 传入对应省份ID获得城市数据，传入城市ID获得区县数据,依次类推
      id: id, //对应接口getCityList返回数据的Id，如：北京是'110000'
      success: function (res) {//成功后的回调
        //console.log(res);
        if (bj.province) {
          self.setState({
            regionData: {
              province: self.state.regionData.province,
              city: res.result[0],
              district: self.state.regionData.district
            }
          })
          self.showCity();
        } else if (bj.city) {
          self.setState({
            regionData: {
              province: self.state.regionData.province,
              city: self.state.regionData.city,
              district: res.result[0]
            }
          })
          self.showDistrict();
        } else {
          self.setState({
            chooseCity: false,
          })
        }
      },
      fail: function (error) {
        //console.error(error);
      },
      complete: function (res) {
        //console.log(res);
      }
    });
  };
  //返回上一页或关闭搜索页面
  back1 = () => {
    if (this.state.addListShow) {
      this.setState({
        addListShow: false
      })
    } else {
      Taro.navigateBack({
        delta: 1
      })
    }
  };
  //关闭选择省市区页面
  back2 = () => {
    this.setState({
      chooseCity: false
    })
  };
  //确认选择地址
  selectedOk = (e) => {
    console.log(this.state.centerData)
  };


  render() {
    const { addListShow, suggestion, chooseCity, currentRegion, currentCity, regionShow, nearList } = this.state;
    return (
      <View>
        if (addListShow){
          <View>
            <View class="top">
              <View class="back iconfont icon-fanhui" onClick="back1"></View>
              <View class="search-box {{addListShow?'search-box1':''}}">
                <View class="region" onClick="chooseCity">{currentRegion.district}</View>
                <View class="shu"></View>
                <input bindinput="getsuggest" placeholder="请输入您的店铺地址"></input>
              </View>
            </View>

            <View class="add-list-box">
              <ScrollView class="add-list" scroll-y>
                {suggestion.map((v, i) => {
                  < View class="add-item" key={i}>
                    <View onClick="backfill" id={i} data-name={v.title}>
                      <View class="title">{v.title}</View>
                      <View class="add">{v.addr}</View>
                    </View>
                  </View>
                })}
              </ScrollView>
            </View>
          </View>
        }

        {!addListShow && !chooseCity ?
          (
            <View>
              {/* <!--地图容器--> */}
              <Map id="myMap"
                style="width:100%;height:300px;"
                longitude="{{longitude}}"
                latitude="{{latitude}}" scale="17" bindregionchange="mapChange">
                <CoverView class="top">
                  <CoverView class="back" onClick="back1">
                    <cover-image src="../../images/back.png"></cover-image>
                  </CoverView>
                  <CoverView class="search-box">
                    <CoverView class="region" onClick="chooseCity">{currentRegion.district}</CoverView>
                    <CoverView class="shu"></CoverView>
                    <CoverView class="placeholder" onClick="showAddList">请输入您的店铺地址</CoverView>
                  </CoverView>
                </CoverView>
                <CoverView class="map-prompt">您可拖动地图, 标记店铺准确位置</CoverView>
                <cover-image class="current-site-icon" src="../../images/my_marker.png"></cover-image>
                <CoverView class="reload" onClick="reload">
                  <CoverView class="center1">
                    <CoverView class="center2"></CoverView>
                  </CoverView>
                </CoverView>
              </Map>

              <ScrollView class="near-list" scroll-y>
                {nearList.map((v, index) => {
                  <View class="near-item" key={index}>
                    if(index ==selectedId){
                      <View class="current-site iconfont icon-location"></View>
                    }
                    <View onClick="chooseCenter" id={index} data-name={v.title}>
                      {/* <!--渲染地址title--> */}
                      <View class="title {index == selectedId?'title1':''}">{v.title}</View>
                      {/* <!--渲染详细地址--> */}
                      <View class="add {index == selectedId?'add1':''}">{v.addr}</View>
                    </View>
                  </View>
                })
                }
              </ScrollView>)

              <View class="bottom-box">
                <button onClick="selectedOk">确认地址</button>
              </View>
            </View >
          )
          :
          (<Block></Block>)
        }
        {
          chooseCity ?
            (<View class="region-box">
              <View class="region-top">
                <View class="region-back iconfont icon-fanhui" onClick="back2"></View>
                <View class="title">选择城市</View>
              </View>
              <View class="region-tabs">
                <Text class="tab" onClick="showProvince">{currentProvince}</Text>
                {currentCity ? <Text class="tab" onClick="showCity"></Text> : <Block></Block>}
                {regionShow.district ? <Text class="tab" onClick="showDistrict" onClick="showDistrict">{currentDistrict}</Text> : <Block></Block>}
              </View >
              <ScrollView scroll-y style="height:1050rpx;">
                {regionShow.province ?
                  (<View class="region-list">
                    {regionData.province.map((item, index) => {
                      <View class="region-item" key={index}>
                        <View data-id={item.id} data-name={item.fullname} onClick="selectProvince">
                          <Text>{item.fullname}</Text>
                        </View>
                      </View>
                    })
                    }
                  </View>)
                  : <Block></Block>
                }

                {regionShow.city ?
                  (<View class="region-list">
                    {regionData.city.map((item, index) => {
                      <View class="region-item" key={index}>
                        <View data-id={item.id} data-name={item.fullname} onClick="selectCity">
                          <Text>{item.fullname}</Text>
                        </View>
                      </View>
                    })
                    }
                  </View>)
                  : <Block></Block>
                }

                {regionShow.district ?
                  (<View class="region-list">
                    {regionData.district.map((item, index) => {
                      <View class="region-item" key={index}>
                        <View data-id={item.id} data-name={item.fullname} data-latitude={item.location.lat} data-longitude={item.location.lng} onClick="selectDistrict">
                          <Text>{item.fullname}</Text>
                        </View>
                      </View>
                    })}
                  </View>)
                  : <Block></Block>
                }
              </ScrollView>
            </View>)
            :
            (<Block></Block>)
        }
      </View >
    );
  }
}