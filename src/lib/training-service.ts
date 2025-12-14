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
    const where: Prisma.TrainingJobWhereInput = {};

    if (filters?.status && filters.status !== 'all') {
      where.status = filters.status;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { model: { contains: filters.search, mode: 'insensitive' } },
        { dataset: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return await db.trainingJob.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
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

