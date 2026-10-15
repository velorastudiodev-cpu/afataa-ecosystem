'use client';
import {Canvas,useFrame} from '@react-three/fiber';
import {Environment,Lightformer,Edges} from '@react-three/drei';
import {Suspense,useEffect,useRef,useState} from 'react';
import {Group,MathUtils} from 'three';
function Sculpture({reduced}:{reduced:boolean}){
 const spin=useRef<Group>(null),tilt=useRef<Group>(null),orbit=useRef<Group>(null);
 const velocity=useRef({x:0,y:0});
 useFrame((state,rawDelta)=>{if(reduced)return;const dt=Math.min(rawDelta,1/30);
  if(spin.current){const t=state.clock.elapsedTime;spin.current.rotation.y+=dt*.24;spin.current.rotation.x=.25+Math.sin(t*.7)*.035;spin.current.rotation.z=.15+Math.cos(t*.55)*.025;spin.current.position.y=Math.sin(t*.8)*.065;}
  if(orbit.current)orbit.current.rotation.z+=dt*.09;
  if(tilt.current){for(const axis of ['x','y'] as const){const target=MathUtils.clamp((axis==='x'?-state.pointer.y:state.pointer.x)*.1745,-.1745,.1745);velocity.current[axis]+=(220*(target-tilt.current.rotation[axis])-26*velocity.current[axis])*dt;tilt.current.rotation[axis]+=velocity.current[axis]*dt;}}
 });
 return <group ref={tilt}><group ref={spin} rotation={[.25,.4,.15]}><mesh><icosahedronGeometry args={[1.48,0]}/><meshPhysicalMaterial color="#E3EFFB" transmission={.85} thickness={1.4} roughness={.15} metalness={.06} ior={1.45} clearcoat={1} envMapIntensity={1.4}/><Edges color="#6BA3D6" threshold={12}/></mesh><mesh scale={.56} rotation={[.3,.6,0]}><icosahedronGeometry args={[1.48,0]}/><meshStandardMaterial color="#6BA3D6" roughness={.4} metalness={.3}/></mesh></group><group ref={orbit} rotation={[.48,.15,-.5]}><mesh><torusGeometry args={[2.05,.012,8,120]}/><meshStandardMaterial color="#D4AF6A" metalness={.7} roughness={.3}/></mesh><mesh position={[2.05,0,0]}><sphereGeometry args={[.055,16,16]}/><meshStandardMaterial color="#D4AF6A" metalness={.5} roughness={.25}/></mesh></group><mesh rotation={[1.1,.5,.5]}><torusGeometry args={[1.92,.008,8,120]}/><meshStandardMaterial color="#6BA3D6" metalness={.5} roughness={.4}/></mesh></group>;
}
export default function GlacialScene({reduced,onReady,onLost}:{reduced:boolean;onReady:()=>void;onLost:()=>void}){
 const wrap=useRef<HTMLDivElement>(null),[visible,setVisible]=useState(true);
 useEffect(()=>{const obs=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{rootMargin:'80px'});if(wrap.current)obs.observe(wrap.current);return()=>obs.disconnect();},[]);
 return <div ref={wrap} className="crystal-canvas"><Canvas dpr={[1,1.5]} camera={{position:[0,0,6.7],fov:45}} frameloop={reduced||!visible?'demand':'always'} gl={{alpha:true,antialias:true,powerPreference:'low-power'}} onCreated={({gl})=>{gl.domElement.addEventListener('webglcontextlost',onLost,{once:true});onReady();}}><ambientLight intensity={1.5}/><directionalLight position={[3,4,5]} intensity={3}/><directionalLight position={[-3,-2,2]} color="#6BA3D6" intensity={2}/><Suspense fallback={null}><Environment resolution={64}><Lightformer intensity={4} position={[0,4,3]} scale={[6,4,1]}/><Lightformer intensity={2} color="#E3EFFB" position={[-4,0,2]} scale={[2,6,1]}/><Lightformer intensity={1} color="#D4AF6A" position={[3,-3,0]} scale={[4,2,1]}/></Environment><Sculpture reduced={reduced}/></Suspense></Canvas></div>;
}
