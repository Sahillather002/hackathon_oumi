'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Send, Copy, ThumbsUp, ThumbsDown, RefreshCw, BarChart3, MessageSquare } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

const models = [
  {
    id: 'gpt2-base',
    name: 'GPT-2 Base',
    description: 'Original GPT-2 model (124M parameters)',
    fineTuned: false
  },
  {
    id: 'gpt2-python',
    name: 'GPT-2 Python Fine-tuned',
    description: 'GPT-2 fine-tuned on Python code (124M parameters)',
    fineTuned: true
  },
  {
    id: 'llama-2-base',
    name: 'Llama-2-7B Base',
    description: 'Original Llama-2 model (7B parameters)',
    fineTuned: false
  },
  {
    id: 'llama-2-chat',
    name: 'Llama-2-7B Chat Fine-tuned',
    description: 'Llama-2 fine-tuned for chat (7B parameters)',
    fineTuned: true
  }
];

const examplePrompts = [
  "Write a Python function to calculate the factorial of a number.",
  "Explain what machine learning is in simple terms.",
  "Create a story about a robot learning to paint.",
  "What are the benefits of renewable energy?",
  "Write a SQL query to find all users who signed up in the last 30 days."
];

function ResponseCard({ 
  response, 
  model, 
  tokens, 
  time, 
  onRate, 
  onCopy 
}: {
  response: string;
  model: string;
  tokens: number;
  time: number;
  onRate: (rating: 'up' | 'down') => void;
  onCopy: () => void;
}) {
  return (
    <Card className="bg-slate-800/50 border-slate-700 h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg">{model}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {tokens} tokens
            </Badge>
            <Badge variant="outline" className="text-xs">
              {time}ms
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-slate-900/50 rounded-lg p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
          <p className="text-slate-200 whitespace-pre-wrap">{response}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => onRate('up')}>
            <ThumbsUp className="w-4 h-4 mr-1" />
            Good
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onRate('down')}>
            <ThumbsDown className="w-4 h-4 mr-1" />
            Bad
          </Button>
          <Button variant="ghost" size="sm" onClick={onCopy}>
            <Copy className="w-4 h-4 mr-1" />
            Copy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PlaygroundPage() {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt2-python');
  const [isGenerating, setIsGenerating] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [compareModel, setCompareModel] = useState('gpt2-base');
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState([200]);
  const [topP, setTopP] = useState([0.9]);
  
  const [responses, setResponses] = useState<{
    [key: string]: {
      text: string;
      tokens: number;
      time: number;
    };
  }>({});

  const handleGenerate = async (modelId: string) => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResponses = {
        'gpt2-base': `Here's a Python function to calculate factorial:

def factorial(n):
    """Calculate the factorial of a non-negative integer."""
    if n < 0:
        raise ValueError("Factorial is not defined for negative numbers")
    elif n == 0 or n == 1:
        return 1
    else:
        return n * factorial(n - 1)

# Example usage
print(factorial(5))  # Output: 120
print(factorial(0))  # Output: 1

This function uses recursion to calculate the factorial. The base case is when n is 0 or 1, where the factorial is 1. For any other positive integer, it multiplies n by the factorial of n-1.`,
        
        'gpt2-python': `Here's an optimized Python function to calculate factorial with error handling and type hints:

def factorial(n: int) -> int:
    """
    Calculate the factorial of a non-negative integer.
    
    Args:
        n (int): Non-negative integer to calculate factorial for
        
    Returns:
        int: Factorial of n
        
    Raises:
        ValueError: If n is negative
        TypeError: If n is not an integer
    """
    if not isinstance(n, int):
        raise TypeError("Factorial is only defined for integers")
    if n < 0:
        raise ValueError("Factorial is not defined for negative numbers")
    
    # Iterative approach for better performance
    result = 1
    for i in range(2, n + 1):
        result *= i
    
    return result

# Example usage with error handling
if __name__ == "__main__":
    test_values = [0, 1, 5, 10]
    
    for val in test_values:
        try:
            print(f"factorial({val}) = {factorial(val)}")
        except (ValueError, TypeError) as e:
            print(f"Error: {e}")`,
        
        'llama-2-base': `To calculate the factorial of a number in Python, you can use the following function:

def factorial(n):
    if n < 0:
        return "Factorial is not defined for negative numbers"
    elif n == 0:
        return 1
    else:
        return n * factorial(n - 1)

This function uses recursion. When you call factorial(5), it will return 120.`,
        
        'llama-2-chat': `I'll help you write a Python function to calculate factorial! Here's a comprehensive solution:

def factorial(n: int) -> int:
    """
    Calculate the factorial of a non-negative integer using recursion.
    
    Args:
        n: A non-negative integer
        
    Returns:
        The factorial of n
        
    Raises:
        ValueError: If n is negative
    """
    if n < 0:
        raise ValueError("Factorial is not defined for negative numbers")
    if n == 0:
        return 1
    return n * factorial(n - 1)

# Test the function
for i in range(6):
    print(f"{i}! = {factorial(i)}")

# Output:
# 0! = 1
# 1! = 1
# 2! = 2
# 3! = 6
# 4! = 24
# 5! = 120

The function includes proper type hints, documentation, and error handling for negative inputs.`
      };

      setResponses(prev => ({
        ...prev,
        [modelId]: {
          text: mockResponses[modelId as keyof typeof mockResponses] || "Response generated successfully.",
          tokens: Math.floor(Math.random() * 100) + 50,
          time: Math.floor(Math.random() * 2000) + 500
        }
      }));
      
      setIsGenerating(false);
    }, 1500);
  };

  const handleGenerateAll = () => {
    handleGenerate(selectedModel);
    if (comparisonMode) {
      setTimeout(() => handleGenerate(compareModel), 500);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleRate = (modelId: string, rating: 'up' | 'down') => {
    console.log(`Rated ${modelId} as ${rating}`);
  };

  const selectedModelData = models.find(m => m.id === selectedModel);
  const compareModelData = models.find(m => m.id === compareModel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 backdrop-blur-sm bg-slate-900/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/" className="flex items-center gap-2">
                <Logo size="md" showText={true} />
              </a>
              <nav className="hidden md:flex items-center gap-6">
                <a href="/dashboard" className="text-slate-300 hover:text-white transition-colors">Dashboard</a>
                <a href="/training" className="text-slate-300 hover:text-white transition-colors">Training</a>
                <a href="/playground" className="text-white font-medium">Playground</a>
                <a href="/datasets" className="text-slate-300 hover:text-white transition-colors">Datasets</a>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Model Playground</h1>
          <p className="text-slate-300">Test and compare your fine-tuned models with base models</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Input
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Prompt</label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your prompt here..."
                    className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 min-h-[120px]"
                  />
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={handleGenerateAll}
                    disabled={!prompt.trim() || isGenerating}
                    className="w-full"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isGenerating ? 'Generating...' : 'Generate'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setPrompt(examplePrompts[Math.floor(Math.random() * examplePrompts.length)])}
                    className="w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Random Example
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Model Selection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Primary Model</label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex items-center gap-2">
                            <span>{model.name}</span>
                            {model.fineTuned && (
                              <Badge className="bg-blue-500 text-xs">Fine-tuned</Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="comparison"
                    checked={comparisonMode}
                    onCheckedChange={setComparisonMode}
                  />
                  <label htmlFor="comparison" className="text-sm text-slate-300">
                    Enable A/B Comparison
                  </label>
                </div>

                {comparisonMode && (
                  <div>
                    <label className="text-sm text-slate-300 mb-2 block">Compare With</label>
                    <Select value={compareModel} onValueChange={setCompareModel}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {models.filter(m => m.id !== selectedModel).map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            <div className="flex items-center gap-2">
                              <span>{model.name}</span>
                              {model.fineTuned && (
                                <Badge className="bg-blue-500 text-xs">Fine-tuned</Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Generation Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">
                    Temperature: {temperature[0].toFixed(1)}
                  </label>
                  <Slider
                    value={temperature}
                    onValueChange={setTemperature}
                    min={0.1}
                    max={2.0}
                    step={0.1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-300 mb-2 block">
                    Max Tokens: {maxTokens[0]}
                  </label>
                  <Slider
                    value={maxTokens}
                    onValueChange={setMaxTokens}
                    min={50}
                    max={500}
                    step={10}
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-300 mb-2 block">
                    Top P: {topP[0].toFixed(1)}
                  </label>
                  <Slider
                    value={topP}
                    onValueChange={setTopP}
                    min={0.1}
                    max={1.0}
                    step={0.1}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Response Panel */}
          <div className="lg:col-span-2">
            <div className={`grid ${comparisonMode ? 'md:grid-cols-2' : 'grid-cols-1'} gap-6`}>
              {/* Primary Model Response */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ResponseCard
                  response={responses[selectedModel]?.text || "Your response will appear here..."}
                  model={selectedModelData?.name || 'Selected Model'}
                  tokens={responses[selectedModel]?.tokens || 0}
                  time={responses[selectedModel]?.time || 0}
                  onRate={(rating) => handleRate(selectedModel, rating)}
                  onCopy={() => handleCopy(responses[selectedModel]?.text || '')}
                />
              </motion.div>

              {/* Comparison Model Response */}
              {comparisonMode && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <ResponseCard
                    response={responses[compareModel]?.text || "Comparison response will appear here..."}
                    model={compareModelData?.name || 'Comparison Model'}
                    tokens={responses[compareModel]?.tokens || 0}
                    time={responses[compareModel]?.time || 0}
                    onRate={(rating) => handleRate(compareModel, rating)}
                    onCopy={() => handleCopy(responses[compareModel]?.text || '')}
                  />
                </motion.div>
              )}
            </div>

            {/* Model Info Cards */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">{selectedModelData?.name}</CardTitle>
                  <CardDescription>{selectedModelData?.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Badge className={selectedModelData?.fineTuned ? 'bg-blue-500' : 'bg-gray-500'}>
                      {selectedModelData?.fineTuned ? 'Fine-tuned' : 'Base Model'}
                    </Badge>
                    {selectedModelData?.fineTuned && (
                      <Badge variant="outline" className="text-green-400">
                        GRPO Trained
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {comparisonMode && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">{compareModelData?.name}</CardTitle>
                    <CardDescription>{compareModelData?.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Badge className={compareModelData?.fineTuned ? 'bg-blue-500' : 'bg-gray-500'}>
                        {compareModelData?.fineTuned ? 'Fine-tuned' : 'Base Model'}
                      </Badge>
                      {compareModelData?.fineTuned && (
                        <Badge variant="outline" className="text-green-400">
                          GRPO Trained
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}