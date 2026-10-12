import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(readFileSync('docs/care-sessions.js','utf8'),ctx);vm.runInContext(readFileSync('docs/art.js','utf8'),ctx);
const C=ctx.window.CareSessions,A=ctx.window.ART;
const meal=C.meal('apple');for(let i=1;i<=4;i++){assert.equal(C.bite(meal),true);assert.equal(meal.bites,i);}assert.equal(C.bite(meal),false);assert.equal(meal.bites,4);
const bath=C.bath();assert.equal(C.selectTool(bath,1),false);assert.equal(C.touch(bath,-1),false);assert.equal(C.touch(bath,4),false);
for(let step=0;step<3;step++){
  assert.equal(bath.step,step);assert.equal(C.selectTool(bath,step),true);
  for(let i=0;i<4;i++){assert.equal(C.touch(bath,i),true);if(i<3){assert.equal(C.touch(bath,i),false);assert.equal(bath.step,step);}}
  assert.equal(bath.step,step+1);assert.equal(bath.tool,-1);
  if(step<2)assert.equal(C.touch(bath,0),false,'Must choose next tool before touching');
}
assert.equal(C.touch(bath,0),false);assert.equal(C.selectTool(bath,2),false);
assert.equal(C.expression({food:25,clean:80,energy:80,joy:80}),'hungry');assert.equal(C.expression({food:80,clean:30,energy:80,joy:80}),'dirty');assert.equal(C.expression({food:80,clean:80,energy:30,joy:80}),'tired');assert.equal(C.expression({food:80,clean:80,energy:80,joy:80},true),'tired');
for(let i=1;i<4;i++){assert.ok(C.growth[i].bodyH>C.growth[i-1].bodyH);assert.ok(C.growth[i].headScale<C.growth[i-1].headScale);}
for(const species of ['cat','dog','rabbit','dragon'])for(let stage=0;stage<4;stage++)for(const mood of ['happy','hungry','dirty','tired','chew','sleep']){const svg=A.pet(species,'mint',stage,mood,'scarf');assert.ok(svg.startsWith('<svg'));assert.ok(!svg.includes('undefined'));assert.ok(!svg.includes('NaN'));assert.ok(svg.includes('age-'+stage));}
assert.ok(A.pet('cat','peach',0,'hungry','none',{dirty:true}).includes('pet-dirt'));
console.log('PASS: four bites, duplicate protection, all twelve bath touches, tool order, need expressions, growth proportions and 96 species/stage/mood combinations.');
