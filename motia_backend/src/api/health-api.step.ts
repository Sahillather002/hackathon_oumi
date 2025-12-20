import type { ApiRouteConfig, Handlers } from 'motia';

export const config: ApiRouteConfig = {
    name: 'health-api',
    type: 'api',
    path: '/api/health',
    method: 'GET',
    flows: ['OumiRL'],
    emits: [],
};

export const handler: Handlers['health-api'] = async () => {
    return {
        status: 200,
        body: {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'motia-backend',
            version: '1.0.0'
        }
    };
};
