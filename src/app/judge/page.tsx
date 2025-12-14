'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Play, CheckCircle, AlertCircle, BarChart3, Star, Target, Shield, Zap } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const models = [
  { id: 'gpt2-base', name: 'GPT-2 Base', description: 'Original GPT-2 model' },
  { id: 'gpt2-python', name: 'GPT-2 Python Fine-tuned', description: 'Fine-tuned on Python code' },
  { id: 'llama-2-base', name: 'Llama-2-7B Base', description: 'Original Llama-2 model' },
  { id: 'llama-2-chat', name: 'Llama-2-7B Chat', description: 'Fine-tuned for chat' }
];

const judgeModels = [
  { id: 'gpt-4', name: 'GPT-4', description: 'Most capable judge model' },
  { id: 'claude-3', name: 'Claude 3', description: 'Balanced evaluation' },
  { id: 'llama-3', name: 'Llama 3', description: 'Open source judge' }
];

const criteria = [
  { id: 'helpfulness', label: 'Helpfulness', description: 'How helpful is the response?' },
  { id: 'accuracy', label: 'Accuracy', description: 'Is the information correct?' },
  { id: 'safety', label: 'Safety', description: 'Is the response safe and appropriate?' },
  { id: 'clarity', label: 'Clarity', description: 'Is the response clear and well-structured?' },
  { id: 'completeness', label: 'Completeness', description: 'Does it fully answer the question?' }
];

const examplePrompts = [
  "Explain quantum computing in simple terms",
  "Write a Python function to sort a list",
  "What are the benefits of renewable energy?",
  "How does photosynthesis work?",
  "Create a story about a time traveler"
];

function ScoreBar({ label, score, max = 10, color = 'from-blue-500 to-green-500' }: {
  label: string;
  score: number;
  max?: number;
  color?: string;
}) {
  const percentage = (score / max) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="text-white font-bold">{score.toFixed(1)}/{max}</span>
      </div>
      <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${color}`}
        />
      </div>
    </div>
  );
}

function ExampleCard({ example, index }: { example: any; index: number }) {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg">Example {index + 1}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-slate-400 mb-2">Prompt:</p>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-slate-200 text-sm">{example.prompt}</p>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-slate-400 mb-2">Response:</p>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-slate-200 text-sm">{example.response}</p>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-slate-400 mb-2">Scores:</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(example.scores).map(([criterion, score]) => (
              <div key={criterion} className="flex justify-between text-sm">
                <span className="text-slate-300 capitalize">{criterion}:</span>
                <span className="text-white font-mono">{(score as number).toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <p className="text-sm text-slate-400 mb-2">Judge Feedback:</p>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-slate-200 text-sm italic">"{example.feedback}"</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function JudgePage() {
  const [selectedModel, setSelectedModel] = useState('');
  const [judgeModel, setJudgeModel] = useState('gpt-4');
  const [testPrompts, setTestPrompts] = useState(examplePrompts.join('\n'));
  const [selectedCriteria, setSelectedCriteria] = useState([
    'helpfulness', 'accuracy', 'safety'
  ]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationProgress, setEvaluationProgress] = useState(0);
  const [results, setResults] = useState<any>(null);

  const handleCriterionChange = (criterionId: string, checked: boolean) => {
    if (checked) {
      setSelectedCriteria(prev => [...prev, criterionId]);
    } else {
      setSelectedCriteria(prev => prev.filter(c => c !== criterionId));
    }
  };

  const handleRunEvaluation = async () => {
    if (!selectedModel || selectedCriteria.length === 0) return;

    setIsEvaluating(true);
    setEvaluationProgress(0);

    // Simulate evaluation progress
    const progressInterval = setInterval(() => {
      setEvaluationProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    // Simulate API call
    setTimeout(() => {
      clearInterval(progressInterval);
      setEvaluationProgress(100);

      // Mock results
      const mockResults = {
        modelId: selectedModel,
        judgeModel: judgeModel,
        overallScore: 8.2,
        criteriaScores: {
          helpfulness: 8.5,
          accuracy: 9.0,
          safety: 9.5,
          clarity: 7.8,
          completeness: 7.2
        },
        numExamples: 5,
        examples: [
          {
            prompt: "Explain quantum computing in simple terms",
            response: "Quantum computing is like having a super-powerful calculator that can explore many possibilities at once. While regular computers use bits (0s and 1s), quantum computers use qubits that can be both 0 and 1 simultaneously, allowing them to solve complex problems much faster.",
            scores: {
              helpfulness: 9.0,
              accuracy: 8.5,
              safety: 10.0,
              clarity: 8.0,
              completeness: 7.5
            },
            feedback: "Great analogy with the calculator, but could benefit from more concrete examples of quantum computing applications."
          },
          {
            prompt: "Write a Python function to sort a list",
            response: "def sort_list(lst):\n    return sorted(lst)\n\n# Usage\nnumbers = [3, 1, 4, 1, 5]\nsorted_numbers = sort_list(numbers)\nprint(sorted_numbers)  # [1, 1, 3, 4, 5]",
            scores: {
              helpfulness: 8.0,
              accuracy: 10.0,
              safety: 10.0,
              clarity: 9.0,
              completeness: 8.0
            },
            feedback: "Correct and concise solution. Could mention different sorting algorithms for educational value."
          },
          {
            prompt: "What are the benefits of renewable energy?",
            response: "Renewable energy offers numerous benefits: it's environmentally friendly with zero carbon emissions, reduces dependence on fossil fuels, creates jobs in green technology, provides energy independence, and has lower long-term costs as technology improves.",
            scores: {
              helpfulness: 8.5,
              accuracy: 9.0,
              safety: 10.0,
              clarity: 8.5,
              completeness: 7.0
            },
            feedback: "Good overview of benefits. Could include specific examples and statistics to strengthen the response."
          }
        ]
      };

      setResults(mockResults);
      setIsEvaluating(false);
    }, 5000);
  };

  const selectedModelData = models.find(m => m.id === selectedModel);
  const judgeModelData = judgeModels.find(m => m.id === judgeModel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 backdrop-blur-sm bg-slate-900/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2">
              <Logo size="md" showText={true} />
            </a>
            <nav className="hidden md:flex items-center gap-6">
              <a href="/dashboard" className="text-slate-300 hover:text-white transition-colors">Dashboard</a>
              <a href="/training" className="text-slate-300 hover:text-white transition-colors">Training</a>
              <a href="/models" className="text-slate-300 hover:text-white transition-colors">Models</a>
              <a href="/judge" className="text-white font-medium">LLM-as-a-Judge</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">LLM-as-a-Judge</h1>
          <p className="text-slate-300">Automated model evaluation using advanced LLM judges</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Evaluation Configuration</CardTitle>
                <CardDescription>Set up your model evaluation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Model to Evaluate</label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div>
                            <div className="font-medium">{model.name}</div>
                            <div className="text-xs text-slate-400">{model.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Judge Model</label>
                  <Select value={judgeModel} onValueChange={setJudgeModel}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {judgeModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div>
                            <div className="font-medium">{model.name}</div>
                            <div className="text-xs text-slate-400">{model.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Test Prompts</label>
                  <Textarea
                    value={testPrompts}
                    onChange={(e) => setTestPrompts(e.target.value)}
                    placeholder="Enter test prompts (one per line)"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                    rows={6}
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-300 mb-3 block">Evaluation Criteria</label>
                  <div className="space-y-2">
                    {criteria.map((criterion) => (
                      <div key={criterion.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={criterion.id}
                          checked={selectedCriteria.includes(criterion.id)}
                          onCheckedChange={(checked) => handleCriterionChange(criterion.id, checked as boolean)}
                        />
                        <div className="flex-1">
                          <label htmlFor={criterion.id} className="text-sm text-white cursor-pointer">
                            {criterion.label}
                          </label>
                          <p className="text-xs text-slate-400">{criterion.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={handleRunEvaluation}
                  disabled={!selectedModel || selectedCriteria.length === 0 || isEvaluating}
                  className="w-full"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isEvaluating ? 'Evaluating...' : 'Run Evaluation'}
                </Button>
              </CardContent>
            </Card>

            {/* Model Info */}
            {selectedModelData && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Model Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Name:</span>
                      <span className="text-white">{selectedModelData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Description:</span>
                      <span className="text-white text-sm">{selectedModelData.description}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Judge:</span>
                      <span className="text-white">{judgeModelData?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Criteria:</span>
                      <span className="text-white">{selectedCriteria.length} selected</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {isEvaluating && (
              <Card className="bg-slate-800/50 border-slate-700 mb-8">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Evaluating Model...</h3>
                    <span className="text-slate-300">{evaluationProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={evaluationProgress} className="h-2" />
                  <p className="text-slate-400 text-sm mt-2">
                    Running evaluation with {judgeModelData?.name}...
                  </p>
                </CardContent>
              </Card>
            )}

            {results && !isEvaluating && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Overall Score */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white text-center">Evaluation Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-6xl font-bold text-white mb-2">
                        {results.overallScore.toFixed(1)}/10
                      </div>
                      <p className="text-slate-300">Overall Score</p>
                    </div>
                    
                    <div className="space-y-4">
                      {Object.entries(results.criteriaScores).map(([criterion, score]) => {
                        if (selectedCriteria.includes(criterion)) {
                          return (
                            <ScoreBar
                              key={criterion}
                              label={criterion.charAt(0).toUpperCase() + criterion.slice(1)}
                              score={score as number}
                            />
                          );
                        }
                        return null;
                      })}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-700">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">{results.numExamples}</p>
                        <p className="text-slate-400 text-sm">Examples Evaluated</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">{judgeModelData?.name}</p>
                        <p className="text-slate-400 text-sm">Judge Model</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Example Responses */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white">Example Evaluations</h3>
                  {results.examples.map((example: any, index: number) => (
                    <ExampleCard key={index} example={example} index={index} />
                  ))}
                </div>
              </motion.div>
            )}

            {!results && !isEvaluating && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-12 text-center">
                  <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Ready to Evaluate</h3>
                  <p className="text-slate-400 mb-6">
                    Configure your evaluation settings and click "Run Evaluation" to start
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 text-left">
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <Star className="w-8 h-8 text-yellow-500 mb-2" />
                      <h4 className="text-white font-semibold mb-1">Automated Scoring</h4>
                      <p className="text-slate-400 text-sm">Get objective scores across multiple criteria</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <Shield className="w-8 h-8 text-blue-500 mb-2" />
                      <h4 className="text-white font-semibold mb-1">Safety Checks</h4>
                      <p className="text-slate-400 text-sm">Ensure responses are safe and appropriate</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <Zap className="w-8 h-8 text-green-500 mb-2" />
                      <h4 className="text-white font-semibold mb-1">Fast Evaluation</h4>
                      <p className="text-slate-400 text-sm">Get results in minutes, not hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}