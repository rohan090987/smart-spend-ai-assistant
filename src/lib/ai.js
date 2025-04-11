export async function fetchAIResponse(prompt) {
    const response = await fetch(import.meta.env.VITE_GORQ_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: prompt,
        temperature: 0.7
      })
    });
  
    const data = await response.json();
    return data.response;
  }