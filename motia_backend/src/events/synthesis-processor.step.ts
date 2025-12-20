import type { EventConfig } from 'motia';
import type { SynthesisResult } from '../shared/types';
import { STATE_KEYS, EVENT_NAMES, stateSet } from '../shared/state-keys';
import { getCurrentTimestamp } from '../shared/utils';

export const config: EventConfig = {
    name: 'synthesis-processor',
    type: 'event',
    subscribes: [EVENT_NAMES.PROCESS_SYNTHESIS],
    flows: ['OumiRL'],
    emits: [EVENT_NAMES.SYNTHESIS_COMPLETE],
};

export const handler = async (req: any, { state, emit, logger }: any) => {
    const { synthesisId, topic, numExamples, difficulty } = req.data;

    if (!synthesisId) {
        logger.error('No synthesisId provided in process-synthesis event');
        return;
    }

    logger.info(`Processing synthesis: ${synthesisId} - Topic: ${topic}, Examples: ${numExamples}`);

    const examples = [];
    const actualExamples = Math.min(numExamples, 50);

    for (let i = 0; i < actualExamples; i++) {
        examples.push({
            prompt: `Explain ${topic} concept ${i + 1} in ${difficulty} difficulty level`,
            response: `Synthetic content about ${topic} at ${difficulty} level.`,
            topic,
            difficulty
        });
    }

    const synthesis: SynthesisResult = {
        id: synthesisId,
        topic,
        difficulty,
        numExamples: actualExamples,
        examples,
        createdAt: getCurrentTimestamp()
    };

    await stateSet(state, STATE_KEYS.SYNTHESIS(synthesisId), synthesis);
    await emit(EVENT_NAMES.SYNTHESIS_COMPLETE, { synthesisId });

    logger.info(`Synthesis ${synthesisId} completed - Generated ${actualExamples} examples`);
};
