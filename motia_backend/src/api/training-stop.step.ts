import type { ApiRouteConfig } from 'motia';
import type { TrainingJob } from '../shared/types';
import { STATE_KEYS, EVENT_NAMES, stateGet, stateSet } from '../shared/state-keys';

export const config: ApiRouteConfig = {
    name: 'training-stop',
    type: 'api',
    path: '/api/training/:id/stop',
    method: 'POST',
    flows: ['OumiRL'],
    emits: [EVENT_NAMES.STOP_TRAINING],
};

export const handler = async (req: any, { state, emit }: any) => {
    const { id } = req.pathParams;
    const job = await stateGet<TrainingJob>(state, STATE_KEYS.TRAINING_JOB(id));

    if (!job) {
        return { status: 404, body: { error: 'Training job not found' } };
    }

    job.status = 'stopped';
    job.endTime = new Date().toISOString();
    await stateSet(state, STATE_KEYS.TRAINING_JOB(id), job);
    await emit(EVENT_NAMES.STOP_TRAINING, { jobId: id });

    return { status: 200, body: { message: 'Training job stopped' } };
};
