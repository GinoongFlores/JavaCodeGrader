
import React, { useState, useCallback } from 'react';
import { GradingSession, StudentSubmission } from '../types';
import { gradeJavaCode } from '../services/geminiService';
import FileUpload from './FileUpload';
import GradingResultCard from './GradingResultCard';

interface GradingSessionViewProps {
  session: GradingSession;
  onUpdateSession: (updatedSession: GradingSession) => void;
}

const GradingSessionView: React.FC<GradingSessionViewProps> = ({ session, onUpdateSession }) => {
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(session.submissions);
  const [processingFiles, setProcessingFiles] = useState<Set<string>>(new Set());

  const handleFileUpload = useCallback(async (fileContent: string, fileName: string) => {
    const submissionId = `sub-${Date.now()}-${fileName}`;
    const newSubmission: StudentSubmission = {
      id: submissionId,
      fileName,
      code: fileContent,
      result: null,
    };

    setSubmissions(prev => [newSubmission, ...prev]);
    setProcessingFiles(prev => new Set(prev).add(submissionId));

    try {
      const result = await gradeJavaCode(fileContent, session.rubric, {
        gradingMode: session.gradingMode,
        title: session.title,
        instructions: session.instruction,
        expectedOutput: session.expectedOutput
      });

      setSubmissions(prev => {
        const updated = prev.map(s => s.id === submissionId ? { ...s, result, error: undefined } : s);
        onUpdateSession({ ...session, submissions: updated });
        return updated;
      });
    } catch (error) {
      console.error("Grading failed:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setSubmissions(prev => {
        const updated = prev.map(s => s.id === submissionId ? { ...s, error: errorMessage, result: null } : s);
        onUpdateSession({ ...session, submissions: updated });
        return updated;
      });
    } finally {
      setProcessingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(submissionId);
        return newSet;
      });
    }
  }, [session, onUpdateSession]);
  
  const handleDeleteSubmission = useCallback((submissionId: string) => {
    setSubmissions(prev => {
        const updatedSubmissions = prev.filter(s => s.id !== submissionId);
        onUpdateSession({ ...session, submissions: updatedSubmissions });
        return updatedSubmissions;
    });
  }, [session, onUpdateSession]);

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-brand-surface p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-brand-text-primary">{session.title}</h2>
          {session.gradingMode === 'logic' ? (
              <span className="mt-2 inline-block text-xs font-semibold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Logic Check</span>
          ) : (
              <span className="mt-2 inline-block text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Output Match</span>
          )}
        </div>
        <div className="bg-brand-surface p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-brand-text-primary mb-3">Instruction</h3>
            <p className="text-sm text-brand-text-secondary whitespace-pre-wrap">{session.instruction}</p>
        </div>
        {session.gradingMode === 'output' && (
          <div className="bg-brand-surface p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-brand-text-primary mb-3">Expected Output</h3>
            <pre className="bg-slate-100 p-3 rounded-md text-sm text-brand-text-secondary whitespace-pre-wrap font-mono">{session.expectedOutput}</pre>
          </div>
        )}
        <div className="bg-brand-surface p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-brand-text-primary mb-3">Scoring Rubric</h3>
          <p className="text-sm text-brand-text-secondary whitespace-pre-wrap">{session.rubric}</p>
        </div>
      </div>
      <div className="lg:col-span-2">
        <FileUpload onFileUpload={handleFileUpload} />
        <div className="mt-8">
            <h3 className="text-xl font-bold text-brand-text-primary mb-4">Submissions ({submissions.length})</h3>
            {submissions.length === 0 ? (
                <p className="text-center text-brand-text-secondary py-8">Upload a student's .java file to begin grading.</p>
            ) : (
                <div className="space-y-4">
                    {submissions.map(sub => (
                        <GradingResultCard 
                            key={sub.id} 
                            submission={sub} 
                            isLoading={processingFiles.has(sub.id)}
                            onDelete={() => handleDeleteSubmission(sub.id)}
                        />
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default GradingSessionView;
