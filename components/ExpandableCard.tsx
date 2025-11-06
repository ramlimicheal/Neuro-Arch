
import React, { useState } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';

interface ExpandableCardProps {
  title: string;
  content: string;
  initiallyOpen?: boolean;
}

export const ExpandableCard: React.FC<ExpandableCardProps> = ({ title, content, initiallyOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${title}\n\n${content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-white/10 bg-black/20 backdrop-blur-md rounded-lg shadow-lg overflow-hidden mb-4 transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left text-lg font-semibold text-white focus:outline-none"
      >
        <span>{title}</span>
        <ChevronDownIcon
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          <p className="text-gray-300 whitespace-pre-wrap">{content}</p>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-2 text-sm text-pink-400 hover:text-pink-300 transition-colors duration-200 focus:outline-none"
            >
              <ClipboardIcon className="w-4 h-4" />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
