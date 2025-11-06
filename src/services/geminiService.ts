
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    sixStepTransformation: {
      type: Type.ARRAY,
      description: "The 6-step CBT transformation process.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "The title of the CBT step." },
          content: { type: Type.STRING, description: "The detailed content for the CBT step." }
        },
        required: ["title", "content"]
      }
    },
    strategicInsights: {
      type: Type.OBJECT,
      description: "Broader context and neuro-architect guidance.",
      properties: {
        title: { type: Type.STRING, description: "The title of the insights section." },
        content: { type: Type.STRING, description: "The detailed strategic insights and guidance." }
      },
      required: ["title", "content"]
    }
  },
  required: ["sixStepTransformation", "strategicInsights"]
};

export async function getMentalOSUpgrade(thought: string): Promise<AnalysisResult> {
  const prompt = `
    You are a Neuro-Architect, an AI expert in Cognitive Behavioral Therapy (CBT), neuroplasticity, and mental reframing. Your goal is to help users upgrade their 'Mental OS' by deconstructing cognitive distortions and architecting new, empowering internal narratives.

    The user has submitted the following thought: "${thought}"

    Analyze this thought and generate a 2-part response in the requested JSON format.

    Part 1: 6-Step Transformation
    Generate content for each of the 6 steps. Use the "Neuro-Architect" persona.
    - 1. Name It: Isolate the Signal: Give the thought pattern a technical, detached name.
    - 2. Identify: Deconstruct the Code: Pinpoint the specific cognitive distortions at play (e.g., Catastrophizing, Fortune-Telling, Mind-Reading).
    - 3. Worst-Case: Run the Simulation: Articulate the absolute worst-case scenario this thought leads to. This helps to defang the fear.
    - 4. Best-Case: Envision the Potential: Articulate the most positive, optimistic outcome. This expands the user's perceived reality.
    - 5. Reframe: Install the Patch: Provide a balanced, realistic, and empowering alternative thought. This is the new line of code.
    - 6. Act: Execute the New Program: Suggest a small, concrete, immediate action the user can take to reinforce the new reframe.

    Part 2: Strategic Insights & Neuro-Architect Guidance
    Provide broader, actionable advice based on the user's thought. Use concepts like "brain OS upgrade," "mental hygiene," "neuroplastic change," "interrupting neural loops," and "engineering feedback loops." Frame the inner critic as a "misguided guardian." Emphasize continuous, daily practice for long-term neuro-rewiring.

    Return the entire response as a single JSON object matching the provided schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    // Basic validation to ensure the structure matches AnalysisResult
    if (result.sixStepTransformation && result.strategicInsights) {
        return result as AnalysisResult;
    } else {
        throw new Error("Invalid response structure from API");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to process the thought. Please try again.");
  }
}
