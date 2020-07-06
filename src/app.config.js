export default {
  pages: [
    'pages/index/index',
    'pages/my/index',
    'pages/create/index',
  ],
  tabBar: {
    list: [{
      //'iconPath': 'resource/latest.png',
      //'selectedIconPath': 'resource/lastest_on.png',
      pagePath: 'pages/index/index',
      text: '同城发现'
    }, {
      //'iconPath': 'resource/hotest.png',
     // 'selectedIconPath': 'resource/hotest_on.png',
      pagePath: 'pages/create/index',
      text: '创建'
    }, {
     // 'iconPath': 'resource/node.png',
     // 'selectedIconPath': 'resource/node_on.png',
      pagePath: 'pages/my/index',
      text: '我的'
    }],
    'color': '#000',
    'selectedColor': '#56abe4',
    'backgroundColor': '#fff',
    'borderStyle': 'white'
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
}
