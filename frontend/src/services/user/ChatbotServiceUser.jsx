const API_URL = import.meta.env.VITE_API_URL;

const ChatbotServiceUser = {
  // Public chat endpoint with streaming response
  chat: async (messages) => {
    return fetch(`${API_URL}/chatbot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
  },
};

export default ChatbotServiceUser;
