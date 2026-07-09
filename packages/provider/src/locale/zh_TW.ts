import type { ProLocale } from './zh_CN'

const zhTW: ProLocale = {
  moneySymbol: 'NT$',
  deleteThisLine: '刪除此行',
  copyThisLine: '複製此行',
  sortUpThisLine: '向上排序',
  sortDownThisLine: '向下排序',
  emptyListValidateMessage: '列表不能為空',
  form: {
    lightFilter: {
      more: '更多篩選',
      clear: '清除',
      confirm: '確認',
      itemUnit: '項',
    },
    captcha: {
      getCaptcha: '取得驗證碼',
      resendAfter: '秒後重新取得',
    },
    upload: {
      buttonText: '按一下上傳',
      draggerTitle: '按一下或拖曳檔案到此區域以上傳',
      draggerDescription: '支援單次或批次上傳',
    },
    modal: {
      okText: '確認',
      cancelText: '取消',
    },
  },
  time: {
    seconds: '秒',
    minutes: '分鐘',
    hours: '小時',
    days: '天',
    ago: '前',
  },
  tableForm: {
    search: '查詢',
    reset: '重置',
    submit: '提交',
    collapsed: '展開',
    expand: '收起',
    inputPlaceholder: '請輸入',
    selectPlaceholder: '請選擇',
  },
  alert: {
    clear: '取消選擇',
    selected: '已選擇',
    item: '項',
  },
  pagination: {
    total: {
      range: '第',
      total: '條/總共',
      item: '條',
    },
  },
  tableToolBar: {
    startPin: '固定到左邊',
    endPin: '固定到右邊',
    noPin: '不固定',
    startFixedTitle: '固定在左側',
    endFixedTitle: '固定在右側',
    noFixedTitle: '不固定',
    reset: '重置',
    columnDisplay: '列展示',
    columnSetting: '列設置',
    fullScreen: '全屏',
    exitFullScreen: '退出全屏',
    reload: '刷新',
    density: '密度',
    densityDefault: '正常',
    densityLarger: '默認',
    densityMedium: '中等',
    densitySmall: '緊湊',
  },
  stepsForm: {
    next: '下一步',
    prev: '上一步',
    submit: '完成',
  },
  loginForm: {
    submitText: '登入',
  },
  editableTable: {
    defaultFieldLabel: '此項',
    defaultFieldType: '文字',
    onlyOneLineEditor: '只能同時編輯一行',
    onlyAddOneLine: '只能同時新增一行',
    action: {
      save: '保存',
      cancel: '取消',
      delete: '刪除',
      add: '新增一行資料',
    },
  },
  switch: {
    open: '打開',
    close: '關閉',
  },
}

export default zhTW
