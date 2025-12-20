import type { EventConfig } from 'motia';
import type { TrainingJob } from '../shared/types';
import { STATE_KEYS, EVENT_NAMES, stateGet, stateSet } from '../shared/state-keys';

export const config: EventConfig = {
    name: 'training-processor',
    type: 'event',
    subscribes: [EVENT_NAMES.START_TRAINING],
    flows: ['OumiRL'],
    emits: [EVENT_NAMES.METRICS_UPDATE, EVENT_NAMES.TRAINING_COMPLETE],
};

export const handler = async (req: any, { state, emit, logger }: any) => {
    const { jobId } = req.data;

    if (!jobId) {
        logger.error('No jobId provided in start-training event');
        return;
    }

    logger.info(`Starting training processor for job: ${jobId}`);

    const job = await stateGet<TrainingJob>(state, STATE_KEYS.TRAINING_JOB(jobId));

    if (!job) {
        logger.error(`Training job ${jobId} not found in state`);
        return;
    }

    job.status = 'running';
    job.tokensPerSecond = Math.floor(Math.random() * 1500) + 500;
    job.gpuUtilization = Math.floor(Math.random() * 25) + 70;
    job.memoryUsage = Math.floor(Math.random() * 30) + 50;

    await stateSet(state, STATE_KEYS.TRAINING_JOB(jobId), job);

    const totalSteps = job.totalSteps || 1000;

    for (let step = 0; step <= totalSteps; step += 100) {
        job.currentStep = Math.min(step, totalSteps);
        job.progress = Math.round((job.currentStep / totalSteps) * 100);
        job.loss = Math.max(0.1, 2.0 * (1 - step / totalSteps) + Math.random() * 0.1 - 0.05);
        job.reward = Math.min(1.0, 0.3 + (step / totalSteps) * 0.6 + Math.random() * 0.04 - 0.02);
        job.klDivergence = Math.max(0.01, 0.1 * (1 - step / totalSteps) + Math.random() * 0.01 - 0.005);
        job.tokensPerSecond = Math.floor(Math.random() * 300) + 1000;
        job.gpuUtilization = Math.floor(Math.random() * 15) + 75;
        job.memoryUsage = Math.floor(Math.random() * 20) + 60;

        await stateSet(state, STATE_KEYS.TRAINING_JOB(jobId), job);
        await emit(EVENT_NAMES.METRICS_UPDATE, { jobId, step: job.currentStep, loss: job.loss, reward: job.reward, klDivergence: job.klDivergence, tokensPerSecond: job.tokensPerSecond, gpuUtilization: job.gpuUtilization, memoryUsage: job.memoryUsage });

        if (step >= totalSteps) break;
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    job.status = 'completed';
    job.progress = 100;
    job.endTime = new Date().toISOString();
    await stateSet(state, STATE_KEYS.TRAINING_JOB(jobId), job);
    await emit(EVENT_NAMES.TRAINING_COMPLETE, { jobId });

    logger.info(`Training job ${jobId} completed successfully`);
};
