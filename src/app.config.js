export default {
  pages: [
    'pages/index/index',
    'pages/my/index',
    'pages/create/index',
  ],
  tabBar: {
    list: [{
      iconPath: 'images/my-daka.png',
      selectedIconPath: 'images/my-daka-selected.png',
      pagePath: 'pages/index/index',
      text: '同城发现'
    }, {
      iconPath: 'images/explore.png',
      selectedIconPath: 'images/explore-selected.png',
      pagePath: 'pages/create/index',
      text: '创建'
    }, {
      iconPath: 'images/self.png',
      selectedIconPath: 'images/self-selected.png',
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
