import type { ApiRouteConfig } from 'motia';
import type { SynthesisResult } from '../shared/types';
import { STATE_KEYS, EVENT_NAMES, stateGet, stateSet } from '../shared/state-keys';
import { generateId } from '../shared/utils';

export const config: ApiRouteConfig = {
    name: 'synthesis-create',
    type: 'api',
    path: '/api/synthesis',
    method: 'POST',
    flows: ['OumiRL'],
    emits: [EVENT_NAMES.PROCESS_SYNTHESIS],
};

export const handler = async (req: any, { state, emit }: any) => {
    const body = req.body as any;
    const topic = body.topic;
    const numExamples = body.num_examples || body.numExamples || 10;
    const difficulty = body.difficulty || 'medium';
    const format = body.format || 'jsonl';
    const temperature = body.temperature || 0.7;

    const synthesisId = generateId();
    const synthesis: Partial<SynthesisResult> = { id: synthesisId, topic, difficulty, numExamples };

    const synthesisIds = await stateGet<string[]>(state, STATE_KEYS.SYNTHESIS_LIST) || [];
    synthesisIds.push(synthesisId);
    await stateSet(state, STATE_KEYS.SYNTHESIS_LIST, synthesisIds);
    await stateSet(state, STATE_KEYS.SYNTHESIS(synthesisId), synthesis);

    await emit(EVENT_NAMES.PROCESS_SYNTHESIS, { synthesisId, topic, numExamples, difficulty, format, temperature });

    return { status: 202, body: { message: 'Data synthesis started', synthesis_id: synthesisId } };
};
