
const fs = require('fs');
const path = require('path');
const Tesseract = require('tesseract.js');
const axios = require('axios');

async function testOllama() {
    console.log("Testing Ollama...");
    try {
        const start = Date.now();
        const response = await axios.post("http://localhost:11434/api/generate", {
            model: "mistral",
            prompt: "Say hello",
            stream: false
        });
        console.log(`✅ Ollama Works! Response in ${(Date.now() - start) / 1000}s:`, response.data.response.substring(0, 50));
        return true;
    } catch (error) {
        console.error("❌ Ollama Failed:", error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error("   Make sure 'ollama serve' is running!");
        }
        return false;
    }
}

async function testTesseract() {
    console.log("Testing Tesseract...");
    try {
        const start = Date.now();
        // Create a dummy image or use a real one if available. Ideally use a small sample.
        // For simplicity, we'll try to OCR a known file or skip if none locally.
        // But creating a canvas or buffer is hard without deps.
        // Let's just initialize Tesseract worker to see if it downloads data.

        const worker = await Tesseract.createWorker('eng');
        await worker.terminate();

        console.log(`✅ Tesseract Init Works! Took ${(Date.now() - start) / 1000}s`);
        return true;
    } catch (error) {
        console.error("❌ Tesseract Failed:", error);
        return false;
    }
}

(async () => {
    console.log("--- Diagnostic Start ---");
    const ollamaOk = await testOllama();
    const tesseractOk = await testTesseract();
    console.log("\n--- Summary ---");
    console.log("Ollama:", ollamaOk ? "PASS" : "FAIL");
    console.log("Tesseract:", tesseractOk ? "PASS" : "FAIL");

    if (!ollamaOk) console.log("ACTION: Run 'ollama serve' in a separate terminal.");
    if (!tesseractOk) console.log("ACTION: Check internet connection or Tesseract.js data path.");
})();
