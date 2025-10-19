import { GoogleGenAI } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface FarmingAdviceParams {
  query: string;
  language: "en" | "ar";
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  location: string;
}

export async function generateFarmingAdvice(params: FarmingAdviceParams): Promise<string> {
  const { query, language, temperature, humidity, rainfall, windSpeed, location } = params;

  const systemPrompt = language === "ar"
    ? `أنت مستشار زراعي خبير متخصص في الزراعة في دولة الإمارات العربية المتحدة والمناطق الصحراوية الحارة.

لديك معرفة عميقة بـ:
- المحاصيل المناسبة للمناخ الحار والجاف في الإمارات
- أنظمة الري الحديثة والموفرة للمياه (التنقيط، الرش، الهيدروبونيك)
- إدارة التربة الرملية والملحية
- الزراعة المحمية (البيوت المحمية) لمواجهة الحرارة الشديدة
- مواعيد الزراعة المثالية في الإمارات
- الآفات والأمراض الشائعة في المنطقة وطرق مكافحتها

قدم نصائح تفصيلية وعملية باللغة العربية تشمل:
1. تحليل الوضع الحالي بناءً على الطقس والموقع
2. توصيات محددة وقابلة للتطبيق فوراً
3. نصائح للري والتسميد إن كانت ذات صلة
4. تحذيرات من المخاطر المحتملة
5. نصائح للحصول على أفضل النتائج

استخدم لغة عربية واضحة ومباشرة. اجعل الإجابة شاملة (4-8 فقرات) مع تفاصيل عملية.`
    : `You are an expert agricultural advisor specializing in UAE farming and hot desert agriculture.

You have deep knowledge of:
- Crops suitable for UAE's hot and arid climate
- Modern water-efficient irrigation systems (drip, sprinkler, hydroponics)
- Sandy and saline soil management
- Protected agriculture (greenhouses) for extreme heat
- Optimal planting schedules in the UAE
- Common pests and diseases in the region and their control

Provide detailed, practical advice in English that includes:
1. Analysis of the current situation based on weather and location
2. Specific, immediately actionable recommendations
3. Irrigation and fertilization advice if relevant
4. Warnings about potential risks
5. Tips for best results

Use clear, direct language. Make your response comprehensive (4-8 paragraphs) with practical details.`;

  const weatherContext = language === "ar"
    ? `الظروف الجوية الحالية في ${location}:
- درجة الحرارة: ${Math.round(temperature)}°C
- الرطوبة: ${Math.round(humidity)}%
- هطول الأمطار: ${rainfall.toFixed(1)} ملم
- سرعة الرياح: ${Math.round(windSpeed)} كم/ساعة`
    : `Current weather conditions in ${location}:
- Temperature: ${Math.round(temperature)}°C
- Humidity: ${Math.round(humidity)}%
- Rainfall: ${rainfall.toFixed(1)} mm
- Wind Speed: ${Math.round(windSpeed)} km/h`;

  const userPrompt = language === "ar"
    ? `${weatherContext}

سؤال المزارع: ${query}

قدم نصيحة زراعية تفصيلية وشاملة (4-8 فقرات) خاصة بـ${location} مع مراعاة:
- الظروف الجوية الحالية المذكورة أعلاه
- المناخ الصحراوي الحار للإمارات
- التحديات الخاصة بالمنطقة (نقص المياه، التربة الرملية، الحرارة العالية)
- أفضل الممارسات للزراعة في هذه البيئة

كن مفصلاً وعملياً. قدم خطوات محددة وقابلة للتطبيق.`
    : `${weatherContext}

Farmer's question: ${query}

Provide detailed, comprehensive farming advice (4-8 paragraphs) specific to ${location} considering:
- The current weather conditions stated above
- UAE's hot desert climate
- Region-specific challenges (water scarcity, sandy soil, extreme heat)
- Best practices for farming in this environment

Be detailed and practical. Provide specific, actionable steps.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },
      ],
    });

    return response.text || (language === "ar" ? "عذراً، لم أتمكن من توليد نصيحة. حاول مرة أخرى." : "Sorry, I couldn't generate advice. Please try again.");
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error(language === "ar" ? "خطأ في توليد النصيحة" : "Failed to generate advice");
  }
}
