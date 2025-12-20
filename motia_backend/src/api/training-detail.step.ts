import type { ApiRouteConfig } from 'motia';
import type { TrainingJob } from '../shared/types';
import { STATE_KEYS, stateGet } from '../shared/state-keys';

export const config: ApiRouteConfig = {
    name: 'training-detail',
    type: 'api',
    path: '/api/training/:id',
    method: 'GET',
    flows: ['OumiRL'],
    emits: [],
};

export const handler = async (req: any, { state }: any) => {
    const { id } = req.pathParams;
    const job = await stateGet<TrainingJob>(state, STATE_KEYS.TRAINING_JOB(id));

    if (!job) {
        return { status: 404, body: { error: 'Training job not found' } };
    }

    return { status: 200, body: job };
};
