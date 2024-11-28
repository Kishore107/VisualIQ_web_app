import React from 'react';
import { motion } from 'framer-motion';
import { ImageAnalysis } from '../types';
import { MessageSquare, Image as ImageIcon } from 'lucide-react';

interface AnalysisResultProps {
  result: ImageAnalysis;
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  return (
    <div className="space-y-4">
      <motion.div 
        className="bg-white/50 dark:bg-gray-900/20 p-6 rounded-xl backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-start gap-4">
          <div className="bg-blue-100/80 dark:bg-blue-900/30 p-2 rounded-lg">
            <ImageIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-blue-100 mb-2">Image Caption</h3>
            <p className="text-gray-600 dark:text-gray-300">{result.caption}</p>
          </div>
        </div>
      </motion.div>
      
      {result.answer && (
        <motion.div 
          className="bg-white/50 dark:bg-gray-900/20 p-6 rounded-xl backdrop-blur-sm border border-gray-200 dark:border-gray-800/50 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-start gap-4">
            <div className="bg-green-100/80 dark:bg-green-900/30 p-2 rounded-lg">
              <MessageSquare className="h-5 w-5 text-green-500 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-green-100 mb-2">Answer</h3>
              <p className="text-gray-600 dark:text-gray-300">{result.answer}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}