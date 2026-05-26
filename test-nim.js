import OpenAI from 'openai';
import { fileURLToPath } from 'url';

const openai = new OpenAI({
    baseURL: "https://integrate.api.nvidia.com/v1",
    apiKey: process.env.NVIDIA_API_KEY
});

async function test() {
    try {
        const dsResponse = await openai.chat.completions.create({
            model: "meta/llama-3.3-70b-instruct",
            messages: [{ role: "user", content: "Say hello and give me a json object" }],
            max_tokens: 4096,
            temperature: 0.1,
        });
        console.log(dsResponse.choices[0]?.message?.content);
    } catch(e) {
        console.error(e);
    }
}
test();
