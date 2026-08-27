<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { HomeRecommendIcon, HomeRecommendItem } from '@/config/home-recommends'
import { computed, shallowRef, useTemplateRef } from 'vue'

const props = defineProps<{
  item: HomeRecommendItem
  index: number
  icon?: HomeRecommendIcon
  cardClass?: string
}>()

const cardRef = useTemplateRef<HTMLAnchorElement>('card')
const mouseX = shallowRef(0)
const mouseY = shallowRef(0)

const cardStyle = computed<CSSProperties>(() => ({
  '--mouse-x': `${mouseX.value}px`,
  '--mouse-y': `${mouseY.value}px`,
  '--card-index': props.index,
}) as CSSProperties)

function syncPointerPosition(event: PointerEvent) {
  const rect = cardRef.value?.getBoundingClientRect()
  if (!rect)
    return

  mouseX.value = event.clientX - rect.left
  mouseY.value = event.clientY - rect.top
}
</script>

<template>
  <div
    ref="card"
    class="antdv-home-recommend-card"
    :class="cardClass"
    :style="cardStyle"
    tabindex="0"
    role="article"
    @pointermove="syncPointerPosition"
    @pointerenter="syncPointerPosition"
  >
    <div class="antdv-home-recommend-main">
      <span class="antdv-home-recommend-preview" aria-hidden="true">
        <span class="antdv-home-recommend-icon-wrap">
          <img
            v-if="icon?.href"
            :src="icon.href"
            :alt="item.source"
            draggable="false"
            class="antdv-home-recommend-source"
          >
        </span>
      </span>
      <div class="antdv-home-recommend-content">
        <h3 class="antdv-home-recommend-title">
          {{ item.title }}
        </h3>
        <p class="antdv-home-recommend-description">
          {{ item.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.antdv-home-recommend-card {
  --recommend-card-gap: 18px;
  --recommend-icon-size: clamp(52px, 4.3vw, 62px);
  --recommend-icon-hover-scale: 2.08;
  --recommend-preview-height: clamp(126px, 9.8vw, 146px);
  --recommend-source-size: clamp(30px, 2.5vw, 36px);
  --recommend-content-top: clamp(86px, 7.2vw, 102px);
  --recommend-hover-content-top: calc(var(--recommend-preview-height) + clamp(22px, 1.7vw, 28px));

  position: relative;
  display: flex;
  align-items: stretch;
  height: clamp(258px, 19vw, 286px);
  padding: clamp(22px, 2vw, 28px);
  box-sizing: border-box;
  text-align: start;
  text-decoration: none;
  color: inherit;
  outline: none;
  isolation: isolate;
  overflow: hidden;
  background:
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--ant-color-bg-container) 96%, transparent),
      var(--ant-color-bg-container)
    ),
    radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--ant-color-primary) 8%, transparent), transparent 56%);
  border: var(--ant-line-width) solid var(--ant-color-border-secondary);
  border-radius: 16px;
  box-shadow:
    0 1px 2px color-mix(in srgb, var(--ant-color-text) 4%, transparent),
    0 12px 32px color-mix(in srgb, var(--ant-color-text) 4%, transparent);
  opacity: 0;
  transform: translateY(18px) scale(0.98);
  animation: home-recommend-enter 0.62s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: calc(var(--card-index) * 80ms);
  transition:
    box-shadow var(--ant-motion-duration-mid),
    transform var(--ant-motion-duration-mid),
    background var(--ant-motion-duration-mid);
}

.antdv-home-recommend-card::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 2;
  padding: 1px;
  border-radius: inherit;
  opacity: 0;
  pointer-events: none;
  background: radial-gradient(
    circle 156px at var(--mouse-x, 50%) var(--mouse-y, 50%),
    color-mix(in srgb, var(--ant-color-primary) 62%, transparent),
    color-mix(in srgb, var(--ant-color-primary-border-hover) 24%, transparent) 34%,
    transparent 62%
  );

  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;

  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: subtract;

  transition: opacity var(--ant-motion-duration-mid);
}

.antdv-home-recommend-main {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  transition: transform var(--ant-motion-duration-mid);
}

.antdv-home-recommend-preview {
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--recommend-icon-size);
  height: var(--recommend-icon-size);
  overflow: hidden;
  border-radius: 14px;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--ant-color-fill-tertiary) 76%, transparent),
    color-mix(in srgb, var(--ant-color-fill-secondary) 48%, transparent)
  );
  transition:
    width var(--ant-motion-duration-mid),
    height var(--ant-motion-duration-mid),
    background var(--ant-motion-duration-mid),
    border-radius var(--ant-motion-duration-mid),
    transform var(--ant-motion-duration-mid);
}

.antdv-home-recommend-icon-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--recommend-icon-size);
  height: var(--recommend-icon-size);
  border-radius: 14px;
  transform: translateZ(0) scale(1);
  transition:
    background var(--ant-motion-duration-mid),
    transform var(--ant-motion-duration-mid);
}

.antdv-home-recommend-content {
  position: absolute;
  inset-block-start: var(--recommend-content-top);
  inset-inline: 0;
  display: flex;
  flex-direction: column;
  min-width: 0;
  transition:
    inset-block-start var(--ant-motion-duration-mid),
    transform var(--ant-motion-duration-mid);
}

.antdv-home-recommend-card:hover,
.antdv-home-recommend-card:focus-visible {
  color: inherit;
  box-shadow:
    0 8px 20px color-mix(in srgb, var(--ant-color-primary) 6%, transparent),
    0 18px 42px color-mix(in srgb, var(--ant-color-text) 7%, transparent);
  transform: translateY(-4px);
}

.antdv-home-recommend-card:hover .antdv-home-recommend-main,
.antdv-home-recommend-card:focus-visible .antdv-home-recommend-main {
  transform: translateY(0);
}

.antdv-home-recommend-card:hover .antdv-home-recommend-preview,
.antdv-home-recommend-card:focus-visible .antdv-home-recommend-preview {
  width: 100%;
  height: var(--recommend-preview-height);
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--ant-color-fill-tertiary) 76%, transparent),
    color-mix(in srgb, var(--ant-color-fill-secondary) 48%, transparent)
  );
  transform: translateY(0);
}

.antdv-home-recommend-card:hover .antdv-home-recommend-content,
.antdv-home-recommend-card:focus-visible .antdv-home-recommend-content {
  inset-block-start: var(--recommend-hover-content-top);
  transform: translateY(0);
}

.antdv-home-recommend-card:hover::before,
.antdv-home-recommend-card:focus-visible::before {
  opacity: 1;
}

.antdv-home-recommend-card:hover .antdv-home-recommend-icon-wrap,
.antdv-home-recommend-card:focus-visible .antdv-home-recommend-icon-wrap {
  /* background: color-mix(in srgb, var(--ant-color-primary) 68%, var(--ant-color-primary-bg)); */
  transform: scale(var(--recommend-icon-hover-scale)) translateZ(0);
}

.antdv-home-recommend-title {
  margin: 0;
  color: var(--ant-color-text);
  font-size: clamp(18px, 1.25vw, 22px);
  font-weight: 700;
  line-height: 1.28;
  letter-spacing: 0;
  transition:
    color var(--ant-motion-duration-mid),
    transform var(--ant-motion-duration-mid);
}

.antdv-home-recommend-card:hover .antdv-home-recommend-title,
.antdv-home-recommend-card:focus-visible .antdv-home-recommend-title {
  transform: translateY(0);
}

.antdv-home-recommend-description {
  display: -webkit-box;
  margin: 12px 0 0;
  max-height: 54px;
  overflow: hidden;
  color: var(--ant-color-text-tertiary);
  font-size: clamp(14px, 1vw, 16px);
  font-weight: 500;
  line-height: 1.65;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  transition:
    opacity var(--ant-motion-duration-fast),
    visibility var(--ant-motion-duration-fast),
    transform var(--ant-motion-duration-mid);
}

.antdv-home-recommend-card:hover .antdv-home-recommend-description,
.antdv-home-recommend-card:focus-visible .antdv-home-recommend-description {
  opacity: 0;
  visibility: hidden;
  transform: translateY(6px);
}

.antdv-home-recommend-source {
  width: var(--recommend-source-size);
  height: var(--recommend-source-size);
  object-fit: contain;
  transition: transform var(--ant-motion-duration-mid);
}

@keyframes home-recommend-enter {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 768px) {
  .antdv-home-recommend-card {
    --recommend-card-gap: 14px;
    --recommend-icon-size: 40px;
    --recommend-icon-hover-scale: 1;
    --recommend-preview-height: 40px;
    --recommend-source-size: 24px;
    --recommend-content-top: 0;
    --recommend-hover-content-top: 0;

    height: 132px;
    padding: 22px;
    border-radius: 14px;
  }

  .antdv-home-recommend-icon-wrap {
    border-radius: 12px;
  }

  .antdv-home-recommend-source {
    width: 24px;
    height: 24px;
  }

  .antdv-home-recommend-main {
    display: grid;
    grid-template-columns: var(--recommend-icon-size) minmax(0, 1fr);
    gap: var(--recommend-card-gap);
    align-items: center;
  }

  .antdv-home-recommend-preview {
    position: relative;
    inset-block-start: auto;
    inset-inline-start: auto;
    width: var(--recommend-icon-size);
    height: var(--recommend-icon-size);
    background: transparent;
  }

  .antdv-home-recommend-content {
    position: relative;
    inset-block-start: auto;
    inset-inline: auto;
  }
}

@media (hover: none) {
  .antdv-home-recommend-card:hover {
    transform: none;
  }

  .antdv-home-recommend-card:hover::before {
    opacity: 0;
  }

  .antdv-home-recommend-card:hover .antdv-home-recommend-preview {
    background: transparent;
  }

  .antdv-home-recommend-card:hover .antdv-home-recommend-icon-wrap,
  .antdv-home-recommend-card:hover .antdv-home-recommend-content,
  .antdv-home-recommend-card:hover .antdv-home-recommend-main {
    transform: none;
  }

  .antdv-home-recommend-card:hover .antdv-home-recommend-description {
    max-height: 54px;
    margin-top: 12px;
    opacity: 1;
    visibility: visible;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .antdv-home-recommend-card,
  .antdv-home-recommend-card::before,
  .antdv-home-recommend-main,
  .antdv-home-recommend-content,
  .antdv-home-recommend-preview,
  .antdv-home-recommend-icon-wrap,
  .antdv-home-recommend-title,
  .antdv-home-recommend-description,
  .antdv-home-recommend-source {
    animation: none;
    transition: none;
  }

  .antdv-home-recommend-card {
    opacity: 1;
    transform: none;
  }
}
</style>
