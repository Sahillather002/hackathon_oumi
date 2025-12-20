// State keys with group IDs for Motia state API
// Motia state.set/get requires: state.set(groupId, key, value) and state.get(groupId, key)

export const EVENT_NAMES = {
    START_TRAINING: 'start-training',
    STOP_TRAINING: 'stop-training',
    TRAINING_COMPLETE: 'training-complete',
    METRICS_UPDATE: 'metrics-update',
    PROCESS_DATASET: 'process-dataset',
    DATASET_COMPLETE: 'dataset-complete',
    PROCESS_EVALUATION: 'process-evaluation',
    EVALUATION_COMPLETE: 'evaluation-complete',
    PROCESS_SYNTHESIS: 'process-synthesis',
    SYNTHESIS_COMPLETE: 'synthesis-complete',
} as const;

// State groups and keys
export const STATE_GROUPS = {
    MODELS: 'models',
    DATASETS: 'datasets',
    TRAINING: 'training',
    EVALUATIONS: 'evaluations',
    SYNTHESIS: 'synthesis',
} as const;

export const STATE_KEYS = {
    // Models - group: 'models'
    MODELS_LIST: { group: 'models', key: 'list' },
    MODEL: (id: string) => ({ group: 'models', key: id }),

    // Datasets - group: 'datasets'
    DATASETS_LIST: { group: 'datasets', key: 'list' },
    DATASET: (id: string) => ({ group: 'datasets', key: id }),

    // Training - group: 'training'
    TRAINING_JOBS_LIST: { group: 'training', key: 'jobs-list' },
    TRAINING_JOB: (id: string) => ({ group: 'training', key: `job-${id}` }),
    TRAINING_METRICS: (jobId: string) => ({ group: 'training', key: `metrics-${jobId}` }),

    // Evaluations - group: 'evaluations'
    EVALUATIONS_LIST: { group: 'evaluations', key: 'list' },
    EVALUATION: (id: string) => ({ group: 'evaluations', key: id }),

    // Synthesis - group: 'synthesis'
    SYNTHESIS_LIST: { group: 'synthesis', key: 'list' },
    SYNTHESIS: (id: string) => ({ group: 'synthesis', key: id }),
} as const;

// Helper functions for state operations
export const stateGet = async <T>(state: any, keyObj: { group: string; key: string }): Promise<T | null> => {
    return await state.get(keyObj.group, keyObj.key);
};

export const stateSet = async (state: any, keyObj: { group: string; key: string }, value: any): Promise<void> => {
    await state.set(keyObj.group, keyObj.key, value);
};
