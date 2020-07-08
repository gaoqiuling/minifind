import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.styl'

export default class Index extends Component {

  constructor(props) {
    super(props);
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
    return (
      <View className='index'>
        <Text onClick={this.go}>创造页</Text>
      </View>
    )
  }
}