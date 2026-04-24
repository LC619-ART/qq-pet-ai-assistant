// Mock 数据文件
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'other' | 'pet';
  timestamp: string;
}

export interface PolishedText {
  id: string;
  style: string;
  content: string;
}

export interface ExtractedInfo {
  important: string[];
  todo: string[];
  deadline: string;
  requirements: string[];
}

export interface Template {
  id: string;
  category: string;
  title: string;
  content: string;
  placeholders: string[];
}

// 预设聊天记录
export const mockMessages: Message[] = [
  {
    id: '1',
    content: '嗨，最近怎么样？',
    sender: 'other',
    timestamp: '10:00',
  },
  {
    id: '2',
    content: '还不错，最近在忙项目',
    sender: 'user',
    timestamp: '10:01',
  },
  {
    id: '3',
    content: '哦，什么项目啊？',
    sender: 'other',
    timestamp: '10:02',
  },
  {
    id: '4',
    content: '就是公司的一个新系统开发，挺忙的',
    sender: 'user',
    timestamp: '10:03',
  },
  {
    id: '5',
    content: '那挺辛苦的，注意休息啊',
    sender: 'other',
    timestamp: '10:04',
  },
  {
    id: '6',
    content: '谢谢关心',
    sender: 'user',
    timestamp: '10:05',
  },
];

// 预设群聊记录
export const mockGroupMessages: Message[] = [
  {
    id: '1',
    content: '各位同学，明天上午9点有数学考试，请大家准时参加',
    sender: 'other',
    timestamp: '08:00',
  },
  {
    id: '2',
    content: '考试范围是第三章到第五章',
    sender: 'other',
    timestamp: '08:01',
  },
  {
    id: '3',
    content: '请大家带好身份证和学生证',
    sender: 'other',
    timestamp: '08:02',
  },
  {
    id: '4',
    content: '考试时间为2小时',
    sender: 'other',
    timestamp: '08:03',
  },
];

// 预设润色结果
export const mockPolishedTexts: PolishedText[] = [
  {
    id: '1',
    style: '礼貌正式版',
    content: '尊敬的老师，您好！因个人原因，我明天无法到校上课，特此向您请假一天，恳请批准。',
  },
  {
    id: '2',
    style: '简洁得体版',
    content: '老师，我明天有事需要请假一天，望批准。',
  },
  {
    id: '3',
    style: '高情商版',
    content: '亲爱的老师，非常抱歉打扰您！由于家中临时有重要事情需要处理，我明天无法按时到校上课，希望您能理解并批准我的请假申请，我会尽快补上落下的课程内容。',
  },
];

// 预设信息提取结果
export const mockExtractedInfo: ExtractedInfo = {
  important: ['明天上午9点有数学考试', '考试范围是第三章到第五章'],
  todo: ['带好身份证和学生证', '复习第三章到第五章的内容'],
  deadline: '明天上午9点',
  requirements: ['准时参加考试', '带好证件', '考试时间为2小时'],
};

// 预设回复建议
export const mockReplySuggestions: string[] = [
  '好的，我会准时参加考试，谢谢老师提醒！',
  '收到，我会带好证件，认真复习的。',
  '谢谢老师的通知，我会做好准备的。',
];

// 预设场景模板
export const mockTemplates: Template[] = [
  {
    id: '1',
    category: '学生专属',
    title: '请假申请',
    content: '尊敬的{称呼}，您好！因{原因}，我需要请假{天数}天，时间从{开始日期}到{结束日期}，恳请批准。',
    placeholders: ['称呼', '原因', '天数', '开始日期', '结束日期'],
  },
  {
    id: '2',
    category: '学生专属',
    title: '作业补交',
    content: '老师，您好！由于{原因}，我未能按时提交{作业名称}，现在补交，请您查收。',
    placeholders: ['原因', '作业名称'],
  },
  {
    id: '3',
    category: '职场专属',
    title: '工作汇报',
    content: '领导，您好！{项目名称}已完成{进度}%，主要完成了{完成内容}，下一步计划{下一步计划}。',
    placeholders: ['项目名称', '进度', '完成内容', '下一步计划'],
  },
  {
    id: '4',
    category: '职场专属',
    title: '会议请假',
    content: '各位同事，因{原因}，我无法参加{会议名称}，请见谅。',
    placeholders: ['原因', '会议名称'],
  },
  {
    id: '5',
    category: '日常社交',
    title: '节日祝福',
    content: '{称呼}，{节日}快乐！愿您在新的一年里{祝福语}。',
    placeholders: ['称呼', '节日', '祝福语'],
  },
  {
    id: '6',
    category: '日常社交',
    title: '道歉感谢',
    content: '{称呼}，非常抱歉{事情}，感谢您的理解和支持！',
    placeholders: ['称呼', '事情'],
  },
];

// 预设宠物回复
export const mockPetReplies: string[] = [
  '你好！有什么可以帮你的吗？',
  '需要我帮你润色话术吗？',
  '有什么开心的事要分享吗？',
  '别担心，一切都会好起来的！',
  '需要我帮你生成回复吗？',
];

// 生成润色结果的函数
export function generatePolishedText(originalText: string): PolishedText[] {
  // 模拟生成不同风格的润色结果
  return [
    {
      id: '1',
      style: '礼貌正式版',
      content: `尊敬的相关人士，${originalText}，恳请您的理解与支持。`,
    },
    {
      id: '2',
      style: '简洁得体版',
      content: `${originalText}，谢谢。`,
    },
    {
      id: '3',
      style: '高情商版',
      content: `亲爱的朋友，非常感谢您的关注，${originalText}，希望我们能够保持良好的沟通。`,
    },
  ];
}

// 生成回复建议的函数
export function generateReplySuggestions(context: string): string[] {
  // 模拟生成回复建议
  return [
    `好的，我了解了，${context}。`,
    `收到，我会认真考虑的，${context}。`,
    `谢谢分享，${context}，我也有同感。`,
  ];
}

// 提取信息的函数
export function extractInfo(text: string): ExtractedInfo {
  // 模拟提取信息
  return {
    important: [text.split('\n')[0]],
    todo: ['完成相关任务'],
    deadline: '尽快',
    requirements: ['认真执行'],
  };
}
