<script setup lang="ts">
import {
  AlipayCircleOutlined,
  GithubOutlined,
  HeartFilled,
  HeartOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
  WechatOutlined,
} from '@antdv-next/icons'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { sponsorRecords } from './records'

const REPOSITORY_URL = 'https://github.com/lucasjeke/pro-components'

const appStore = useAppStore()
const { locale } = storeToRefs(appStore)

const content = {
  'zh-CN': {
    eyebrow: '个人捐赠',
    title: '支持 ProComponents Vue',
    description: '你的捐赠将用于服务器、文档建设以及项目的持续开发与维护。',
    scanTitle: '扫码捐赠',
    scanDescription: '请选择你常用的支付方式，使用手机扫描二维码即可完成捐赠。',
    alipay: '支付宝',
    alipayAlt: '支付宝捐赠二维码',
    wechat: '微信支付',
    wechatAlt: '微信支付捐赠二维码',
    scanHint: '请使用手机扫码捐赠',
    privacy: '捐赠金额完全自愿，无需填写任何个人信息。',
    donorTitle: '捐赠人名单',
    donorDescription: '感谢每一位支持 ProComponents Vue 的朋友。',
    donorCount: '共 {count} 位',
    donorEmptyTitle: '暂无公开的捐赠记录',
    donorEmptyDescription: '经捐赠者同意后，昵称、金额和留言会展示在这里。',
    donorPrivacy: '名单只展示捐赠者同意公开的信息。',
    thanks: '感谢你对开源项目的支持。每一份帮助，都会让我有更多时间持续完善 ProComponents Vue。',
    github: '查看 GitHub 项目',
  },
  'en-US': {
    eyebrow: 'Individual donation',
    title: 'Support ProComponents Vue',
    description: 'This project is currently maintained by one developer. Donations help cover servers, documentation, and ongoing development and maintenance.',
    scanTitle: 'Donate by QR code',
    scanDescription: 'Choose a payment method and scan the QR code with your phone to donate.',
    alipay: 'Alipay',
    alipayAlt: 'Alipay donation QR code',
    wechat: 'WeChat Pay',
    wechatAlt: 'WeChat Pay donation QR code',
    scanHint: 'Scan with your phone to donate',
    privacy: 'Donate any amount you wish. No personal information is required.',
    donorTitle: 'Donors',
    donorDescription: 'Thank you to everyone supporting ProComponents Vue.',
    donorCount: '{count} donors',
    donorEmptyTitle: 'No public donation records yet',
    donorEmptyDescription: 'Names, amounts, and messages will appear here with each donor\'s permission.',
    donorPrivacy: 'Only information approved by donors is shown publicly.',
    thanks: 'Thank you for supporting open source. Every contribution gives me more time to keep improving ProComponents Vue.',
    github: 'View the project on GitHub',
  },
} as const

const page = computed(() => content[locale.value])
const donorCount = computed(() => page.value.donorCount.replace('{count}', String(sponsorRecords.length)))

function formatDate(date: string) {
  return new Intl.DateTimeFormat(locale.value, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}
</script>

<template>
  <main class="sponsor-page">
    <section class="sponsor-intro" aria-labelledby="sponsor-title">
      <div class="sponsor-container">
        <div class="sponsor-eyebrow">
          <UserOutlined />
          <span>{{ page.eyebrow }}</span>
        </div>
        <h1 id="sponsor-title">
          {{ page.title }}
        </h1>
        <p>{{ page.description }}</p>
      </div>
    </section>

    <section class="sponsor-donation" aria-labelledby="sponsor-scan-title">
      <div class="sponsor-container">
        <header class="donation-header">
          <h2 id="sponsor-scan-title">
            {{ page.scanTitle }}
          </h2>
          <p>{{ page.scanDescription }}</p>
        </header>

        <div class="qr-grid">
          <article class="qr-card qr-card-alipay">
            <div class="payment-name">
              <AlipayCircleOutlined />
              <h3>{{ page.alipay }}</h3>
            </div>
            <div class="qr-frame">
              <img src="/sponsor-alipay-qr.png" :alt="page.alipayAlt">
            </div>
            <p>{{ page.scanHint }}</p>
          </article>

          <article class="qr-card qr-card-wechat">
            <div class="payment-name">
              <WechatOutlined />
              <h3>{{ page.wechat }}</h3>
            </div>
            <div class="qr-frame">
              <img src="/sponsor-wechat-qr.png" :alt="page.wechatAlt">
            </div>
            <p>{{ page.scanHint }}</p>
          </article>
        </div>

        <p class="sponsor-privacy">
          <SafetyCertificateOutlined />
          <span>{{ page.privacy }}</span>
        </p>
      </div>
    </section>

    <section class="donor-section" aria-labelledby="donor-list-title">
      <div class="sponsor-container">
        <header class="donor-header">
          <div>
            <h2 id="donor-list-title">
              {{ page.donorTitle }}
            </h2>
            <p>{{ page.donorDescription }}</p>
          </div>
          <span>{{ donorCount }}</span>
        </header>

        <ul v-if="sponsorRecords.length" class="donor-list">
          <li v-for="record in sponsorRecords" :key="`${record.name}-${record.date}`">
            <div class="donor-avatar" aria-hidden="true">
              {{ record.name.slice(0, 1).toUpperCase() }}
            </div>
            <div class="donor-info">
              <div class="donor-name-line">
                <h3>{{ record.name }}</h3>
                <time :datetime="record.date">{{ formatDate(record.date) }}</time>
              </div>
              <p v-if="record.message">
                {{ record.message }}
              </p>
            </div>
            <strong v-if="record.amount" class="donor-amount">¥{{ record.amount }}</strong>
          </li>
        </ul>

        <div v-else class="donor-empty">
          <HeartOutlined />
          <h3>{{ page.donorEmptyTitle }}</h3>
          <p>{{ page.donorEmptyDescription }}</p>
        </div>

        <p class="donor-privacy">
          <SafetyCertificateOutlined />
          <span>{{ page.donorPrivacy }}</span>
        </p>
      </div>
    </section>

    <section class="sponsor-thanks">
      <div class="sponsor-container">
        <HeartFilled class="sponsor-heart" />
        <p>{{ page.thanks }}</p>
        <a :href="REPOSITORY_URL" target="_blank" rel="noreferrer">
          <GithubOutlined />
          <span>{{ page.github }}</span>
        </a>
      </div>
    </section>
  </main>
</template>

<style scoped lang="less">
.sponsor-page {
  min-height: calc(100vh - var(--ant-doc-header-height));
  color: var(--ant-color-text);
  background: var(--ant-color-bg-container);
}

.sponsor-container {
  width: min(960px, calc(100% - 48px));
  margin-inline: auto;
}

.sponsor-intro {
  padding: 84px 0 64px;
  text-align: center;
  border-bottom: 1px solid var(--ant-color-border-secondary);

  h1 {
    margin: 18px 0 14px;
    color: var(--ant-color-text-heading);
    font-size: 42px;
    line-height: 1.25;
    letter-spacing: 0;
  }

  p {
    max-width: 680px;
    margin: 0 auto;
    color: var(--ant-color-text-secondary);
    font-size: 17px;
    line-height: 1.8;
  }
}

.sponsor-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--ant-color-primary);
  font-size: 14px;
  font-weight: 600;
}

.sponsor-donation {
  padding: 56px 0 48px;
  background: var(--ant-color-fill-quaternary);
}

.donation-header {
  margin-bottom: 30px;
  text-align: center;

  h2 {
    margin: 0 0 8px;
    color: var(--ant-color-text-heading);
    font-size: 26px;
    line-height: 1.4;
  }

  p {
    margin: 0;
    color: var(--ant-color-text-secondary);
    font-size: 15px;
    line-height: 1.7;
  }
}

.qr-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  width: min(760px, 100%);
  margin-inline: auto;
}

.qr-card {
  min-width: 0;
  padding: 24px;
  border: 1px solid var(--ant-color-border-secondary);
  border-radius: 8px;
  background: var(--ant-color-bg-container);
  box-shadow: 0 6px 20px color-mix(in srgb, var(--ant-color-text) 6%, transparent);

  > p {
    margin: 16px 0 0;
    color: var(--ant-color-text-secondary);
    font-size: 14px;
    text-align: center;
  }
}

.payment-name {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  margin-bottom: 18px;

  :deep(.anticon) {
    font-size: 24px;
  }

  h3 {
    margin: 0;
    color: var(--ant-color-text-heading);
    font-size: 18px;
    line-height: 1.4;
  }
}

.qr-card-alipay .payment-name :deep(.anticon) {
  color: #1677ff;
}

.qr-card-wechat .payment-name :deep(.anticon) {
  color: #07c160;
}

.qr-frame {
  width: 100%;
  max-width: 300px;
  aspect-ratio: 1;
  margin-inline: auto;
  overflow: hidden;
  background: #fff;

  img {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 1;
    object-fit: contain;
  }
}

.sponsor-privacy {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 8px;
  margin: 24px 0 0;
  color: var(--ant-color-text-tertiary);
  font-size: 13px;
  line-height: 1.6;
  text-align: center;

  :deep(.anticon) {
    flex: none;
    margin-top: 3px;
  }
}

.donor-section {
  padding: 56px 0;
  border-top: 1px solid var(--ant-color-border-secondary);
}

.donor-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 22px;

  h2 {
    margin: 0 0 6px;
    color: var(--ant-color-text-heading);
    font-size: 26px;
    line-height: 1.4;
  }

  p {
    margin: 0;
    color: var(--ant-color-text-secondary);
    font-size: 15px;
    line-height: 1.7;
  }

  > span {
    flex: none;
    color: var(--ant-color-text-tertiary);
    font-size: 13px;
  }
}

.donor-list {
  margin: 0;
  padding: 0;
  overflow: hidden;
  border: 1px solid var(--ant-color-border-secondary);
  border-radius: 8px;
  background: var(--ant-color-bg-container);
  list-style: none;

  li {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 14px;
    padding: 18px 20px;

    + li {
      border-top: 1px solid var(--ant-color-border-secondary);
    }
  }
}

.donor-avatar {
  display: grid;
  width: 42px;
  height: 42px;
  flex: none;
  place-items: center;
  border-radius: 50%;
  color: var(--ant-color-primary);
  background: var(--ant-color-primary-bg);
  font-size: 17px;
  font-weight: 600;
}

.donor-info {
  min-width: 0;
  flex: 1;

  > p {
    margin: 5px 0 0;
    overflow-wrap: anywhere;
    color: var(--ant-color-text-secondary);
    font-size: 13px;
    line-height: 1.6;
  }
}

.donor-name-line {
  display: flex;
  min-width: 0;
  align-items: baseline;
  gap: 10px;

  h3 {
    min-width: 0;
    margin: 0;
    overflow-wrap: anywhere;
    color: var(--ant-color-text-heading);
    font-size: 15px;
    line-height: 1.5;
  }

  time {
    flex: none;
    color: var(--ant-color-text-tertiary);
    font-size: 12px;
  }
}

.donor-amount {
  flex: none;
  color: var(--ant-color-error);
  font-size: 15px;
}

.donor-empty {
  display: flex;
  min-height: 200px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
  border: 1px dashed var(--ant-color-border);
  border-radius: 8px;
  background: var(--ant-color-fill-quaternary);
  text-align: center;

  :deep(.anticon) {
    color: var(--ant-color-text-quaternary);
    font-size: 28px;
  }

  h3 {
    margin: 14px 0 6px;
    color: var(--ant-color-text-heading);
    font-size: 16px;
    line-height: 1.5;
  }

  p {
    margin: 0;
    color: var(--ant-color-text-secondary);
    font-size: 13px;
    line-height: 1.7;
  }
}

.donor-privacy {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  gap: 7px;
  margin: 14px 0 0;
  color: var(--ant-color-text-tertiary);
  font-size: 12px;
  line-height: 1.6;

  :deep(.anticon) {
    flex: none;
    margin-top: 3px;
  }
}

.sponsor-thanks {
  padding: 48px 0 64px;
  text-align: center;

  .sponsor-heart {
    color: var(--ant-color-error);
    font-size: 24px;
  }

  p {
    max-width: 680px;
    margin: 14px auto 18px;
    color: var(--ant-color-text-secondary);
    font-size: 15px;
    line-height: 1.8;
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--ant-color-primary);
    font-weight: 500;

    &:hover {
      color: var(--ant-color-primary-hover);
    }
  }
}

@media (max-width: 700px) {
  .sponsor-container {
    width: min(100% - 32px, 520px);
  }

  .sponsor-intro {
    padding: 60px 0 48px;

    h1 {
      font-size: 32px;
    }

    p {
      font-size: 15px;
    }
  }

  .sponsor-donation {
    padding: 44px 0 40px;
  }

  .donation-header h2 {
    font-size: 23px;
  }

  .qr-grid {
    grid-template-columns: 1fr;
    width: min(100%, 360px);
  }

  .qr-card {
    padding: 20px;
  }

  .donor-section {
    padding: 44px 0;
  }

  .donor-header {
    align-items: flex-start;

    h2 {
      font-size: 23px;
    }
  }

  .donor-list li {
    align-items: flex-start;
    flex-wrap: wrap;
    padding: 16px;
  }

  .donor-info {
    width: calc(100% - 56px);
    flex: none;
  }

  .donor-name-line {
    flex-direction: column;
    gap: 2px;
  }

  .donor-amount {
    margin-left: 56px;
  }

  .donor-privacy {
    justify-content: flex-start;
  }

  .sponsor-thanks {
    padding: 40px 0 52px;
  }
}
</style>
