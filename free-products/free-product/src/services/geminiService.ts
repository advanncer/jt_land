import { GoogleGenAI, Type } from "@google/genai";
import { QuizResult, ZodiacSign } from "../types";
import { ZODIAC_SIGNS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateAstroRoast(
  zodiac: ZodiacSign,
  answers: Record<string, string>
): Promise<QuizResult> {
  const model = "gemini-3-flash-preview";
  const zodiacInfo = ZODIAC_SIGNS.find(z => z.id === zodiac);
  
  const prompt = `
    System Role:
    Ти — експертний викладач англійської мови з глибоким розумінням психології та астрології. Твоє завдання — проаналізувати відповіді клієнта та його знак зодіаку, щоб скласти унікальну стратегію навчання. Твій голос має бути професійним, але з характером, що відповідає вайбу знака зодіаку клієнта.

    Context:
    Знак зодіаку: ${zodiac} (${zodiacInfo?.label})
    Альтер-его знака: ${zodiacInfo?.slang}
    Управитель: ${zodiacInfo?.ruler}
    Стилія: ${zodiacInfo?.element}
    Метафора: ${zodiacInfo?.metaphor}
    Відповіді на тест: ${JSON.stringify(answers)}

    Instructions:
    1. Linguistic Audit: На основі відповідей виділи 2 сильні та 2 слабкі сторони в англійській.
    2. Zodiac Archetype: Адаптуй рекомендації під риси знака, враховуючи його управителя (${zodiacInfo?.ruler}) та стихію (${zodiacInfo?.element}).
       - Наприклад, для Рака (управитель Місяць) згадай про "фази" навчання: сьогодні пік (Full Moon) — говориш без зупинки, завтра ресурс (New Moon) — краще засвоюєш візуал.
       - Використовуй метафору знака: "${zodiacInfo?.metaphor}".
    3. Study Plan: Запропонуй 3 конкретні кроки (цікаві саме цьому знаку), як підтягнути англійську.

    Поверни результат у форматі JSON:
    {
      "persona": "Назва твого альтер-его",
      "roast": "Текст аналізу (Linguistic Audit + Zodiac Archetype) у форматі Markdown. Використовуй подвійні переноси рядків для розділення абзаців, щоб текст був читабельним.",
      "advice": "Study Plan (3 конкретні кроки) у форматі Markdown"
    }
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          persona: { type: Type.STRING },
          roast: { type: Type.STRING },
          advice: { type: Type.STRING },
        },
        required: ["persona", "roast", "advice"],
      },
    },
  });

  const result = JSON.parse(response.text || "{}") as QuizResult;

  // Generate a character image for the result in a sophisticated editorial style
  try {
    const imageResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: `A sophisticated, high-end editorial digital identity card for a ${zodiac} zodiac persona. 
      Background is a mix of dark moody tones and subtle grainy grunge texture. 
      Delicate silver constellations of ${zodiac} interwoven with organic elements like dried leaves or water ripples. 
      A minimalist, fine-line glowing symbol of ${zodiacInfo?.ruler} at the top. 
      Soft natural lighting, cinematic shadows, iridescent accents. 
      Vibrant colors from JustSchool brand (neon blue, yellow, purple, and vibrant orange) integrated subtly. 
      8k, serene and mysterious atmosphere, frosted glass texture.`,
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });

    for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        result.imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }
  } catch (error) {
    console.error("Image generation failed:", error);
    result.imageUrl = `https://picsum.photos/seed/${zodiac}/800/800`;
  }

  return result;
}
