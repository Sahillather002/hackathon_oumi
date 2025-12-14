'use client';

import { motion } from 'framer-motion';
import { Brain, ArrowLeft, Users, TrendingUp, Clock, DollarSign, Target, BarChart3, CheckCircle, Zap, Award, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

const timeline = [
  {
    phase: 'Data Preparation',
    days: 'Days 1-5',
    description: 'Upload and clean existing customer service data',
    icon: Target,
    achievements: [
      'Uploaded 15,000 existing conversations',
      'Identified data gaps and quality issues',
      'Formatted data for GRPO training',
      'Generated synthetic edge cases'
    ]
  },
  {
    phase: 'GRPO Fine-tuning',
    days: 'Days 6-15',
    description: 'Train model using reinforcement learning from customer feedback',
    icon: Brain,
    achievements: [
      'Configured GRPO with KL divergence control',
      'Achieved 87% reduction in training loss',
      'Optimized reward function for satisfaction',
      'Real-time monitoring of convergence'
    ]
  },
  {
    phase: 'Evaluation & Testing',
    days: 'Days 16-20',
    description: 'Automated evaluation and A/B testing',
    icon: BarChart3,
    achievements: [
      'LLM-as-a-Judge evaluation across 5 criteria',
      '42-57% improvement in all quality metrics',
      'A/B testing against base model',
      '95% confidence in deployment readiness'
    ]
  },
  {
    phase: 'Deployment & Monitoring',
    days: 'Days 21-30',
    description: 'Production deployment and continuous monitoring',
    icon: CheckCircle,
    achievements: [
      'Successful production deployment',
      'Real-time performance monitoring',
      'Customer satisfaction tracking',
      'ROI analysis and reporting'
    ]
  }
];

const metrics = [
  {
    label: 'Customer Satisfaction',
    before: 58,
    after: 87,
    improvement: 50,
    color: 'from-green-500 to-emerald-600',
    icon: Users
  },
  {
    label: 'Response Quality',
    before: 6.2,
    after: 8.7,
    improvement: 40,
    color: 'from-blue-500 to-indigo-600',
    icon: Star
  },
  {
    label: 'Escalation Rate',
    before: 35,
    after: 15,
    improvement: -57,
    color: 'from-purple-500 to-pink-600',
    icon: TrendingUp
  },
  {
    label: 'Monthly Support Cost',
    before: 45000,
    after: 18000,
    improvement: -60,
    color: 'from-orange-500 to-red-600',
    icon: DollarSign,
    format: 'currency'
  }
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'VP of Customer Experience',
    company: 'TechMart',
    quote: 'Oumi RL Studio transformed our customer service operations. The improvement in response quality and customer satisfaction exceeded our wildest expectations.',
    result: '50% improvement in satisfaction'
  },
  {
    name: 'Michael Rodriguez',
    role: 'Lead ML Engineer',
    company: 'TechMart',
    quote: 'The GRPO training and real-time monitoring features allowed us to iterate 3x faster than our previous manual processes.',
    result: '30-day project completed in 29 days'
  },
  {
    name: 'Jennifer Liu',
    role: 'Customer Support Manager',
    company: 'TechMart',
    quote: 'Our support team productivity increased dramatically. The AI assistant now handles 78% of inquiries without escalation.',
    result: '57% reduction in escalations'
  }
];

function MetricCard({ metric }: { metric: typeof metrics[0] }) {
  const Icon = metric.icon;
  const isPositiveImprovement = metric.improvement > 0;
  
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${metric.color} flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-400">{metric.label}</p>
            </div>
          </div>
          <Badge className={`${isPositiveImprovement ? 'bg-green-500' : 'bg-red-500'} text-white`}>
            {isPositiveImprovement ? '+' : ''}{metric.improvement}%
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Before:</span>
            <span className="text-lg font-bold text-red-400">
              {metric.format ? `$${metric.before.toLocaleString()}` : metric.before}
              {metric.format === 'currency' ? '/month' : ''}
              {metric.format !== 'currency' ? '/10' : ''}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-400">After:</span>
            <span className="text-lg font-bold text-green-400">
              {metric.format ? `$${metric.after.toLocaleString()}` : metric.after}
              {metric.format === 'currency' ? '/month' : ''}
              {metric.format !== 'currency' ? '/10' : ''}
            </span>
          </div>
          
          <Progress value={Math.abs(metric.improvement)} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}

function TimelineCard({ phase, index }: { phase: typeof timeline[0]; index: number }) {
  const Icon = phase.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className="bg-slate-800/50 border-slate-700 h-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-white">{phase.phase}</CardTitle>
              <CardDescription className="text-slate-400">{phase.days}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-300">{phase.description}</p>
          <ul className="space-y-2">
            {phase.achievements.map((achievement, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-slate-300">{achievement}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className="bg-slate-800/50 border-slate-700 h-full">
        <CardContent className="p-6">
          <div className="mb-4">
            <p className="text-slate-200 italic mb-4">"{testimonial.quote}"</p>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-semibold text-yellow-400">{testimonial.result}</span>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-4">
            <p className="font-semibold text-white">{testimonial.name}</p>
            <p className="text-sm text-slate-400">{testimonial.role}</p>
            <p className="text-sm text-blue-400">{testimonial.company}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function CustomerServiceCaseStudy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 backdrop-blur-sm bg-slate-900/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/use-cases">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Use Cases
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold text-white">Customer Service Chatbot</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-8">
            <Badge className="bg-blue-500 text-white mb-4">Success Story</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              TechMart: Customer Service
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Transformation
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              How an e-commerce giant improved customer satisfaction by 50% and reduced support costs by 60% using Oumi RL Studio
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400">87%</p>
              <p className="text-sm text-slate-400">Customer Satisfaction</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-400">8.7/10</p>
              <p className="text-sm text-slate-400">Response Quality</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-400">15%</p>
              <p className="text-sm text-slate-400">Escalation Rate</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-400">$27K</p>
              <p className="text-sm text-slate-400">Monthly Savings</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Challenge Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">The Challenge</h2>
          <Card className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border-red-500/30 max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-red-400 mb-4">Business Problems</h3>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">⚠️</span>
                      <span>Low customer satisfaction (58%)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">⚠️</span>
                      <span>High escalation rate (35%)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">⚠️</span>
                      <span>Poor technical support quality</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">⚠️</span>
                      <span>30-day deadline to improve by 40%</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-red-400 mb-4">Consequences</h3>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">💸</span>
                      <span>$45,000 monthly support costs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">📉</span>
                      <span>Risk of outsourcing to expensive provider</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">😞</span>
                      <span>Lost sales and customer loyalty</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Solution Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">The Oumi RL Studio Solution</h2>
          <Card className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-500/30 max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-green-400 mb-4">Key Strategies</h3>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">✓</span>
                      <span>GRPO reinforcement learning from customer feedback</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">✓</span>
                      <span>Synthetic data generation for edge cases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">✓</span>
                      <span>Automated evaluation with LLM-as-a-Judge</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">✓</span>
                      <span>Real-time monitoring and optimization</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-green-400 mb-4">Technical Implementation</h3>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">🧠</span>
                      <span>Fine-tuned Llama-2-7B on 20,000 examples</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">📊</span>
                      <span>Real-time training metrics and convergence monitoring</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">⚖️</span>
                      <span>GRPO with KL divergence control (0.1)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">🎯</span>
                      <span>Automated quality evaluation across 5 criteria</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Metrics Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Measurable Results</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <MetricCard metric={metric} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Timeline Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">30-Day Implementation Timeline</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {timeline.map((phase, index) => (
              <TimelineCard key={phase.phase} phase={phase} index={index} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* ROI Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-500/30 max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-white text-center text-2xl">💰 Business Impact & ROI</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <p className="text-4xl font-bold text-yellow-400">1,620%</p>
                  <p className="text-lg text-slate-300">Annual ROI</p>
                  <p className="text-sm text-slate-400">First year return</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-green-400">3 days</p>
                  <p className="text-lg text-slate-300">Payback Period</p>
                  <p className="text-sm text-slate-400">Time to break even</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-blue-400">$324K</p>
                  <p className="text-lg text-slate-300">Annual Savings</p>
                  <p className="text-sm text-slate-400">Total cost reduction</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">What the Team Says</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-slate-700 max-w-4xl mx-auto">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Achieve Similar Results?
              </h2>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Whether you're working on customer service, technical support, or any other AI application, Oumi RL Studio can help you achieve transformative results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/training/new">
                  <Button size="lg" className="text-lg px-8 py-3">
                    <Zap className="w-5 h-5 mr-2" />
                    Start Your Project
                  </Button>
                </Link>
                <Link href="/use-cases">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-slate-600 text-white hover:bg-slate-800">
                    View More Cases
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}