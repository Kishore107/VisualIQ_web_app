import React, { useState } from 'react';
import { Brain } from 'lucide-react';
import { ImageUploader } from './components/ImageUploader';
import { QuestionInput } from './components/QuestionInput';
import { AnalysisResult } from './components/AnalysisResult';
import type { AnalysisState } from './types';
import { generateImageCaption, answerQuestion } from './utils/api';

function App() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    result: null,
  });

  const handleImageSelect = async (file: File) => {
    setSelectedImage(file);
    setAnalysis({
      isLoading: true,
      error: null,
      result: null,
    });

    try {
      const caption = await generateImageCaption(file);
      setAnalysis({
        isLoading: false,
        error: null,
        result: {
          caption,
        },
      });
    } catch (error) {
      setAnalysis({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to analyze image',
        result: null,
      });
    }
  };

  const handleAskQuestion = async (question: string) => {
    if (!selectedImage) return;

    setAnalysis(prev => ({
      ...prev,
      isLoading: true,
    }));

    try {
      const answer = await answerQuestion(selectedImage, question);
      setAnalysis(prev => ({
        isLoading: false,
        error: null,
        result: {
          caption: prev.result?.caption || "",
          answer,
        },
      }));
    } catch (error) {
      setAnalysis(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to answer question',
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Brain className="h-8 w-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-900">AI Image Analyzer</h1>
          </div>
          <p className="text-gray-600">
            Upload an image to generate captions and ask questions about it
          </p>
        </header>

        <div className="space-y-6">
          <ImageUploader
            onImageSelect={handleImageSelect}
            className="bg-white"
          />

          {selectedImage && (
            <div className="bg-white p-4 rounded-lg shadow">
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Uploaded preview"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {analysis.isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Analyzing image...</p>
            </div>
          )}

          {analysis.error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {analysis.error}
            </div>
          )}

          {analysis.result && (
            <>
              <AnalysisResult result={analysis.result} />
              <QuestionInput
                onAskQuestion={handleAskQuestion}
                disabled={analysis.isLoading}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;