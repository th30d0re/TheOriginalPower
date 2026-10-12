import {makeProject} from '@motion-canvas/core';
import part1 from './scenes/part1?scene';
import audio from './audio/part1.mp3';

export default makeProject({
  scenes: [part1],
  audio,
});
