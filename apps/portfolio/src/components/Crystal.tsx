'use client';
import dynamic from 'next/dynamic';
import { Component, type ReactNode, useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
const Scene=dynamic(()=>import('../three/GlacialScene'),{ssr:false});
class Boundary extends Component<{children:ReactNode;onFailure:()=>void},{failed:boolean}>{
 state={failed:false};static getDerivedStateFromError(){return {failed:true};}
 componentDidCatch(){this.props.onFailure();}
 render(){return this.state.failed?null:this.props.children;}
}
export default function Crystal(){
 const [supported,setSupported]=useState(false),[ready,setReady]=useState(false);const reduced=useReducedMotion();
 useEffect(()=>{try{const c=document.createElement('canvas');const gl=c.getContext('webgl2');setSupported(Boolean(gl));gl?.getExtension('WEBGL_lose_context')?.loseContext();}catch{setSupported(false);}},[]);
 return <div className="crystal-stage" aria-label="Slowly rotating glacial crystal with champagne gold orbit rings">
  <div className="crystal-grid" aria-hidden="true"/><div className="crystal-halo" aria-hidden="true"/>
  <div className={`crystal-fallback ${ready?'is-ready':''}`} aria-hidden="true"><svg viewBox="0 0 480 480"><defs><linearGradient id="ice" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#FFFFFF"/><stop offset=".5" stopColor="#6BA3D6"/><stop offset="1" stopColor="#1E3A5F"/></linearGradient></defs><g fill="none" stroke="#D4AF6A"><ellipse cx="240" cy="240" rx="208" ry="71" transform="rotate(-25 240 240)"/><ellipse cx="240" cy="240" rx="181" ry="105" transform="rotate(55 240 240)"/></g><g className="fallback-facets" stroke="#3B82C4" strokeWidth="1.2"><path d="M240 70 378 165 340 333 240 395 105 309 87 160Z" fill="url(#ice)"/><path d="M240 70 220 200 87 160M378 165 220 200 340 333 240 395 220 200 105 309M240 70 378 165 340 333" fill="none"/><path d="M240 70 378 165 220 200Z" fill="#E3EFFB" fillOpacity=".7"/><path d="M220 200 340 333 240 395Z" fill="#1E3A5F" fillOpacity=".25"/></g><circle cx="412" cy="170" r="5" fill="#D4AF6A"/></svg></div>
  {supported&&<Boundary onFailure={()=>setReady(false)}><Scene reduced={Boolean(reduced)} onReady={()=>setReady(true)} onLost={()=>setReady(false)}/></Boundary>}
  <div className="crystal-label label-logic"><span>01</span>Algorithmic logic</div><div className="crystal-label label-design"><span>02</span>UI/UX craft</div><div className="crystal-label label-systems"><span>03</span>Full-stack architecture</div>
  <div className="crystal-caption"><span className="mono">FORM / FUNCTION / PRECISION</span><span className="tiny-cross">+</span></div>
 </div>;
}
