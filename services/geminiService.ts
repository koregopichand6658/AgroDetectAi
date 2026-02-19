import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Diagnosis } from '../types';

// Use the flash model for multimodal tasks (Image + Text -> JSON)
const MODEL_NAME = 'gemini-flash-latest'; 

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const diagnosisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    isPlant: { type: Type.BOOLEAN, description: "True if the image contains a plant, leaf, crop, or fruit." },
    plantName: { type: Type.STRING, description: "The common name of the plant identified." },
    status: { type: Type.STRING, enum: ['Healthy', 'Diseased', 'Unknown'], description: "General health status." },
    diseaseName: { type: Type.STRING, description: "Name of the disease or pest if detected, otherwise null or 'None'." },
    confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 100." },
    severity: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'None'], description: "Severity of the issue." },
    symptoms: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of visual symptoms observed." },
    causes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Potential causes (fungal, bacterial, pests, environmental)." },
    treatments: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Recommended treatments or cures." },
    preventiveMeasures: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Steps to prevent future occurrences." },
    description: { type: Type.STRING, description: "A brief, easy-to-understand summary of the diagnosis." },
  },
  required: ['isPlant', 'plantName', 'status', 'confidence', 'description'],
};

export const analyzePlantImage = async (base64Image: string): Promise<Diagnosis> => {
  // Remove header if present (e.g., "data:image/jpeg;base64,")
  const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          },
          {
            text: "Analyze this image for plant health. Identify the plant and detect any diseases, pests, or nutrient deficiencies. Provide a detailed diagnosis."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: diagnosisSchema,
        temperature: 0.4, // Lower temperature for more analytical/factual results
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as Diagnosis;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};

export const createChatSession = (diagnosisContext?: Diagnosis) => {
  let systemInstruction = "You are AgroBot, an expert agricultural consultant. You help users identify plant diseases and provide farming advice. Be helpful, concise, and scientific yet accessible.";
  
  if (diagnosisContext) {
    systemInstruction += `\n\nCurrent Context: The user has just analyzed a plant identified as ${diagnosisContext.plantName}. Status: ${diagnosisContext.status}. Diagnosis: ${diagnosisContext.diseaseName}. Description: ${diagnosisContext.description}. Use this information to answer follow-up questions.`;
  }

  return ai.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction: systemInstruction,
    }
  });
};
