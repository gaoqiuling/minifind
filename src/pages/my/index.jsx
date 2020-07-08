import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { Block, View, Image, OpenData, Button } from '@tarojs/components'
// import AddTip from '../../components/add-tip'
import './index.styl'

export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      clubAuth: '',
      userName: "秋秋",
      mobile: "135****7970",

    }
  }
  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  loginBtnClick = () => {
    // this.loginRef.login({
    //   type: 'switch'
    // })
  }


  onTap = () => {
    console.log("onTap");
  }

  showTip = () => {
    Taro.showToast({
      icon: 'none',
      title: '开发中，敬请期待',
      duration: 2000
    });
  }


  render() {
    const isLogin = true;
    const { userName, mobile } = this.state;
    return (
      <Block>
        <View className='self'>
          <View className='header-bg'>
            <Image src='https://n1image.hjfile.cn/res7/2019/04/19/0908df57ba285614ec0d0fdc3593ebbd.png' />
          </View>
          <View className='info'>
            {isLogin && (
              <View className='open-info'>
                <View className='avatar'>
                  <OpenData type='userAvatarUrl' />``
                </View>
                <View className='name_phone'>
                  <OpenData className='name' type='userNickName' />
                  {userName && (<View className='username'>{'用户名：' + userName}</View>)}
                  {mobile && (<View className='mobile'>{'手机号：' + mobile}</View>)}
                </View>
                <View className='switch-account' onTap={this.loginBtnClick}>
                  <Image
                    className='switch-icon'
                    src='https://n1image.hjfile.cn/res7/2019/04/26/4a83425896a2230226c71013167b3c42.png'
                  />
                  <View className='switch-txt'>切换账号</View>
                </View>
              </View>
            )}
            {!isLogin && (
              <View className='unlogin-info' onTap={this.loginBtnClick}>
                <View className='avatar'>
                  <Image src='https://n1image.hjfile.cn/res7/2018/11/27/16ef01bff43d91174c2c634e53fdb5f6.png' />
                </View>
                <View className='unlogin name'>Hi，请登录</View>
              </View>
            )}
          </View>
          {isLogin ? (
            <Block>
              <View className='section' onClick={this.showTip}>
                <View className='set-icon icon' />绑定穿戴设备
                {/* <AddTip /> */}
              </View>
              <View className='section line'>
                <Button className='feedback-btn' openType='contact' />
                <View className='feedback-icon icon' />客服中心
              </View>
            </Block>
          ) : (
              <View className='login-box'>
                <View className='page-unlogin'>
                  <Image
                    className='pic'
                    src='https://n1image.hjfile.cn/res7/2018/12/19/9f8252a1a7d4b90d317ff619629bba3b.png'
                  />
                  <View className='txt'>你还没有登录，请登录</View>
                  <View className='login-btn' onTap={this.loginBtnClick}>
                    登录
                </View>
                </View>
              </View>
            )}
          <View className='version'>ver.1.0.0</View>
        </View>
        {/* <LoginBtn ref={this.loginRef} onSuccess={this.loginSuccess} /> */}
      </Block>
    )
  }
}