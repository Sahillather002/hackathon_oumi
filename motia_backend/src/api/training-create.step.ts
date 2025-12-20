import type { ApiRouteConfig } from 'motia';
import type { TrainingJob } from '../shared/types';
import { STATE_KEYS, EVENT_NAMES, stateGet, stateSet } from '../shared/state-keys';
import { generateId, getCurrentTimestamp, getEstimatedCompletion } from '../shared/utils';

export const config: ApiRouteConfig = {
    name: 'training-create',
    type: 'api',
    path: '/api/training',
    method: 'POST',
    flows: ['OumiRL'],
    emits: [EVENT_NAMES.START_TRAINING],
};

export const handler = async (req: any, { state, emit }: any) => {
    const body = req.body as any;
    const name = body.name || body.job_name || 'Untitled Training Job';
    const model = body.model || body.model_name;
    const dataset = body.dataset || body.dataset_id;
    const config = body.config || {};

    const learningRate = config.learning_rate || config.learningRate || 1e-5;
    const batchSize = config.batch_size || config.batchSize || 4;
    const epochs = config.num_epochs || config.epochs || 3;
    const useGRPO = config.use_grpo !== false && config.useGRPO !== false;
    const totalSteps = config.max_steps || config.maxSteps || 1000;

    const jobId = generateId();
    const job: TrainingJob = {
        id: jobId,
        name,
        model,
        dataset,
        status: 'queued',
        progress: 0,
        currentStep: 0,
        totalSteps,
        loss: 0,
        reward: 0,
        klDivergence: 0,
        learningRate,
        batchSize,
        epochs,
        useGRPO,
        startTime: getCurrentTimestamp(),
        tokensPerSecond: 0,
        gpuUtilization: 0,
        memoryUsage: 0,
        config,
    };

    const jobIds = await stateGet<string[]>(state, STATE_KEYS.TRAINING_JOBS_LIST) || [];
    jobIds.push(job.id);
    await stateSet(state, STATE_KEYS.TRAINING_JOBS_LIST, jobIds);
    await stateSet(state, STATE_KEYS.TRAINING_JOB(job.id), job);

    await emit(EVENT_NAMES.START_TRAINING, { jobId: job.id });

    return {
        status: 201,
        body: { id: job.id, job_id: job.id, status: job.status, name: job.name, model: job.model, dataset: job.dataset }
    };
};
