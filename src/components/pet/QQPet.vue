<template>
  <div
    v-if="isVisible"
    id="qq-pet"
    class="qq-pet"
    :class="`pet-${animationState}`"
    :style="petStyle()"
    @click="handleClick"
    @dblclick="handleDoubleClick"
  >
    <!-- 宠物形象 -->
    <div class="pet-image" @mousedown="startDrag" @touchstart="startDrag">
      <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20QQ%20pet%20cartoon%20character%20with%20blue%20body%20and%20big%20eyes%20modern%20design%20clean%20style&image_size=square" alt="QQ Pet" />
    </div>
    
    <!-- 交互提示 -->
    <div v-if="showInteractionHint" class="interaction-hint">
      <span>点击我查看功能</span>
    </div>
    
    <!-- 建议气泡 -->
    <div v-if="showSuggestionBubble" class="suggestion-bubble">
      <div class="bubble-content">{{ suggestionMessage }}</div>
      <div class="bubble-arrow"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits, ref, onMounted, onUnmounted } from 'vue';
import { usePetInteraction } from '../../composables/usePetInteraction';

const props = defineProps({
  showSuggestionBubble: {
    type: Boolean,
    default: false,
  },
  suggestionMessage: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['openPanel', 'openPetChat']);

const {
  position,
  size,
  isDragging,
  animationState,
  isVisible,
  startDrag,
  endDrag,
  handleClick: originalHandleClick,
  handleDoubleClick: originalHandleDoubleClick,
  petStyle,
} = usePetInteraction();

// 交互提示
const showInteractionHint = ref(true);
let hintTimer: number | null = null;

// 自定义点击处理函数
const handleClick = () => {
  // 只有在没有拖拽时才触发
  if (!isDragging.value) {
    originalHandleClick();
    emit('openPanel', position.value);
    // 点击后隐藏提示
    showInteractionHint.value = false;
    if (hintTimer) {
      clearTimeout(hintTimer);
    }
  }
};

// 自定义双击处理函数
const handleDoubleClick = () => {
  originalHandleDoubleClick();
  emit('openPetChat');
  // 双击后隐藏提示
  showInteractionHint.value = false;
  if (hintTimer) {
    clearTimeout(hintTimer);
  }
};

// 组件挂载后初始化
onMounted(() => {
  // 30秒后隐藏提示
  hintTimer = window.setTimeout(() => {
    showInteractionHint.value = false;
  }, 30000);
});

// 组件卸载前清理
onUnmounted(() => {
  if (hintTimer) {
    clearTimeout(hintTimer);
  }
});
</script>

<style scoped>
.qq-pet {
  position: fixed;
  z-index: 9999;
  cursor: grab;
  transition: all var(--transition-slow);
  transform-origin: center;
}

.qq-pet:active {
  cursor: grabbing;
}

.pet-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: var(--shadow-lg);
  border: 3px solid var(--white);
  transition: all var(--transition-normal);
  backdrop-filter: blur(10px);
}

.pet-image:hover {
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.2);
  transform: scale(1.05);
}

.pet-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all var(--transition-normal);
}

.suggestion-bubble {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--primary-color);
  color: white;
  padding: 10px 16px;
  border-radius: 20px;
  font-size: 13px;
  white-space: nowrap;
  box-shadow: var(--shadow-md);
  animation: slideIn 0.2s ease-out;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
}

.bubble-arrow {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid var(--primary-color);
}

/* 交互提示 */
.interaction-hint {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--accent-color);
  color: white;
  padding: 8px 14px;
  border-radius: 16px;
  font-size: 12px;
  white-space: nowrap;
  box-shadow: var(--shadow-md);
  animation: pulse 2s infinite;
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 10000;
}

@keyframes pulse {
  0% {
    transform: translateX(-50%) scale(1);
    opacity: 0.8;
  }
  50% {
    transform: translateX(-50%) scale(1.05);
    opacity: 1;
  }
  100% {
    transform: translateX(-50%) scale(1);
    opacity: 0.8;
  }
}

/* 动画效果 */
.pet-wave {
  animation: wave 1s ease-in-out;
}

.pet-jump {
  animation: jump 1.2s ease-in-out;
}

.pet-idle {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
</style>
