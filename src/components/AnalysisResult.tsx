import React from 'react';
import { ImageAnalysis } from '../types';
import { MessageSquare, Image as ImageIcon } from 'lucide-react';

interface AnalysisResultProps {
  result: ImageAnalysis;
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-start gap-3">
          <ImageIcon className="h-5 w-5 text-blue-500 mt-1" />
          <div>
            <h3 className="font-medium text-gray-900">Image Caption</h3>
            <p className="text-gray-600">{result.caption}</p>
          </div>
        </div>
      </div>
      
      {result.answer && (
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-start gap-3">
            <MessageSquare className="h-5 w-5 text-green-500 mt-1" />
            <div>
              <h3 className="font-medium text-gray-900">Answer</h3>
              <p className="text-gray-600">{result.answer}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}