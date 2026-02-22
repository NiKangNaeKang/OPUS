import axios from "axios";

export const chatbotApi = {
  /**
   * AI 챗봇 대화
   */
  chat: async (message, conversationId = null) => {
    const response = await axios.post(`/chatbot/chat`, {
      message,
      conversationId
    });
    return response.data;
  },

  /**
   * 대화 히스토리 조회
   */
  getHistory: async (conversationId) => {
    const response = await axios.get(
      `/chatbot/history/${conversationId}`
    );
    return response.data;
  }
};