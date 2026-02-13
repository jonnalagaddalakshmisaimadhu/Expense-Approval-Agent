
import axios from 'axios';

const SCALEDOWN_API_KEY = process.env.SCALEDOWN_API_KEY;
const SCALEDOWN_ENDPOINT = "https://api.scaledown.xyz/compress/raw/"; // Based on search result

export async function compressPolicy(policyText: string) {
    try {
        // Scaledown API call
        // Assuming POST with text body or specific JSON structure.
        // Based on "compress/raw", it likely takes raw text or a JSON with "text" field.
        // I'll try standard JSON payload.
        const response = await axios.post(
            SCALEDOWN_ENDPOINT,
            {
                text: policyText,
                level: "high" // Hypothetical parameter, or default
            },
            {
                headers: {
                    'Authorization': `Bearer ${SCALEDOWN_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // If API returns compressed text directly or in a field
        return response.data.compressedText || response.data.text || response.data;
    } catch (error) {
        console.error("Scaledown compression failed, using original text:", error);
        return policyText; // Fallback to original if compression fails
    }
}
