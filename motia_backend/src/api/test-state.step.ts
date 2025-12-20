import type { ApiRouteConfig } from 'motia';

export const config: ApiRouteConfig = {
    name: 'test-state',
    type: 'api',
    path: '/api/test-state',
    method: 'GET',
    flows: ['OumiRL'],
    emits: [],
};

export const handler = async (req: any, { state }: any) => {
    try {
        // Test state operations
        await state.set('test-key', 'test-value');
        const value = await state.get('test-key');

        return {
            status: 200,
            body: {
                message: 'State test',
                setValue: 'test-value',
                getValue: value,
                stateType: typeof state,
                stateMethods: state ? Object.getOwnPropertyNames(Object.getPrototypeOf(state)) : []
            }
        };
    } catch (error: any) {
        return {
            status: 500,
            body: {
                error: error.message,
                stack: error.stack
            }
        };
    }
};
