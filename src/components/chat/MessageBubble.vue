<template>
  <div class="message-bubble" :class="sender">
    <div class="message-content">{{ content }}</div>
    <div class="message-time">{{ timestamp }}</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    default: 'other',
    validator: (value: string) => ['user', 'other', 'pet'].includes(value),
  },
  timestamp: {
    type: String,
    default: '',
  },
});
</script>

<style scoped>
.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: var(--border-radius-lg);
  margin-bottom: 12px;
  position: relative;
  word-wrap: break-word;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.message-bubble:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.message-bubble.user {
  background-color: var(--primary-color);
  color: white;
  align-self: flex-end;
  border-bottom-right-radius: 4px;
}

.message-bubble.other {
  background-color: var(--card-background);
  color: var(--text-color);
  align-self: flex-start;
  border-bottom-left-radius: 4px;
  border: 1px solid var(--border-color);
}

.message-bubble.pet {
  background-color: var(--accent-color);
  color: white;
  align-self: flex-start;
  border-bottom-left-radius: 4px;
}

.message-content {
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 6px;
  font-family: 'Inter', sans-serif;
}

.message-time {
  font-size: 12px;
  opacity: 0.7;
  text-align: right;
  font-weight: 500;
}

@media (max-width: 768px) {
  .message-bubble {
    max-width: 85%;
    padding: 14px 18px;
  }
  
  .message-content {
    font-size: 16px;
  }
  
  .message-time {
    font-size: 13px;
  }
}
</style>
