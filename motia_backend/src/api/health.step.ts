import type { ApiRouteConfig, Handlers } from 'motia';

export const config: ApiRouteConfig = {
    name: 'health',
    type: 'api',
    path: '/health',
    method: 'GET',
    flows: ['OumiRL'],
    emits: [],
};

export const handler: Handlers['health'] = async () => {
    return {
        status: 200,
        body: {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'oumi-rl-motia-backend',
            version: '1.0.0'
        }
    };
};
