<docs lang="zh-CN">
登录表单
</docs>

<docs lang="en-US">
login form
</docs>

<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import { ProConfigProvider, ProFormCaptcha, ProFormCheckbox, ProFormPassword, ProFormText, ProLoginForm, setAlpha } from '@antdv-next1/pro-components'
import { AlipayCircleOutlined, LockOutlined, MobileOutlined, TaobaoCircleOutlined, UserOutlined, WeiboCircleOutlined } from '@antdv-next/icons'
import { message, Space, Tabs, theme } from 'antdv-next'
import { computed, h, shallowRef } from 'vue'

const { token } = theme.useToken()
type LoginType = 'phone' | 'account'

const loginType = shallowRef<LoginType>('phone')
const [messageApi, ContextHolder] = message.useMessage()

const iconStyles = computed(() => ({
  marginInlineStart: '16px',
  color: setAlpha(token.value.colorTextBase, 0.2),
  fontSize: '24px',
  verticalAlign: 'middle',
  cursor: 'pointer',
}) as CSSProperties)
</script>

<template>
  <div class="p-6">
    <ContextHolder />
    <ProConfigProvider :hashed="false">
      <div :style="{ backgroundColor: token.colorBgContainer }">
        <ProLoginForm
          logo="https://github.githubassets.com/favicons/favicon.png"
          title="Github"
          sub-title="全球最大的代码托管平台"
          :actions="h(Space, null, () => [
            '其他登录方式',
            h(AlipayCircleOutlined, { style: iconStyles }),
            h(TaobaoCircleOutlined, { style: iconStyles }),
            h(WeiboCircleOutlined, { style: iconStyles }),
          ])"
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
                strengthText:
                  'Password should contain numbers, letters and special characters, at least 8 characters long.',
                statusRender: (value) => {
                  const getStatus = () => {
                    if (value && value.length > 12) {
                      return 'ok';
                    }
                    if (value && value.length > 6) {
                      return 'pass';
                    }
                    return 'poor';
                  };
                  const status = getStatus();
                  if (status === 'pass') {
                    return h('div', { style: { color: token.colorWarning } }, ' 强度：中');
                  }
                  if (status === 'ok') {
                    return h('div', { style: { color: token.colorSuccess } }, '强度：强')
                  }
                  return h('div', { style: { color: token.colorError } }, '强度：弱')
                },
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
        </ProLoginForm>
      </div>
    </ProConfigProvider>
  </div>
</template>

<style scoped></style>
