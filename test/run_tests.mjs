import { build } from 'vite';
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const testDir = path.resolve('test');
const tempBundle = path.join(testDir, '_temp_bundle.mjs');

async function run() {
  console.log('⚡ [1/2] Đang biên dịch Test Suite qua Vite Engine (0 external packages)...');
  
  try {
    await build({
      logLevel: 'error',
      publicDir: false,
      build: {
        ssr: true,
        write: true,
        emptyOutDir: false,
        lib: {
          entry: path.resolve('test/core_logic.test.ts'),
          formats: ['es'],
        },
        rollupOptions: {
          external: ['node:test', 'node:assert', 'node:fs', 'node:path', 'node:child_process'],
          output: {
            dir: testDir,
            entryFileNames: '_temp_bundle.mjs',
          },
        },
      },
    });

    console.log('🧪 [2/2] Thực thi Unit Tests với Node.js Native Test Runner...');
    
    const testProcess = spawn(process.execPath, ['--test', tempBundle], {
      stdio: 'inherit',
      shell: false,
    });

    testProcess.on('exit', (code) => {
      // Clean up temp bundle
      if (fs.existsSync(tempBundle)) {
        try {
          fs.unlinkSync(tempBundle);
        } catch (_) {}
      }
      process.exit(code || 0);
    });
  } catch (err) {
    console.error('Lỗi biên dịch test:', err);
    if (fs.existsSync(tempBundle)) {
      try {
        fs.unlinkSync(tempBundle);
      } catch (_) {}
    }
    process.exit(1);
  }
}

run();
