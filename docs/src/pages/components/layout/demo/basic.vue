<docs lang="zh-CN">
展示 ProLayout 的典型中后台页面外框：左侧布局、路由菜单、头像操作区、应用列表、PageContainer 内容区、菜单项自定义跳转和 SettingDrawer 运行时配置。
</docs>

<docs lang="en-US">
Demonstrates a typical ProLayout admin shell with left layout, route-driven menu, avatar actions, app list, PageContainer content, custom menu navigation, and runtime settings through SettingDrawer.
</docs>

<script setup lang="ts">
import type { MenuDataItem, MenuItemRender, ProLayoutProps, ProSettings } from '@antdv-next1/pro-components'
import { GridContent, PageContainer, ProLayout, SettingDrawer } from '@antdv-next1/pro-components'
import { DashboardOutlined, EllipsisOutlined, FormOutlined, HomeOutlined, LayoutOutlined, LogoutOutlined, SettingOutlined, SolutionOutlined, TableOutlined, TeamOutlined, UserOutlined } from '@antdv-next/icons'
import { Button, Dropdown, Tag } from 'antdv-next'
import { computed, h, reactive, ref } from 'vue'

const location = reactive({
  path: '/system/user',
})
const avatarProps = ref<ProLayoutProps['avatarProps']>({
  src: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
  alt: 'avatar',
  size: 'small',
  title: 'Serati Ma',
  render: (_, dom) =>
    h(
      Dropdown,
      {
        placement: 'bottomRight',
        menu: {
          items: [
            {
              icon: () => h(UserOutlined),
              key: 'center',
              label: '个人中心',
            },
            {
              icon: () => h(SettingOutlined),
              key: 'setting',
              label: '个人设置',
            },
            {
              type: 'divider',
            },
            {
              icon: () => h(LogoutOutlined),
              key: 'logout',
              label: '退出登录',
            },
          ],
        },
      },
      () => dom,
    ),
})
const bgLayoutImgList = [
  {
    src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
    left: 85,
    bottom: 100,
    height: '303px',
  },
  {
    src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
    bottom: -68,
    right: -45,
    height: '303px',
  },
  {
    src: 'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
    bottom: 0,
    left: 0,
    width: '331px',
  },
]
const state = ref<ProSettings>({
  navTheme: 'dark',
  colorPrimary: '#1677FF',
  layout: 'side',
  compact: false,
  contentWidth: 'Fluid',
  splitMenus: false,
  colorWeak: false,
  fixedHeader: true,
  fixedSiderbar: false,
  siderMenuType: 'sub',
})
const routeObj: MenuDataItem = {
  path: '/',
  name: 'Index',
  redirect: '/dashboard',
  meta: {
    title: '首页',
    icon: HomeOutlined,
  },
  children: [
    {
      path: 'dashboard',
      name: 'Dashboard',
      meta: {
        title: '仪表盘',
        lock: true,
        icon: DashboardOutlined,
      },
    },
    {
      path: 'system',
      name: 'System',
      meta: {
        title: '系统管理',
        icon: SettingOutlined,
      },
      redirect: '/system/user',
      children: [
        {
          path: 'user',
          name: 'User',
          meta: {
            icon: SolutionOutlined,
            title: '用户管理',
          },
        },
        {
          path: 'role',
          name: 'Role',
          meta: {
            icon: TeamOutlined,
            title: '角色管理',
          },
        },
      ],
    },
    {
      path: 'list',
      name: 'List',
      meta: {
        title: '表格管理',
        icon: TableOutlined,
      },
      redirect: '/list/form1',
      children: [
        {
          path: 'form1',
          name: 'Form1',
          meta: {
            icon: LayoutOutlined,
            title: '布局管理',
          },
        },
        {
          path: 'form2',
          name: 'form2',
          meta: {
            icon: FormOutlined,
            title: '表单管理',
          },
        },
      ],
    },
  ],
}
function handleClick(item: Parameters<MenuItemRender>[0]['item']) {
  if (item.path === '/system') {
    location.path = '/system/user'
  }
  else if (item.path === '/list') {
    location.path = '/list/form1'
  }
  else {
    location.path = item.path
  }
}
const footer = [
  h(Button, { key: 3 }, () => '重置'),
  h(
    Button,
    {
      type: 'primary',
      key: 2,
    },
    () => '提交',
  ),
]
const extra = [
  h(Button, { key: 3 }, () => '操作'),
  h(Button, { key: 2 }, () => '操作'),
  h(
    Button,
    {
      type: 'primary',
      key: 1,
      onClick: () => {
        // setNum(num > 0 ? 0 : 40)
      },
    },
    () => '主操作',
  ),
  h(Dropdown, { key: 'dropdown', trigger: ['click'], menu: {
    items: [
      {
        label: 'Dropdown menu',
        key: '1',
      },
      {
        label: 'Dropdown menu 2',
        key: '2',
      },
      {
        label: 'Dropdown menu 3',
        key: '3',
      },
    ],
  } }, () => h(Button, { key: 4, style: { padding: '0 8px' } }, () => h(EllipsisOutlined))),
]
const isDashboard = computed(() => location.path === '/dashboard')
</script>

<template>
  <ProLayout
    v-bind="state"
    :location="location"
    :route="routeObj"
    :bg-layout-img-list="bgLayoutImgList"
    :avatar-props="avatarProps"
    iconfont-url="//at.alicdn.com/t/font_2804900_nzigh7z84gc.js"
    style="min-height: 100vh"
    :app-list="[
      {
        icon: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
        title: 'Ant Design',
        desc: '杭州市较知名的 UI 设计语言',
        url: 'https://ant.design',
      },
      {
        icon: 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
        title: 'AntV',
        desc: '蚂蚁集团全新一代数据可视化解决方案',
        url: 'https://antv.vision/',
        target: '_blank',
      },
      {
        icon: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
        title: 'Pro Components',
        desc: '专业级 UI 组件库',
        url: 'https://procomponents.ant.design/',
      },
      {
        icon: 'https://img.alicdn.com/tfs/TB1zomHwxv1gK0jSZFFXXb0sXXa-200-200.png',
        title: 'umi',
        desc: '插件化的企业级前端应用框架。',
        url: 'https://umijs.org/zh-CN/docs',
      },

      {
        icon: 'https://gw.alipayobjects.com/zos/bmw-prod/8a74c1d3-16f3-4719-be63-15e467a68a24/km0cv8vn_w500_h500.png',
        title: 'qiankun',
        desc: '可能是你见过最完善的微前端解决方案🧐',
        url: 'https://qiankun.umijs.org/',
      },
      {
        icon: 'https://gw.alipayobjects.com/zos/rmsportal/XuVpGqBFxXplzvLjJBZB.svg',
        title: '知识库',
        desc: '团队知识创作与分享工具',
        url: 'https://www.yuque.com/',
      },
      {
        icon: 'https://gw.alipayobjects.com/zos/rmsportal/LFooOLwmxGLsltmUjTAP.svg',
        title: 'Kitchen ',
        desc: 'Sketch 工具集',
        url: 'https://kitchen.alipay.com/',
      },
      {
        icon: 'https://gw.alipayobjects.com/zos/bmw-prod/d3e3eb39-1cd7-4aa5-827c-877deced6b7e/lalxt4g3_w256_h256.png',
        title: 'dumi',
        desc: '为组件开发场景而生的文档工具',
        url: 'https://d.umijs.org/zh-CN',
      },
    ]"
    :breadcrumb-props="{
      onClickItem: (item) => {
        if (item.path === '/system'){
          location.path = '/system/user'
        }
        else {
          location.path = item.path || ''
        }
      },
    }"
  >
    <GridContent v-if="isDashboard">
      <a-card> dashboard</a-card>
    </GridContent>
    <PageContainer
      v-else
      :footer="footer"
      :extra="extra"
      sub-title="简单的描述"
      tab-bar-extra-content="Test tabBarExtraContent"
      :tab-list="[
        {
          label: '基础信息',
          key: 'base',
        },
        {
          label: '详情信息',
          key: 'info',
        },
      ]"
      :tags="h(Tag, { color: 'blue', variant: 'outlined' }, () => 'Running')"
      @back="() => null"
    >
      <div style=" height: 900px;">
        asdas测试
      </div>
      <template #footer>
        <a-button key="3">
          重置
        </a-button>
        <a-button type="primary">
          提交
        </a-button>
      </template>
    </PageContainer>
    <template #menuItemRender="{ item, dom }">
      <component :is="dom" @click="handleClick(item)" />
    </template>
    <SettingDrawer :settings="state" />
  </ProLayout>
</template>

<style scoped></style>
