import {defineConfig} from 'vite';
import motionCanvasPlugin from '@motion-canvas/vite-plugin';
import ffmpegPlugin from '@motion-canvas/ffmpeg';

// Both packages ship CommonJS; under Node's ESM loader the factory sits on `.default`.
const motionCanvas = ((motionCanvasPlugin as any).default ?? motionCanvasPlugin) as typeof motionCanvasPlugin;
const ffmpeg = ((ffmpegPlugin as any).default ?? ffmpegPlugin) as typeof ffmpegPlugin;

export default defineConfig({
  plugins: [motionCanvas({project: ['./src/part1.ts']}), ffmpeg()],
});
