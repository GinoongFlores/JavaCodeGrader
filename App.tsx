
import React, { useState, useCallback } from 'react';
import { GradingSession } from './types';
import Header from './components/Header';
import GradingSessionView from './components/GradingSessionView';
import { PlusIcon, TrashIcon } from './components/Icons';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<GradingSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [newSessionInstruction, setNewSessionInstruction] = useState('');
  const [newSessionGradingMode, setNewSessionGradingMode] = useState<'output' | 'logic'>('output');
  const [newSessionOutput, setNewSessionOutput] = useState('');
  const [newSessionRubric, setNewSessionRubric] = useState('');

  const handleAddSession = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (newSessionTitle.trim() && newSessionInstruction.trim() && newSessionRubric.trim() && (newSessionGradingMode === 'logic' || newSessionOutput.trim())) {
      const newSession: GradingSession = {
        id: `session-${Date.now()}`,
        title: newSessionTitle,
        instruction: newSessionInstruction,
        gradingMode: newSessionGradingMode,
        expectedOutput: newSessionGradingMode === 'logic' ? '' : newSessionOutput,
        rubric: newSessionRubric,
        submissions: [],
      };
      setSessions(prev => [newSession, ...prev]);
      setNewSessionTitle('');
      setNewSessionInstruction('');
      setNewSessionGradingMode('output');
      setNewSessionOutput('');
      setNewSessionRubric('');
    }
  }, [newSessionTitle, newSessionInstruction, newSessionOutput, newSessionRubric, newSessionGradingMode]);

  const handleDeleteSession = useCallback((sessionId: string) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
  }, []);

  const updateSession = useCallback((updatedSession: GradingSession) => {
    setSessions(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s));
  }, []);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  if (activeSession) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="p-4 sm:p-6 lg:p-8">
          <button
            onClick={() => setActiveSessionId(null)}
            className="mb-6 text-sm font-semibold text-brand-secondary hover:text-brand-primary transition-colors"
          >
            &larr; Back to All Sessions
          </button>
          <GradingSessionView
            key={activeSession.id}
            session={activeSession}
            onUpdateSession={updateSession}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="bg-brand-surface p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-2xl font-bold text-brand-text-primary mb-4">Create New Grading Session</h2>
          <form onSubmit={handleAddSession} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-brand-text-secondary">Title</label>
              <input
                id="title"
                type="text"
                value={newSessionTitle}
                onChange={(e) => setNewSessionTitle(e.target.value)}
                placeholder="e.g., Homework 1: Hello World"
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary"
                required
              />
            </div>
            
            <div>
              <label htmlFor="instruction" className="block text-sm font-medium text-brand-text-secondary">Instruction</label>
              <textarea
                id="instruction"
                rows={4}
                value={newSessionInstruction}
                onChange={(e) => setNewSessionInstruction(e.target.value)}
                placeholder="e.g., Write a Java program that prints 'Hello, World!' to the console."
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text-secondary">Grading Mode</label>
              <div className="mt-1 flex rounded-md bg-slate-100 p-1 w-full sm:w-auto">
                  <button type="button" onClick={() => setNewSessionGradingMode('output')} className={`w-1/2 sm:w-auto transition-colors duration-200 ${newSessionGradingMode === 'output' ? 'bg-white shadow' : 'text-slate-500'} px-3 py-1 text-sm font-semibold rounded-md`}>
                      Expected Output
                  </button>
                  <button type="button" onClick={() => setNewSessionGradingMode('logic')} className={`w-1/2 sm:w-auto transition-colors duration-200 ${newSessionGradingMode === 'logic' ? 'bg-white shadow' : 'text-slate-500'} px-3 py-1 text-sm font-semibold rounded-md`}>
                      Logic Check
                  </button>
              </div>
              <p className="mt-2 text-xs text-brand-text-secondary">
                {newSessionGradingMode === 'output' 
                  ? "Grades based on matching a specific console output." 
                  : "Grades based on correctness of code logic against instructions."}
              </p>
            </div>

            {newSessionGradingMode === 'output' && (
              <div>
                <label htmlFor="output" className="block text-sm font-medium text-brand-text-secondary">Expected Output</label>
                <textarea
                  id="output"
                  rows={4}
                  value={newSessionOutput}
                  onChange={(e) => setNewSessionOutput(e.target.value)}
                  placeholder="The exact console output you expect from a correct submission."
                  className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary"
                  required={newSessionGradingMode === 'output'}
                />
              </div>
            )}
            
            <div>
              <label htmlFor="rubric" className="block text-sm font-medium text-brand-text-secondary">Scoring Rubric</label>
              <textarea
                id="rubric"
                rows={6}
                value={newSessionRubric}
                onChange={(e) => setNewSessionRubric(e.target.value)}
                placeholder="Describe how submissions will be graded. e.g., '10 points: Perfect output. 5 points: Minor formatting errors. 0 points: Incorrect logic.'"
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary"
                required
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Session
            </button>
          </form>
        </div>

        <h2 className="text-2xl font-bold text-brand-text-primary mb-4">Existing Sessions</h2>
        {sessions.length === 0 ? (
          <p className="text-brand-text-secondary text-center py-8 bg-brand-surface rounded-xl">No grading sessions created yet.</p>
        ) : (
          <ul className="space-y-4">
            {sessions.map(session => (
              <li
                key={session.id}
                className="bg-brand-surface p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow flex justify-between items-center"
              >
                <div
                  onClick={() => setActiveSessionId(session.id)}
                  className="cursor-pointer flex-grow"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-brand-primary">{session.title}</h3>
                    {session.gradingMode === 'logic' ? (
                      <span className="text-xs font-semibold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Logic Check</span>
                    ) : (
                      <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Output Match</span>
                    )}
                  </div>
                  <p className="text-sm text-brand-text-secondary mt-1 truncate">{session.submissions.length} submission(s)</p>
                </div>
                <button
                  onClick={() => handleDeleteSession(session.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  aria-label="Delete session"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default App;
