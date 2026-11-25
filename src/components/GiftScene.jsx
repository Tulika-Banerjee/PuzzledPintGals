import React,{useEffect,useRef,useState} from 'react';
import {Canvas,useFrame} from '@react-three/fiber';
import {Float,Sparkles} from '@react-three/drei';
import * as THREE from 'three';
import CalendarDialog from './CalendarDialog';
import SceneFallback from './SceneFallback';
function Present({open,onClick,reducedMotion}){
 const lid=useRef();
 useFrame((_,dt)=>{if(!reducedMotion&&lid.current){lid.current.position.y=THREE.MathUtils.damp(lid.current.position.y,open?2.0:.74,3,dt);lid.current.rotation.z=THREE.MathUtils.damp(lid.current.rotation.z,open?.35:0,3,dt)}});
 return <Float enabled={!reducedMotion} speed={.75} rotationIntensity={.05} floatIntensity={.07}>
 <group rotation={[.08,-.35,0]} onClick={onClick}>
   <mesh position={[0,-.12,0]} castShadow><boxGeometry args={[1.9,1.4,1.7]}/><meshStandardMaterial color="#bd6974" metalness={.06} roughness={.45}/></mesh>
   <mesh position={[0,-.12,.86]}><boxGeometry args={[.26,1.41,.022]}/><meshStandardMaterial color="#f5d99c"/></mesh>
   <mesh position={[0,-.12,0]}><boxGeometry args={[1.93,1.42,.24]}/><meshStandardMaterial color="#f5d99c"/></mesh>
   <group ref={lid} position={[0,reducedMotion&&open?2:.74,0]} rotation={[0,0,reducedMotion&&open?.35:0]}>
     <mesh castShadow><boxGeometry args={[2.12,.24,1.9]}/><meshStandardMaterial color="#d98b91" metalness={.12} roughness={.34}/></mesh>
     <mesh position={[0,.135,0]}><boxGeometry args={[.28,.03,1.92]}/><meshStandardMaterial color="#f5d99c"/></mesh>
     <mesh position={[0,.14,0]}><boxGeometry args={[2.15,.03,.28]}/><meshStandardMaterial color="#f5d99c"/></mesh>
     <mesh position={[-.25,.36,0]} rotation={[0,0,-.5]}><torusGeometry args={[.29,.085,8,22,Math.PI*2]}/><meshStandardMaterial color="#f5d99c"/></mesh>
     <mesh position={[.25,.36,0]} rotation={[0,0,.5]}><torusGeometry args={[.29,.085,8,22,Math.PI*2]}/><meshStandardMaterial color="#f5d99c"/></mesh>
   </group>
   {open&&!reducedMotion&&<Sparkles count={60} color="#fff1ae" size={3} scale={[3,3,3]} speed={.7}/>}
 </group></Float>;
}
export default function GiftScene({message,onClose,reducedMotion}){
 const[open,setOpen]=useState(false);
 const returnButton=useRef(null);
 useEffect(()=>{if(open)returnButton.current?.focus();},[open]);
 return <CalendarDialog className="finale" label="Christmas gift reveal" onClose={onClose}>
 <button className="gallery-close" onClick={onClose} aria-label="Close"><span>✕</span></button>
 <div className="gallery-heading"><span className="kicker">december twenty-four</span><h2>A little something for you</h2></div>
 <div className="gift-canvas"><SceneFallback fallback={<div className="gift-fallback" aria-hidden="true">🎁</div>}><Canvas frameloop={reducedMotion?'demand':'always'} camera={{position:[3,2.2,6],fov:38}}><ambientLight intensity={2.1}/><directionalLight position={[4,6,5]} intensity={3}/><pointLight color="#ffe49c" intensity={17} position={[0,2,2]}/><Present open={open} reducedMotion={reducedMotion} onClick={()=>setOpen(true)}/></Canvas></SceneFallback></div>
 {open?<div className="finale-note"><h3>Your Christmas surprise ✨</h3><p>{message}</p><button ref={returnButton} onClick={onClose}>Back to our calendar</button></div>:<button className="gift-action" onClick={()=>setOpen(true)}>Tap to unwrap your gift 🎁</button>}
 </CalendarDialog>;
}
