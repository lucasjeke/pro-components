import { useStyle } from '@antdv-next1/pro-provider'

export default useStyle('ProDescriptions', (token) => {
  const { antCls, componentCls } = token

  return {
    [componentCls]: {
      [`${antCls}-descriptions-view > table`]: {
        width: '100%',
      },
      [`&${componentCls}-ellipsis ${antCls}-descriptions-view > table`]: {
        tableLayout: 'fixed',
      },
      [`${antCls}-descriptions-item-container, ${antCls}-descriptions-item-content`]: {
        minWidth: 0,
      },
    },
  }
})
