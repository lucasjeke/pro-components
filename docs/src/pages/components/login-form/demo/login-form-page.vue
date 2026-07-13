<docs lang="zh-CN">
 页面级别登录表单
</docs>

<docs lang="en-US">
 页面级别登录表单
</docs>

<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import { ProConfigProvider, ProFormCaptcha, ProFormCheckbox, ProFormPassword, ProFormText, ProLoginFormPage } from '@antdv-next1/pro-components'
import { unit } from '@antdv-next/cssinjs'
import { AlipayCircleFilled, LockOutlined, MobileOutlined, TaobaoCircleFilled, UserOutlined, WeiboCircleFilled } from '@antdv-next/icons'
import { Button, Divider, message, Space, Tabs, theme } from 'antdv-next'
import { computed, h, shallowRef } from 'vue'

const { token } = theme.useToken()
const [messageApi, ContextHolder] = message.useMessage()
type LoginType = 'phone' | 'account'
const loginType = shallowRef<LoginType>('phone')
const iconStyles = computed(() => ({
  color: 'rgba(0, 0, 0, 0.2)',
  fontSize: '18px',
  verticalAlign: 'middle',
  cursor: 'pointer',
}) as CSSProperties)
</script>

<template>
  <ProConfigProvider dark>
    <ContextHolder />
    <div
      :style="{
        backgroundColor: 'white',
        height: '100vh',
      }"
    >
      <ProLoginFormPage
        background-image-url="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
        logo="https://github.githubassets.com/favicons/favicon.png"
        background-video-url="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
        title="Github"
        :container-style="{
          backgroundColor: 'rgba(0, 0, 0,0.65)',
          backdropFilter: 'blur(4px)',
        }"
        sub-title="全球最大的代码托管平台"
        :activity-config="{
          style: {
            boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)',
            color: token.colorTextHeading,
            borderRadius: 8,
            backgroundColor: 'rgba(255,255,255,0.25)',
            backdropFilter: 'blur(4px)',
          },
          title: '活动标题，可配置图片',
          subTitle: '活动介绍说明文字',
          action: h(
            Button,
            {
              size: 'large',
              style: {
                borderRadius: unit(20),
                background: token.colorBgElevated,
                color: token.colorPrimary,
                width: unit(120),
              },
            },
            () => '去看看',
          ),
        }"
        :actions="h(
          'div',
          {
            style: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            },
          },
          [
            h(Divider, { plain: true },
              () => h('span', {
                style: {
                  color: token.colorTextPlaceholder,
                  fontWeight: 'normal',
                  fontSize: 14,
                },
              }, '其他登录方式'),
            ),
            h(Space, {
              align: 'center',
              size: 24,
            }, () => [
              h('div', {
                style: {
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  height: 40,
                  width: 40,
                  border: `1px solid ${token.colorPrimaryBorder}`,
                  borderRadius: '50%',
                },
              }, h(AlipayCircleFilled, {
                style: {
                  ...iconStyles,
                  color: '#1677FF',
                },
              })),
              h('div', {
                  style: {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    height: 40,
                    width: 40,
                    border: `1px solid ${token.colorPrimaryBorder}`,
                    borderRadius: '50%',
                  },
                },
                h(TaobaoCircleFilled, {
                  style: {
                    ...iconStyles,
                    color: '#FF6A10',
                  },
                }),
              ),
              h('div', {
                style: {
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  height: 40,
                  width: 40,
                  border: `1px solid ${token.colorPrimaryBorder}`,
                  borderRadius: '50%',
                },
              }, h(WeiboCircleFilled, { style: {
                ...iconStyles,
                color: '#1890ff',
              } })),
            ]),
          ],
        )"
      >
        <Tabs
          v-model:active-key="loginType"
          centered
          :items="[
            { key: 'account', label: '账号密码登录' },
            { key: 'phone', label: '手机号登录' },
          ]"
        />
        <template v-if="loginType === 'phone'">
          <ProFormText
            :field-props="{
              size: 'large',
              prefix: h(MobileOutlined, { class: 'prefixIcon' }),
            }"
            name="mobile"
            placeholder="手机号"
            :rules="[
              {
                required: true,
                message: '请输入手机号！',
              },
              {
                pattern: /^1\d{10}$/,
                message: '手机号格式错误！',
              },
            ]"
          />

          <ProFormCaptcha
            placeholder="请输入验证码"
            name="captcha"
            :field-props="{
              size: 'large',
              prefix: h(LockOutlined, { class: 'prefixIcon' }),
            }"
            :captcha-props="{
              size: 'large',
            }"
            :rules="[
              {
                required: true,
                message: '请输入验证码！',
              },
            ]"
            @get-captcha="async () => {
              messageApi.success('获取验证码成功！验证码为：1234');
            }"
          />
        </template>
        <template v-if="loginType === 'account'">
          <ProFormText
            name="username"
            :field-props="{
              size: 'large',
              prefix: h(UserOutlined, { class: 'prefixIcon' }),
            }"
            placeholder="用户名: admin or user"
            :rules="[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]"
          />
          <ProFormPassword
            name="password"
            :field-props="{
              size: 'large',
              prefix: h(LockOutlined, { class: 'prefixIcon' }),
            }"
            placeholder="密码: ant.design"
            :rules="[
              {
                required: true,
                message: '请输入密码！',
              },
            ]"
          />
        </template>
        <div style="margin-block-end: 24px">
          <ProFormCheckbox no-style name="autoLogin">
            自动登录
          </ProFormCheckbox>
          <a style="float: right">忘记密码</a>
        </div>
      </ProLoginFormPage>
    </div>
  </ProConfigProvider>
</template>

<style scoped></style>
