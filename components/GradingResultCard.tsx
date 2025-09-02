
import React, { useState } from 'react';
import { StudentSubmission } from '../types';
import Spinner from './Spinner';
import { ChevronDownIcon, CodeBracketIcon, TrashIcon } from './Icons';

interface GradingResultCardProps {
  submission: StudentSubmission;
  isLoading: boolean;
  onDelete: () => void;
}

const GradingResultCard: React.FC<GradingResultCardProps> = ({ submission, isLoading, onDelete }) => {
  const [isCodeVisible, setIsCodeVisible] = useState(false);
  const [isReasoningVisible, setIsReasoningVisible] = useState(false);

  const scoreColor = submission.result 
    ? (submission.result.score / submission.result.maxScore >= 0.8 
        ? 'text-green-600' 
        : (submission.result.score / submission.result.maxScore >= 0.5 ? 'text-yellow-600' : 'text-red-600'))
    : 'text-brand-text-secondary';
    
  return (
    <div className="bg-brand-surface rounded-xl shadow-md overflow-hidden transition-shadow hover:shadow-lg">
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-start">
            <h4 className="text-lg font-semibold text-brand-text-primary flex-grow truncate mr-4">{submission.fileName}</h4>
            {isLoading ? (
            <div className="flex items-center space-x-2 text-sm text-brand-secondary">
                <Spinner />
                <span>Grading...</span>
            </div>
            ) : submission.result ? (
            <div className={`text-2xl font-bold ${scoreColor}`}>
                {submission.result.score} / {submission.result.maxScore}
            </div>
            ) : null}
        </div>

        {submission.error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                <strong>Error:</strong> {submission.error}
            </div>
        )}

        {submission.result && (
          <div className="mt-4 space-y-4">
            <div>
              <h5 className="font-semibold text-brand-text-primary">Feedback</h5>
              <p className="text-brand-text-secondary text-sm mt-1">{submission.result.feedback}</p>
            </div>

            <div>
              <button
                onClick={() => setIsReasoningVisible(!isReasoningVisible)}
                className="flex items-center text-sm font-semibold text-brand-secondary hover:text-brand-primary"
              >
                Show AI Reasoning
                <ChevronDownIcon className={`w-5 h-5 ml-1 transition-transform ${isReasoningVisible ? 'rotate-180' : ''}`} />
              </button>
              {isReasoningVisible && (
                 <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-md">
                    <p className="text-sm text-brand-text-secondary whitespace-pre-wrap">{submission.result.reasoning}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
             <button
                onClick={() => setIsCodeVisible(!isCodeVisible)}
                className="flex items-center text-sm font-semibold text-brand-secondary hover:text-brand-primary"
              >
                <CodeBracketIcon className="w-5 h-5 mr-1" />
                {isCodeVisible ? 'Hide' : 'Show'} Code
              </button>
              <button
                onClick={onDelete}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                aria-label="Delete submission"
              >
                <TrashIcon className="h-5 w-5" />
            </button>
        </div>
      </div>

      {isCodeVisible && (
        <div className="bg-slate-800 p-4 max-h-96 overflow-auto">
            <pre className="text-sm text-slate-100 whitespace-pre-wrap"><code>{submission.code}</code></pre>
        </div>
      )}
    </div>
  );
};

export default GradingResultCard;
