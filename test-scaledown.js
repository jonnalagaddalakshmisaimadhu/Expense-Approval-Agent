
const axios = require('axios');

const SCALEDOWN_API_KEY = "OuT9qqPbVZ6Xwz7Pl3UzX1ZONarluk1T5guaLGth";
const SCALEDOWN_ENDPOINT = "https://api.scaledown.xyz/compress/raw/";

async function testScaledown() {
    try {
        console.log("Testing Scaledown API...");
        const response = await axios.post(
            SCALEDOWN_ENDPOINT,
            {
                text: "This is a long test string to see if the compression API is actually working and returning a shorter version.",
                level: "high"
            },
            {
                headers: {
                    'Authorization': `Bearer ${SCALEDOWN_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log("Success!");
        console.log("Response data:", response.data);
    } catch (error) {
        console.error("Failed!");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error("Error:", error.message);
        }
    }
}

testScaledown();
