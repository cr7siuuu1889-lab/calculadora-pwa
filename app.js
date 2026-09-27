const display=document.querySelector('#display'), expression=document.querySelector('#expression');
let first=0,op='',fresh=true;
let history=JSON.parse(localStorage.getItem('calcHistory')||'[]');
const fmt=n=>Number.isInteger(n)?String(n):String(Number(n.toFixed(10)));
function number(v){if(fresh||display.textContent==='0'){display.textContent=v;fresh=false}else display.textContent+=v}
function decimal(){if(fresh){display.textContent='0.';fresh=false}else if(!display.textContent.includes('.'))display.textContent+='.'}
function clearAll(){display.textContent='0';expression.textContent='';first=0;op='';fresh=true}
function back(){if(fresh)return;let s=display.textContent;display.textContent=s.length<=1?'0':s.slice(0,-1)}
function sign(){let s=display.textContent;if(s!=='0')display.textContent=s.startsWith('-')?s.slice(1):'-'+s}
function percent(){display.textContent=fmt(Number(display.textContent)/100)}
function operation(v){first=Number(display.textContent);op=v;expression.textContent=fmt(first)+' '+v;fresh=true}
function equal(){if(!op)return;let b=Number(display.textContent),r;if(op==='+')r=first+b;else if(op==='−')r=first-b;else if(op==='×')r=first*b;else {if(b===0){display.textContent='Error';fresh=true;op='';return}r=first/b}let line=fmt(first)+' '+op+' '+fmt(b)+' = '+fmt(r);history.unshift(line);history=history.slice(0,50);localStorage.setItem('calcHistory',JSON.stringify(history));expression.textContent=line;display.textContent=fmt(r);op='';fresh=true}
document.querySelectorAll('.keys button').forEach(b=>b.addEventListener('click',()=>{let a=b.dataset.action,v=b.dataset.value;if(a==='clear')clearAll();else if(a==='back')back();else if(a==='sign')sign();else if(a==='percent')percent();else if(a==='equal')equal();else if(v==='.')decimal();else if('+-−×÷'.includes(v))operation(v);else number(v)}));
const modal=document.querySelector('#history');
function showHistory(){const list=document.querySelector('#historyList');list.innerHTML=history.length?history.map(x=>`<div class="item">${x}</div>`).join(''):'<p>No hay operaciones.</p>';modal.classList.remove('hidden')}
document.querySelector('#historyBtn').onclick=showHistory;document.querySelector('#closeHistory').onclick=()=>modal.classList.add('hidden');
document.querySelector('#clearHistory').onclick=()=>{history=[];localStorage.removeItem('calcHistory');showHistory()};
let deferred;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;document.querySelector('#install').hidden=false});
document.querySelector('#install').onclick=async()=>{if(deferred){deferred.prompt();deferred=null}};
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js');
