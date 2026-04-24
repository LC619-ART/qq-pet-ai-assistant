<template>
  <div class="input-box" ref="inputBoxRef">
    <button class="emoji-button">😊</button>
    <textarea
      v-model="localInput"
      class="input-area"
      placeholder="输入消息..."
      @input="handleInput"
      @keydown.enter.exact="handleSend"
      @keydown.enter.shift=""
    ></textarea>
    <button
      class="send-button"
      :disabled="!localInput.trim()"
      @click="handleSend"
    >
      ➤
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'send', 'drop']);

const localInput = ref(props.modelValue);
const inputBoxRef = ref<HTMLElement | null>(null);

// 同步外部值变化
watch(
  () => props.modelValue,
  (newValue) => {
    localInput.value = newValue;
  }
);

// 处理输入
const handleInput = () => {
  emit('update:modelValue', localInput.value);
  // 触发输入变化事件，用于智能建议
  if (window.dispatchEvent) {
    window.dispatchEvent(new CustomEvent('input-change', {
      detail: { text: localInput.value }
    }));
  }
};

// 处理发送
const handleSend = () => {
  if (localInput.value.trim()) {
    emit('send', localInput.value);
    localInput.value = '';
    emit('update:modelValue', '');
  }
};

// 暴露方法供父组件调用
defineExpose({
  focus: () => {
    const textarea = inputBoxRef.value?.querySelector('textarea');
    textarea?.focus();
  },
  getElement: () => inputBoxRef.value,
});
</script>

<style scoped>
.input-box {
  background-color: var(--card-background);
  border-top: 1px solid var(--border-color);
  padding: 12px;
  display: flex;
  align-items: flex-end;
  gap: 10px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
}

.emoji-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
  align-self: center;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji-button:hover {
  background-color: var(--secondary-color);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.input-area {
  flex: 1;
  min-height: 40px;
  max-height: 120px;
  padding: 10px 16px;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  resize: none;
  outline: none;
  font-size: 14px;
  font-family: inherit;
  color: var(--text-color);
  transition: all var(--transition-normal);
  background-color: var(--secondary-color);
}

.input-area::placeholder {
  color: var(--light-text);
  opacity: 0.7;
}

.input-area:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
  background-color: var(--secondary-color);
}

.send-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);
  font-size: 16px;
  font-weight: bold;
  box-shadow: var(--shadow-sm);
}

.send-button:hover:not(:disabled) {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.send-button:disabled {
  background-color: var(--light-text);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

@media (max-width: 768px) {
  .input-box {
    padding: 14px;
  }
  
  .input-area {
    font-size: 16px;
    min-height: 44px;
  }
  
  .send-button {
    width: 44px;
    height: 44px;
  }
  
  .emoji-button {
    width: 44px;
    height: 44px;
    font-size: 22px;
  }
}
</style>
