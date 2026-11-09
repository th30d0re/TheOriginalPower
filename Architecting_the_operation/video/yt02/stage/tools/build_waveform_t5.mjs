import {execFileSync} from 'node:child_process';
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const stageDir=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const repoDir=resolve(stageDir,'../../../..');
// Use the audio the episode actually plays, and the Disclosure span from the current stage plan,
// so the waveform cannot drift when the OV is retimed. Override the audio with WAVEFORM_AUDIO.
const input=process.env.WAVEFORM_AUDIO ?? '/Users/emmanuel/Dev/Tools/scriptCast/video/public/stage/YT02v2_ov/YT02v2_ov.mp3';
const plan=JSON.parse(readFileSync(resolve(stageDir,'ov/stage_plan.json'),'utf8'));
const disclosure=plan.segments.find((segment)=>segment.scene==='Disclosure');
if(!disclosure)throw new Error('No Disclosure segment in ov/stage_plan.json');
const output=resolve(stageDir,'firstminute/data/waveform_t5.json');
const startMs=disclosure.start_ms,endMs=disclosure.end_ms,fps=30,sampleRate=48000;
const samplesPerFrame=sampleRate/fps;
const filter=`atrim=start=${startMs/1000}:end=${endMs/1000},asetpts=PTS-STARTPTS,asetnsamples=n=${samplesPerFrame}:p=1,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level:file=-`;
const text=execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-i',input,'-af',filter,'-f','null','-'],{encoding:'utf8',stdio:['ignore','pipe','pipe']});
const db=[...text.matchAll(/lavfi\.astats\.Overall\.RMS_level=(-?(?:inf|\d+(?:\.\d+)?))/g)].map(match=>match[1]==='-inf'?-120:Number(match[1]));
const expected=Math.ceil((endMs-startMs)*fps/1000);
if(db.length!==expected)throw new Error(`Expected ${expected} RMS frames, received ${db.length}`);
const rms=db.map(value=>Number(Math.pow(10,value/20).toFixed(8)));
mkdirSync(dirname(output),{recursive:true});
writeFileSync(output,JSON.stringify({start_ms:startMs,end_ms:endMs,fps,sample_rate:sampleRate,samples_per_frame:samplesPerFrame,rms},null,2)+'\n');
console.log(`wrote ${output} (${rms.length} RMS frames)`);
