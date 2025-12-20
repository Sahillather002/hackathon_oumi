import type { ApiRouteConfig } from 'motia';
import type { Evaluation } from '../shared/types';
import { STATE_KEYS, EVENT_NAMES, stateGet, stateSet } from '../shared/state-keys';
import { generateId } from '../shared/utils';

export const config: ApiRouteConfig = {
    name: 'evaluation-create',
    type: 'api',
    path: '/api/evaluation',
    method: 'POST',
    flows: ['OumiRL'],
    emits: [EVENT_NAMES.PROCESS_EVALUATION],
};

export const handler = async (req: any, { state, emit }: any) => {
    const body = req.body as any;
    const model = body.model_id || body.model;
    const judgeModel = body.judge_model || body.judgeModel;
    const prompts = body.test_prompts || body.prompts || [];
    const criteria = body.criteria || [];

    const evaluationId = generateId();
    const evaluation: Partial<Evaluation> = { id: evaluationId, model, judgeModel };

    const evalIds = await stateGet<string[]>(state, STATE_KEYS.EVALUATIONS_LIST) || [];
    evalIds.push(evaluationId);
    await stateSet(state, STATE_KEYS.EVALUATIONS_LIST, evalIds);
    await stateSet(state, STATE_KEYS.EVALUATION(evaluationId), evaluation);

    await emit(EVENT_NAMES.PROCESS_EVALUATION, { evaluationId, model, judgeModel, prompts, criteria });

    return { status: 202, body: { message: 'Evaluation started', evaluation_id: evaluationId } };
};
