import { NextRequest, NextResponse } from 'next/server';
import { trainingService } from '@/lib/training-service';
import { oumiClient } from '@/lib/oumi-client';

const USE_DATABASE = process.env.USE_DATABASE !== 'false';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || undefined;

    if (USE_DATABASE) {
      try {
        // Use database
        const jobs = await trainingService.listJobs({ status, search });
        
        // Transform to API format
        const transformedJobs = jobs.map(job => ({
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
        }));

        return NextResponse.json(transformedJobs);
      } catch (dbError) {
        console.error('Database error, falling back to backend service:', dbError);
        // Fall through to backend service
      }
    }
    
    // Fallback to backend service
    try {
      const response = await fetch(`${BACKEND_URL}/api/training`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (backendError) {
      console.error('Backend service error:', backendError);
      // Return empty array if both database and backend fail
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Error fetching training jobs:', error);
    // Return empty array instead of error to prevent UI crashes
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (USE_DATABASE) {
      // Use database
      const job = await trainingService.createJob({
        name: body.name || body.job_name || 'Untitled Training Job',
        model: body.model || body.model_name,
        dataset: body.dataset || body.dataset_id,
        status: 'pending',
        learningRate: body.learning_rate || body.learningRate,
        batchSize: body.batch_size || body.batchSize,
        epochs: body.num_epochs || body.epochs,
        useGRPO: body.use_grpo !== false,
        totalSteps: body.max_steps || body.totalSteps,
        config: body.config || body,
      });

      // Also create in backend service for processing
      try {
        await oumiClient.createTrainingJob({
          model_name: job.model,
          dataset_id: job.dataset,
          learning_rate: job.learningRate,
          batch_size: job.batchSize,
          num_epochs: job.epochs,
          use_grpo: job.useGRPO,
          job_name: job.name,
        });
      } catch (backendError) {
        console.error('Failed to create job in backend:', backendError);
        // Continue anyway - job is saved in database
      }

      return NextResponse.json({
        id: job.id,
        job_id: job.id,
        status: job.status,
        name: job.name,
        model: job.model,
        dataset: job.dataset,
      });
    } else {
      // Fallback to backend service
      const response = await fetch(`${BACKEND_URL}/api/training`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Error creating training job:', error);
    return NextResponse.json(
      { error: 'Failed to create training job' },
      { status: 500 }
    );
  }
}

