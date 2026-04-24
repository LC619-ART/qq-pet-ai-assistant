// 聊天辅助逻辑
import { ref } from 'vue';
import type { Message, PolishedText, ExtractedInfo, Template } from '../utils/mockData';
import { generatePolishedText, generateReplySuggestions, extractInfo, mockTemplates, mockPetReplies } from '../utils/mockData';

export function useChatAssistant() {
  // 状态
  const inputText = ref('');
  const isLoading = ref(false);
  const polishedTexts = ref<PolishedText[]>([]);
  const extractedInfo = ref<ExtractedInfo | null>(null);
  const replySuggestions = ref<string[]>([]);
  const selectedTemplate = ref<Template | null>(null);
  const showPolishPanel = ref(false);
  const showExtractPanel = ref(false);
  const showTemplatePanel = ref(false);
  const showSuggestionBubble = ref(false);
  const suggestionMessage = ref('');

  // 润色话术
  const polishText = async (text?: string) => {
    const content = text || inputText.value;
    if (!content.trim()) return;

    isLoading.value = true;
    // 模拟 API 调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    polishedTexts.value = generatePolishedText(content);
    showPolishPanel.value = true;
    isLoading.value = false;
  };

  // 提取信息
  const extractInformation = async (text: string) => {
    if (!text.trim()) return;

    isLoading.value = true;
    // 模拟 API 调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    extractedInfo.value = extractInfo(text);
    showExtractPanel.value = true;
    isLoading.value = false;
  };

  // 生成回复
  const generateReply = async (context: string) => {
    if (!context.trim()) return;

    isLoading.value = true;
    // 模拟 API 调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    replySuggestions.value = generateReplySuggestions(context);
    isLoading.value = false;
  };

  // 应用润色结果
  const applyPolishedText = (text: string) => {
    inputText.value = text;
    showPolishPanel.value = false;
  };

  // 应用回复建议
  const applyReplySuggestion = (suggestion: string) => {
    inputText.value = suggestion;
  };

  // 选择模板
  const selectTemplate = (template: Template) => {
    selectedTemplate.value = template;
  };

  // 生成模板内容
  const generateTemplateContent = (template: Template, placeholders: Record<string, string>) => {
    let content = template.content;
    for (const [key, value] of Object.entries(placeholders)) {
      content = content.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }
    return content;
  };

  // 应用模板内容
  const applyTemplateContent = (content: string) => {
    inputText.value = content;
    showTemplatePanel.value = false;
  };

  // 检测关键词并显示建议气泡
  const checkKeywords = (text: string) => {
    const keywords = ['请假', '道歉', '感谢', '汇报', '生日祝福', '会议', '拒绝'];
    const hasKeyword = keywords.some(keyword => text.includes(keyword));
    
    if (hasKeyword) {
      showSuggestionBubble.value = true;
      suggestionMessage.value = '需要我帮你润色一下话术吗？';
    } else {
      // 只有在没有情绪关键词时才隐藏气泡
      const negativeEmotions = ['emo', '难过', '生气', '伤心', '失望'];
      const positiveEmotions = ['开心', '高兴', '兴奋', '升职', '考试过了'];
      const hasEmotion = negativeEmotions.some(emotion => text.includes(emotion)) || 
                         positiveEmotions.some(emotion => text.includes(emotion));
      
      if (!hasEmotion) {
        showSuggestionBubble.value = false;
      }
    }
  };

  // 检测情绪并显示建议
  const checkEmotion = (text: string) => {
    const negativeEmotions = ['emo', '难过', '生气', '伤心', '失望'];
    const positiveEmotions = ['开心', '高兴', '兴奋', '升职', '考试过了'];

    const hasNegativeEmotion = negativeEmotions.some(emotion => text.includes(emotion));
    const hasPositiveEmotion = positiveEmotions.some(emotion => text.includes(emotion));

    if (hasNegativeEmotion) {
      showSuggestionBubble.value = true;
      suggestionMessage.value = '需要我帮你写几句安慰/回应的话吗？';
    } else if (hasPositiveEmotion) {
      showSuggestionBubble.value = true;
      suggestionMessage.value = '恭喜你！需要我帮你生成分享的话术吗？';
    } else {
      // 只有在没有关键词时才隐藏气泡
      const keywords = ['请假', '道歉', '感谢', '汇报', '生日祝福', '会议', '拒绝'];
      const hasKeyword = keywords.some(keyword => text.includes(keyword));
      
      if (!hasKeyword) {
        showSuggestionBubble.value = false;
      }
    }
  };

  // 获取宠物回复
  const getPetReply = (message: string) => {
    // 模拟宠物回复
    const randomIndex = Math.floor(Math.random() * mockPetReplies.length);
    return mockPetReplies[randomIndex];
  };

  // 关闭所有面板
  const closeAllPanels = () => {
    showPolishPanel.value = false;
    showExtractPanel.value = false;
    showTemplatePanel.value = false;
    showSuggestionBubble.value = false;
  };

  return {
    inputText,
    isLoading,
    polishedTexts,
    extractedInfo,
    replySuggestions,
    selectedTemplate,
    showPolishPanel,
    showExtractPanel,
    showTemplatePanel,
    showSuggestionBubble,
    suggestionMessage,
    polishText,
    extractInformation,
    generateReply,
    applyPolishedText,
    applyReplySuggestion,
    selectTemplate,
    generateTemplateContent,
    applyTemplateContent,
    checkKeywords,
    checkEmotion,
    getPetReply,
    closeAllPanels,
  };
}
