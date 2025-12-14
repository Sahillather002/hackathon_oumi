'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Wand2, Download, Save, Plus, Trash2, RefreshCw, Settings } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const exampleTopics = [
  "Python programming tutorials",
  "Machine learning concepts",
  "Customer support responses",
  "Creative writing prompts",
  "Mathematical problem solving",
  "Historical facts and explanations",
  "Science experiments and procedures",
  "Language learning exercises"
];

function DataPreview({ data, onSave, onDownload }: {
  data: Array<{ prompt: string; response: string }>;
  onSave: () => void;
  onDownload: () => void;
}) {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Preview (First 5 Examples)</CardTitle>
        <CardDescription>Review generated data before saving</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {data.slice(0, 5).map((item, index) => (
            <div key={index} className="bg-slate-900/50 rounded-lg p-4">
              <div className="mb-3">
                <p className="text-sm text-slate-400 mb-1">Prompt:</p>
                <p className="text-slate-200">{item.prompt}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Response:</p>
                <p className="text-slate-200">{item.response}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2 pt-4 border-t border-slate-700">
          <Button onClick={onSave} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            Save as Dataset
          </Button>
          <Button variant="outline" onClick={onDownload} className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download JSON
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SynthesizePage() {
  const [topic, setTopic] = useState('');
  const [numExamples, setNumExamples] = useState(100);
  const [difficulty, setDifficulty] = useState('medium');
  const [format, setFormat] = useState('alpaca');
  const [temperature, setTemperature] = useState(0.7);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedData, setGeneratedData] = useState<Array<{ prompt: string; response: string }>>([]);

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setGenerationProgress(0);
    setGeneratedData([]);

    // Simulate generation progress
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.random() * 20;
      });
    }, 200);

    // Simulate API call to generate data
    setTimeout(() => {
      clearInterval(progressInterval);
      setGenerationProgress(100);

      // Mock generated data
      const mockData = Array.from({ length: numExamples }, (_, i) => {
        const prompts = [
          `What are the key concepts in ${topic}?`,
          `Explain ${topic} for beginners`,
          `How does ${topic} work in practice?`,
          `What are common challenges in ${topic}?`,
          `Provide examples of ${topic} applications`
        ];

        const responses = [
          `${topic} is a fascinating field that encompasses various important concepts and principles. Understanding these fundamentals is crucial for anyone looking to master this subject area.`,
          `When learning about ${topic}, it's important to start with the basics and gradually build up your knowledge. This approach ensures a solid foundation for more advanced topics.`,
          `In practical applications, ${topic} demonstrates its value through real-world implementations and case studies. These examples help bridge theory with practice.`,
          `Like any complex subject, ${topic} comes with its own set of challenges. Being aware of these helps in developing effective strategies to overcome them.`,
          `The applications of ${topic} span across multiple industries and domains. From academic research to commercial use cases, its versatility makes it highly valuable.`
        ];

        return {
          prompt: prompts[i % prompts.length],
          response: responses[i % responses.length]
        };
      });

      setGeneratedData(mockData);
      setIsGenerating(false);
    }, 3000);
  };

  const handleSaveDataset = () => {
    // In a real app, this would call API to save as dataset
    console.log('Saving dataset with', generatedData.length, 'examples');
    alert('Dataset saved successfully!');
  };

  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(generatedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `synthesized-data-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRandomTopic = () => {
    const randomTopic = exampleTopics[Math.floor(Math.random() * exampleTopics.length)];
    setTopic(randomTopic);
  };

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
              <a href="/synthesize" className="text-white font-medium">Data Synthesis</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Data Synthesis</h1>
          <p className="text-slate-300">Generate synthetic training data using AI</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Wand2 className="w-5 h-5" />
                  Data Generation
                </CardTitle>
                <CardDescription>Configure synthetic data generation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Python programming tutorials"
                    className="bg-slate-700/50 border-slate-600"
                  />
                </div>

                <div>
                  <Label htmlFor="examples">Number of Examples</Label>
                  <Select value={numExamples.toString()} onValueChange={(v) => setNumExamples(parseInt(v))}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 examples</SelectItem>
                      <SelectItem value="50">50 examples</SelectItem>
                      <SelectItem value="100">100 examples</SelectItem>
                      <SelectItem value="500">500 examples</SelectItem>
                      <SelectItem value="1000">1,000 examples</SelectItem>
                      <SelectItem value="5000">5,000 examples</SelectItem>
                      <SelectItem value="10000">10,000 examples</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Difficulty Level</Label>
                  <RadioGroup value={difficulty} onValueChange={setDifficulty}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="easy" id="easy" />
                      <Label htmlFor="easy">Easy</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium">Medium</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hard" id="hard" />
                      <Label htmlFor="hard">Hard</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="format">Output Format</Label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alpaca">Alpaca Format</SelectItem>
                      <SelectItem value="chat">Chat Format</SelectItem>
                      <SelectItem value="qa">Q&A Format</SelectItem>
                      <SelectItem value="instruction">Instruction Format</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Temperature: {temperature.toFixed(1)}</Label>
                  <input
                    type="range"
                    min="0.1"
                    max="2.0"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Precise</span>
                    <span>Creative</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={handleGenerate}
                    disabled={!topic.trim() || isGenerating}
                    className="w-full"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    {isGenerating ? 'Generating...' : 'Generate Data'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleRandomTopic}
                    disabled={isGenerating}
                    className="w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Random Topic
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Generation Progress */}
            {isGenerating && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Generating Data...</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Progress</span>
                    <span className="text-white">{generationProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={generationProgress} className="h-2" />
                  <p className="text-slate-400 text-sm">
                    {generationProgress < 100 
                      ? 'Creating high-quality training examples...' 
                      : 'Generation complete!'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {generatedData.length > 0 && !isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <DataPreview
                  data={generatedData}
                  onSave={handleSaveDataset}
                  onDownload={handleDownloadJSON}
                />
              </motion.div>
            )}

            {generatedData.length === 0 && !isGenerating && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-12 text-center">
                  <Wand2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Ready to Generate Data</h3>
                  <p className="text-slate-400 mb-6">
                    Configure your data generation settings and click "Generate Data" to create synthetic training examples
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-left">
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-2">High Quality</h4>
                      <p className="text-slate-400 text-sm">
                        AI-generated examples that are diverse, accurate, and well-formatted for training
                      </p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-2">Fast Generation</h4>
                      <p className="text-slate-400 text-sm">
                        Generate thousands of examples in minutes, not hours
                      </p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-2">Customizable</h4>
                      <p className="text-slate-400 text-sm">
                        Control difficulty, format, and creativity level of generated content
                      </p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-2">Multiple Formats</h4>
                      <p className="text-slate-400 text-sm">
                        Support for Alpaca, chat, Q&A, and instruction formats
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Example Topics */}
        <Card className="bg-slate-800/50 border-slate-700 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Example Topics</CardTitle>
            <CardDescription>Click any topic to get started quickly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {exampleTopics.map((exampleTopic) => (
                <Badge 
                  key={exampleTopic}
                  variant="outline" 
                  className="cursor-pointer hover:bg-blue-500/20 hover:border-blue-500 transition-colors"
                  onClick={() => setTopic(exampleTopic)}
                >
                  {exampleTopic}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}