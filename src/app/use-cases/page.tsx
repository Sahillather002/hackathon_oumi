'use client';

import { motion } from 'framer-motion';
import { Brain, ArrowLeft, TrendingUp, Users, Zap, Target, BarChart3, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

const useCases = [
  {
    id: 'customer-service',
    title: 'Customer Service Chatbot',
    description: 'Transform customer support with AI-powered chatbots',
    icon: Users,
    metrics: {
      improvement: '87%',
      savings: '$27K/month',
      timeline: '30 days',
      satisfaction: '8.7/10'
    },
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'technical-support',
    title: 'Technical Support Systems',
    description: 'Build intelligent IT helpdesk and troubleshooting assistants',
    icon: Target,
    metrics: {
      improvement: '78%',
      savings: '$15K/month',
      timeline: '21 days',
      resolution: '92%'
    },
    color: 'from-green-500 to-teal-600'
  },
  {
    id: 'education',
    title: 'Educational Content',
    description: 'Create personalized learning experiences and tutoring systems',
    icon: Brain,
    metrics: {
      improvement: '94%',
      savings: '$8K/month',
      timeline: '14 days',
      engagement: '91%'
    },
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'code-assistant',
    title: 'Code Completion Tools',
    description: 'Develop intelligent programming assistants and code generators',
    icon: Zap,
    metrics: {
      improvement: '73%',
      savings: '$22K/month',
      timeline: '18 days',
      accuracy: '89%'
    },
    color: 'from-orange-500 to-red-600'
  }
];

function MetricCard({ label, value, icon: Icon, color }: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}) {
  const Icon = icon;
  return (
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-lg font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

function UseCaseCard({ useCase }: { useCase: typeof useCases[0] }) {
  const Icon = useCase.icon;  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${useCase.color} flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-white text-lg">{useCase.title}</CardTitle>
              <CardDescription className="text-slate-400 text-sm">
                {useCase.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              label="Performance Improvement"
              value={useCase.metrics.improvement}
              icon={TrendingUp}
              color="from-green-500 to-emerald-600"
            />
            <MetricCard
              label="Monthly Savings"
              value={useCase.metrics.savings}
              icon={DollarSign}
              color="from-blue-500 to-indigo-600"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              label="Implementation Time"
              value={useCase.metrics.timeline}
              icon={Clock}
              color="from-purple-500 to-pink-600"
            />
            {useCase.metrics.satisfaction && (
              <MetricCard
                label="Quality Score"
                value={useCase.metrics.satisfaction}
                icon={BarChart3}
                color="from-orange-500 to-red-600"
              />
            )}
            {useCase.metrics.resolution && (
              <MetricCard
                label="Resolution Rate"
                value={useCase.metrics.resolution}
                icon={CheckCircle}
                color="from-teal-500 to-cyan-600"
              />
            )}
            {useCase.metrics.accuracy && (
              <MetricCard
                label="Accuracy"
                value={useCase.metrics.accuracy}
                icon={Target}
                color="from-indigo-500 to-purple-600"
              />
            )}
            {useCase.metrics.engagement && (
              <MetricCard
                label="User Engagement"
                value={useCase.metrics.engagement}
                icon={Users}
                color="from-pink-500 to-rose-600"
              />
            )}
          </div>
          
          <div className="pt-4 border-t border-slate-700">
            <Link href={`/use-cases/${useCase.id}`}>
              <Button className="w-full">
                View Full Case Study
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function UseCasesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 backdrop-blur-sm bg-slate-900/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold text-white">Use Cases</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Real-World Success with
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Oumi RL Studio
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
            See how organizations are transforming their AI applications with GRPO fine-tuning
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/training/new">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Your Project
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-slate-600 text-white hover:bg-slate-800">
                View Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Featured Case Study */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="bg-blue-500 text-white mb-4">Featured</Badge>
          <h2 className="text-3xl font-bold text-white mb-4">
            Customer Service Chatbot Transformation
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            How TechMart improved customer satisfaction by 50% and reduced support costs by 60% using Oumi RL Studio
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/30 mb-12">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">The Challenge</h3>
                    <ul className="space-y-2 text-slate-300">
                      <li className="flex items-start gap-2">
                        <span className="text-red-400">•</span>
                        <span>Low customer satisfaction (58%)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400">•</span>
                        <span>High escalation rate (35%)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400">•</span>
                        <span>30-day deadline to improve by 40%</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">The Solution</h3>
                    <ul className="space-y-2 text-slate-300">
                      <li className="flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        <span>GRPO fine-tuning with customer feedback</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        <span>Synthetic data generation for edge cases</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        <span>Automated evaluation with LLM-as-a-Judge</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Results</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
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
                  </div>
                  
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-2">Key Success Factors</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-500">GRPO</Badge>
                        <span className="text-slate-300">Reinforcement learning from feedback</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-500">Data Synthesis</Badge>
                        <span className="text-slate-300">5,000 additional examples</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-purple-500">LLM Judge</Badge>
                        <span className="text-slate-300">42-57% improvement</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Link href="/use-cases/customer-service">
                      <Button className="w-full">
                        Read Full Case Study
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* All Use Cases */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            More Success Stories
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Explore how different industries are leveraging Oumi RL Studio
          </p>
        </motion.div>

        <Tabs defaultValue="all" className="space-y-8">
          <TabsList className="bg-slate-800/50 border-slate-700 w-full justify-start">
            <TabsTrigger value="all" className="text-white">All Use Cases</TabsTrigger>
            <TabsTrigger value="enterprise" className="text-white">Enterprise</TabsTrigger>
            <TabsTrigger value="startup" className="text-white">Startup</TabsTrigger>
            <TabsTrigger value="education" className="text-white">Education</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={useCase.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <UseCaseCard useCase={useCase} />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="enterprise">
            <div className="grid md:grid-cols-2 gap-6">
              {useCases.slice(0, 2).map((useCase, index) => (
                <UseCaseCard key={useCase.id} useCase={useCase} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="startup">
            <div className="grid md:grid-cols-2 gap-6">
              {useCases.slice(1, 3).map((useCase, index) => (
                <UseCaseCard key={useCase.id} useCase={useCase} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="education">
            <div className="grid md:grid-cols-2 gap-6">
              {useCases.slice(2, 3).map((useCase, index) => (
                <UseCaseCard key={useCase.id} useCase={useCase} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
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
                Ready to Transform Your AI Project?
              </h2>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Join thousands of developers using Oumi RL Studio to build better language models
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/training/new">
                  <Button size="lg" className="text-lg px-8 py-3">
                    Start Your Project
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-slate-600 text-white hover:bg-slate-800">
                    View Dashboard
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