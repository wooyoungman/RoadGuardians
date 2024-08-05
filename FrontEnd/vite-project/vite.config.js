import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
<<<<<<< HEAD
=======
import dotenv from 'dotenv';

dotenv.config();
>>>>>>> FrontEnd_mingyeong

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.PNG', '**/*.png']
})
