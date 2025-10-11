const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyBk8T3g4oHC2i75_bAincHGf6VuQ2_HvtE";

export async function generateGeminiResponse(prompt, history = []) {
  try {
    // Format history for Gemini API
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));
    
    // Add the current prompt
    const contents = [
      ...formattedHistory,
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ];
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
      return {
        success: true,
        content: data.candidates[0].content.parts[0].text
      };
    } else {
      throw new Error('Invalid response from Gemini API');
    }
  } catch (error) {
    console.error("Error generating Gemini response:", error);
    return {
      success: false,
      error: error.message
    };
  }
        }
