import type { ApiRouteConfig } from 'motia';

export const config: ApiRouteConfig = {
    name: 'test-simple',
    type: 'api',
    path: '/api/test',
    method: 'GET',
    flows: ['OumiRL'],
    emits: [],
};

export const handler = async () => {
    return {
        status: 200,
        body: { message: 'Test endpoint working!' }
    };
};
