/* Bot playthroughs of every level, to check the engine and tune difficulty.
   Usage: node scripts/simulate.js [gamesPerLevel] [random|greedy] */
const Engine = require('../public/js/engine.js');
const LEVELS = require('../public/js/levels.js');
const N = +process.argv[2] || 100;
const bots = process.argv[3] ? [process.argv[3]] : ['random', 'greedy'];

function play(lv, bot) {
  const S = Engine.init(lv);
  while (S.moves > 0 && !Engine.won(S)) {
    const moves = Engine.allMoves(S, false);
    if (!moves.length) throw new Error('board has no moves');
    let pick;
    if (bot === 'random') pick = moves[Math.floor(Math.random() * moves.length)];
    else {
      let best = -Infinity;
      for (const m of moves) {
        const T = structuredClone(S);
        Engine.swap(T, m[0], m[1]);
        let v = T.score - S.score + Math.random() * 50;
        for (const g of lv.goals) if (g.t !== 'score') v += (Engine.remaining(g, S) - Engine.remaining(g, T)) * 400;
        if (v > best) { best = v; pick = m; }
      }
    }
    if (!Engine.swap(S, pick[0], pick[1]).ok) throw new Error('engine rejected a valid move');
    for (let r = 0; r < S.R; r++) for (let c = 0; c < S.C; c++) {
      if (!S.block[r][c] && !S.board[r][c]) throw new Error('hole left in board');
      if (S.block[r][c] && S.board[r][c]) throw new Error('candy inside a blocker');
    }
  }
  const won = Engine.won(S);
  if (won) Engine.bonus(S);
  return { won, score: S.score };
}

LEVELS.forEach((lv, i) => {
  const out = bots.map((bot) => {
    const n = bot === 'greedy' ? Math.ceil(N / 3) : N;
    let wins = 0; const scores = [];
    for (let k = 0; k < n; k++) { const r = play(lv, bot); if (r.won) { wins++; scores.push(r.score); } }
    scores.sort((a, b) => a - b);
    const q = (p) => (scores.length ? scores[Math.floor(p * (scores.length - 1))] : 0);
    return `${bot}: win ${Math.round((wins / n) * 100)}%, median ${q(0.5)}, p75 ${q(0.75)}`;
  });
  console.log(`Level ${i + 1} (stars ${lv.stars.join('/')}): ${out.join(' | ')}`);
});
