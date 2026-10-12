import vm from 'node:vm';import assert from 'node:assert/strict';import {readFileSync,existsSync} from 'node:fs';
const manifest=JSON.parse(readFileSync('docs/manifest.webmanifest','utf8')),html=readFileSync('docs/index.html','utf8'),sw=readFileSync('docs/sw.js','utf8');
assert.equal(manifest.display,'standalone');assert.equal(manifest.start_url,'./');assert.equal(manifest.scope,'./');assert.ok(html.includes('rel="manifest"'));assert.ok(html.includes('apple-touch-icon'));
for(const icon of manifest.icons){const data=readFileSync('docs/'+icon.src),[w,h]=icon.sizes.split('x').map(Number);assert.equal(data.readUInt32BE(16),w);assert.equal(data.readUInt32BE(20),h);assert.equal(data.toString('hex',0,8),'89504e470d0a1a0a');}
const apple=readFileSync('docs/icons/apple-touch-icon.png');assert.equal(apple.readUInt32BE(16),180);
const base='https://fercala.github.io/mi-pequena-mascota/',events={},buckets=new Map();let requests=0,claims=0,skip=0;
const self={registration:{scope:base},location:{href:base+'sw.js'},clients:{claim:async()=>claims++},skipWaiting:()=>skip++,addEventListener:(kind,handler)=>events[kind]=handler};
const caches={open:async key=>{if(!buckets.has(key))buckets.set(key,new Map());const b=buckets.get(key);return{addAll:async files=>{for(const url of files){assert.ok(url.startsWith(base));const rel=url.slice(base.length);assert.ok(existsSync('docs/'+rel),rel+' must exist');b.set(url,new Response(readFileSync('docs/'+rel)));}},match:async url=>b.get(typeof url==='string'?url:url.url)?.clone()};},keys:async()=>[...buckets.keys()],delete:async key=>buckets.delete(key)};
vm.runInNewContext(sw,{self,caches,URL,Set,fetch:async()=>{requests++;throw new Error('offline');}});
let pending;events.install({waitUntil:p=>pending=p});await pending;const cacheKey=[...buckets.keys()][0];assert.ok(buckets.get(cacheKey).size>=20);
const foreign='mi-mascota:https://fercala.github.io/another-game/:old',old='mi-mascota:'+base+':old';buckets.set(foreign,new Map());buckets.set(old,new Map());events.activate({waitUntil:p=>pending=p});await pending;assert.equal(claims,1);assert.equal(buckets.has(old),false);assert.equal(buckets.has(foreign),true);
async function route(path,mode='cors',method='GET'){let response;events.fetch({request:{url:path,mode,method},respondWith:p=>response=p});return response?await response:undefined;}
for(const url of [base,base+'?install=1',base+'index.html'])assert.ok((await(await route(url,'navigate')).text()).includes('Mi Pequeña Mascota'));
for(const file of ['game.js','pwa.js','adventures.js','style.css','manifest.webmanifest','icons/icon-192.png'])assert.equal((await route(base+file+'?v=1')).status,200);
assert.equal(requests,0,'All game files are served when network is unavailable');assert.equal(await route('https://fercala.github.io/another-game/','navigate'),undefined);assert.equal(await route('https://example.com/api'),undefined);assert.equal(await route(base+'missing.png'),undefined);assert.equal(await route(base,'navigate','POST'),undefined);
events.message({data:{type:'SKIP_WAITING'}});assert.equal(skip,1);assert.ok(!sw.includes('localStorage'));
console.log('PASS: install manifest and PNG sizes; complete precache; offline navigation/assets at GitHub repository path; app-scoped cache cleanup; explicit safe updates.');
