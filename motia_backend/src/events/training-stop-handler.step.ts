import type { EventConfig, Handlers } from 'motia';
import type { TrainingJob } from '../shared/types';
import { STATE_KEYS, EVENT_NAMES } from '../shared/state-keys';

export const config: EventConfig = {
    name: 'training-stop-handler',
    type: 'event',
    subscribes: [EVENT_NAMES.STOP_TRAINING],
    flows: ['OumiRL'],
    emits: [],
};

export const handler: Handlers['training-stop-handler'] = async (req, { state, logger }) => {
    const { jobId } = req.event.data;

    if (!jobId) {
        logger.error('No jobId provided in stop-training event');
        return;
    }

    logger.info(`Stopping training job: ${jobId}`);

    const job = await state.get<TrainingJob>(STATE_KEYS.TRAINING_JOB(jobId));

    if (!job) {
        logger.error(`Training job ${jobId} not found`);
        return;
    }

    // Job status is already updated by the API endpoint
    // This handler could be used for cleanup or stopping actual training processes
    logger.info(`Training job ${jobId} stop confirmed`);
};
