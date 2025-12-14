'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Brain, ArrowLeft, Upload, FileText, Check, AlertCircle, X, Plus } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  preview?: string;
}

interface DatasetFormat {
  name: string;
  description: string;
  example: string;
  required: string[];
}

const formats: DatasetFormat[] = [
  {
    name: 'JSONL',
    description: 'JSON Lines format - one JSON object per line',
    example: '{"prompt": "What is Python?", "response": "Python is a programming language"}',
    required: ['prompt', 'response']
  },
  {
    name: 'JSON',
    description: 'JSON array format with prompt-response pairs',
    example: '[{"prompt": "What is Python?", "response": "Python is a programming language"}]',
    required: ['prompt', 'response']
  },
  {
    name: 'CSV',
    description: 'CSV format with prompt and response columns',
    example: 'prompt,response\n"What is Python?","Python is a programming language"',
    required: ['prompt', 'response']
  }
];

function FileUploadCard({ 
  onFilesSelected, 
  accept = '.json,.jsonl,.csv' 
}: { 
  onFilesSelected: (files: File[]) => void;
  accept?: string;
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    onFilesSelected(files);
  }, [onFilesSelected]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  return (
    <Card className={`bg-slate-800/50 border-slate-700 transition-all ${
      isDragOver ? 'border-blue-500 bg-blue-500/10' : ''
    }`}>
      <CardContent className="p-8">
        <div
          className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-slate-500 transition-colors"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            {isDragOver ? 'Drop files here' : 'Drag and drop your dataset here'}
          </h3>
          <p className="text-slate-400 mb-4">or click to browse files</p>
          <Button variant="outline">Browse Files</Button>
          <input
            id="file-input"
            type="file"
            multiple
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />
          <p className="text-slate-500 text-xs mt-4">
            Supported formats: JSON, JSONL, CSV (max 100MB per file)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function UploadedFileCard({ 
  file, 
  onRemove 
}: { 
  file: UploadedFile; 
  onRemove: () => void;
}) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-white font-medium">{file.name}</p>
              <p className="text-slate-400 text-sm">
                {formatFileSize(file.size)} • {file.type}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onRemove}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DatasetUploadPage() {
  const router = useRouter();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [datasetName, setDatasetName] = useState('');
  const [description, setDescription] = useState('');
  const [format, setFormat] = useState('jsonl');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleFilesSelected = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type || 'unknown'
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const validateDataset = () => {
    const errors: string[] = [];
    
    if (!datasetName.trim()) {
      errors.push('Dataset name is required');
    }
    
    if (uploadedFiles.length === 0) {
      errors.push('At least one file must be uploaded');
    }
    
    if (tags.length === 0) {
      errors.push('At least one tag is required');
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleUpload = async () => {
    if (!validateDataset()) {
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.random() * 10;
      });
    }, 200);

    // Simulate API call
    setTimeout(() => {
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setIsUploading(false);
        router.push('/datasets');
      }, 1000);
    }, 3000);
  };

  const selectedFormat = formats.find(f => f.name.toLowerCase() === format);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 backdrop-blur-sm bg-slate-900/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/datasets">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Datasets
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Logo size="md" showText={false} />
              <span className="text-xl font-bold text-white">Upload Dataset</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Upload Progress */}
          {isUploading && (
            <Card className="bg-slate-800/50 border-slate-700 mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Uploading Dataset...</h3>
                  <span className="text-slate-300">{uploadProgress.toFixed(0)}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-slate-400 text-sm mt-2">
                  {uploadProgress < 100 ? 'Processing and validating your dataset...' : 'Upload complete! Redirecting...'}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <Card className="bg-red-900/20 border-red-500/50 mb-8">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <h3 className="text-white font-semibold mb-2">Please fix the following errors:</h3>
                    <ul className="text-red-400 text-sm space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="upload" className="space-y-6">
            <TabsList className="bg-slate-800/50 border-slate-700">
              <TabsTrigger value="upload" className="text-white">Upload Files</TabsTrigger>
              <TabsTrigger value="metadata" className="text-white">Dataset Info</TabsTrigger>
              <TabsTrigger value="format" className="text-white">Format Guide</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
              <FileUploadCard onFilesSelected={handleFilesSelected} />

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Uploaded Files ({uploadedFiles.length})</h3>
                  <div className="space-y-3">
                    {uploadedFiles.map((file) => (
                      <UploadedFileCard
                        key={file.id}
                        file={file}
                        onRemove={() => removeFile(file.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="metadata" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Dataset Information</CardTitle>
                  <CardDescription>Provide details about your dataset</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="name">Dataset Name *</Label>
                    <Input
                      id="name"
                      value={datasetName}
                      onChange={(e) => setDatasetName(e.target.value)}
                      placeholder="e.g., Python Tutorials Dataset"
                      className="bg-slate-700/50 border-slate-600"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your dataset and its use case..."
                      className="bg-slate-700/50 border-slate-600"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="format">Format *</Label>
                    <Select value={format} onValueChange={setFormat}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jsonl">JSONL</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Tags *</Label>
                    <div className="flex gap-2 mb-3">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag..."
                        className="bg-slate-700/50 border-slate-600"
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      />
                      <Button onClick={addTag} variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                          {tag}
                          <X className="w-3 h-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="format" className="space-y-6">
              <div className="grid md:grid-cols-1 gap-6">
                {formats.map((fmt) => (
                  <Card 
                    key={fmt.name} 
                    className={`bg-slate-800/50 border-slate-700 ${
                      format === fmt.name.toLowerCase() ? 'border-blue-500' : ''
                    }`}
                  >
                    <CardHeader>
                      <CardTitle className="text-white">{fmt.name}</CardTitle>
                      <CardDescription>{fmt.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-2">Required Fields:</h4>
                        <div className="flex flex-wrap gap-2">
                          {fmt.required.map((field) => (
                            <Badge key={field} variant="outline" className="text-blue-400">
                              {field}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-2">Example:</h4>
                        <div className="bg-slate-900/50 rounded-lg p-3 font-mono text-xs text-slate-300">
                          {fmt.example}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-between mt-8">
            <Link href="/datasets">
              <Button variant="outline">
                Cancel
              </Button>
            </Link>
            <Button 
              onClick={handleUpload}
              disabled={isUploading || uploadedFiles.length === 0}
            >
              {isUploading ? 'Uploading...' : 'Upload Dataset'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}