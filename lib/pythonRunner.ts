
import { spawn } from 'child_process';
import path from 'path';

/**
 * Executes a Python script from the python_backend directory.
 * 
 * Spawns a child process running the specified Python script,
 * optionally passing arguments and stdin data. The Gemini API key
 * is automatically forwarded via environment variables.
 */
export async function runPythonScript(scriptName: string, args: string[] = [], stdin?: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(process.cwd(), 'python_backend', scriptName);
        const pythonProcess = spawn('py', [scriptPath, ...args], {
            env: {
                ...process.env,
                GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
            },
        });

        let output = '';
        let errorOutput = '';

        if (stdin) {
            pythonProcess.stdin.write(stdin);
            pythonProcess.stdin.end();
        }

        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Python script exited with code ${code}: ${errorOutput}`));
            } else {
                resolve(output);
            }
        });

        pythonProcess.on('error', (err) => {
            reject(err);
        });
    });
}
