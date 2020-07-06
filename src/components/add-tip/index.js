import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import './styles.styl'

export default class AddTip extends Taro.Component {
  config = {
    component: true
  }

  constructor(props) {
    super(props)
    this.state = {
      showStatus: false,
      txt: '正在开发中。。。',
    }
  }

  show() {
    this.setState(
      {
        showStatus: true
      },
      () => {
        setTimeout(() => {
          this.hide()
        }, 10000)
      }
    )
  }

  hide() {
    this.setState({
      showStatus: false
    })
  }

  render() {
    const { showStatus, txt } = this.state

    return (
      <View className='add-tip fadeIn' hidden={!showStatus}>
        <View className='add-tip-txt'>{txt}</View>
      </View>
    )
  }
}
