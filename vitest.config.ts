import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'datastore',
    setupFiles: ['./test/network-guard.ts'],
  },
});
