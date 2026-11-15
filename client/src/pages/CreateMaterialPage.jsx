import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Layers,
  HelpCircle,
  BookOpen,
  FileText,
  Package,
  RotateCw,
  Save,
  Play,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle as QuestionIcon,
} from 'lucide-react';
import { Button } from '../components/common/Button.jsx';
import { Input } from '../components/common/Input.jsx';
import { Dropdown } from '../components/common/Dropdown.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Skeleton } from '../components/common/Skeleton.jsx';
import { aiService } from '../services/aiService.js';
import { useStudy } from '../context/StudyContext.jsx';

const outputTypes = [
  { id: 'flashcards', label: 'Flashcards', icon: Layers, desc: 'Active recall cards with front/back concepts' },
  { id: 'quiz', label: 'Interactive Quiz', icon: HelpCircle, desc: 'Multiple-choice questions with full explanations' },
  { id: 'study-guide', label: 'Study Guide', icon: BookOpen, desc: 'Structured summary, concepts & key examples' },
  { id: 'summary', label: 'Summary', icon: FileText, desc: 'Executive overview with core takeaways' },
  { id: 'mixed', label: 'Mixed Pack', icon: Package, desc: 'Cards, practice questions & overview pack' },
];

const samplePrompts = [
  { label: 'Photosynthesis & Light Reactions', topic: 'Photosynthesis & Light Reactions', subject: 'Biology', type: 'flashcards' },
  { label: 'JavaScript Event Loop & Microtasks', topic: 'JavaScript Event Loop & Concurrency', subject: 'Computer Science', type: 'quiz' },
  { label: 'Machine Learning: Backpropagation', topic: 'Neural Networks & Backpropagation', subject: 'Artificial Intelligence', type: 'study-guide' },
  { label: 'WWII: Geopolitics & Turning Points', topic: 'World War II Turning Points', subject: 'History', type: 'summary' },
];

export const CreateMaterialPage = () => {
  const navigate = useNavigate();
  const { addMaterial, addToast } = useStudy();

  const [topic, setTopic] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [outputType, setOutputType] = useState('flashcards');
  const [itemCount, setItemCount] = useState(5);

  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [error, setError] = useState(null);
  const [activePreviewCard, setActivePreviewCard] = useState(0);
  const [isFlippedPreview, setIsFlippedPreview] = useState(false);

  const subjects = [
    'Computer Science',
    'Biology',
    'Artificial Intelligence',
    'History',
    'Mathematics',
    'Chemistry',
    'Physics',
    'Economics',
    'General Studies',
  ];

  const handleGenerate = async () => {
    if (!topic.trim() && !sourceText.trim()) {
      setError('Please provide a topic or paste study notes.');
      return;
    }

    setError(null);
    setIsLoading(true);
    setGeneratedResult(null);

    try {
      const data = await aiService.generate({
        prompt: sourceText,
        topic,
        subject,
        type: outputType,
        difficulty,
        count: itemCount,
      });

      setGeneratedResult(data);
      addToast(
        'Generated Successfully!',
        data.isDemo
          ? 'Generated with high-fidelity Demo Mode generator.'
          : 'AI processing complete and verified.',
        'success'
      );
    } catch (err) {
      setError(err.message || 'Generation failed. Please try again.');
      addToast('Generation Error', err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToLibrary = async () => {
    if (!generatedResult) return;

    try {
      const saved = await addMaterial({
        title: generatedResult.title || topic || 'New Study Set',
        subject: generatedResult.subject || subject,
        type: outputType,
        difficulty,
        sourceText,
        content: generatedResult,
      });

      // Navigate to the created item
      if (outputType === 'flashcards') {
        navigate(`/flashcards/${saved._id}`);
      } else if (outputType === 'quiz') {
        navigate(`/quiz/${saved._id}`);
      } else {
        navigate(`/library`);
      }
    } catch (err) {
      // toast already handled in addMaterial
    }
  };

  const handleApplySample = (sample) => {
    setTopic(sample.topic);
    setSubject(sample.subject);
    setOutputType(sample.type);
    setSourceText(`Study notes for ${sample.topic}: Core definitions, principles, and key mechanisms.`);
    setError(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Content Generation Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Create AI Study Material
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Transform your raw lecture notes, topics, or textbook excerpts into structured interactive resources.
        </p>
      </div>

      {/* Main Grid: Input Form & Live Result Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: 7 cols */}
        <div className="lg:col-span-7 space-y-6 bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          {/* Sample prompts */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Try an Example Prompt:
            </label>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplySample(s)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/50 dark:hover:text-brand-300 border border-slate-200 dark:border-slate-700 transition-colors font-medium"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Topic Input */}
          <Input
            label="Study Topic / Concept Name"
            placeholder="e.g. Photosynthesis, Binary Trees, Cold War Treaties"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          {/* Source Notes Area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Source Notes / Lecture Content (Optional or paste text)
              </label>
              <span className="text-xs text-slate-400">
                {sourceText.length} characters
              </span>
            </div>
            <textarea
              rows={5}
              placeholder="Paste raw lecture transcripts, textbook excerpts, or leave blank to let AI generate purely from the topic..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>

          {/* Type Selector Tabs */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Select Output Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {outputTypes.map((t) => {
                const Icon = t.icon;
                const isSelected = outputType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setOutputType(t.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-brand-50/80 dark:bg-brand-950/60 border-brand-500 text-brand-900 dark:text-brand-200 shadow-sm ring-1 ring-brand-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-2 ${isSelected ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`} />
                    <p className="text-xs font-bold leading-tight">{t.label}</p>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{t.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subject, Difficulty, and Item Count selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Dropdown
              label="Subject"
              options={subjects}
              value={subject}
              onChange={setSubject}
            />

            <Dropdown
              label="Difficulty"
              options={[
                { value: 'beginner', label: 'Beginner' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'advanced', label: 'Advanced' },
              ]}
              value={difficulty}
              onChange={setDifficulty}
            />

            <Dropdown
              label="Items Count"
              options={[
                { value: 3, label: '3 Items (Quick)' },
                { value: 5, label: '5 Items (Standard)' },
                { value: 10, label: '10 Items (Detailed)' },
              ]}
              value={itemCount}
              onChange={(val) => setItemCount(Number(val))}
            />
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              size="lg"
              isLoading={isLoading}
              onClick={handleGenerate}
              className="flex-1 shadow-md"
              icon={Sparkles}
            >
              Generate Educational Material
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                setTopic('');
                setSourceText('');
                setGeneratedResult(null);
                setError(null);
              }}
              title="Clear inputs"
            >
              <Trash2 className="w-4 h-4 text-slate-400" />
            </Button>
          </div>
        </div>

        {/* Right Preview: 5 cols */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Interactive Preview</span>
              {generatedResult?.isDemo ? (
                <Badge variant="warning" size="xs">
                  Demo Mode
                </Badge>
              ) : generatedResult ? (
                <Badge variant="success" size="xs">
                  Gemini Live AI ✨
                </Badge>
              ) : null}
            </h3>
            {generatedResult && (
              <Badge variant="primary" size="xs">
                Verified Schema ✓
              </Badge>
            )}
          </div>

          {/* Loading Skeleton */}
          {isLoading && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-40 w-full rounded-xl" />
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
              </div>
            </div>
          )}

          {/* Empty State before generation */}
          {!isLoading && !generatedResult && (
            <div className="p-10 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Ready for AI Processing
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                Fill in your topic or pick a sample above, then click Generate to preview your structured learning components here.
              </p>
            </div>
          )}

          {/* Generated Result Preview */}
          {!isLoading && generatedResult && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-5 animate-fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="blue" size="xs">
                    {generatedResult.subject}
                  </Badge>
                  <Badge variant="default" size="xs">
                    {generatedResult.difficulty}
                  </Badge>
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {generatedResult.title}
                </h4>
              </div>

              {/* Render Type-Specific Preview Component */}
              {generatedResult.type === 'flashcards' && generatedResult.cards && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Card {activePreviewCard + 1} of {generatedResult.cards.length}</span>
                    <button
                      type="button"
                      onClick={() => setIsFlippedPreview(!isFlippedPreview)}
                      className="text-brand-600 dark:text-brand-400 font-semibold hover:underline flex items-center gap-1"
                    >
                      <RotateCw className="w-3 h-3" /> Flip Card
                    </button>
                  </div>

                  <div
                    onClick={() => setIsFlippedPreview(!isFlippedPreview)}
                    className="min-h-[160px] p-6 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 flex flex-col justify-center text-center cursor-pointer shadow-sm hover:shadow transition-all"
                  >
                    {!isFlippedPreview ? (
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Question (Front)</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {generatedResult.cards[activePreviewCard]?.question}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 mb-2">Answer (Back)</p>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {generatedResult.cards[activePreviewCard]?.answer}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={activePreviewCard === 0}
                      onClick={() => {
                        setActivePreviewCard((p) => p - 1);
                        setIsFlippedPreview(false);
                      }}
                    >
                      Previous
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={activePreviewCard >= generatedResult.cards.length - 1}
                      onClick={() => {
                        setActivePreviewCard((p) => p + 1);
                        setIsFlippedPreview(false);
                      }}
                    >
                      Next Card
                    </Button>
                  </div>
                </div>
              )}

              {generatedResult.type === 'quiz' && generatedResult.questions && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500">
                    Sample Question 1 of {generatedResult.questions.length}:
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {generatedResult.questions[0]?.question}
                  </p>
                  <div className="space-y-1.5 pt-1">
                    {generatedResult.questions[0]?.options.map((opt, i) => (
                      <div
                        key={i}
                        className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between ${
                          opt === generatedResult.questions[0]?.correctAnswer
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/80 text-emerald-900 dark:text-emerald-200'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <span>{opt}</span>
                        {opt === generatedResult.questions[0]?.correctAnswer && (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            Correct Answer ✓
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1">
                    Explanation: {generatedResult.questions[0]?.explanation}
                  </p>
                </div>
              )}

              {generatedResult.type === 'study-guide' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3">
                    {generatedResult.summary}
                  </p>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Sections Included:
                    </span>
                    {generatedResult.sections?.map((s, idx) => (
                      <p key={idx} className="text-xs text-brand-600 dark:text-brand-400 font-medium">
                        • {s.title}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {generatedResult.type === 'summary' && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {generatedResult.summary}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <Button
                  size="md"
                  icon={Save}
                  onClick={handleSaveToLibrary}
                  className="flex-1 shadow-sm"
                >
                  Save to Library
                </Button>
                <Button
                  size="md"
                  variant="secondary"
                  icon={RotateCw}
                  onClick={handleGenerate}
                  title="Regenerate"
                >
                  Regenerate
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
