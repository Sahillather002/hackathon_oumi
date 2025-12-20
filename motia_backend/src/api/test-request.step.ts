import type { ApiRouteConfig } from 'motia';

export const config: ApiRouteConfig = {
    name: 'test-request',
    type: 'api',
    path: '/api/test-req',
    method: 'GET',
    flows: ['OumiRL'],
    emits: [],
};

export const handler = async (req: any, context: any) => {
    return {
        status: 200,
        body: {
            message: 'Request test',
            hasUrl: !!req?.url,
            hasQuery: !!req?.query,
            hasParams: !!req?.params,
            hasPathParams: !!req?.pathParams,
            hasBody: !!req?.body,
            contextKeys: context ? Object.keys(context) : [],
            reqKeys: req ? Object.keys(req) : []
        }
    };
};
