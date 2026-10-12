import vm from 'node:vm';import {readFileSync} from 'node:fs';import assert from 'node:assert/strict';
const ctx={window:{}};vm.createContext(ctx);for(const f of ['experience.js','model.js','care-sessions.js','art.js'])vm.runInContext(readFileSync('docs/'+f,'utf8'),ctx);
const X=ctx.window.PetExperience,M=ctx.window.PetModel,A=ctx.window.ART;
let s=M.fresh();s.pet='dragon';s.name='Dragui';assert.equal(s.tutorial.step,0);assert.equal(s.tutorial.active,true);
M.care(s,'bath');assert.equal(s.tutorial.step,0,'Out of order care does not skip lesson');
for(const [i,care]of ['love','food','bath','play','sleep'].entries()){M.care(s,care);assert.equal(s.tutorial.step,i+1);if(i<4)assert.equal(s.tutorial.active,true);}
assert.equal(s.tutorial.active,false);M.care(s,'sleep');assert.equal(s.tutorial.step,5);
let legacy=M.normalize({version:1,pet:'dragon',name:'Dragui',day:4,caredDays:3,needs:{food:62},settings:{duration:600},stickers:['food']});assert.equal(legacy.name,'Dragui');assert.equal(legacy.caredDays,3);assert.equal(legacy.tutorial.active,false);assert.equal(legacy.settings.duration,600);assert.equal(legacy.decor.rug,'honey');
assert.equal(X.setDecor(s,'rug','mint'),true);assert.equal(X.setDecor(s,'bed','peach'),true);assert.equal(X.setDecor(s,'ornament','rainbow'),true);assert.equal(X.setDecor(s,'unknown','bad'),false);assert.equal(X.setDecor(s,'rug','<script>'),false);
const ritual=X.ritual();assert.equal(X.lightsOff(ritual),false);assert.equal(X.tuck(ritual),false);assert.equal(X.choosePlush(s,ritual,'bad'),false);assert.equal(X.choosePlush(s,ritual,'bunny'),true);assert.equal(X.chooseBlanket(s,ritual,'hearts'),true);assert.equal(X.lightsOff(ritual),false);assert.equal(X.tuck(ritual),true);assert.equal(X.lightsOff(ritual),true);assert.equal(X.lightsOff(ritual),false);
assert.equal(X.discover(s,'duck'),true);assert.equal(X.discover(s,'duck'),false);assert.equal(X.discover(s,'bad'),false);
const restored=M.normalize(JSON.parse(JSON.stringify(s)));assert.equal(restored.decor.rug,'mint');assert.equal(restored.decor.bed,'peach');assert.equal(restored.decor.ornament,'rainbow');assert.equal(restored.bedtime.plush,'bunny');assert.equal(restored.bedtime.blanket,'hearts');assert.equal(restored.discoveries.length,1);assert.equal(restored.tutorial.step,5);
const bad=M.normalize({version:1,pet:'cat',name:'Mimo',tutorial:{step:999,active:true},decor:{rug:'bad',bed:'bad'},bedtime:{plush:'bad'},discoveries:['bad','duck','duck']});assert.equal(bad.tutorial.step,5);assert.equal(bad.tutorial.active,false);assert.equal(bad.decor.rug,'honey');assert.equal(bad.bedtime.plush,'bear');assert.equal(bad.discoveries.length,1);
for(const species of ['cat','dog','rabbit','dragon'])assert.ok(X.personalities[species].gesture);
for(const room of ['garden','kitchen','bath','bedroom']){const svg=X.decorate(A.room(room),{...s,room});assert.ok(svg.includes('🌈'));assert.ok(!svg.includes('undefined'));assert.ok(svg.endsWith('</svg>'));}
assert.equal(Object.values(X.surprises).flat().length,8);
assert.ok(!X.preview(A.room('bedroom'),s).includes('data-scene-action'));
console.log('PASS: lesson order, completion and legacy migration; decoration validation and restoration; bedtime ordering; unique discoveries; four personalities and eight room surprises.');
