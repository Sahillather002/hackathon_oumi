import type { ApiRouteConfig } from 'motia';
import type { TrainingJob } from '../shared/types';
import { STATE_KEYS, stateGet } from '../shared/state-keys';
import { generateId, getCurrentTimestamp, getEstimatedCompletion } from '../shared/utils';

export const config: ApiRouteConfig = {
    name: 'training-list',
    type: 'api',
    path: '/api/training',
    method: 'GET',
    flows: ['OumiRL'],
    emits: [],
};

export const handler = async (req: any, { state }: any) => {
    const statusFilter = req.queryParams?.status || 'all';
    const jobIds = await stateGet<string[]>(state, STATE_KEYS.TRAINING_JOBS_LIST) || [];

    let jobs: TrainingJob[] = [];
    for (const id of jobIds) {
        const job = await stateGet<TrainingJob>(state, STATE_KEYS.TRAINING_JOB(id));
        if (job && (statusFilter === 'all' || job.status === statusFilter)) {
            jobs.push(job);
        }
    }

    return { status: 200, body: jobs };
};
