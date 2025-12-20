import type { ApiRouteConfig } from 'motia';
import type { Dataset } from '../shared/types';
import { STATE_KEYS, EVENT_NAMES, stateGet, stateSet } from '../shared/state-keys';
import { generateId, getCurrentTimestamp } from '../shared/utils';

export const config: ApiRouteConfig = {
    name: 'datasets-create',
    type: 'api',
    path: '/api/datasets',
    method: 'POST',
    flows: ['OumiRL'],
    emits: [EVENT_NAMES.PROCESS_DATASET],
};

export const handler = async (req: any, { state, emit }: any) => {
    const { name, description, format } = req.body as any;

    const dataset: Dataset = {
        id: generateId(),
        name,
        description,
        format: format || 'jsonl',
        size: '0 MB',
        examples: 0,
        createdAt: getCurrentTimestamp(),
        status: 'processing'
    };

    const datasetIds = await stateGet<string[]>(state, STATE_KEYS.DATASETS_LIST) || [];
    datasetIds.push(dataset.id);
    await stateSet(state, STATE_KEYS.DATASETS_LIST, datasetIds);
    await stateSet(state, STATE_KEYS.DATASET(dataset.id), dataset);

    await emit(EVENT_NAMES.PROCESS_DATASET, { datasetId: dataset.id });

    return { status: 201, body: dataset };
};
