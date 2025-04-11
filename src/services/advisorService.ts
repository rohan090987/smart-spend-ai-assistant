// src/services/advisorService.ts
export const advisorService = {
  async getAIResponse(query: string) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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", // Replace safely
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo", // safe default model
          messages: [
            {
              role: "system",
              content: "You are a helpful and concise financial advisor. Answer clearly, simply, and with financial accuracy."
            },
            {
              role: "user",
              content: query
            }
          ]
        })
      });

      const data = await response.json();

      if (response.ok && data.choices?.[0]?.message?.content) {
        return { content: data.choices[0].message.content };
      } else {
        console.error("AI error response:", data);
        return { content: "Sorry, I couldn't process your request." };
      }

    } catch (error) {
      console.error("Error fetching AI response:", error);
      return { content: "Sorry, something went wrong." };
    }
  }
};