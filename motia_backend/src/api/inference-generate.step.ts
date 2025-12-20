import type { ApiRouteConfig } from 'motia';

export const config: ApiRouteConfig = {
    name: 'inference-generate',
    type: 'api',
    path: '/api/generate',
    method: 'POST',
    flows: ['OumiRL'],
    emits: [],
};

export const handler = async (req: any, { logger }: any) => {
    const { model, prompt, temperature = 0.7, max_tokens = 200 } = req.body || {};

    logger.info(`Generating response for model ${model} with prompt: ${prompt.substring(0, 50)}...`);

    // In a real scenario, this would call an LLM (running locally or via API)
    // For this hackathon, we'll simulate a higher quality response than the frontend mock

    const responses: Record<string, string> = {
        'gpt2-base': `This is a generated response from the base GPT-2 model. It's fast but might be less precise than fine-tuned versions.
        Prompt: ${prompt}`,
        'gpt2-python': `This is a response from the GPT-2 model fine-tuned on Python code.
        Based on your prompt "${prompt}", here is a code-focused snippet:
        
        def solution():
            # Implementation details
            pass`,
        'llama-2-chat': `Hello! I am a Llama-2 chat model. How can I help you today?
        You asked about: ${prompt}`
    };

    const responseText = responses[model] || `Generated response for ${model}: ${prompt}.`;

    return {
        status: 200,
        body: {
            text: responseText,
            tokens: Math.floor(responseText.length / 4) + 10,
            time: Math.floor(Math.random() * 1500) + 200
        }
    };
};
