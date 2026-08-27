import type { App, Plugin } from 'vue'
import type { DescriptionsPageSkeletonProps } from './components/Descriptions'
import type { ListPageSkeletonProps } from './components/List'
import type { ResultPageSkeletonProps } from './components/Result'
import { defineComponent } from 'vue'
import DescriptionsPageSkeleton from './components/Descriptions'
import ListPageSkeleton from './components/List'
import ResultPageSkeleton from './components/Result'

export type ProSkeletonProps = ListPageSkeletonProps & DescriptionsPageSkeletonProps & ResultPageSkeletonProps & {
  type?: 'list' | 'result' | 'descriptions'
  active?: boolean
}

const _ProSkeleton = defineComponent<ProSkeletonProps>((props) => {
  return () => {
    const { type = 'list', ...rest } = props
    if (type === 'result') {
      return <ResultPageSkeleton {...rest} />
    }

    if (type === 'descriptions') {
      return <DescriptionsPageSkeleton {...rest} />
    }
    return <ListPageSkeleton {...rest} />
  }
}, {
  name: 'ProSkeleton',
  inheritAttrs: false,
})

const ProSkeleton = _ProSkeleton as typeof _ProSkeleton
  & Plugin & {
  }

ProSkeleton.install = (app: App) => {
  app.component(ProSkeleton.name!, ProSkeleton)
}

export default ProSkeleton
