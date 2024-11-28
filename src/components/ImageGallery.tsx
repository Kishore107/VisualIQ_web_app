import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Share2, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function ImageGallery() {
  const { analyzedImages, clearHistory } = useApp();

  const handleShare = async (image: File, analysis: string) => {
    try {
      await navigator.share({
        title: 'Visual IQ Analysis',
        text: analysis,
        files: [image],
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (analyzedImages.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold dark:text-gray-200 text-gray-800">Recent Analyses</h2>
        <button
          onClick={clearHistory}
          className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Clear History
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {analyzedImages.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white/50 dark:bg-gray-900/20 p-4 rounded-xl backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 shadow-sm"
            >
              <div className="relative w-full flex justify-center h-48 mb-3">
                <img
                  src={URL.createObjectURL(item.file)}
                  alt="Analysis"
                  className="max-w-full h-full object-contain rounded-lg"
                />
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{item.analysis.caption}</p>
              <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(item.timestamp).toLocaleDateString()}
                </div>
                <button
                  onClick={() => handleShare(item.file, item.analysis.caption)}
                  className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
} 