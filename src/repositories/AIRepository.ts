import axios from 'axios';
import dotenv from 'dotenv';

interface AIFlashCardItem {
    front_text: string;
    back_text: string;
}

interface AIFlashCardResponse {
    [key: string]: AIFlashCardItem;
}

dotenv.config();

export class AIRepository {
    handleRequest = async (quantity: number, level: string, topic: string): Promise<any> => {
        const payload = {
            model: process.env.AI_MODEL,
            prompt: `Generate ${quantity} flashcards for the topic "${topic}" at the "${level}" level.
                        Provide the response as a single JSON array. Each element in the array should be a JSON object containing two keys: "front_text" (for the question or term) and "back_text" (for the answer or definition).

                        Example of one flashcard object: {"front_text": "Term/Question", "back_text": "Definition/Answer"}`,
            stream: false,
            format: 'json',
            temperature: 1,
        };

        try {
            const response = await axios.post(`${process.env.AI_SERVER_URL}`, payload);
            const parsedResponse = JSON.parse(response.data?.response);
            return parsedResponse;
        } catch (error) {
            console.error('Error in AIRepository.handleRequest:', error);
            throw new Error('Error communicating with AI server');
        }
    };

    postProcessResponse = (inputResponse: any): AIFlashCardItem[] => {
        if (!inputResponse) throw new Error('Empty response from AI server');

        if (Array.isArray(inputResponse)) {
            return inputResponse
                .filter(
                    (item) =>
                        item &&
                        typeof item === 'object' &&
                        'front_text' in item &&
                        'back_text' in item
                )
                .map((item) => ({
                    front_text: (item as AIFlashCardItem).front_text,
                    back_text: (item as AIFlashCardItem).back_text,
                }));
        }

        if (typeof inputResponse === 'object') {
            return Object.values(inputResponse)
                .filter(
                    (item) =>
                        item &&
                        typeof item === 'object' &&
                        'front_text' in item &&
                        'back_text' in item
                )
                .map((item) => ({
                    front_text: (item as AIFlashCardItem).front_text,
                    back_text: (item as AIFlashCardItem).back_text,
                }));
        }

        throw new Error('Unsupported response format from AI server');
    };
}
