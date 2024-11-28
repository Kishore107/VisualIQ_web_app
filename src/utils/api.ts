import { ImageAnalysis } from '../types';

const HUGGING_FACE_API_KEY = import.meta.env.VITE_HUGGING_FACE_API_KEY;

const CAPTION_MODEL = "Salesforce/blip-image-captioning-base";
const VQA_MODEL = "dandelin/vilt-b32-finetuned-vqa";

async function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix
      const base64Content = base64String.split(',')[1];
      resolve(base64Content);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function generateImageCaption(image: File): Promise<string> {
  let retries = 0;
  const maxRetries = 10;
  const retryDelay = 2000;

  while (retries < maxRetries) {
    try {
      // Create blob from file
      const blob = new Blob([image], { type: image.type });
      
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${CAPTION_MODEL}`,
        {
          headers: {
            Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
          },
          method: "POST",
          body: blob,
        }
      );

      const result = await response.json();
      
      if (result.error?.includes('loading')) {
        retries++;
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue;
      }

      if (!response.ok) throw new Error(result.error || 'Failed to generate caption');
      return result[0].generated_text;
    } catch (error) {
      if (retries === maxRetries - 1) throw error;
      retries++;
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }

  throw new Error('Model took too long to load. Please try again.');
}

export async function answerQuestion(image: File, question: string): Promise<string> {
  let retries = 0;
  const maxRetries = 10;
  const retryDelay = 2000;

  while (retries < maxRetries) {
    try {
      const base64Image = await readFileAsBase64(image);

      const response = await fetch(
        `https://api-inference.huggingface.co/models/${VQA_MODEL}`,
        {
          headers: {
            Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          method: "POST",
          body: JSON.stringify({
            inputs: {
              image: base64Image,
              question: question
            }
          }),
        }
      );

      const result = await response.json();
      
      if (result.error?.includes('loading')) {
        retries++;
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue;
      }

      if (!response.ok) throw new Error(result.error || 'Failed to answer question');
      return result[0].answer;
    } catch (error) {
      if (retries === maxRetries - 1) throw error;
      retries++;
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }

  throw new Error('Model took too long to load. Please try again.');
} 