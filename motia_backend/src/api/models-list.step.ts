import type { ApiRouteConfig } from 'motia';
import type { Model } from '../shared/types';
import { STATE_KEYS, stateGet, stateSet } from '../shared/state-keys';

export const config: ApiRouteConfig = {
    name: 'models-list',
    type: 'api',
    path: '/api/models',
    method: 'GET',
    flows: ['OumiRL'],
    emits: [],
};

export const handler = async (req: any, { state }: any) => {
    const modelIds = await stateGet<string[]>(state, STATE_KEYS.MODELS_LIST) || [];

    const models: Model[] = [];
    for (const id of modelIds) {
        const model = await stateGet<Model>(state, STATE_KEYS.MODEL(id));
        if (model) {
            models.push(model);
        }
    }

    // Initialize with defaults if empty
    if (models.length === 0) {
        const defaultModels: Model[] = [
            {
                id: 'gpt2-small',
                name: 'GPT-2 Small',
                size: '124M',
                description: 'Small, fast, perfect for testing and prototyping',
                parameters: '124 million',
                recommended: true
            },
            {
                id: 'gpt2-medium',
                name: 'GPT-2 Medium',
                size: '355M',
                description: 'Good balance of size and performance',
                parameters: '355 million',
                recommended: false
            },
            {
                id: 'gpt2-large',
                name: 'GPT-2 Large',
                size: '774M',
                description: 'Larger model with better performance',
                parameters: '774 million',
                recommended: false
            },
            {
                id: 'llama-2-7b',
                name: 'Llama 2 7B',
                size: '7B',
                description: 'Meta\'s Llama 2 model, excellent for fine-tuning',
                parameters: '7 billion',
                recommended: true
            }
        ];

        const ids = defaultModels.map(m => m.id);
        await stateSet(state, STATE_KEYS.MODELS_LIST, ids);
        for (const model of defaultModels) {
            await stateSet(state, STATE_KEYS.MODEL(model.id), model);
        }

        return { status: 200, body: defaultModels };
    }

    return { status: 200, body: models };
};
