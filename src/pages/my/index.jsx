import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text,Map } from '@tarojs/components'
import './index.styl'

export default class Index extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  go = () => {
    Taro.navigateTo({
      url: 'pages/index/index'
    })
  }

  onTap=(e)=>{
    console.log("test");
    console.log(e);
  }

  render () {
    return (
      <View className='index'>
        <Text onClick={this.go}>我的</Text>
        <Map onClick={this.onTap} />
      </View>
    )
  }
}