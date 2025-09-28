import { GoogleGenAI, Type } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";
import { ScanResult, NewsVerificationResult, UrlAnalysisResult, GroundingSource, DetailedFinding, LearningModule } from '../types';

// IMPORTANT: In a production application, the API key must be handled by a secure backend.
// Do not expose it on the client-side. The key is retrieved from environment variables for this example.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const imageForensicsSchema = {
    type: Type.OBJECT,
    properties: {
        verdict: {
            type: Type.STRING,
            description: "A final verdict on the image's authenticity.",
            enum: ["Likely Authentic", "Potentially Manipulated", "Likely AI-Generated", "High Confidence AI-Generated"]
        },
        trust_score: {
            type: Type.NUMBER,
            description: "A score from 0 to 100 representing the likelihood the image is authentic. 0 means very likely AI-generated/manipulated, 100 means very likely authentic."
        },
        summary: {
            type: Type.STRING,
            description: "A concise, one-paragraph summary of the overall analysis and the reasoning behind the verdict."
        },
        detailed_findings: {
            type: Type.ARRAY,
            description: "A list of specific observations found during the analysis, categorized by area.",
            items: {
                type: Type.OBJECT,
                properties: {
                    category: {
                        type: Type.STRING,
                        description: "The area of analysis.",
                        enum: ["Anatomy & Proportions", "Lighting & Shadows", "Background & Environment", "Texture & Detail", "AI Artifacts", "Other"]
                    },
                    finding: {
                        type: Type.STRING,
                        description: "A detailed description of the specific finding in this category."
                    },
                    severity: {
                        type: Type.STRING,
                        description: "The severity of the finding as an indicator of manipulation.",
                        enum: ["Low", "Medium", "High"]
                    }
                }
            }
        }
    },
    required: ["verdict", "trust_score", "summary", "detailed_findings"]
};

const videoForensicsSchema = {
    type: Type.OBJECT,
    properties: {
        verdict: {
            type: Type.STRING,
            description: "A final verdict on the video's authenticity.",
            enum: ["Likely Authentic", "Potentially Manipulated", "Likely AI-Generated", "High Confidence AI-Generated"]
        },
        trust_score: {
            type: Type.NUMBER,
            description: "A score from 0 to 100 representing the likelihood the video is authentic. 0 means very likely AI-generated/manipulated, 100 means very likely authentic."
        },
        summary: {
            type: Type.STRING,
            description: "A concise, one-paragraph summary of the overall analysis and the reasoning behind the verdict."
        },
        detailed_findings: {
            type: Type.ARRAY,
            description: "A list of specific observations found during the analysis, categorized by area.",
            items: {
                type: Type.OBJECT,
                properties: {
                    category: {
                        type: Type.STRING,
                        description: "The area of analysis for video.",
                        enum: ["Facial & Speech Analysis", "Scene & Object Consistency", "Audio-Visual Sync", "Compression & Artifacts", "Other"]
                    },
                    finding: {
                        type: Type.STRING,
                        description: "A detailed description of the specific finding in this category."
                    },
                    severity: {
                        type: Type.STRING,
                        description: "The severity of the finding as an indicator of manipulation.",
                        enum: ["Low", "Medium", "High"]
                    }
                }
            }
        }
    },
    required: ["verdict", "trust_score", "summary", "detailed_findings"]
};


const newsAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        verdict: {
            type: Type.STRING,
            description: "A final verdict on the news's truthfulness.",
            enum: ["Likely Factual", "Misleading", "Potentially False", "Unverifiable"]
        },
        credibility_score: {
            type: Type.NUMBER,
            description: "A score from 0 to 100 representing the credibility of the news. 0 is not credible, 100 is highly credible."
        },
        summary: {
            type: Type.STRING,
            description: "A concise, one-paragraph summary of the analysis, explaining the verdict and key findings."
        },
        key_findings: {
            type: Type.ARRAY,
            description: "A list of key observations from the analysis, like emotional language, lack of sources, etc.",
            items: { type: Type.STRING }
        },
        detected_biases: {
            type: Type.ARRAY,
            description: "A list of specific propaganda techniques or logical fallacies detected.",
            items: { type: Type.STRING }
        }
    },
    required: ["verdict", "credibility_score", "summary", "key_findings", "detected_biases"]
};

const learningContentSchema = {
    type: Type.OBJECT,
    properties: {
        content: {
            type: Type.STRING,
            description: "The full educational lesson content, formatted with markdown for readability (e.g., headers, lists, bold text). Should be engaging and easy to understand for the target age group."
        },
        quiz: {
            type: Type.ARRAY,
            description: "A list of 3 multiple-choice questions to test understanding of the lesson content.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: {
                        type: Type.STRING,
                        description: "The quiz question."
                    },
                    options: {
                        type: Type.ARRAY,
                        description: "An array of 4 possible string answers for the question.",
                        items: { type: Type.STRING }
                    },
                    correct_answer: {
                        type: Type.STRING,
                        description: "The correct answer from the options list."
                    },
                    explanation: {
                        type: Type.STRING,
                        description: "A brief explanation of why the correct answer is right."
                    }
                },
                required: ["question", "options", "correct_answer", "explanation"]
            }
        }
    },
    required: ["content", "quiz"]
};


export const analyzeImage = async (base64Image: string, mimeType: string): Promise<Pick<ScanResult, 'verdict' | 'trust_score' | 'summary' | 'detailed_findings'>> => {
  if (!API_KEY) {
    throw new Error("API key for Gemini is not configured.");
  }

  const prompt = `Act as a forensic image analyst specializing in detecting AI-generated and manipulated images. Perform a detailed examination of this image. Your analysis should evaluate the following key areas:
1.  **Anatomy and Proportions:** Check for unnatural body parts, incorrect number of fingers, distorted facial features, or inconsistent proportions.
2.  **Lighting and Shadows:** Analyze if shadows are consistent with the light sources in the scene. Look for objects that are lit from different directions or lack appropriate shadows.
3.  **Background and Environment:** Examine the background for distorted patterns, illogical structures, or elements that blend unnaturally.
4.  **Texture and Detail:** Look for areas that are overly smooth (like plastic skin), have strange texture patterns, or have inconsistent levels of detail across the image.
5.  **AI Artifacts:** Identify common digital artifacts from AI models, such as strange patterns in fine details (hair, fabric), garbled text, or signature watermarks from generation tools.

Based on this comprehensive analysis, provide a final verdict, a trust score, a summary, and detailed findings for each category in the requested JSON format.`;

  const imagePart = {
    inlineData: {
      mimeType,
      data: base64Image,
    },
  };

  const textPart = { text: prompt };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: imageForensicsSchema,
        }
    });
    
    const resultText = response.text.trim();
    const parsedResult = JSON.parse(resultText);

    return {
        verdict: parsedResult.verdict,
        trust_score: parsedResult.trust_score,
        summary: parsedResult.summary,
        detailed_findings: parsedResult.detailed_findings,
    };
  } catch (error) {
    console.error("Error analyzing image with Gemini:", error);
    throw new Error("Failed to analyze image. The AI model may be temporarily unavailable.");
  }
};

export const analyzeVideo = async (base64Video: string, mimeType: string): Promise<Pick<ScanResult, 'verdict' | 'trust_score' | 'summary' | 'detailed_findings'>> => {
  if (!API_KEY) {
    throw new Error("API key for Gemini is not configured.");
  }

  const prompt = `Act as a forensic video analyst specializing in detecting AI-generated and manipulated videos (deepfakes). Perform a detailed examination of this video. Your analysis should evaluate the following key areas:
1.  **Facial & Speech Analysis:** Look for unnatural facial movements, lack of blinking, poor lip-sync with the audio, and strange emotional expressions.
2.  **Scene & Object Consistency:** Analyze if objects or background elements behave consistently throughout the video. Look for illogical changes, flickering, or morphing.
3.  **Audio-Visual Sync:** Check the synchronization between audio events and visual cues.
4.  **Compression & Artifacts:** Identify unusual digital artifacts, blurring around faces, or inconsistencies in video quality that might indicate manipulation.

Based on this comprehensive analysis, provide a final verdict, a trust score, a summary, and detailed findings for each category in the requested JSON format.`;

  const videoPart = {
    inlineData: {
      mimeType,
      data: base64Video,
    },
  };

  const textPart = { text: prompt };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [videoPart, textPart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: videoForensicsSchema,
        }
    });
    
    const resultText = response.text.trim();
    const parsedResult = JSON.parse(resultText);

    return {
        verdict: parsedResult.verdict,
        trust_score: parsedResult.trust_score,
        summary: parsedResult.summary,
        detailed_findings: parsedResult.detailed_findings,
    };
  } catch (error) {
    console.error("Error analyzing video with Gemini:", error);
    throw new Error("Failed to analyze video. The AI model may be temporarily unavailable or the video format may not be supported.");
  }
};

export const verifyNewsWithGemini = async (query: string): Promise<NewsVerificationResult> => {
    if (!API_KEY) {
        throw new Error("API key for Gemini is not configured.");
    }
    
    const prompt = `Act as an expert fact-checker and media analyst. Analyze the following news headline or article text for bias, misinformation, and propaganda techniques. 
    
    News to analyze: "${query}"

    Your analysis should cover these points:
    1.  **Factual Accuracy:** Cross-reference the claims (conceptually) against known facts.
    2.  **Source Credibility:** Assess the likely credibility of the source making this claim.
    3.  **Language and Tone:** Look for emotionally charged words, sensationalism, or biased framing.
    4.  **Propaganda Techniques:** Identify any logical fallacies or manipulation tactics (e.g., ad hominem, whataboutism, fear-mongering, appeal to emotion).

    Provide your analysis in the requested JSON format. The summary should be neutral and objective. The key findings should be specific and actionable.
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: newsAnalysisSchema,
            }
        });

        const resultText = response.text.trim();
        const parsedResult = JSON.parse(resultText);
        return parsedResult as NewsVerificationResult;

    } catch (error) {
        console.error("Error verifying news with Gemini:", error);
        throw new Error("Failed to verify news. The AI model may be temporarily unavailable.");
    }
};

export const analyzeUrlWithGemini = async (url: string): Promise<UrlAnalysisResult> => {
    if (!API_KEY) {
        throw new Error("API key for Gemini is not configured.");
    }

    const prompt = `Act as a senior cybersecurity analyst. Your task is to analyze the following URL for potential threats and provide a safety assessment grounded in Google Search results.

    URL to analyze: "${url}"

    Analyze for threats including, but not limited to:
    - Phishing and social engineering
    - Malware or virus distribution
    - Scams or fraudulent activity
    - Deceptive practices or misinformation

    Based on your analysis, provide your response strictly in the following format. Do not add any introductory text, explanations, or markdown formatting.

    Verdict: [One of: Safe, Caution, Dangerous, Unknown]
    Summary: [A concise, one-paragraph summary of your findings and recommendation.]
    Threats Found: [A comma-separated list of specific threats detected. If none, write "None".]`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }] },
            config: {
                tools: [{ googleSearch: {} }],
            }
        });

        const text = response.text;

        const verdictMatch = text.match(/Verdict: (Safe|Caution|Dangerous|Unknown)/);
        const summaryMatch = text.match(/Summary: ([\s\S]*?)Threats Found:/);
        const threatsMatch = text.match(/Threats Found: (.*)/);

        const verdict = verdictMatch ? verdictMatch[1] as UrlAnalysisResult['verdict'] : 'Unknown';
        const summary = summaryMatch ? summaryMatch[1].trim() : 'Could not determine a summary.';
        const threats_found = threatsMatch && threatsMatch[1].trim().toLowerCase() !== 'none' ? threatsMatch[1].trim().split(',').map(t => t.trim()) : [];

        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources: GroundingSource[] = groundingChunks
            .map((chunk: any) => ({
                uri: chunk.web?.uri || '',
                title: chunk.web?.title || 'Untitled Source'
            }))
            .filter((source: GroundingSource) => source.uri);

        return {
            verdict,
            summary,
            threats_found,
            sources,
        };

    } catch (error) {
        console.error("Error analyzing URL with Gemini:", error);
        throw new Error("Failed to analyze URL. The AI model may be temporarily unavailable.");
    }
};

export const generateLearningContent = async (
    module: Pick<LearningModule, 'title' | 'description' | 'age_group'>
): Promise<Pick<LearningModule, 'content' | 'quiz'>> => {
    if (!API_KEY) {
        throw new Error("API key for Gemini is not configured.");
    }
    
    const prompt = `Act as an expert cybersecurity educator. Create a short, engaging lesson and a 3-question multiple-choice quiz on the topic of '${module.title}'. 
    
    The lesson should be tailored for the '${module.age_group}' age group. The general description of the lesson is: '${module.description}'.
    
    The lesson content should be clear, concise, and easy to understand, formatted with basic markdown (e.g., headers, lists, bold). For the quiz, each question must have exactly 4 options and a clear correct answer. Also, provide a brief explanation for why the correct answer is right.
    
    Respond strictly in the required JSON format.`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: learningContentSchema,
            }
        });

        const resultText = response.text.trim();
        const parsedResult = JSON.parse(resultText);
        
        // Ensure quiz options have exactly 4 items
        parsedResult.quiz.forEach((q: any) => {
            if (q.options.length > 4) {
                q.options = q.options.slice(0, 4);
            }
            while (q.options.length < 4) {
                q.options.push("N/A");
            }
        });

        return {
            content: parsedResult.content,
            quiz: parsedResult.quiz,
        };

    } catch (error) {
        console.error("Error generating learning content with Gemini:", error);
        throw new Error("Failed to generate lesson. The AI model may be temporarily unavailable.");
    }
};