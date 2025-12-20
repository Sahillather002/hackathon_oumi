import type { EventConfig } from 'motia';
import type { Evaluation } from '../shared/types';
import { STATE_KEYS, EVENT_NAMES, stateSet } from '../shared/state-keys';
import { getCurrentTimestamp } from '../shared/utils';

export const config: EventConfig = {
    name: 'evaluation-processor',
    type: 'event',
    subscribes: [EVENT_NAMES.PROCESS_EVALUATION],
    flows: ['OumiRL'],
    emits: [EVENT_NAMES.EVALUATION_COMPLETE],
};

export const handler = async (req: any, { state, emit, logger }: any) => {
    const { evaluationId, model, judgeModel, prompts, criteria } = req.data;

    if (!evaluationId) {
        logger.error('No evaluationId provided in process-evaluation event');
        return;
    }

    logger.info(`Processing evaluation: ${evaluationId}`);

    const evaluation: Evaluation = {
        id: evaluationId,
        model,
        judgeModel,
        overallScore: Math.random() * 3 + 7,
        criteria: {
            helpfulness: Math.random() * 3 + 7,
            accuracy: Math.random() * 3 + 7,
            safety: Math.random() * 2 + 8,
            clarity: Math.random() * 3 + 6,
            completeness: Math.random() * 3 + 6
        },
        examples: (prompts || []).slice(0, 3).map((prompt: string, index: number) => ({
            prompt,
            response: `Simulated response to: ${prompt.substring(0, 50)}...`,
            score: Math.random() * 3 + 7,
            feedback: `Simulated feedback for response ${index + 1}.`
        })),
        createdAt: getCurrentTimestamp()
    };

    await stateSet(state, STATE_KEYS.EVALUATION(evaluationId), evaluation);
    await emit(EVENT_NAMES.EVALUATION_COMPLETE, { evaluationId });

    logger.info(`Evaluation ${evaluationId} completed - Overall score: ${evaluation.overallScore.toFixed(2)}`);
};
