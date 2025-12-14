'use client';

import { motion } from 'framer-motion';
import { Brain, Zap, TrendingUp, Sparkles, BarChart3, Database, Play, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import Link from 'next/link';

const features = [
  {
    icon: Brain,
    title: 'GRPO Training',
    description: 'Advanced reinforcement learning using Oumi\'s GRPO algorithm',
    color: 'from-blue-500 to-purple-600'
  },
  {
    icon: BarChart3,
    title: 'Real-Time Metrics',
    description: 'Live monitoring of training progress with beautiful charts',
    color: 'from-green-500 to-teal-600'
  },
  {
    icon: Database,
    title: 'Data Synthesis',
    description: 'Generate synthetic training data with AI assistance',
    color: 'from-orange-500 to-red-600'
  },
  {
    icon: CheckCircle,
    title: 'LLM-as-a-Judge',
    description: 'Automated model evaluation using advanced LLM judges',
    color: 'from-purple-500 to-pink-600'
  }
];

const stats = [
  { label: 'Models Trained', value: '500+', icon: Brain },
  { label: 'Active Users', value: '1.2K', icon: Zap },
  { label: 'Training Hours', value: '10K+', icon: TrendingUp },
  { label: 'Success Rate', value: '98%', icon: CheckCircle }
];

function FeatureCard({ feature }: { feature: typeof features[0] }) {
  const Icon = feature.icon;
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="h-full bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
        <CardHeader>
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-white">{feature.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-slate-300">
            {feature.description}
          </CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StatCard({ stat }: { stat: typeof stats[0] }) {
  const Icon = stat.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6 text-center">
          <Icon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
          <div className="text-sm text-slate-400">{stat.label}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{ bottom: '10%', right: '10%' }}
        />
      </div>

      {/* Navigation Header */}
      <header className="relative z-10 border-b border-slate-800 backdrop-blur-sm bg-slate-900/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="md" />
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
            <a href="/use-cases" className="text-slate-300 hover:text-white transition-colors">Use Cases</a>
            <a href="#docs" className="text-slate-300 hover:text-white transition-colors">Docs</a>
            <a href="https://github.com/oumi-ai/oumi" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors">GitHub</a>
          </nav>
          <Link href="/dashboard">
            <Button>Launch App</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Fine-tune LLMs with
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Reinforcement Learning
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Train, evaluate, and deploy custom models using Oumi's GRPO algorithm. 
            No ML expertise required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-3">
                <Play className="w-5 h-5 mr-2" />
                Try Demo
              </Button>
            </Link>
            <Link href="/use-cases">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-slate-600 text-white hover:bg-slate-800">
                View Success Stories
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Everything You Need to Train Models
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Powerful features that make RL training accessible and efficient
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <FeatureCard feature={feature} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-slate-700 max-w-4xl mx-auto">
            <CardContent className="p-12">
              <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Start Training?
              </h2>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Join thousands of researchers and developers using Oumi RL Studio 
                to build better language models.
              </p>
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8 py-3">
                  Get Started Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Brain className="w-6 h-6 text-blue-500" />
              <span className="text-white font-semibold">Oumi RL Studio</span>
            </div>
            <div className="text-slate-400 text-sm">
              Powered by <a href="https://github.com/oumi-ai/oumi" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Oumi</a> • Built for the AI Agents Hackathon
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}