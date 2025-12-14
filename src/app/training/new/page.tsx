'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Brain, ArrowLeft, ArrowRight, Check, Upload, Database, Settings, Play } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

const models = [
  {
    id: 'gpt2',
    name: 'GPT-2',
    size: '124M',
    description: 'Small, fast, good for testing and prototyping',
    parameters: '124 million',
    memory: '2GB',
    trainingTime: '~30 min',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'llama-2-7b',
    name: 'Llama-2-7B',
    size: '7B',
    description: 'Good balance of performance and efficiency',
    parameters: '7 billion',
    memory: '14GB',
    trainingTime: '~2 hours',
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'mistral-7b',
    name: 'Mistral-7B',
    size: '7B',
    description: 'Excellent performance for instruction following',
    parameters: '7 billion',
    memory: '14GB',
    trainingTime: '~2 hours',
    color: 'from-green-500 to-teal-600'
  },
  {
    id: 'falcon-7b',
    name: 'Falcon-7B',
    size: '7B',
    description: 'Strong reasoning capabilities',
    parameters: '7 billion',
    memory: '14GB',
    trainingTime: '~2.5 hours',
    color: 'from-orange-500 to-red-600'
  }
];

const datasets = [
  {
    id: 'python-tutorials',
    name: 'Python Tutorials Dataset',
    size: '10K examples',
    description: 'Programming tutorials and code explanations',
    format: 'JSONL',
    uploaded: '2 days ago'
  },
  {
    id: 'alpaca-format',
    name: 'Alpaca Format Dataset',
    size: '52K examples',
    description: 'Instruction following dataset in Alpaca format',
    format: 'JSONL',
    uploaded: '1 week ago'
  },
  {
    id: 'customer-support',
    name: 'Customer Support Chat',
    size: '25K examples',
    description: 'Customer service conversations and responses',
    format: 'JSON',
    uploaded: '3 days ago'
  }
];

function ModelCard({ model, isSelected, onClick }: { 
  model: typeof models[0]; 
  isSelected: boolean; 
  onClick: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className={`cursor-pointer transition-all ${
          isSelected 
            ? 'border-blue-500 bg-blue-500/10' 
            : 'border-slate-700 hover:border-slate-600'
        }`}
        onClick={onClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${model.color} flex items-center justify-center`}>
              <Brain className="w-6 h-6 text-white" />
            </div>
            {isSelected && (
              <Check className="w-5 h-5 text-blue-500" />
            )}
          </div>
          <CardTitle className="text-white">{model.name}</CardTitle>
          <CardDescription>{model.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Parameters:</span>
            <span className="text-white">{model.parameters}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Memory:</span>
            <span className="text-white">{model.memory}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Est. Time:</span>
            <span className="text-white">{model.trainingTime}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function DatasetCard({ dataset, isSelected, onClick }: { 
  dataset: typeof datasets[0]; 
  isSelected: boolean; 
  onClick: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className={`cursor-pointer transition-all ${
          isSelected 
            ? 'border-blue-500 bg-blue-500/10' 
            : 'border-slate-700 hover:border-slate-600'
        }`}
        onClick={onClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            {isSelected && (
              <Check className="w-5 h-5 text-blue-500" />
            )}
          </div>
          <CardTitle className="text-white">{dataset.name}</CardTitle>
          <CardDescription>{dataset.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Size:</span>
            <span className="text-white">{dataset.size}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Format:</span>
            <span className="text-white">{dataset.format}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Uploaded:</span>
            <span className="text-white">{dataset.uploaded}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function NewTrainingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedDataset, setSelectedDataset] = useState('');
  const [jobName, setJobName] = useState('');
  const [description, setDescription] = useState('');
  
  // Training parameters
  const [learningRate, setLearningRate] = useState([1e-5]);
  const [batchSize, setBatchSize] = useState(4);
  const [numEpochs, setNumEpochs] = useState(3);
  const [useGRPO, setUseGRPO] = useState(true);
  const [klCoef, setKlCoef] = useState([0.1]);
  const [clipRange, setClipRange] = useState([0.2]);
  const [gradientAccumulationSteps, setGradientAccumulationSteps] = useState(1);

  const steps = [
    { id: 1, title: 'Select Model', icon: Brain },
    { id: 2, title: 'Choose Dataset', icon: Database },
    { id: 3, title: 'Configure Training', icon: Settings },
    { id: 4, title: 'Review & Start', icon: Play }
  ];

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedModel !== '';
      case 2:
        return selectedDataset !== '';
      case 3:
        return true;
      case 4:
        return jobName !== '';
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartTraining = () => {
    // In a real app, this would call the API to start training
    console.log('Starting training:', {
      jobName,
      model: selectedModel,
      dataset: selectedDataset,
      learningRate: learningRate[0],
      batchSize,
      numEpochs,
      useGRPO,
      klCoef: klCoef[0],
      clipRange: clipRange[0],
      gradientAccumulationSteps
    });
    
    // Redirect to training details page
    router.push('/training/1');
  };

  const selectedModelData = models.find(m => m.id === selectedModel);
  const selectedDatasetData = datasets.find(d => d.id === selectedDataset);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 backdrop-blur-sm bg-slate-900/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/training">
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Training
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Logo size="md" showText={false} />
                <span className="text-xl font-bold text-white">New Training Job</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              
              return (
                <div key={step.id} className="flex items-center">
                  <motion.div
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                      isActive 
                        ? 'border-blue-500 bg-blue-500/20' 
                        : isCompleted 
                        ? 'border-green-500 bg-green-500/20' 
                        : 'border-slate-600 bg-slate-800/50'
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Icon className={`w-5 h-5 ${
                      isActive ? 'text-blue-500' : isCompleted ? 'text-green-500' : 'text-slate-400'
                    }`} />
                  </motion.div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-2 ${
                      isCompleted ? 'bg-green-500' : 'bg-slate-600'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          {/* Step 1: Select Model */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Select Base Model</h2>
                <p className="text-slate-300">Choose the model you want to fine-tune with GRPO</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {models.map((model) => (
                  <ModelCard
                    key={model.id}
                    model={model}
                    isSelected={selectedModel === model.id}
                    onClick={() => setSelectedModel(model.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Choose Dataset */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Choose Training Dataset</h2>
                <p className="text-slate-300">Select the dataset to use for training</p>
              </div>
              
              <Tabs defaultValue="existing" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="existing">Use Existing Dataset</TabsTrigger>
                  <TabsTrigger value="upload">Upload New Dataset</TabsTrigger>
                </TabsList>
                
                <TabsContent value="existing" className="space-y-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {datasets.map((dataset) => (
                      <DatasetCard
                        key={dataset.id}
                        dataset={dataset}
                        isSelected={selectedDataset === dataset.id}
                        onClick={() => setSelectedDataset(dataset.id)}
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="upload" className="space-y-6">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Upload Dataset</CardTitle>
                      <CardDescription>Upload your training data in JSON or JSONL format</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-300 mb-2">Drag and drop your dataset here</p>
                        <p className="text-slate-500 text-sm mb-4">or</p>
                        <Button variant="outline">Browse Files</Button>
                        <p className="text-slate-500 text-xs mt-4">Supported formats: JSON, JSONL (max 100MB)</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Step 3: Configure Training */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Configure Training Parameters</h2>
                <p className="text-slate-300">Fine-tune the GRPO training settings</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Basic Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="jobName">Job Name</Label>
                      <Input
                        id="jobName"
                        value={jobName}
                        onChange={(e) => setJobName(e.target.value)}
                        placeholder="e.g., GPT-2 Fine-tuning"
                        className="bg-slate-700/50 border-slate-600"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your training job..."
                        className="bg-slate-700/50 border-slate-600"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="batchSize">Batch Size: {batchSize}</Label>
                      <Select value={batchSize.toString()} onValueChange={(v) => setBatchSize(parseInt(v))}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="8">8</SelectItem>
                          <SelectItem value="16">16</SelectItem>
                          <SelectItem value="32">32</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="epochs">Number of Epochs: {numEpochs}</Label>
                      <Select value={numEpochs.toString()} onValueChange={(v) => setNumEpochs(parseInt(v))}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">GRPO Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="grpo">Use GRPO Algorithm</Label>
                      <Switch
                        id="grpo"
                        checked={useGRPO}
                        onCheckedChange={setUseGRPO}
                      />
                    </div>

                    {useGRPO && (
                      <>
                        <div>
                          <Label>Learning Rate: {learningRate[0].toExponential()}</Label>
                          <Slider
                            value={learningRate}
                            onValueChange={setLearningRate}
                            min={1e-7}
                            max={1e-4}
                            step={1e-7}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label>KL Coefficient: {klCoef[0].toFixed(2)}</Label>
                          <Slider
                            value={klCoef}
                            onValueChange={setKlCoef}
                            min={0.01}
                            max={0.5}
                            step={0.01}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label>Clip Range: {clipRange[0].toFixed(2)}</Label>
                          <Slider
                            value={clipRange}
                            onValueChange={setClipRange}
                            min={0.1}
                            max={0.5}
                            step={0.01}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label htmlFor="gradAccum">Gradient Accumulation Steps</Label>
                          <Select value={gradientAccumulationSteps.toString()} onValueChange={(v) => setGradientAccumulationSteps(parseInt(v))}>
                            <SelectTrigger className="bg-slate-700/50 border-slate-600">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="8">8</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Step 4: Review & Start */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Review & Start Training</h2>
                <p className="text-slate-300">Review your configuration and start the training job</p>
              </div>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Training Configuration Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Job Details</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Name:</span>
                          <span className="text-white">{jobName || 'Untitled Job'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Description:</span>
                          <span className="text-white">{description || 'No description'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Model & Dataset</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Model:</span>
                          <span className="text-white">{selectedModelData?.name || 'Not selected'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Dataset:</span>
                          <span className="text-white">{selectedDatasetData?.name || 'Not selected'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Training Parameters</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Learning Rate:</span>
                          <span className="text-white font-mono">{learningRate[0].toExponential()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Batch Size:</span>
                          <span className="text-white">{batchSize}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Epochs:</span>
                          <span className="text-white">{numEpochs}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Algorithm:</span>
                          <Badge className={useGRPO ? 'bg-blue-500' : 'bg-gray-500'}>
                            {useGRPO ? 'GRPO' : 'Standard Fine-tuning'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {useGRPO && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">GRPO Settings</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-400">KL Coefficient:</span>
                            <span className="text-white font-mono">{klCoef[0].toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Clip Range:</span>
                            <span className="text-white font-mono">{clipRange[0].toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Grad Accumulation:</span>
                            <span className="text-white">{gradientAccumulationSteps}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-400">
                        Estimated training time: ~{selectedModelData?.trainingTime || 'Unknown'}
                      </div>
                      <div className="text-sm text-slate-400">
                        Estimated cost: ~$2.50
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <Button 
                  onClick={handleStartTraining}
                  size="lg"
                  className="text-lg px-8 py-3"
                  disabled={!canProceed()}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Training
                </Button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            {currentStep < steps.length && (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}