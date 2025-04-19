import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], // ضيف الـ React plugin هنا
  server: {
    host: '0.0.0.0', // بيخلي السيرفر يشتغل على كل الواجهات
    port: 5173,      // المنفذ بتاعك
    allowedHosts: [
      '.loca.lt', // الـ host بتاع localtunnel
    ],
  },
});