import { db } from './db';
import { Prisma } from '@prisma/client';

export interface CreateTrainingJobInput {
  name: string;
  model: string;
  dataset: string;
  status?: string;
  config?: any;
  learningRate?: number;
  batchSize?: number;
  epochs?: number;
  useGRPO?: boolean;
  totalSteps?: number;
}

export interface UpdateTrainingJobInput {
  status?: string;
  progress?: number;
  currentStep?: number;
  loss?: number;
  reward?: number;
  klDivergence?: number;
  error?: string;
  endTime?: Date;
}

export class TrainingService {
  async createJob(input: CreateTrainingJobInput) {
    return await db.trainingJob.create({
      data: {
        name: input.name,
        model: input.model,
        dataset: input.dataset,
        status: input.status || 'pending',
        learningRate: input.learningRate || 1e-5,
        batchSize: input.batchSize || 4,
        epochs: input.epochs || 3,
        useGRPO: input.useGRPO !== false,
        totalSteps: input.totalSteps || 1000,
        config: input.config ? JSON.stringify(input.config) : null,
      },
    });
  }

  async getJob(id: string) {
    return await db.trainingJob.findUnique({
      where: { id },
    });
  }

  async listJobs(filters?: {
    status?: string;
    search?: string;
  }) {
    try {
      const where: Prisma.TrainingJobWhereInput = {};

      if (filters?.status && filters.status !== 'all') {
        where.status = filters.status;
      }

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        // SQLite doesn't support case-insensitive mode, so we filter in memory
        // or use a workaround with multiple OR conditions
        where.OR = [
          { name: { contains: filters.search } },
          { model: { contains: filters.search } },
          { dataset: { contains: filters.search } },
        ];
      }

      const jobs = await db.trainingJob.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      // If search was provided, filter case-insensitively in memory for SQLite
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        return jobs.filter(job => 
          job.name.toLowerCase().includes(searchLower) ||
          job.model.toLowerCase().includes(searchLower) ||
          job.dataset.toLowerCase().includes(searchLower)
        );
      }

      return jobs;
    } catch (error) {
      console.error('Error listing jobs from database:', error);
      throw error;
    }
  }

  async updateJob(id: string, input: UpdateTrainingJobInput) {
    return await db.trainingJob.update({
      where: { id },
      data: {
        ...input,
        updatedAt: new Date(),
      },
    });
  }

  async deleteJob(id: string) {
    return await db.trainingJob.delete({
      where: { id },
    });
  }

  async stopJob(id: string) {
    const job = await this.getJob(id);
    if (!job) {
      throw new Error('Training job not found');
    }

    if (job.status === 'running') {
      return await this.updateJob(id, {
        status: 'stopped',
        endTime: new Date(),
      });
    }

    return job;
  }
}

export const trainingService = new TrainingService();

