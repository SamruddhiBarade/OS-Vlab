import { execSync } from 'child_process';
import path from 'path';
import fileURLToPath from 'url';

console.log("Executing npm install via Node child_process...");
try {
  const output = execSync('npm.cmd install --no-audit --no-fund', {
    encoding: 'utf-8',
    cwd: process.cwd(),
    env: { ...process.env, CI: 'true' }
  });
  console.log("NPM Output:", output);
} catch (err) {
  console.error("NPM Error:", err.message);
  if (err.stdout) console.log("Stdout:", err.stdout);
  if (err.stderr) console.error("Stderr:", err.stderr);
}
