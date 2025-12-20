import type { ApiRouteConfig } from 'motia';
import { STATE_KEYS, stateGet, stateSet } from '../shared/state-keys';

export const config: ApiRouteConfig = {
    name: 'training-delete',
    type: 'api',
    path: '/api/training/:id',
    method: 'DELETE',
    flows: ['OumiRL'],
    emits: [],
};

export const handler = async (req: any, { state }: any) => {
    const { id } = req.pathParams;
    const job = await stateGet(state, STATE_KEYS.TRAINING_JOB(id));

    if (!job) {
        return { status: 404, body: { error: 'Training job not found' } };
    }

    const jobIds = await stateGet<string[]>(state, STATE_KEYS.TRAINING_JOBS_LIST) || [];
    const filteredIds = jobIds.filter(jobId => jobId !== id);
    await stateSet(state, STATE_KEYS.TRAINING_JOBS_LIST, filteredIds);
    await stateSet(state, STATE_KEYS.TRAINING_JOB(id), null);
    await stateSet(state, STATE_KEYS.TRAINING_METRICS(id), null);

    return { status: 200, body: { message: 'Training job deleted' } };
};
