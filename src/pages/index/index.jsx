import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Map } from '@tarojs/components'
import './index.styl'

export default class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  go = () => {
    Taro.navigateTo({
      url: '/pages/my/index'
    })
  }

  render() {
    // let [
    //   longitude,
    //   latitude,
    //   showModal,
    //   dataChoice,
    //   checkRadio,
    //   beginTime,
    //   endTime,
    //   historyData,
    //   endX,
    //   endY,
    //   startX,
    //   startY,
    //   historyNote,
    //   address
    // ] = this.state
    // let { personname, cellphone, fixedtelephone } = StateStorage.userInfo;
    // if (!address) {
    //   address = "无位置信息";
    // } else {
    //   let curStr = address.slice(0, 9);
    //   let lastStr = address.slice(9);
    //   curStr += "\n";
    //   address = curStr.concat(lastStr);
    // }
    let markers = [
      {
        iconPath: '',
        id: 1,
        anchor: { x: 0.5, y: 0.8 },
        latitude: 1,
        longitude: 2,
        width: 40,
        height: 40,
        callout: {
          alpha: 0.1,
          content:
            "姓名:" +
            "personname" +
            "\n" +
            "手环号:" +
            "cellphone" +
            " \n" +
            "联系电话:" +
            "fixedtelephone" +
            "\n" +
            "当前地点:" +
            "address" || "无位置信息",

          color: "#000000 ",
          fontSize: 18,
          bgColor: "#FFFFFF",
          display: "BYCLICK",
          padding: 10,
          textAlign: "left",
          boxShadow: "2px 2px 10px #aaa"
        }
      },
      {
        iconPath: 1,
        id: 2,
        latitude: 1,
        longitude: 1,
        width: 30,
        height: 30
      },
      {
        iconPath: '',
        id: 3,
        latitude: 2,
        longitude: 2,
        width: 30,
        height: 30
      }
    ];
    let circles = [
      {
        latitude: 2,
        longitude: 3,
        radius: 60,
        fillColor: "#7cb5ec88",
        color: "#ffffff"
      }
    ];

    let polyline = [
      {
        points: 2,
        width: 5,
        color: "#4CBBCE",
        dottedLine: false
      }
    ];

    return (
      <View>
        <View className='index'>
          <Text>我的</Text>
        </View>
        <View>
          <Map
            className='curMap'
            id='location'
            subkey='s'
            longitude='1'
            latitude='2'
            scale='16'
            markers={markers}
            circles={circles}
            polyline={polyline}
            show-compass='true'
          >
          </Map>


        </View>

      </View>
    );
  }
}