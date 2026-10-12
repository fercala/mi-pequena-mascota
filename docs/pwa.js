'use strict';
(() => {
 const install=document.querySelector('#installGame'),status=document.querySelector('#offlineStatus'),update=document.querySelector('#updateGame'),help=document.querySelector('#installHelp');
 let prompt=null,registration=null,updating=false;
 function showHelp(){help.showModal();window.dispatchEvent(new CustomEvent('pet-install-help',{detail:true}));}
 help.addEventListener('close',()=>window.dispatchEvent(new CustomEvent('pet-install-help',{detail:false})));
 const standalone=()=>window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
 function sync(){install.hidden=standalone();}
 sync();window.addEventListener('appinstalled',()=>{prompt=null;sync();install.hidden=true;});
 window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();prompt=event;install.textContent='📲 Instalar el juego';});
 install.addEventListener('click',async()=>{if(prompt){const event=prompt;prompt=null;try{await event.prompt();await event.userChoice;}catch{showHelp();}sync();}else showHelp();});
 document.querySelector('#closeInstallHelp').addEventListener('click',()=>help.close());
 function waiting(){if(registration?.waiting){update.hidden=false;update.textContent='✨ Hay una actualización';}}
 update.addEventListener('click',()=>{if(!registration?.waiting)return;window.dispatchEvent(new Event('pet-before-update'));updating=true;update.disabled=true;registration.waiting.postMessage({type:'SKIP_WAITING'});});
 if('serviceWorker' in navigator&&window.isSecureContext){
   status.textContent='Preparando el juego sin conexión…';
   navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'}).then(reg=>{
     registration=reg;waiting();
     reg.addEventListener('updatefound',()=>{const worker=reg.installing;if(worker)worker.addEventListener('statechange',()=>{if(worker.state==='installed')waiting();});});
     navigator.serviceWorker.ready.then(()=>{status.textContent='✓ Juego preparado para jugar sin conexión';});
   }).catch(()=>{status.textContent='Abre el juego con conexión para preparar el modo sin internet.';});
   navigator.serviceWorker.addEventListener('controllerchange',()=>{if(updating)window.location.reload();});
 }else status.textContent='Puedes jugar desde el navegador. La instalación requiere una conexión HTTPS compatible.';
})();
