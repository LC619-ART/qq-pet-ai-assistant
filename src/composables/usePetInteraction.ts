// 宠物交互逻辑
import { ref, onMounted, onUnmounted } from 'vue';
import type { PetAnimationState } from '../utils/animation';
import { getRandomAnimation, calculateAnimationDelay, getPetStyle, isElementInViewport } from '../utils/animation';

export function usePetInteraction() {
  // 宠物状态
  const position = ref({ x: 100, y: 100 });
  const size = ref(80);
  const isDragging = ref(false);
  const animationState = ref<PetAnimationState>('idle');
  const isVisible = ref(true);
  const panelPosition = ref({ x: 0, y: 0 });

  // 拖拽相关
  const dragStart = ref({ x: 0, y: 0 });
  let clickTimer: number | null = null;
  let isClick = true;

  // 动画计时器
  let animationTimer: number | null = null;
  let idleTimer: number | null = null;

  // 开始拖拽
  const startDrag = (event: MouseEvent | TouchEvent) => {
    // 阻止默认的拖拽行为
    event.preventDefault();
    
    // 记录鼠标相对于宠物左上角的偏移量
    if (event instanceof MouseEvent) {
      dragStart.value = {
        x: event.clientX - position.value.x,
        y: event.clientY - position.value.y,
      };
    } else if (event instanceof TouchEvent) {
      dragStart.value = {
        x: event.touches[0].clientX - position.value.x,
        y: event.touches[0].clientY - position.value.y,
      };
    }
    
    // 开始拖拽时，设置 isClick 为 false
    isClick = false;
    
    // 清除点击计时器
    if (clickTimer) {
      clearTimeout(clickTimer);
      clickTimer = null;
    }
    
    // 开始监听鼠标移动事件
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('touchmove', onDrag);
    
    // 暂时不设置isDragging为true，等待mousemove事件确认
    animationState.value = 'drag';
  };

  // 拖拽中
  const onDrag = (event: MouseEvent | TouchEvent) => {
    // 阻止默认的拖拽行为
    event.preventDefault();
    
    let clientX: number;
    let clientY: number;

    if (event instanceof MouseEvent) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else if (event instanceof TouchEvent) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      return;
    }

    // 计算移动距离
    const dx = Math.abs(clientX - (position.value.x + dragStart.value.x));
    const dy = Math.abs(clientY - (position.value.y + dragStart.value.y));
    const distance = Math.sqrt(dx * dx + dy * dy);

    // 如果移动距离超过5px，才认为是拖拽
    if (distance > 5) {
      isDragging.value = true;
      isClick = false;

      // 计算新位置：鼠标当前位置 - 偏移量
      const newX = clientX - dragStart.value.x;
      const newY = clientY - dragStart.value.y;

      position.value = {
        x: newX,
        y: newY,
      };

      // 确保宠物在视口内
      const petElement = document.getElementById('qq-pet');
      if (petElement) {
        const rect = petElement.getBoundingClientRect();
        if (!isElementInViewport(petElement)) {
          // 调整位置到视口内
          position.value = {
            x: Math.max(0, Math.min(position.value.x, window.innerWidth - size.value)),
            y: Math.max(0, Math.min(position.value.y, window.innerHeight - size.value)),
          };
        }
      }
    }
  };

  // 结束拖拽
  const endDrag = () => {
    // 移除鼠标移动事件监听器
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('touchmove', onDrag);
    
    // 只有在真正发生拖拽时才执行拖拽相关逻辑
    if (isDragging.value) {
      // 检测是否拖拽到输入框
      const petElement = document.getElementById('qq-pet');
      const inputBox = document.querySelector('.input-box');
      const chatMessages = document.querySelector('.chat-messages');
      
      console.log('拖拽结束，检测元素：', {
        petElement: !!petElement,
        inputBox: !!inputBox,
        chatMessages: !!chatMessages
      });
      
      if (petElement && inputBox) {
        const petRect = petElement.getBoundingClientRect();
        const inputRect = inputBox.getBoundingClientRect();
        
        console.log('宠物位置：', petRect);
        console.log('输入框位置：', inputRect);
        
        // 检测是否在输入框范围内
        const isInInput = (
          petRect.right >= inputRect.left &&
          petRect.left <= inputRect.right &&
          petRect.bottom >= inputRect.top &&
          petRect.top <= inputRect.bottom
        );
        
        console.log('是否在输入框内：', isInInput);
        
        if (isInInput) {
          // 触发话术润色功能
          console.log('触发话术润色功能');
          if (window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent('pet-drag-to-input'));
          }
        }
      }
      
      if (petElement && chatMessages) {
        const petRect = petElement.getBoundingClientRect();
        const chatRect = chatMessages.getBoundingClientRect();
        
        console.log('宠物位置：', petRect);
        console.log('聊天记录位置：', chatRect);
        
        // 检测是否在聊天记录范围内
        const isInChat = (
          petRect.right >= chatRect.left &&
          petRect.left <= chatRect.right &&
          petRect.bottom >= chatRect.top &&
          petRect.top <= chatRect.bottom
        );
        
        console.log('是否在聊天记录内：', isInChat);
        
        if (isInChat) {
          // 触发信息提取功能
          console.log('触发信息提取功能');
          if (window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent('pet-drag-to-chat'));
          }
        }
      }
    }
    
    // 重置状态
    isDragging.value = false;
    isClick = true;
    
    resetIdleTimer();
  };

  // 处理点击事件
  const handleClick = () => {
    if (isDragging.value) return;

    animationState.value = 'wave';
    panelPosition.value = {
      x: position.value.x,
      y: position.value.y,
    };
    resetIdleTimer();
  };

  // 处理双击事件
  const handleDoubleClick = () => {
    if (isDragging.value) return;

    animationState.value = 'jump';
    // 跳转到辅助聊天窗口
    window.location.href = '/pet-chat';
  };

  // 重置闲置计时器
  const resetIdleTimer = () => {
    if (idleTimer) {
      clearTimeout(idleTimer);
    }
    idleTimer = window.setTimeout(() => {
      startIdleAnimation();
    }, 3000);
  };

  // 开始闲置动画
  const startIdleAnimation = () => {
    if (isDragging.value) return;

    const nextAnimation = getRandomAnimation();
    animationState.value = nextAnimation;

    if (animationTimer) {
      clearTimeout(animationTimer);
    }
    animationTimer = window.setTimeout(() => {
      animationState.value = 'idle';
      startIdleAnimation();
    }, calculateAnimationDelay(nextAnimation));
  };

  // 隐藏宠物
  const hidePet = () => {
    isVisible.value = false;
  };

  // 显示宠物
  const showPet = () => {
    isVisible.value = true;
  };

  // 调整宠物大小
  const resizePet = (newSize: number) => {
    size.value = newSize;
  };

  // 监听事件
  onMounted(() => {
    // 只添加鼠标和触摸结束事件监听器
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);

    // 开始闲置动画
    startIdleAnimation();
  });

  // 清理事件
  onUnmounted(() => {
    // 移除鼠标和触摸结束事件监听器
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('touchend', endDrag);

    if (animationTimer) {
      clearTimeout(animationTimer);
    }
    if (idleTimer) {
      clearTimeout(idleTimer);
    }
  });

  // 获取宠物样式
  const petStyle = (): any => {
    return getPetStyle(position.value, size.value, isDragging.value);
  };

  return {
    position,
    size,
    isDragging,
    animationState,
    isVisible,
    panelPosition,
    startDrag,
    endDrag,
    handleClick,
    handleDoubleClick,
    hidePet,
    showPet,
    resizePet,
    petStyle,
  };
}
