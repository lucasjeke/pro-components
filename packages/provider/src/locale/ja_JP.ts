import type { ProLocale } from './zh_CN'

const jaJP: ProLocale = {
  moneySymbol: '¥',
  deleteThisLine: 'この行を削除',
  copyThisLine: 'この行をコピー',
  sortUpThisLine: '上へ移動',
  sortDownThisLine: '下へ移動',
  emptyListValidateMessage: 'リストは空にできません',
  form: {
    lightFilter: {
      more: 'もっと',
      clear: 'クリア',
      confirm: '確認',
      itemUnit: '項目',
    },
    captcha: {
      getCaptcha: '認証コードを取得',
      resendAfter: '秒後に再送信',
    },
    upload: {
      buttonText: 'クリックしてアップロード',
      draggerTitle: 'クリックまたはファイルをこのエリアにドラッグしてアップロード',
      draggerDescription: '単一または複数のアップロードに対応',
    },
    modal: {
      okText: '確認',
      cancelText: 'キャンセル',
    },
  },
  time: {
    seconds: '秒',
    minutes: '分',
    hours: '時間',
    days: '日',
    ago: '前',
  },
  tableForm: {
    search: '検索',
    reset: 'リセット',
    submit: '送信',
    collapsed: '展開',
    expand: '折りたたむ',
    inputPlaceholder: '入力してください',
    selectPlaceholder: '選択してください',
  },
  alert: {
    clear: 'クリア',
    selected: '選択済み',
    item: '件',
  },
  pagination: {
    total: {
      range: '第',
      total: '/ 合計',
      item: '件',
    },
  },
  tableToolBar: {
    startPin: '左に固定',
    endPin: '右に固定',
    noPin: 'キャンセル',
    startFixedTitle: '左に固定された項目',
    endFixedTitle: '右に固定された項目',
    noFixedTitle: '固定されてない項目',
    reset: 'リセット',
    columnDisplay: '表示列',
    columnSetting: '列表示設定',
    fullScreen: 'フルスクリーン',
    exitFullScreen: '終了',
    reload: '更新',
    density: '表示密度',
    densityDefault: 'デフォルト',
    densityLarger: '大',
    densityMedium: '中',
    densitySmall: '小',
  },
  stepsForm: {
    next: '次のステップ',
    prev: '前',
    submit: '送信',
  },
  loginForm: {
    submitText: 'ログイン',
  },
  editableTable: {
    defaultFieldLabel: 'この項目',
    defaultFieldType: 'テキスト',
    onlyOneLineEditor: '同時に編集できるのは1行のみです',
    onlyAddOneLine: '同時に追加できるのは1行のみです',
    action: {
      save: '保存',
      cancel: 'キャンセル',
      delete: '削除',
      add: 'データ行を追加',
    },
  },
  switch: {
    open: '開く',
    close: '閉じる',
  },
}

export default jaJP
