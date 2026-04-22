import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Risk-Assessment/',
  plugins: [react()],
});
