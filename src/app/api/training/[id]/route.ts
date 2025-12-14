import { NextRequest, NextResponse } from 'next/server';
import { trainingService } from '@/lib/training-service';

const USE_DATABASE = process.env.USE_DATABASE !== 'false';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (USE_DATABASE) {
      const job = await trainingService.getJob(id);
      
      if (!job) {
        return NextResponse.json(
          { error: 'Training job not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        id: job.id,
        name: job.name,
        model: job.model,
        dataset: job.dataset,
        status: job.status,
        progress: job.progress,
        currentStep: job.currentStep,
        totalSteps: job.totalSteps,
        loss: job.loss,
        reward: job.reward,
        klDivergence: job.klDivergence,
        learningRate: job.learningRate,
        batchSize: job.batchSize,
        epochs: job.epochs,
        useGRPO: job.useGRPO,
        error: job.error,
        startTime: job.startTime.toISOString(),
        endTime: job.endTime?.toISOString(),
        createdAt: job.createdAt.toISOString(),
        updatedAt: job.updatedAt.toISOString(),
        config: job.config ? JSON.parse(job.config) : null,
      });
    } else {
      const response = await fetch(`${BACKEND_URL}/api/training/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        if (response.status === 404) {
          return NextResponse.json(
            { error: 'Training job not found' },
            { status: 404 }
          );
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Error fetching training job:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training job' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (USE_DATABASE) {
      await trainingService.deleteJob(id);
      return NextResponse.json({ message: 'Training job deleted', job_id: id });
    } else {
      const response = await fetch(`${BACKEND_URL}/api/training/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return NextResponse.json(
            { error: 'Training job not found' },
            { status: 404 }
          );
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Error deleting training job:', error);
    return NextResponse.json(
      { error: 'Failed to delete training job' },
      { status: 500 }
    );
  }
}

