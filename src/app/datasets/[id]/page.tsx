'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { 
  Brain, 
  ArrowLeft, 
  Download, 
  Trash2, 
  FileText, 
  Database,
  Calendar,
  HardDrive,
  Eye,
  Filter,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/logo';
import Link from 'next/link';

// Mock dataset data
const mockDatasetData: Record<string, any> = {
  'python-tutorials': {
    id: 'python-tutorials',
    name: 'Python Tutorials Dataset',
    description: 'Comprehensive collection of Python programming tutorials and code examples',
    format: 'JSONL',
    size: '10.2 MB',
    numExamples: 10200,
    created: '2 days ago',
    examples: [
      { prompt: 'How do I create a list comprehension in Python?', response: 'You can create a list comprehension using the syntax: [expression for item in iterable if condition]' },
      { prompt: 'What is a Python decorator?', response: 'A decorator is a function that modifies the behavior of another function' },
      { prompt: 'Explain Python generators', response: 'Generators are functions that return an iterator using yield instead of return' },
      { prompt: 'How do I handle exceptions?', response: 'Use try-except blocks to catch and handle exceptions in Python' },
      { prompt: 'What is the difference between list and tuple?', response: 'Lists are mutable while tuples are immutable sequences in Python' },
    ]
  },
  'alpaca-format': {
    id: 'alpaca-format',
    name: 'Alpaca Format Dataset',
    description: 'Instruction following dataset in Alpaca format for fine-tuning chat models',
    format: 'JSONL',
    size: '52.4 MB',
    numExamples: 52400,
    created: '1 week ago',
    examples: [
      { prompt: 'Explain the concept of machine learning', response: 'Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.' },
      { prompt: 'What is the difference between supervised and unsupervised learning?', response: 'Supervised learning uses labeled data to train models, while unsupervised learning finds patterns in unlabeled data.' },
      { prompt: 'Describe neural networks', response: 'Neural networks are computing systems inspired by biological neural networks that process information using interconnected nodes.' },
    ]
  },
  'customer-support': {
    id: 'customer-support',
    name: 'Customer Support Chat',
    description: 'Customer service conversations and responses for training support bots',
    format: 'JSON',
    size: '25.8 MB',
    numExamples: 25800,
    created: '3 days ago',
    examples: [
      { prompt: 'How can I reset my password?', response: 'You can reset your password by clicking the "Forgot Password" link on the login page and following the instructions sent to your email.' },
      { prompt: 'What is your return policy?', response: 'We offer a 30-day return policy for all unused items in their original packaging.' },
      { prompt: 'How do I track my order?', response: 'You can track your order using the tracking number sent to your email or by logging into your account.' },
      { prompt: 'Can I change my shipping address?', response: 'Yes, you can change your shipping address before the order is shipped by contacting our support team.' },
    ]
  },
  'medical-qa': {
    id: 'medical-qa',
    name: 'Medical Q&A Dataset',
    description: 'Medical questions and answers for healthcare assistant training',
    format: 'JSONL',
    size: '15.3 MB',
    numExamples: 15300,
    created: '5 days ago',
    examples: [
      { prompt: 'What are the symptoms of diabetes?', response: 'Common symptoms include increased thirst, frequent urination, extreme hunger, unexplained weight loss, and fatigue.' },
      { prompt: 'How is blood pressure measured?', response: 'Blood pressure is measured using a sphygmomanometer, which records systolic and diastolic pressure in mmHg.' },
      { prompt: 'What causes headaches?', response: 'Headaches can be caused by stress, dehydration, lack of sleep, eye strain, or underlying medical conditions.' },
    ]
  },
  'code-review': {
    id: 'code-review',
    name: 'Code Review Dataset',
    description: 'Code examples and review comments for improving code quality',
    format: 'JSONL',
    size: '8.7 MB',
    numExamples: 8700,
    created: '1 week ago',
    examples: [
      { prompt: 'Review this Python function for potential issues', response: 'The function looks good overall, but I recommend adding input validation and error handling for edge cases.' },
      { prompt: 'How can I improve this code\'s performance?', response: 'Consider using list comprehensions instead of loops, caching results, and avoiding unnecessary function calls.' },
      { prompt: 'Is this code following best practices?', response: 'The code is functional but could benefit from better variable names, docstrings, and type hints.' },
    ]
  },
};

export default function DatasetDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const datasetId = params.id as string;
  const dataset = mockDatasetData[datasetId];

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (!dataset) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-slate-700 p-8 text-center">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Dataset Not Found</CardTitle>
            <CardDescription>The dataset "{datasetId}" does not exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/datasets">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Datasets
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredExamples = dataset.examples.filter((ex: any) =>
    ex.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ex.response.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-blue-400" />
              <Logo size="md" showText={true} />
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-white">Dashboard</Button>
              </Link>
              <Link href="/training">
                <Button variant="ghost" className="text-white">Training</Button>
              </Link>
              <Link href="/models">
                <Button variant="ghost" className="text-white">Models</Button>
              </Link>
              <Link href="/datasets">
                <Button variant="ghost" className="text-white">Datasets</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/datasets">
          <Button variant="ghost" className="text-white mb-6 hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Datasets
          </Button>
        </Link>

        {/* Dataset Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{dataset.name}</h1>
              <p className="text-gray-400 text-lg">{dataset.description}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-400" />
                  <div>
                    <div className="text-sm text-gray-400">Format</div>
                    <div className="text-xl font-bold text-white">{dataset.format}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <HardDrive className="w-8 h-8 text-green-400" />
                  <div>
                    <div className="text-sm text-gray-400">Size</div>
                    <div className="text-xl font-bold text-white">{dataset.size}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Database className="w-8 h-8 text-purple-400" />
                  <div>
                    <div className="text-sm text-gray-400">Examples</div>
                    <div className="text-xl font-bold text-white">{dataset.numExamples.toLocaleString()}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-orange-400" />
                  <div>
                    <div className="text-sm text-gray-400">Created</div>
                    <div className="text-xl font-bold text-white">{dataset.created}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Examples Preview */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Dataset Examples</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search examples..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-900/50 border-slate-600 text-white w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredExamples.slice(0, 10).map((example: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 bg-slate-900/50 rounded-lg border border-slate-700"
                >
                  <div className="mb-3">
                    <div className="text-xs text-gray-400 uppercase font-semibold mb-1">Prompt:</div>
                    <div className="text-white">{example.prompt}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 uppercase font-semibold mb-1">Response:</div>
                    <div className="text-gray-300">{example.response}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredExamples.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">No examples found matching your search.</p>
              </div>
            )}

            {filteredExamples.length > 10 && (
              <div className="mt-6 text-center">
                <Button variant="outline" className="border-slate-600 text-white">
                  Load More Examples
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <Link href={`/training/new?dataset=${dataset.id}`}>
            <Button className="bg-blue-500 hover:bg-blue-600">
              Use for Training
            </Button>
          </Link>
          <Button variant="outline" className="border-slate-600 text-white">
            <Eye className="w-4 h-4 mr-2" />
            View Full Dataset
          </Button>
        </div>
      </div>
    </div>
  );
}
