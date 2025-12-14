import { NextRequest, NextResponse } from 'next/server';
import { trainingService } from '@/lib/training-service';
import { oumiClient } from '@/lib/oumi-client';

const USE_DATABASE = process.env.USE_DATABASE !== 'false';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (USE_DATABASE) {
      const job = await trainingService.stopJob(id);
      
      // Also stop in backend service
      try {
        await oumiClient.stopTrainingJob(id);
      } catch (backendError) {
        console.error('Failed to stop job in backend:', backendError);
        // Continue anyway - job is updated in database
      }

      return NextResponse.json({ 
        message: 'Training job stopped', 
        job_id: id,
        status: job.status,
      });
    } else {
      const response = await fetch(`${BACKEND_URL}/api/training/${id}/stop`, {
        method: 'POST',
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
    console.error('Error stopping training job:', error);
    return NextResponse.json(
      { error: 'Failed to stop training job' },
      { status: 500 }
    );
  }
}

