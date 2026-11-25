import React,{useRef,useState} from 'react';
import {Canvas,useFrame} from '@react-three/fiber';
import {Float,Sparkles} from '@react-three/drei';
import * as THREE from 'three';
function Present({open,onClick}){
 const lid=useRef(),bows=useRef();
 useFrame((_,dt)=>{if(lid.current){lid.current.position.y=THREE.MathUtils.damp(lid.current.position.y,open?2.0:.74,3,dt);lid.current.rotation.z=THREE.MathUtils.damp(lid.current.rotation.z,open?.35:0,3,dt)}});
 return <Float speed={.75} rotationIntensity={.05} floatIntensity={.07}>
 <group rotation={[.08,-.35,0]} onClick={onClick}>
   <mesh position={[0,-.12,0]} castShadow><boxGeometry args={[1.9,1.4,1.7]}/><meshStandardMaterial color="#bd6974" metalness={.06} roughness={.45}/></mesh>
   <mesh position={[0,-.12,.86]}><boxGeometry args={[.26,1.41,.022]}/><meshStandardMaterial color="#f5d99c"/></mesh>
   <mesh position={[0,-.12,0]}><boxGeometry args={[1.93,1.42,.24]}/><meshStandardMaterial color="#f5d99c"/></mesh>
   <group ref={lid} position={[0,.74,0]}>
     <mesh castShadow><boxGeometry args={[2.12,.24,1.9]}/><meshStandardMaterial color="#d98b91" metalness={.12} roughness={.34}/></mesh>
     <mesh position={[0,.135,0]}><boxGeometry args={[.28,.03,1.92]}/><meshStandardMaterial color="#f5d99c"/></mesh>
     <mesh position={[0,.14,0]}><boxGeometry args={[2.15,.03,.28]}/><meshStandardMaterial color="#f5d99c"/></mesh>
     <mesh position={[-.25,.36,0]} rotation={[0,0,-.5]}><torusGeometry args={[.29,.085,8,22,Math.PI*2]}/><meshStandardMaterial color="#f5d99c"/></mesh>
     <mesh position={[.25,.36,0]} rotation={[0,0,.5]}><torusGeometry args={[.29,.085,8,22,Math.PI*2]}/><meshStandardMaterial color="#f5d99c"/></mesh>
   </group>
   {open&&<Sparkles count={60} color="#fff1ae" size={3} scale={[3,3,3]} speed={.7}/>}
 </group></Float>;
}
export default function GiftScene({message,onClose}){
 const[open,setOpen]=useState(false);
 return <div className="gallery-overlay finale" role="dialog" aria-modal="true" aria-label="Christmas gift reveal">
 <button className="gallery-close" onClick={onClose} aria-label="Close"><span>✕</span></button>
 <div className="gallery-heading"><span className="kicker">december twenty-four</span><h2>A little something for you</h2></div>
 <div className="gift-canvas"><Canvas camera={{position:[3,2.2,6],fov:38}}><ambientLight intensity={2.1}/><directionalLight position={[4,6,5]} intensity={3}/><pointLight color="#ffe49c" intensity={17} position={[0,2,2]}/><Present open={open} onClick={()=>setOpen(v=>!v)}/></Canvas></div>
 {open?<div className="finale-note"><h3>All 24 memories, all the magic ✨</h3><p>{message}</p><button onClick={onClose}>Back to our calendar</button></div>:<button className="gift-action" onClick={()=>setOpen(true)}>Tap to unwrap your gift 🎁</button>}
 </div>;
}
