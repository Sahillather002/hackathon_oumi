import type { EventConfig } from 'motia';
import type { Dataset } from '../shared/types';
import { STATE_KEYS, stateGet, stateSet } from '../shared/state-keys';

export const config: EventConfig = {
    name: 'dataset-processor',
    type: 'event',
    subscribes: ['process-dataset'],
    flows: ['OumiRL'],
    emits: [],
};

export const handler = async (req: any, { state, logger }: any) => {
    const { datasetId } = req.data;

    if (!datasetId) {
        logger.error('No datasetId provided in process-dataset event');
        return;
    }

    logger.info(`Processing dataset: ${datasetId}`);

    const dataset = await stateGet<Dataset>(state, STATE_KEYS.DATASET(datasetId));

    if (!dataset) {
        logger.error(`Dataset ${datasetId} not found in state`);
        return;
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    dataset.status = 'ready';
    dataset.size = `${(Math.random() * 9 + 1).toFixed(1)} MB`;
    dataset.examples = Math.floor(Math.random() * 49000) + 1000;

    await stateSet(state, STATE_KEYS.DATASET(datasetId), dataset);

    logger.info(`Dataset ${datasetId} processed successfully - ${dataset.examples} examples, ${dataset.size}`);
};
