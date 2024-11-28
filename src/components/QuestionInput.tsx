import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic, Keyboard } from 'lucide-react';

interface QuestionInputProps {
  onAskQuestion: (question: string) => void;
  disabled?: boolean;
}

export function QuestionInput({ onAskQuestion, disabled }: QuestionInputProps) {
  const [question, setQuestion] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + / to focus input
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
      }
      // Ctrl/Cmd + Enter to submit
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && question.trim()) {
        e.preventDefault();
        onAskQuestion(question.trim());
        setQuestion('');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [question, onAskQuestion]);

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuestion(transcript);
      };

      recognition.start();
    }
  };

  return (
    <div className="relative">
      <motion.form 
        onSubmit={(e) => {
          e.preventDefault();
          if (question.trim()) {
            onAskQuestion(question.trim());
            setQuestion('');
          }
        }}
        className="flex gap-3"
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about the image... (Ctrl + / to focus)"
          disabled={disabled}
          className="flex-1 px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
        <motion.button
          type="button"
          onClick={startVoiceInput}
          disabled={disabled || isListening}
          className="px-3 bg-gray-100/50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-200/50 dark:hover:bg-gray-600/50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Mic className={`h-5 w-5 ${isListening ? 'text-red-400' : 'text-gray-500 dark:text-gray-400'}`} />
        </motion.button>
        <motion.button
          type="submit"
          disabled={disabled || !question.trim()}
          className="px-6 py-3 bg-blue-500/90 dark:bg-blue-600/90 text-white rounded-xl hover:bg-blue-600/90 dark:hover:bg-blue-700/90 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Send className="h-5 w-5" />
        </motion.button>
      </motion.form>

      <button
        onClick={() => setShowShortcuts(!showShortcuts)}
        className="absolute -bottom-8 right-0 text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
      >
        <Keyboard className="h-3 w-3" />
        {showShortcuts ? 'Hide shortcuts' : 'Show shortcuts'}
      </button>

      {showShortcuts && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-24 right-0 bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg text-sm text-gray-600 dark:text-gray-400 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div>Ctrl/Cmd + / : Focus input</div>
          <div>Ctrl/Cmd + Enter : Submit</div>
        </motion.div>
      )}
    </div>
  );
}