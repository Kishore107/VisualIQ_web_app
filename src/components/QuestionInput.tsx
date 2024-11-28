import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface QuestionInputProps {
  onAskQuestion: (question: string) => void;
  disabled?: boolean;
}

export function QuestionInput({ onAskQuestion, disabled }: QuestionInputProps) {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onAskQuestion(question.trim());
      setQuestion('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question about the image..."
        disabled={disabled}
        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
      />
      <button
        type="submit"
        disabled={disabled || !question.trim()}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <Send className="h-4 w-4" />
        Ask
      </button>
    </form>
  );
}