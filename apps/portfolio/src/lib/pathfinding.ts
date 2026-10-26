export type Algorithm = 'dijkstra' | 'astar';
export function findPath(cols:number,rows:number,start:number,end:number,walls:ReadonlySet<number>,algorithm:Algorithm){
 const count=cols*rows;
 if(!Number.isInteger(cols)||!Number.isInteger(rows)||cols<1||rows<1||start<0||end<0||start>=count||end>=count)throw new Error('Invalid grid');
 if(walls.has(start)||walls.has(end))return {visited:[],path:[]};
 const distances=new Array<number>(count).fill(Infinity),parents=new Array<number>(count).fill(-1);
 const open=new Set([start]),closed=new Set<number>(),visited:number[]=[];distances[start]=0;
 const heuristic=(n:number)=>algorithm==='astar'?Math.abs(n%cols-end%cols)+Math.abs(Math.floor(n/cols)-Math.floor(end/cols)):0;
 while(open.size){
  let current=-1,score=Infinity;
  // Tie-break equal f on the smaller heuristic so A* keeps heading for the goal instead of flooding plateaus.
  let bestH=Infinity;
  for(const n of open){const h=heuristic(n),f=distances[n]+h;if(f<score||(f===score&&h<bestH)){current=n;score=f;bestH=h;}}
  open.delete(current);closed.add(current);visited.push(current);
  if(current===end){const path:number[]=[];for(let n=end;n!==-1;n=parents[n])path.unshift(n);return {visited,path};}
  const x=current%cols,y=Math.floor(current/cols);
  const neighbors=[x>0?current-1:-1,x<cols-1?current+1:-1,y>0?current-cols:-1,y<rows-1?current+cols:-1];
  for(const n of neighbors){if(n<0||walls.has(n)||closed.has(n))continue;const d=distances[current]+1;if(d<distances[n]){distances[n]=d;parents[n]=current;open.add(n);}}
 }
 return {visited,path:[]};
}
