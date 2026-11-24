/* Candy Pop Party UI: rendering, input, screens, saved progress. */
{
const $=s=>document.querySelector(s);
const STAR='<path d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.5l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9z"/>';
const starSvg=(on,cls='')=>`<svg viewBox="0 0 24 24" class="${cls}" fill="${on?'#ffd23f':'rgba(255,255,255,.4)'}" stroke="${on?'#e89b00':'rgba(150,40,90,.35)'}" stroke-width="1.4" stroke-linejoin="round">${STAR}</svg>`;
const LOCK='<svg class="i" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="3"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>';
const CHECK='<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

const COLORS=[
  {base:'#ff3b5c',light:'#ffb0bf',dark:'#b0002a',name:'hearts'},
  {base:'#2e8bff',light:'#a8d0ff',dark:'#004fc0',name:'blue drops'},
  {base:'#ffd21f',light:'#fff3a8',dark:'#c28c00',name:'stars'},
  {base:'#38c94b',light:'#b0f5b8',dark:'#16852a',name:'green squares'},
  {base:'#ff8a1f',light:'#ffd0a0',dark:'#b25000',name:'orange gumballs'},
  {base:'#a55bff',light:'#dcc0ff',dark:'#6a1fc9',name:'purple gems'}];


/* ---------- candy sprites ---------- */
function shapePath(g,k,R){
  g.beginPath();
  if(k===0){g.moveTo(0,-.35*R);g.bezierCurveTo(-.2*R,-.98*R,-1.08*R,-.78*R,-.97*R,-.12*R);g.bezierCurveTo(-.9*R,.32*R,-.38*R,.58*R,0,.92*R);
    g.bezierCurveTo(.38*R,.58*R,.9*R,.32*R,.97*R,-.12*R);g.bezierCurveTo(1.08*R,-.78*R,.2*R,-.98*R,0,-.35*R);}
  else if(k===4){g.arc(0,0,.9*R,0,Math.PI*2);}
  else if(k===2){for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,d=i%2?.5*R:1.02*R;g.lineTo(Math.cos(a)*d,Math.sin(a)*d+.06*R);}}
  else if(k===3){const s=.8*R,q=.34*R;g.moveTo(-s+q,-s);g.arcTo(s,-s,s,s,q);g.arcTo(s,s,-s,s,q);g.arcTo(-s,s,-s,-s,q);g.arcTo(-s,-s,s,-s,q);}
  else if(k===1){g.moveTo(0,-.98*R);g.bezierCurveTo(.3*R,-.55*R,.84*R,-.1*R,.84*R,.32*R);g.bezierCurveTo(.84*R,.76*R,.46*R,.96*R,0,.96*R);
    g.bezierCurveTo(-.46*R,.96*R,-.84*R,.76*R,-.84*R,.32*R);g.bezierCurveTo(-.84*R,-.1*R,-.3*R,-.55*R,0,-.98*R);}
  else{for(let i=0;i<6;i++){const a=-Math.PI/2+i*Math.PI/3;g.lineTo(Math.cos(a)*.98*R,Math.sin(a)*.98*R);}}
  g.closePath();
}
function makeSprite(k,sp,S){
  const cv=document.createElement('canvas');cv.width=cv.height=S;const g=cv.getContext('2d');g.translate(S/2,S/2);
  let R=S*.4;
  if(sp==='bomb'){
    g.beginPath();g.arc(0,R*.1,R*.95,0,7);g.fillStyle='rgba(60,0,30,.3)';g.fill();
    g.beginPath();g.arc(0,0,R*.95,0,7);const gr=g.createRadialGradient(-R*.3,-R*.35,R*.1,0,0,R);
    gr.addColorStop(0,'#9a6440');gr.addColorStop(.6,'#4f2814');gr.addColorStop(1,'#2a1208');g.fillStyle=gr;g.fill();
    let seed=11;const rnd=()=>(seed=(seed*9301+49297)%233280)/233280;const cols=COLORS.map(c=>c.base).concat('#fff');
    g.lineCap='round';g.lineWidth=R*.13;
    for(let i=0;i<18;i++){const a=rnd()*6.28,d=Math.sqrt(rnd())*R*.72,x=Math.cos(a)*d,y=Math.sin(a)*d,t=rnd()*3.14;
      g.strokeStyle=cols[i%cols.length];g.beginPath();g.moveTo(x-Math.cos(t)*R*.11,y-Math.sin(t)*R*.11);g.lineTo(x+Math.cos(t)*R*.11,y+Math.sin(t)*R*.11);g.stroke();}
    g.beginPath();g.ellipse(-R*.3,-R*.45,R*.32,R*.15,-.5,0,7);g.fillStyle='rgba(255,255,255,.4)';g.fill();
    return cv;
  }
  const col=COLORS[k];
  if(sp==='wrap'){
    for(const s of[-1,1]){g.beginPath();g.moveTo(s*R*.6,0);g.lineTo(s*R*1.2,-R*.52);g.quadraticCurveTo(s*R*1.05,0,s*R*1.2,R*.52);g.closePath();
      g.fillStyle=col.base;g.fill();g.lineWidth=S*.022;g.strokeStyle=col.dark;g.stroke();}
    R*=.86;
  }
  g.save();g.translate(0,R*.1);shapePath(g,k,R);g.fillStyle='rgba(60,0,30,.28)';g.fill();g.restore();
  shapePath(g,k,R);
  const gr=g.createRadialGradient(-R*.35,-R*.42,R*.08,0,0,R*1.15);
  gr.addColorStop(0,col.light);gr.addColorStop(.48,col.base);gr.addColorStop(1,col.dark);
  g.fillStyle=gr;g.fill();g.lineJoin='round';g.lineWidth=Math.max(1,S*.024);g.strokeStyle=col.dark;g.stroke();
  if(sp==='h'||sp==='v'){g.save();shapePath(g,k,R);g.clip();g.fillStyle='rgba(255,255,255,.88)';const w=R*.17;
    for(let i=-3;i<=3;i++){const o=i*R*.42;if(sp==='h')g.fillRect(-R*1.3,o-w/2,R*2.6,w);else g.fillRect(o-w/2,-R*1.3,w,R*2.6);}g.restore();
    shapePath(g,k,R);g.stroke();}
  g.save();shapePath(g,k,R);g.clip();g.beginPath();g.ellipse(-R*.24,-R*.44,R*.42,R*.19,-.5,0,7);g.fillStyle='rgba(255,255,255,.6)';g.fill();g.restore();
  if(sp==='wrap'){g.setLineDash([S*.045,S*.035]);g.lineWidth=S*.035;g.strokeStyle='rgba(255,255,255,.95)';shapePath(g,k,R*.62);g.stroke();}
  return cv;
}
const ICON=COLORS.map((_,k)=>makeSprite(k,'n',96).toDataURL());

/* ---------- state ---------- */
const cv=$('#cv'),ctx=cv.getContext('2d');
let S=null,LI=0,vis=new Map(),view=null,busy=false,mode=null,sel=null,drag=null,extraUsed=false;
let boosters={hammer:3,shuffle:2},cs=40,ox=0,oy=0,W=0,H=0,dpr=1,sprites={},spriteSize=0,SPEED=1;
let hudScore=0,hudMoves=0,litStars=0;
const fxs=[],parts=[],texts=[],tweens=[];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;

const KEY='candy-pop-party-v1';
let prog={unlocked:1,stars:Array(LEVELS.length).fill(0),best:Array(LEVELS.length).fill(0)};
try{const d=JSON.parse(localStorage.getItem(KEY)||'null');if(d&&Array.isArray(d.stars))prog=Object.assign(prog,d);}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(prog));}catch(e){}};
const fmt=n=>n.toLocaleString('en-US');

/* ---------- tweening ---------- */
const E={out:u=>1-(1-u)**3,inq:u=>u*u,back:u=>{const c=1.9;return 1+(c+1)*(u-1)**3+c*(u-1)**2;},
  drop:u=>{if(u<.82){const v=u/.82;return v*v;}const v=(u-.82)/.18;return 1-Math.sin(v*Math.PI)*.07;}};
function tw(o,to,dur,ease=E.out){return new Promise(res=>{const from={};for(const k in to)from[k]=o[k];tweens.push({o,from,to,dur:Math.max(1,dur/SPEED),t0:performance.now(),ease,res});});}
const wait=ms=>new Promise(r=>setTimeout(r,ms/SPEED));
function updTweens(t){for(let i=tweens.length-1;i>=0;i--){const w=tweens[i],u=Math.min(1,Math.max(0,(t-w.t0)/w.dur)),e=w.ease(u);
  for(const k in w.to)w.o[k]=w.from[k]+(w.to[k]-w.from[k])*e;if(u>=1){tweens.splice(i,1);w.res();}}}

/* ---------- layout & drawing ---------- */
function layout(){
  const b=$('#boardwrap').getBoundingClientRect();if(!b.width)return;
  W=b.width;H=b.height;dpr=Math.min(window.devicePixelRatio||1,3);
  cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);
  if(!S)return;
  cs=Math.max(12,Math.floor(Math.min((W-16)/S.C,(H-16)/S.R,86)));
  ox=Math.round((W-cs*S.C)/2);oy=Math.round((H-cs*S.R)/2);
  const px=Math.round(cs*dpr);
  if(px!==spriteSize){spriteSize=px;sprites={};for(let k=0;k<6;k++)for(const sp of['n','h','v','wrap'])sprites[k+sp]=makeSprite(k,sp,px);sprites.bomb=makeSprite(0,'bomb',px);}
}
new ResizeObserver(layout).observe($('#boardwrap'));
function rr(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();}
function drawBlock(g,b,x,y,s){
  const p=s*.05;rr(g,x+p,y+p,s-2*p,s-2*p,s*.16);
  if(b.t==='ice'){
    const gr=g.createLinearGradient(x,y,x+s,y+s);gr.addColorStop(0,'#f2fdff');gr.addColorStop(1,b.hp>1?'#5bbbe8':'#9fdcf7');
    g.fillStyle=gr;g.fill();g.lineWidth=Math.max(1.5,s*.05);g.strokeStyle='#fff';g.stroke();
    g.strokeStyle='rgba(255,255,255,.95)';g.lineWidth=s*.06;g.lineCap='round';g.beginPath();
    g.moveTo(x+s*.24,y+s*.52);g.lineTo(x+s*.52,y+s*.24);g.moveTo(x+s*.4,y+s*.7);g.lineTo(x+s*.7,y+s*.4);g.stroke();
    if(b.hp>1){rr(g,x+s*.17,y+s*.17,s*.66,s*.66,s*.1);g.strokeStyle='rgba(255,255,255,.75)';g.lineWidth=s*.045;g.stroke();}
  }else{
    g.fillStyle='#5a2f14';g.fill();const q=(s-2*p)/2;g.fillStyle='#8a4f2b';
    for(let i=0;i<2;i++)for(let j=0;j<2;j++){rr(g,x+p+i*q+s*.05,y+p+j*q+s*.05,q-s*.1,q-s*.1,s*.06);g.fill();}
    g.fillStyle='rgba(255,220,180,.25)';for(let i=0;i<2;i++)for(let j=0;j<2;j++){g.fillRect(x+p+i*q+s*.09,y+p+j*q+s*.08,q-s*.18,s*.05);}
  }
}
function draw(t){
  const g=ctx;g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,W,H);
  if(!S||!view)return;
  const R=S.R,C=S.C,bw=C*cs,bh=R*cs;
  rr(g,ox-8,oy-8,bw+16,bh+16,20);g.fillStyle='rgba(110,6,62,.5)';g.fill();
  for(let r=0;r<R;r++)for(let c=0;c<C;c++){
    const x=ox+c*cs,y=oy+r*cs;rr(g,x+2,y+2,cs-4,cs-4,cs*.2);g.fillStyle=(r+c)%2?'rgba(255,255,255,.17)':'rgba(255,255,255,.27)';g.fill();
    const j=view.jelly[r][c];
    if(j){rr(g,x+3,y+3,cs-6,cs-6,cs*.22);g.fillStyle=j>1?'rgba(255,40,150,.9)':'rgba(255,125,195,.8)';g.fill();
      rr(g,x+cs*.18,y+cs*.12,cs*.5,cs*.12,cs*.06);g.fillStyle='rgba(255,255,255,.45)';g.fill();}
  }
  g.save();g.beginPath();g.rect(ox,oy,bw,bh);g.clip();
  for(const v of vis.values()){
    let s=v.s;if(v.sp&&!RM)s*=1+.045*Math.sin(t/230+v.id);
    if(sel&&sel.id===v.id)s*=1.1+.05*Math.sin(t/110);
    if(s<=.01)continue;const im=v.sp==='bomb'?sprites.bomb:sprites[v.k+(v.sp||'n')];if(!im)continue;
    const z=cs*s,cx=ox+(v.x+.5)*cs,cy=oy+(v.y+.5)*cs;g.drawImage(im,cx-z/2,cy-z/2,z,z);
  }
  g.restore();
  for(let r=0;r<R;r++)for(let c=0;c<C;c++){const b=view.block[r][c];if(b)drawBlock(g,b,ox+c*cs,oy+r*cs,cs);}
  if(sel){rr(g,ox+sel.c*cs+2,oy+sel.r*cs+2,cs-4,cs-4,cs*.2);g.strokeStyle='#fff';g.lineWidth=3;g.stroke();}
  if(mode==='hammer'){rr(g,ox-8,oy-8,bw+16,bh+16,20);g.strokeStyle=`rgba(255,210,63,${.6+.4*Math.sin(t/150)})`;g.lineWidth=5;g.stroke();}
  for(let i=fxs.length-1;i>=0;i--){
    const f=fxs[i],u=(t-f.t0)/f.dur;if(u>=1){fxs.splice(i,1);continue;}if(u<0)continue;
    const a=1-u,cx=ox+(f.c+.5)*cs,cy=oy+(f.r+.5)*cs;
    if(f.t==='row'||f.t==='col'){const h=cs*.62*(1-u*.7);g.fillStyle=`rgba(255,250,215,${a})`;
      if(f.t==='row'){rr(g,ox,cy-h/2,bw,h,h/2);}else{rr(g,cx-h/2,oy,h,bh,h/2);}g.fill();}
    else if(f.t==='ring'){g.strokeStyle=`rgba(255,230,120,${a})`;g.lineWidth=cs*.3*a;g.beginPath();g.arc(cx,cy,cs*(f.rad+.6)*(.35+u),0,7);g.stroke();}
    else if(f.t==='bomb'){g.strokeStyle=`rgba(255,255,255,${a})`;g.lineWidth=3;g.beginPath();for(const[r,c]of f.targets){g.moveTo(cx,cy);g.lineTo(ox+(c+.5)*cs,oy+(r+.5)*cs);}g.stroke();}
    else if(f.t==='big'){g.fillStyle=`rgba(255,255,255,${a*.85})`;g.fillRect(ox,oy,bw,bh);}
  }
  for(let i=parts.length-1;i>=0;i--){const p=parts[i],u=(t-p.t0)/1000;if(u>p.life){parts.splice(i,1);continue;}
    const x=p.x+p.vx*u,y=p.y+p.vy*u+700*u*u;g.globalAlpha=1-u/p.life;g.fillStyle=p.col;g.beginPath();g.arc(x,y,p.z,0,7);g.fill();}
  g.globalAlpha=1;g.textAlign='center';g.textBaseline='middle';g.lineJoin='round';
  for(let i=texts.length-1;i>=0;i--){const x=texts[i],u=(t-x.t0)/x.dur;if(u>=1){texts.splice(i,1);continue;}
    const sc=x.big?Math.min(1,u*5)*(1+.1*(u<.2?1-u*5:0)):1,y=x.y-(x.big?0:u*cs*.8);
    g.globalAlpha=u>.75?(1-u)*4:1;g.font=`700 ${x.size*sc}px Fredoka, system-ui, sans-serif`;
    g.lineWidth=x.size*.2;g.strokeStyle='#9c1258';g.strokeText(x.s,x.x,y);g.fillStyle=x.big?'#ffd23f':'#fff';g.fillText(x.s,x.x,y);}
  g.globalAlpha=1;
}
function burst(r,c,col,n){if(RM)return;const x=ox+(c+.5)*cs,y=oy+(r+.5)*cs,t=performance.now();
  for(let i=0;i<n;i++){const a=Math.random()*6.28,sp=120+Math.random()*260;parts.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-200,col,z:cs*(.05+Math.random()*.06),t0:t,life:.55});}
  if(parts.length>500)parts.splice(0,parts.length-500);}
function bigText(s,dur=1100){texts.push({s,x:W/2,y:H/2,t0:performance.now(),dur:dur/SPEED,size:Math.min(cs*.95,W/(s.length*.62)),big:true});}
function loop(t){updTweens(t);draw(t);requestAnimationFrame(loop);}
requestAnimationFrame(loop);

/* ---------- HUD ---------- */
const lv=()=>LEVELS[LI];
function goalChip(g,s){
  const rem=Engine.remaining(g,s),done=rem===0;let icon,num;
  if(g.t==='score'){icon=`<span class="ic star">${starSvg(true)}</span>`;num=`${fmt(g.n)} <small>points</small>`;}
  else if(g.t==='collect'){icon=`<img src="${ICON[g.k]}" alt="${COLORS[g.k].name}">`;num=rem;}
  else if(g.t==='jelly'){icon='<span class="ic jelly"></span>';num=rem;}
  else{const hasChoc=lv().map.join('').includes('c');icon=`<span class="ic ${hasChoc?'choc':'ice'}"></span>`;num=rem;}
  return`<div class="goal${done?' done':''}">${icon}<b>${done?CHECK:num}</b></div>`;
}
function renderHud(){
  const s=view;$('#moves').textContent=hudMoves;$('#movesBox').classList.toggle('low',hudMoves<=5&&hudMoves>0);
  $('#score').textContent=fmt(hudScore);
  $('#goals').innerHTML=lv().goals.map(g=>goalChip(g,{...s,score:hudScore})).join('');
  const st=lv().stars,top=st[2];$('#fill').style.width=Math.min(100,hudScore/top*100)+'%';
  const n=starCount(hudScore);
  if(n!==litStars||!$('#bar .mark')){
    const marks=[st[0]||st[1]*.5,st[1],st[2]].map((v,i)=>`<span class="mark${i<n?' on':''}" style="left:${Math.min(97,v/top*100)}%">${starSvg(i<n)}</span>`).join('');
    $('#bar').querySelectorAll('.mark').forEach(m=>m.remove());$('#bar').insertAdjacentHTML('beforeend',marks);litStars=n;}
}
function starCount(sc){const st=lv().stars;return(sc>=(st[0]||st[1]*.5)?1:0)+(sc>=st[1]?1:0)+(sc>=st[2]?1:0);}
function renderBoosters(){
  $('#nHammer').textContent=boosters.hammer;$('#nShuffle').textContent=boosters.shuffle;
  $('#bHammer').disabled=!boosters.hammer;$('#bShuffle').disabled=!boosters.shuffle;
  $('#bHammer').setAttribute('aria-pressed',mode==='hammer');
  $('#boosthint').textContent=mode==='hammer'?'Tap any candy or block to smash it':'';
}
function setView(s){view=s;hudScore=s.score;hudMoves=s.moves;renderHud();}

/* ---------- playing engine steps ---------- */
const WORDS=['','','Sweet!','Yummy!','Delicious!','Candy party!'];
async function play(steps){
  for(const st of steps){
    if(st.type==='swap'){const A=vis.get(st.ida),B=vis.get(st.idb);hudMoves=st.movesLeft;renderHud();
      await Promise.all([A&&tw(A,{x:st.b[1],y:st.b[0]},170),B&&tw(B,{x:st.a[1],y:st.a[0]},170)]);}
    else if(st.type==='convert'){
      if(st.fx)for(const f of st.fx)fxs.push({...f,t0:performance.now(),dur:500/SPEED});
      for(const x of st.list){const v=vis.get(x.id);if(v){v.sp=x.sp;tw(v,{s:1.3},140).then(()=>tw(v,{s:1},140));}}
      if(st.movesLeft!=null){hudMoves=st.movesLeft;renderHud();}
      await wait(st.fx?480:300);}
    else if(st.type==='clear'){
      const now=performance.now();
      for(const f of st.fx)fxs.push({...f,t0:now,dur:(f.t==='bomb'?480:400)/SPEED});
      let sx=0,sy=0;
      for(const x of st.cells){const v=vis.get(x.id);if(v)tw(v,{s:0},190,E.inq);sx+=x.c;sy+=x.r;burst(x.r,x.c,x.sp==='bomb'?'#fff':COLORS[x.k].base,4);}
      for(const h of st.hits)burst(h.r,h.c,h.t==='ice'?'#e6fbff':'#7a4422',8);
      if(st.gain&&st.cells.length){const n=st.cells.length;texts.push({s:'+'+fmt(st.gain),x:ox+(sx/n+.5)*cs,y:oy+(sy/n+.5)*cs,t0:now,dur:850/SPEED,size:cs*.42});}
      if(st.chain>=2&&SPEED===1)bigText(WORDS[Math.min(5,st.chain)],900);
      await wait(200);
      for(const x of st.cells)vis.delete(x.id);
      setView(st.after);
      for(const c of st.created){const v={id:c.id,k:c.k,sp:c.sp,x:c.c,y:c.r,s:0};vis.set(c.id,v);tw(v,{s:1},240,E.back);}
      if(st.created.length)await wait(170);}
    else if(st.type==='fall'){
      const ps=[];
      for(const m of st.moves){let v=vis.get(m.id);if(!v){v={id:m.id,k:m.k,sp:m.sp,x:m.c,y:m.from,s:1};vis.set(m.id,v);}
        const d=Math.abs(m.to-v.y);ps.push(tw(v,{y:m.to},Math.min(560,150+Math.sqrt(d)*120),E.drop));}
      await Promise.all(ps);}
    else if(st.type==='spread'){const v=vis.get(st.id);if(v)await tw(v,{s:0},180,E.inq);vis.delete(st.id);burst(st.r,st.c,'#7a4422',8);setView(st.after);await wait(160);}
    else if(st.type==='shuffle'){bigText('Shuffle!',900);
      await Promise.all(st.moves.map(m=>{const v=vis.get(m.id);if(!v)return null;v.k=m.k;return tw(v,{x:m.c,y:m.r},480,E.out);}));}
    else if(st.type==='tally'){setView(st.after);}
  }
}

/* ---------- game flow ---------- */
function goalText(g){
  if(g.t==='score')return`Score <b>${fmt(g.n)}</b> points`;
  if(g.t==='collect')return`Collect <b>${g.n}</b> ${COLORS[g.k].name}`;
  if(g.t==='jelly')return'Clear all the jelly';
  return lv().map.join('').includes('c')?(lv().map.join('').match(/[iI]/)?'Break all the ice and chocolate':'Munch all the chocolate'):'Break all the ice';
}
function startLevel(i){
  LI=i;S=Engine.init(LEVELS[i]);boosters={hammer:3,shuffle:2};extraUsed=false;mode=null;sel=null;SPEED=1;litStars=-1;
  vis=new Map();Engine.eachPiece(S,(p,r,c)=>vis.set(p.id,{id:p.id,k:p.k,sp:p.sp,x:c,y:r,s:0}));
  fxs.length=parts.length=texts.length=0;
  $('#map').hidden=true;$('#game').hidden=false;$('#lvlNum').textContent=i+1;
  spriteSize=0;layout();setView(Engine.snap(S));renderBoosters();busy=true;
  modal(`<h2>Level ${i+1}</h2><p>${LEVELS[i].goals.map(goalText).join('<br>')}</p>
    <div class="goals">${LEVELS[i].goals.map(g=>goalChip(g,view)).join('')}</div>
    <p>You have <b>${S.moves}</b> moves.</p><div class="tip">${LEVELS[i].tip}</div>
    <div class="btns"><button class="btn" data-act="go">Play!</button></div>`);
}
async function begin(){
  closeModal();
  for(const v of vis.values())setTimeout(()=>tw(v,{s:1},300,E.back),RM?0:(v.x+v.y)*35);
  await wait(RM?50:(S.R+S.C)*35+300);busy=false;
}
async function attemptSwap(a,b){
  if(busy)return;const[r2,c2]=b;
  if(r2<0||c2<0||r2>=S.R||c2>=S.C||!S.board[a[0]][a[1]]||!S.board[r2][c2])return;
  busy=true;sel=null;
  const res=Engine.swap(S,a,b);
  if(!res.ok){const A=vis.get(S.board[a[0]][a[1]].id),B=vis.get(S.board[r2][c2].id);
    await Promise.all([tw(A,{x:c2,y:r2},140),tw(B,{x:a[1],y:a[0]},140)]);
    await Promise.all([tw(A,{x:a[1],y:a[0]},170,E.back),tw(B,{x:c2,y:r2},170,E.back)]);busy=false;return;}
  await play(res.steps);await afterTurn();
}
async function afterTurn(){
  if(Engine.won(S)){
    await wait(250);bigText('Level complete!',1300);await wait(1100);
    if(S.moves>0){bigText('Party time!',1000);await wait(700);SPEED=1.8;await play(Engine.bonus(S));SPEED=1;await wait(400);}
    const n=Math.max(1,starCount(S.score));
    prog.stars[LI]=Math.max(prog.stars[LI],n);prog.best[LI]=Math.max(prog.best[LI],S.score);
    if(LI+1<LEVELS.length)prog.unlocked=Math.max(prog.unlocked,LI+2);save();
    const last=LI===LEVELS.length-1;
    modal(`<h2>${last?'You did it!':['','Nice one!','Great job!','Super sweet!'][n]}</h2>
      <div class="bigstars">${[0,1,2].map(i=>starSvg(i<n,i<n?'on':'')).join('')}</div>
      <div class="bigscore">${fmt(S.score)}</div><p>${last?'You finished every level of Candy Pop Party!':'points'}</p>
      <div class="btns">${last?'':'<button class="btn" data-act="next">Next level</button>'}
      <button class="btn alt" data-act="retry">Play again</button><button class="btn alt" data-act="map">Level map</button></div>`);
    return;
  }
  if(S.moves<=0){await wait(350);
    modal(`<h2>Out of moves!</h2><p>So close! Still to do:</p>
      <div class="goals">${lv().goals.filter(g=>Engine.remaining(g,S)>0).map(g=>goalChip(g,S)).join('')}</div>
      <div class="btns">${extraUsed?'':'<button class="btn sun" data-act="more">+5 moves, keep going</button>'}
      <button class="btn${extraUsed?'':' alt'}" data-act="retry">Try again</button><button class="btn alt" data-act="map">Level map</button></div>`);
    return;}
  busy=false;
}

/* ---------- input ---------- */
function cellAt(e){const b=cv.getBoundingClientRect(),c=Math.floor((e.clientX-b.left-ox)/cs),r=Math.floor((e.clientY-b.top-oy)/cs);
  return(r>=0&&c>=0&&S&&r<S.R&&c<S.C)?{r,c}:null;}
cv.addEventListener('pointerdown',e=>{
  if(busy||!S)return;const p=cellAt(e);if(!p)return;e.preventDefault();
  if(mode==='hammer'){useHammer(p.r,p.c);return;}
  drag={...p,x:e.clientX,y:e.clientY};try{cv.setPointerCapture(e.pointerId);}catch(_){}
});
cv.addEventListener('pointermove',e=>{
  if(!drag||busy)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
  if(Math.hypot(dx,dy)<cs*.32)return;
  const a=[drag.r,drag.c],b=Math.abs(dx)>Math.abs(dy)?[drag.r,drag.c+Math.sign(dx)]:[drag.r+Math.sign(dy),drag.c];
  drag=null;attemptSwap(a,b);
});
const endDrag=e=>{
  if(!drag)return;const p=drag;drag=null;if(busy)return;
  const piece=S.board[p.r][p.c];if(!piece){sel=null;return;}
  if(sel&&Math.abs(sel.r-p.r)+Math.abs(sel.c-p.c)===1){const a=[sel.r,sel.c];sel=null;attemptSwap(a,[p.r,p.c]);}
  else if(sel&&sel.r===p.r&&sel.c===p.c)sel=null;
  else sel={r:p.r,c:p.c,id:piece.id};
};
cv.addEventListener('pointerup',endDrag);
cv.addEventListener('pointercancel',()=>{drag=null;});

async function useHammer(r,c){
  if(busy||!boosters.hammer)return;
  const steps=Engine.hammer(S,r,c);if(!steps)return;
  boosters.hammer--;mode=null;sel=null;renderBoosters();busy=true;await play(steps);await afterTurn();
}
$('#bHammer').addEventListener('click',()=>{if(busy||!boosters.hammer)return;mode=mode==='hammer'?null:'hammer';sel=null;renderBoosters();});
$('#bShuffle').addEventListener('click',async()=>{
  if(busy||!boosters.shuffle)return;boosters.shuffle--;mode=null;sel=null;renderBoosters();busy=true;
  await play([Engine.shuffle(S)]);busy=false;});
$('#back').addEventListener('click',()=>{
  if(busy&&$('#modal').hidden)return;
  modal(`<h2>Leave level?</h2><p>Your moves in this level won’t be saved.</p>
    <div class="btns"><button class="btn" data-act="close">Keep playing</button><button class="btn alt" data-act="map">Back to map</button></div>`);
});

/* ---------- modal ---------- */
let wasBusy=false;
function modal(html){wasBusy=busy;busy=true;$('#card').innerHTML=html;$('#modal').hidden=false;setTimeout(()=>{const b=$('#card .btn');if(b)b.focus({preventScroll:true});},50);}
function closeModal(){$('#modal').hidden=true;}
const ACT={
  go:begin,
  close:()=>{closeModal();busy=wasBusy;},
  next:()=>{closeModal();startLevel(LI+1);},
  retry:()=>{closeModal();startLevel(LI);},
  map:()=>{closeModal();showMap();},
  more:()=>{extraUsed=true;S.moves+=5;hudMoves=S.moves;renderHud();closeModal();busy=false;},
  resetYes:()=>{prog={unlocked:1,stars:Array(LEVELS.length).fill(0),best:Array(LEVELS.length).fill(0)};save();closeModal();showMap();},
  resetNo:()=>{closeModal();busy=false;}
};
$('#card').addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(b)ACT[b.dataset.act]();});

/* ---------- map ---------- */
function showMap(){
  S=null;view=null;busy=false;$('#game').hidden=true;$('#map').hidden=false;
  const N=LEVELS.length,gap=108,top=50,h=top*2+(N-1)*gap;
  const pts=LEVELS.map((_,i)=>({x:50+Math.sin(i*1.15)*30,y:top+i*gap}));
  let d=`M${pts[0].x} ${pts[0].y}`;for(let i=1;i<N;i++){const a=pts[i-1],b=pts[i];d+=` C${a.x} ${a.y+gap/2} ${b.x} ${b.y-gap/2} ${b.x} ${b.y}`;}
  const road=$('#road');road.style.height=h+'px';
  road.innerHTML=`<svg viewBox="0 0 100 ${h}" preserveAspectRatio="none" aria-hidden="true">
    <path d="${d}" fill="none" stroke="rgba(110,6,62,.35)" stroke-width="30" vector-effect="non-scaling-stroke" transform="translate(0 5)"/>
    <path d="${d}" fill="none" stroke="#fff" stroke-width="26" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
    <path d="${d}" fill="none" stroke="#ff4f8b" stroke-width="26" stroke-dasharray="12 16" vector-effect="non-scaling-stroke"/></svg>`+
    pts.map((p,i)=>{const locked=i+1>prog.unlocked,cur=i+1===prog.unlocked&&!prog.stars[i];
      return`<div class="node${locked?' locked':''}${cur?' cur':''}" style="left:${p.x}%;top:${p.y}px">
      <button data-lv="${i}" ${locked?'disabled aria-label="Level '+(i+1)+', locked"':'aria-label="Play level '+(i+1)+'"'}>${locked?LOCK:i+1}</button>
      <div class="st">${[0,1,2].map(s=>starSvg(s<prog.stars[i])).join('')}</div></div>`;}).join('');
  const tot=prog.stars.reduce((a,b)=>a+b,0);
  $('#total').innerHTML=`${starSvg(true)}<span>${tot} of ${N*3} stars</span>`;
  const cur=road.querySelector('.cur');if(cur)setTimeout(()=>cur.scrollIntoView({block:'center',behavior:RM?'auto':'smooth'}),80);
}
$('#road').addEventListener('click',e=>{const b=e.target.closest('button[data-lv]');if(b&&!b.disabled)startLevel(+b.dataset.lv);});
$('#reset').addEventListener('click',()=>modal(`<h2>Start over?</h2><p>This clears all your stars and locks the levels again.</p>
  <div class="btns"><button class="btn" data-act="resetNo">Keep my stars</button><button class="btn alt" data-act="resetYes">Reset progress</button></div>`));
$('#candyrow').innerHTML=ICON.map((src,k)=>`<img src="${src}" alt="" style="animation-delay:${-k*.4}s">`).join('');
document.addEventListener('gesturestart',e=>e.preventDefault());

/* ---------- installable app ---------- */
let installEvt=null;
const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvt=e;$('#install').hidden=false;});
window.addEventListener('appinstalled',()=>{installEvt=null;$('#install').hidden=true;});
$('#install').addEventListener('click',async()=>{
  if(!installEvt)return;installEvt.prompt();
  try{await installEvt.userChoice;}catch(e){}
  installEvt=null;$('#install').hidden=true;});
let iosHidden=false;try{iosHidden=localStorage.getItem('candy-pop-party-ioshint')==='1';}catch(e){}
if(isIOS&&!standalone()&&!iosHidden)$('#iosHint').hidden=false;
$('#iosClose').addEventListener('click',()=>{$('#iosHint').hidden=true;try{localStorage.setItem('candy-pop-party-ioshint','1');}catch(e){}});
if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol))
  window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));

showMap();
}
