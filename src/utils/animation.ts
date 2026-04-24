// 动画工具文件

// 宠物动画状态
export type PetAnimationState = 
  | 'idle'      // 闲置状态
  | 'blink'     // 眨眼
  | 'breathe'   // 呼吸
  | 'wave'      // 挥手
  | 'nod'       // 点头
  | 'jump'      // 跳跃
  | 'drag'      // 拖拽
  | 'thinking'  // 思考
  | 'comfort'   // 安慰
  | 'celebrate' // 庆祝

// 动画配置
export const animationConfig = {
  idle: {
    duration: 3000,
    next: ['blink', 'breathe'],
  },
  blink: {
    duration: 500,
    next: ['idle'],
  },
  breathe: {
    duration: 2000,
    next: ['idle'],
  },
  wave: {
    duration: 1000,
    next: ['idle'],
  },
  nod: {
    duration: 800,
    next: ['idle'],
  },
  jump: {
    duration: 1200,
    next: ['idle'],
  },
  drag: {
    duration: 0,
    next: ['idle'],
  },
  thinking: {
    duration: 3000,
    next: ['idle'],
  },
  comfort: {
    duration: 2000,
    next: ['idle'],
  },
  celebrate: {
    duration: 2000,
    next: ['idle'],
  },
};

// 生成随机动画状态
export function getRandomAnimation(): PetAnimationState {
  const states: PetAnimationState[] = ['blink', 'breathe', 'wave', 'nod'];
  return states[Math.floor(Math.random() * states.length)];
}

// 计算动画延迟
export function calculateAnimationDelay(state: PetAnimationState): number {
  return animationConfig[state].duration;
}

// 生成宠物样式
export function getPetStyle(position: { x: number; y: number }, size: number, isDragging: boolean): object {
  return {
    position: 'fixed',
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${size}px`,
    height: `${size}px`,
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: 9999,
    transition: isDragging ? 'none' : 'all 0.3s ease',
  };
}

// 生成面板样式
export function getPanelStyle(position: { x: number; y: number }, size: number): object {
  return {
    position: 'fixed',
    left: `${position.x + size + 10}px`,
    top: `${position.y}px`,
    zIndex: 9998,
    animation: 'slideIn 0.2s ease-out',
  };
}

// 检测元素是否在视口中
export function isElementInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// 检测宠物是否接近输入框
export function isPetNearInput(petRect: DOMRect, inputRect: DOMRect): boolean {
  const threshold = 50;
  return (
    petRect.right >= inputRect.left - threshold &&
    petRect.left <= inputRect.right + threshold &&
    petRect.bottom >= inputRect.top - threshold &&
    petRect.top <= inputRect.bottom + threshold
  );
}

// 检测宠物是否接近聊天记录
export function isPetNearChat(petRect: DOMRect, chatRect: DOMRect): boolean {
  const threshold = 50;
  return (
    petRect.right >= chatRect.left - threshold &&
    petRect.left <= chatRect.right + threshold &&
    petRect.bottom >= chatRect.top - threshold &&
    petRect.top <= chatRect.bottom + threshold
  );
}
