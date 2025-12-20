import type { EventConfig, Handlers } from 'motia';
import { EVENT_NAMES } from '../shared/state-keys';

export const config: EventConfig = {
    name: 'metrics-updater',
    type: 'event',
    subscribes: [EVENT_NAMES.METRICS_UPDATE],
    flows: ['OumiRL'],
    emits: [],
};

export const handler: Handlers['metrics-updater'] = async (req, { logger }) => {
    const metricsData = req.event.data;

    if (!metricsData.jobId) {
        logger.error('No jobId provided in metrics-update event');
        return;
    }

    // Log metrics update (in production, could broadcast via WebSocket)
    logger.debug(`Metrics update for job ${metricsData.jobId}:`, {
        step: metricsData.step,
        loss: metricsData.loss?.toFixed(4),
        reward: metricsData.reward?.toFixed(4),
        tokensPerSec: metricsData.tokensPerSecond
    });

    // In production, this would:
    // 1. Store metrics in time-series database
    // 2. Broadcast to WebSocket clients
    // 3. Update monitoring dashboards
    // 4. Trigger alerts if metrics anomalies detected
};
