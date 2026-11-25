import React, { useState, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Float, Html, useTexture } from '@react-three/drei';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

function PhotoCard({url,index,activeIndex,onSelect}){
  const tex=useTexture(url);
  tex.colorSpace='srgb';
  const img=tex.image;const aspect=img?.width&&img?.height?img.width/img.height:1;
  const frameW=1.81,frameH=2.16;const imageW=aspect>frameW/frameH?frameW:frameH*aspect;const imageH=aspect>frameW/frameH?frameW/aspect:frameH;
  const delta=index-activeIndex;
  const near=Math.abs(delta)<3;
  if(!near)return null;
  const pos=[delta*2.45,Math.abs(delta)===0?.0:-.12,-Math.abs(delta)*1.4];
  return <Float floatIntensity={delta===0?.11:.04} rotationIntensity={.015} speed={.62}>
    <group position={pos} rotation={[0,-delta*.14,delta*.04]} onClick={e=>{e.stopPropagation();onSelect(index)}}>
      <mesh position={[0,0,-.038]}><boxGeometry args={[2.0,2.64,.06]}/><meshStandardMaterial color="#fdf8f0" roughness={.75}/></mesh>
      <mesh position={[0,.12,0]}><planeGeometry args={[imageW,imageH]}/><meshBasicMaterial map={tex} toneMapped={false}/></mesh>
      <Html center position={[0,-1.19,.09]} transform distanceFactor={7}><div className="gallery-day">DEC {String(index+1).padStart(2,'0')}</div></Html>
    </group>
  </Float>
}
function Display({photos,index,setIndex}){
  return <Canvas camera={{position:[0,.1,7],fov:37}} dpr={[1,1.6]} gl={{alpha:true}}>
    <ambientLight intensity={2.2}/><directionalLight position={[3,5,4]} intensity={2}/>
    <Suspense fallback={null}>
      {photos.map((p,i)=><PhotoCard key={p.day} url={p.url} index={i} activeIndex={index} onSelect={setIndex}/>)}
    </Suspense>
  </Canvas>;
}
export default function MemoryGallery({photos,onClose}){
  const [index,setIndex]=useState(0);
  return <div className="gallery-overlay" role="dialog" aria-modal="true" aria-label="Unlocked memories gallery">
    <button className="gallery-close" onClick={onClose} aria-label="Close gallery"><X/></button>
    <div className="gallery-heading"><span className="kicker">the moments that made us</span><h2>Our little universe of memories</h2><p>{photos.length} unlocked {photos.length===1?'memory':'memories'}</p></div>
    <div className="gallery-stage"><Display photos={photos} index={index} setIndex={setIndex}/></div>
    <div className="gallery-controls">
      <button onClick={()=>setIndex(v=>Math.max(0,v-1))} disabled={index===0} aria-label="Previous photo"><ChevronLeft/></button>
      <span>{index+1} / {photos.length}</span>
      <button onClick={()=>setIndex(v=>Math.min(photos.length-1,v+1))} disabled={index===photos.length-1} aria-label="Next photo"><ChevronRight/></button>
    </div>
  </div>;
}
