/* Candy Pop Party levels. Colour indexes: 0 hearts, 1 blue drops, 2 stars, 3 green squares, 4 orange gumballs, 5 purple gems. */
/* Levels: j jelly, J double jelly, i ice, I thick ice, c chocolate */
const LEVELS=[
 {size:7,colors:4,moves:20,goals:[{t:'score',n:8000}],stars:[8000,28000,38000],tip:'Swipe a candy toward a neighbour to swap them. Line up 3 or more of the same candy!'},
 {size:7,colors:4,moves:20,goals:[{t:'collect',k:0,n:20},{t:'collect',k:1,n:20}],stars:[0,30000,45000],tip:'Collect the candies shown at the top by matching them.'},
 {size:7,colors:5,moves:20,goals:[{t:'score',n:8000}],stars:[8000,15000,21000],tip:'Match 4 in a row to make a striped candy. Match it again to blast a whole line!'},
 {colors:5,moves:26,goals:[{t:'jelly'}],stars:[0,20000,32000],tip:'Pink squares are jelly. Make matches on top of them to wipe them away!',
  map:['.......','.jjjjj.','.j...j.','.j...j.','.j...j.','.jjjjj.','.......']},
 {size:8,colors:5,moves:22,goals:[{t:'collect',k:2,n:22},{t:'collect',k:3,n:22}],stars:[0,21000,34000],tip:'Make an L or T shape to create a wrapped candy. It goes BOOM!'},
 {colors:5,moves:20,goals:[{t:'block'}],stars:[0,17000,28000],tip:'Ice blocks crack when you match right next to them. Break them all!',
  map:['........','........','........','iiiiiiii','........','........','........','........']},
 {colors:5,moves:34,goals:[{t:'jelly'}],stars:[0,40000,55000],tip:'Matches near the bottom shake things up. Keep an eye on every jelly square!',
  map:['........','........','........','........','........','jjjjjjjj','jjjjjjjj','jjjjjjjj']},
 {size:8,colors:5,moves:20,goals:[{t:'score',n:10000}],stars:[10000,18000,26000],tip:'Line up 5 in a row for a colour bomb. Swap it with any candy to clear that colour!'},
 {colors:5,moves:28,goals:[{t:'block'}],stars:[0,30000,44000],tip:'Chocolate grows if you leave it alone for two turns. Match next to it to munch it!',
  map:['c......c','........','........','........','........','........','........','cc....cc']},
 {colors:5,moves:26,goals:[{t:'jelly'},{t:'block'}],stars:[0,25000,37000],tip:'Dark pink jelly is double thick. Match there twice!',
  map:['........','.iiiiii.','.i....i.','.i.JJ.i.','.i.JJ.i.','.i....i.','.iiiiii.','........']},
 {size:8,colors:6,moves:28,goals:[{t:'collect',k:0,n:20},{t:'collect',k:5,n:20}],stars:[0,16000,23000],tip:'Six kinds of candy now. Look out for the purple gems!'},
 {colors:5,moves:28,goals:[{t:'block'}],stars:[0,30000,44000],tip:'Thick ice needs two hits. Striped candies are great here!',
  map:['........','........','II.II.II','........','........','II.II.II','........','........']},
 {colors:5,moves:38,goals:[{t:'jelly'},{t:'block'}],stars:[0,45000,65000],tip:'Munch the chocolate and clear the jelly frame around it.',
  map:['jjjjjjjj','j......j','j......j','j..cc..j','j..cc..j','j......j','j......j','jjjjjjjj']},
 {size:8,colors:6,moves:24,goals:[{t:'score',n:9000}],stars:[9000,14000,20000],tip:'Six colours and a big score to beat. Hunt for special candies!'},
 {colors:5,moves:44,goals:[{t:'jelly'},{t:'block'}],stars:[0,55000,75000],tip:'The grand finale! Clear every jelly and break the sweet tower in the middle.',
  map:['jjjjjjjj','j......j','j.cIIc.j','j.cJJc.j','j.cJJc.j','j.cIIc.j','j......j','jjjjjjjj']},
];
if(typeof module==='object'&&module.exports)module.exports=LEVELS;
