import type { ApiRouteConfig } from 'motia';
import type { Dataset } from '../shared/types';
import { STATE_KEYS, stateGet, stateSet } from '../shared/state-keys';
import { getCurrentTimestamp } from '../shared/utils';

export const config: ApiRouteConfig = {
    name: 'datasets-list',
    type: 'api',
    path: '/api/datasets',
    method: 'GET',
    flows: ['OumiRL'],
    emits: [],
};

export const handler = async (req: any, { state }: any) => {
    const datasetIds = await stateGet<string[]>(state, STATE_KEYS.DATASETS_LIST) || [];

    const datasets: Dataset[] = [];
    for (const id of datasetIds) {
        const dataset = await stateGet<Dataset>(state, STATE_KEYS.DATASET(id));
        if (dataset) {
            datasets.push(dataset);
        }
    }

    if (datasets.length === 0) {
        const defaultDataset: Dataset = {
            id: 'python-code',
            name: 'Python Code Dataset',
            description: 'Python programming problems and solutions',
            size: '2.4 MB',
            examples: 10000,
            format: 'jsonl',
            createdAt: getCurrentTimestamp(),
            status: 'ready'
        };

        await stateSet(state, STATE_KEYS.DATASETS_LIST, [defaultDataset.id]);
        await stateSet(state, STATE_KEYS.DATASET(defaultDataset.id), defaultDataset);

        return { status: 200, body: [defaultDataset] };
    }

    return { status: 200, body: datasets };
};
