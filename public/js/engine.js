/* Candy Pop Party game engine: pure board logic, no DOM. Also loadable from Node (see scripts/simulate.js). */
const Engine=(()=>{
let NID=1;
const DIRS=[[0,1],[1,0],[0,-1],[-1,0]];
const piece=(k,sp=null)=>({id:NID++,k,sp});
const grid=(R,C,f)=>Array.from({length:R},(_,r)=>Array.from({length:C},(_,c)=>f(r,c)));
const rcol=S=>Math.floor(Math.random()*S.nc);
function eachPiece(S,f){for(let r=0;r<S.R;r++)for(let c=0;c<S.C;c++){const p=S.board[r][c];if(p)f(p,r,c);}}
function snap(S){return{score:S.score,moves:S.moves,collected:S.collected.slice(),jelly:S.jelly.map(r=>r.slice()),block:S.block.map(r=>r.map(b=>b&&{t:b.t,hp:b.hp}))};}

function init(lv){
  const R=lv.map?lv.map.length:lv.size,C=lv.map?lv.map[0].length:lv.size;
  const S={R,C,lv,nc:lv.colors,moves:lv.moves,score:0,collected:[0,0,0,0,0,0],chocBroken:false,chocIdle:0,
    jelly:grid(R,C,()=>0),block:grid(R,C,()=>null),board:grid(R,C,()=>null)};
  if(lv.map)lv.map.forEach((row,r)=>[...row].forEach((ch,c)=>{
    if(ch==='j')S.jelly[r][c]=1;else if(ch==='J')S.jelly[r][c]=2;
    else if(ch==='i')S.block[r][c]={t:'ice',hp:1};else if(ch==='I')S.block[r][c]={t:'ice',hp:2};
    else if(ch==='c')S.block[r][c]={t:'choc',hp:1};}));
  for(let t=0;t<300;t++){
    const b=S.board;
    for(let r=0;r<R;r++)for(let c=0;c<C;c++){
      if(S.block[r][c]){b[r][c]=null;continue;}
      const bad=new Set();
      if(c>=2&&b[r][c-1]&&b[r][c-2]&&b[r][c-1].k===b[r][c-2].k)bad.add(b[r][c-1].k);
      if(r>=2&&b[r-1][c]&&b[r-2][c]&&b[r-1][c].k===b[r-2][c].k)bad.add(b[r-1][c].k);
      let k;do{k=rcol(S);}while(bad.has(k));
      b[r][c]=piece(k);
    }
    if(findMove(S))break;
  }
  return S;
}

function kAt(S,r,c){const p=S.board[r]&&S.board[r][c];return p&&p.sp!=='bomb'?p.k:-1;}
function findRuns(S){
  const runs=[];
  for(let r=0;r<S.R;r++){let c=0;while(c<S.C){const k=kAt(S,r,c);let e=c+1;if(k>=0)while(e<S.C&&kAt(S,r,e)===k)e++;
    if(k>=0&&e-c>=3){const cells=[];for(let x=c;x<e;x++)cells.push([r,x]);runs.push({d:'h',k,cells});}c=e;}}
  for(let c=0;c<S.C;c++){let r=0;while(r<S.R){const k=kAt(S,r,c);let e=r+1;if(k>=0)while(e<S.R&&kAt(S,e,c)===k)e++;
    if(k>=0&&e-r>=3){const cells=[];for(let y=r;y<e;y++)cells.push([y,c]);runs.push({d:'v',k,cells});}r=e;}}
  return runs;
}
function groupRuns(S,runs){
  const par=runs.map((_,i)=>i);const f=i=>par[i]===i?i:(par[i]=f(par[i]));
  const owner=new Map();
  runs.forEach((run,i)=>run.cells.forEach(([r,c])=>{const key=r*S.C+c;if(owner.has(key))par[f(i)]=f(owner.get(key));else owner.set(key,i);}));
  const g=new Map();runs.forEach((run,i)=>{const root=f(i);if(!g.has(root))g.set(root,[]);g.get(root).push(run);});
  return[...g.values()];
}

function effect(S,p,r,c){
  const cells=[];
  if(p.sp==='h'){for(let x=0;x<S.C;x++)cells.push([r,x]);return{cells,fx:{t:'row',r,c}};}
  if(p.sp==='v'){for(let y=0;y<S.R;y++)cells.push([y,c]);return{cells,fx:{t:'col',r,c}};}
  if(p.sp==='wrap'){for(let y=r-1;y<=r+1;y++)for(let x=c-1;x<=c+1;x++)cells.push([y,x]);return{cells,fx:{t:'ring',r,c,rad:1}};}
  const cnt=[0,0,0,0,0,0];eachPiece(S,q=>{if(q.sp!=='bomb')cnt[q.k]++;});
  const k=cnt.indexOf(Math.max(...cnt));
  eachPiece(S,(q,y,x)=>{if(q.k===k&&q.sp!=='bomb')cells.push([y,x]);});
  return{cells,fx:{t:'bomb',r,c,targets:cells.slice()}};
}

function blast(S,seeds,o={}){
  const{R,C,board,block,jelly}=S,chain=o.chain||1,fired=o.fired||new Set();
  const st={type:'clear',cells:[],fx:o.fx?o.fx.slice():[],hits:[],created:[],chain,gain:0};
  const before=S.score,seen=new Set(),hit=new Set();
  const inB=(r,c)=>r>=0&&c>=0&&r<R&&c<C;
  const dmg=(r,c)=>{const key=r*C+c,b=block[r][c];if(!b||hit.has(key))return;hit.add(key);b.hp--;S.score+=100;st.hits.push({r,c,t:b.t});
    if(b.hp<=0){if(b.t==='choc')S.chocBroken=true;block[r][c]=null;}};
  const q=seeds.slice();
  for(let i=0;i<q.length;i++){
    const[r,c]=q[i];if(!inB(r,c))continue;const key=r*C+c;if(seen.has(key))continue;seen.add(key);
    if(block[r][c]){dmg(r,c);continue;}
    const p=board[r][c];if(!p)continue;
    st.cells.push({r,c,id:p.id,k:p.k,sp:p.sp});
    if(p.sp&&!fired.has(p.id)){fired.add(p.id);const e=effect(S,p,r,c);st.fx.push(e.fx);for(const x of e.cells)q.push(x);S.score+=100;}
  }
  if(o.match)for(const x of st.cells)for(const[dr,dc]of DIRS){const r=x.r+dr,c=x.c+dc;if(inB(r,c))dmg(r,c);}
  for(const x of st.cells){board[x.r][x.c]=null;if(jelly[x.r][x.c]>0){jelly[x.r][x.c]--;S.score+=100;}
    if(x.sp!=='bomb')S.collected[x.k]++;S.score+=50*chain;}
  for(const cr of o.created||[]){const p=piece(cr.k,cr.sp);board[cr.r][cr.c]=p;st.created.push({r:cr.r,c:cr.c,id:p.id,k:p.k,sp:p.sp});
    S.score+=cr.sp==='bomb'?400:cr.sp==='wrap'?200:120;}
  st.gain=S.score-before;st.after=snap(S);return st;
}

function resolve(S,focus,chain){
  const runs=findRuns(S);if(!runs.length)return null;
  const seeds=[],created=[];
  for(const grp of groupRuns(S,runs)){
    const cm=new Map();for(const run of grp)for(const[r,c]of run.cells)cm.set(r*S.C+c,[r,c]);
    seeds.push(...cm.values());
    const maxLen=Math.max(...grp.map(x=>x.cells.length));
    const hasH=grp.some(x=>x.d==='h'),hasV=grp.some(x=>x.d==='v');
    let sp=null;
    if(maxLen>=5)sp='bomb';else if(hasH&&hasV)sp='wrap';else if(maxLen===4)sp=grp[0].d==='h'?'v':'h';
    if(!sp)continue;
    let pos=null;
    if(focus)for(const[fr,fc]of focus)if(cm.has(fr*S.C+fc)){pos=[fr,fc];break;}
    if(!pos&&sp==='wrap'){const hs=new Set();grp.filter(x=>x.d==='h').forEach(x=>x.cells.forEach(([r,c])=>hs.add(r*S.C+c)));
      for(const x of grp.filter(x=>x.d==='v'))for(const[r,c]of x.cells)if(!pos&&hs.has(r*S.C+c))pos=[r,c];}
    if(!pos){const long=grp.reduce((a,b)=>b.cells.length>a.cells.length?b:a);pos=long.cells[Math.floor(long.cells.length/2)];}
    created.push({r:pos[0],c:pos[1],k:grp[0].k,sp});
  }
  return blast(S,seeds,{match:true,created,chain});
}

function gravity(S){
  const moves=[];
  for(let c=0;c<S.C;c++){
    const slots=[];for(let r=0;r<S.R;r++)if(!S.block[r][c])slots.push(r);
    const ps=[];for(const r of slots)if(S.board[r][c])ps.push({p:S.board[r][c],r});
    for(const r of slots)S.board[r][c]=null;
    const n=ps.length,m=slots.length;
    ps.forEach(({p,r},i)=>{const tr=slots[m-n+i];S.board[tr][c]=p;if(tr!==r)moves.push({id:p.id,c,from:r,to:tr});});
    const need=m-n;
    for(let i=0;i<need;i++){const tr=slots[i],p=piece(rcol(S));S.board[tr][c]=p;moves.push({id:p.id,c,from:i-need,to:tr,k:p.k,sp:null});}
  }
  return{type:'fall',moves};
}

function cascade(S,steps,focus){
  let chain=1;
  if(steps.length&&steps[steps.length-1].type==='clear'){steps.push(gravity(S));chain=2;}
  for(let g=0;g<80;g++){const st=resolve(S,focus,chain);focus=null;if(!st)break;steps.push(st,gravity(S));chain++;}
}

function combo(S,p1,p2,a,b){
  const fired=new Set([p1.id,p2.id]);const[br,bc]=b;
  if(p1.sp==='bomb'&&p2.sp==='bomb'){const all=[];for(let r=0;r<S.R;r++)for(let c=0;c<S.C;c++)all.push([r,c]);
    return[blast(S,all,{fired,fx:[{t:'big',r:br,c:bc}]})];}
  if(p1.sp==='bomb'||p2.sp==='bomb'){
    const bomb=p1.sp==='bomb'?p1:p2,other=bomb===p1?p2:p1,bpos=bomb===p1?b:a,k=other.k,targets=[];
    eachPiece(S,(q,r,c)=>{if(q.k===k&&q.sp!=='bomb')targets.push([r,c]);});
    const fx=[{t:'bomb',r:bpos[0],c:bpos[1],targets}];
    if(other.sp){
      const list=[];for(const[r,c]of targets){const q=S.board[r][c];q.sp=other.sp==='wrap'?'wrap':(Math.random()<.5?'h':'v');list.push({id:q.id,sp:q.sp});}
      return[{type:'convert',list,fx},blast(S,[bpos,...targets],{fired:new Set([bomb.id])})];
    }
    return[blast(S,[bpos,...targets],{fired,fx})];
  }
  const s=[p1.sp,p2.sp],seeds=[a,b],fx=[];
  const lines=(rows,cols)=>{for(const r of rows)if(r>=0&&r<S.R){for(let x=0;x<S.C;x++)seeds.push([r,x]);fx.push({t:'row',r,c:bc});}
    for(const c of cols)if(c>=0&&c<S.C){for(let y=0;y<S.R;y++)seeds.push([y,c]);fx.push({t:'col',r:br,c});}};
  if(s[0]==='wrap'&&s[1]==='wrap'){for(let y=br-2;y<=br+2;y++)for(let x=bc-2;x<=bc+2;x++)seeds.push([y,x]);fx.push({t:'ring',r:br,c:bc,rad:2});}
  else if(s.includes('wrap'))lines([br-1,br,br+1],[bc-1,bc,bc+1]);
  else lines([br],[bc]);
  return[blast(S,seeds,{fired,fx})];
}

function lineAt(S,r,c){const k=kAt(S,r,c);if(k<0)return false;let h=1;for(let x=c-1;kAt(S,r,x)===k;x--)h++;for(let x=c+1;kAt(S,r,x)===k;x++)h++;if(h>=3)return true;
  let v=1;for(let y=r-1;kAt(S,y,c)===k;y--)v++;for(let y=r+1;kAt(S,y,c)===k;y++)v++;return v>=3;}
function allMoves(S,first){
  const out=[];
  for(let r=0;r<S.R;r++)for(let c=0;c<S.C;c++)for(const[dr,dc]of[[0,1],[1,0]]){
    const r2=r+dr,c2=c+dc;if(r2>=S.R||c2>=S.C)continue;
    const p=S.board[r][c],q=S.board[r2][c2];if(!p||!q)continue;
    let ok=p.sp==='bomb'||q.sp==='bomb'||!!(p.sp&&q.sp);
    if(!ok){S.board[r][c]=q;S.board[r2][c2]=p;ok=lineAt(S,r,c)||lineAt(S,r2,c2);S.board[r][c]=p;S.board[r2][c2]=q;}
    if(ok){out.push([[r,c],[r2,c2]]);if(first)return out;}
  }
  return out;
}
const findMove=S=>allMoves(S,true)[0]||null;

function shuffle(S){
  const cells=[],ps=[];eachPiece(S,(p,r,c)=>{cells.push([r,c]);ps.push(p);});
  for(let t=0;t<400;t++){
    for(let i=ps.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[ps[i],ps[j]]=[ps[j],ps[i]];}
    if(t>200)ps.forEach(p=>{if(!p.sp)p.k=rcol(S);});
    cells.forEach(([r,c],i)=>{S.board[r][c]=ps[i];});
    if(!findRuns(S).length&&findMove(S))break;
  }
  return{type:'shuffle',moves:cells.map(([r,c])=>({id:S.board[r][c].id,r,c,k:S.board[r][c].k}))};
}

function remaining(g,s){
  if(g.t==='score')return Math.max(0,g.n-s.score);
  if(g.t==='collect')return Math.max(0,g.n-s.collected[g.k]);
  let n=0;
  if(g.t==='jelly')s.jelly.forEach(row=>row.forEach(v=>{if(v>0)n++;}));
  else s.block.forEach(row=>row.forEach(b=>{if(b)n++;}));
  return n;
}
const won=S=>S.lv.goals.every(g=>remaining(g,S)===0);

function endTurn(S,steps,spread){
  if(spread&&S.chocBroken)S.chocIdle=0;
  else if(spread&&!won(S)&&++S.chocIdle>=2){
    S.chocIdle=0;const cand=[];
    for(let r=0;r<S.R;r++)for(let c=0;c<S.C;c++)if(S.block[r][c]&&S.block[r][c].t==='choc')
      for(const[dr,dc]of DIRS){const y=r+dr,x=c+dc,p=S.board[y]&&S.board[y][x];if(p&&!p.sp)cand.push([y,x]);}
    if(cand.length){const[y,x]=cand[Math.floor(Math.random()*cand.length)],p=S.board[y][x];
      S.board[y][x]=null;S.block[y][x]={t:'choc',hp:1};steps.push({type:'spread',r:y,c:x,id:p.id,after:snap(S)});}
  }
  if(!won(S)&&S.moves>0&&!findMove(S))steps.push(shuffle(S));
}

function swap(S,a,b){
  const p1=S.board[a[0]][a[1]],p2=S.board[b[0]][b[1]];
  if(!p1||!p2)return{ok:false};
  S.board[a[0]][a[1]]=p2;S.board[b[0]][b[1]]=p1;
  const isCombo=p1.sp==='bomb'||p2.sp==='bomb'||!!(p1.sp&&p2.sp);
  if(!isCombo&&!findRuns(S).length){S.board[a[0]][a[1]]=p1;S.board[b[0]][b[1]]=p2;return{ok:false};}
  S.moves--;S.chocBroken=false;
  const steps=[{type:'swap',a,b,ida:p1.id,idb:p2.id,movesLeft:S.moves}];
  if(isCombo)steps.push(...combo(S,p1,p2,a,b));
  cascade(S,steps,isCombo?null:[b,a]);
  endTurn(S,steps,true);
  return{ok:true,steps};
}

function hammer(S,r,c){
  if(!S.board[r][c]&&!S.block[r][c])return null;
  const steps=[blast(S,[[r,c]],{fx:[{t:'ring',r,c,rad:0}]})];
  cascade(S,steps,null);endTurn(S,steps,false);return steps;
}

function bonus(S){
  const steps=[];let fired=0;
  while(S.moves>0&&fired<10){
    const normal=[];eachPiece(S,(p,r,c)=>{if(!p.sp)normal.push([r,c]);});
    if(!normal.length)break;
    const[r,c]=normal[Math.floor(Math.random()*normal.length)],p=S.board[r][c];
    p.sp=Math.random()<.5?'h':'v';S.moves--;fired++;
    steps.push({type:'convert',list:[{id:p.id,sp:p.sp}],movesLeft:S.moves});
    steps.push(blast(S,[[r,c]],{}));cascade(S,steps,null);
  }
  S.score+=S.moves*300;S.moves=0;
  steps.push({type:'tally',after:snap(S)});
  return steps;
}

return{init,swap,hammer,shuffle,bonus,findMove,allMoves,remaining,won,snap,eachPiece};
})();
if(typeof module==='object'&&module.exports)module.exports=Engine;
