import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageUploader } from './components/ImageUploader';
import { QuestionInput } from './components/QuestionInput';
import { AnalysisResult } from './components/AnalysisResult';
import { AnimatedBrain } from './components/AnimatedBrain';
import type { AnalysisState } from './types';
import { generateImageCaption, answerQuestion } from './utils/api';
import { ParticleBackground } from './components/ParticleBackground';
import { AppProvider, useApp } from './context/AppContext';
import { ImageGallery } from './components/ImageGallery';
import confetti from 'canvas-confetti';

function AppContent() {
  const { theme, toggleTheme, addAnalyzedImage } = useApp();
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
      addAnalyzedImage(file, { caption });
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
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
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-white' : 'bg-gradient-to-b from-gray-50 to-white text-gray-900'}`}>
      <button
        onClick={toggleTheme}
        className={`fixed top-4 right-4 p-2 rounded-lg backdrop-blur-sm ${
          theme === 'dark' 
            ? 'bg-gray-800/50 text-yellow-400 hover:bg-gray-700/50' 
            : 'bg-white/50 text-gray-600 hover:bg-gray-50/50 border border-gray-200'
        }`}
      >
        {theme === 'dark' ? '🌞' : '🌙'}
      </button>
      <ParticleBackground />
      <div className="max-w-4xl mx-auto p-6 relative">
        <motion.header 
          className={`text-center mb-12 backdrop-blur-sm p-8 rounded-2xl border ${
            theme === 'dark'
              ? 'bg-white/5 border-white/10'
              : 'bg-white/80 border-gray-200'
          }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <AnimatedBrain />
              <motion.div
                className="absolute -inset-2 bg-blue-500/20 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
            <motion.h1 
              className="text-5xl font-bold"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700">
                Visual IQ
              </span>
            </motion.h1>
          </div>
          <motion.p 
            className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Upload an image to generate captions and ask questions about it
          </motion.p>
        </motion.header>

        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ImageUploader
            onImageSelect={handleImageSelect}
            className={theme === 'dark' 
              ? 'bg-gray-800/50 border-gray-700 hover:border-blue-500'
              : 'bg-white border-gray-300 hover:border-blue-400'
            }
          />

          {selectedImage && (
            <motion.div 
              className={`p-6 rounded-xl shadow-xl ${
                theme === 'dark' ? 'bg-gray-800/20' : 'bg-white'
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring" }}
            >
              <div className="relative w-full flex justify-center rounded-lg overflow-hidden">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Uploaded preview"
                  className="max-w-full max-h-[70vh] object-contain"
                />
              </div>
            </motion.div>
          )}

          {analysis.isLoading && (
            <div className="text-center py-8">
              <motion.div 
                className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className={`mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Analyzing image...
              </p>
            </div>
          )}

          {analysis.error && (
            <motion.div 
              className={`p-4 rounded-lg ${
                theme === 'dark' 
                  ? 'bg-red-900/50 text-red-300' 
                  : 'bg-red-50 text-red-600 border border-red-200'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {analysis.error}
            </motion.div>
          )}

          {analysis.result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AnalysisResult result={analysis.result} />
              <QuestionInput
                onAskQuestion={handleAskQuestion}
                disabled={analysis.isLoading}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
      <ImageGallery />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;