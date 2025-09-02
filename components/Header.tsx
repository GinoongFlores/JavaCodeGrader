
import React from 'react';
import { CodeBracketIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-brand-surface shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start h-16">
          <CodeBracketIcon className="h-8 w-8 text-brand-primary" />
          <h1 className="text-2xl font-bold text-brand-text-primary ml-3">
            Java Code Grader AI
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
