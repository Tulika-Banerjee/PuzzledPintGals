import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Html, useTexture } from '@react-three/drei';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import CalendarDialog from './CalendarDialog';
import SceneFallback from './SceneFallback';

const dateLabel=day=>`DEC ${String(day).padStart(2,'0')}`;

function PhotoCard({day,url,index,activeIndex,onSelect,reducedMotion}){
  const tex=useTexture(url);
  tex.colorSpace='srgb';
  const img=tex.image;const aspect=img?.width&&img?.height?img.width/img.height:1;
  const frameW=1.81,frameH=2.16;const imageW=aspect>frameW/frameH?frameW:frameH*aspect;const imageH=aspect>frameW/frameH?frameW/aspect:frameH;
  const delta=index-activeIndex;
  const pos=[delta*2.45,Math.abs(delta)===0?.0:-.12,-Math.abs(delta)*1.4];
  return <Float enabled={!reducedMotion} floatIntensity={delta===0?.11:.04} rotationIntensity={.015} speed={.62}>
    <group position={pos} rotation={[0,-delta*.14,delta*.04]} onClick={e=>{e.stopPropagation();onSelect(index)}}>
      <mesh position={[0,0,-.038]}><boxGeometry args={[2.0,2.64,.06]}/><meshStandardMaterial color="#fdf8f0" roughness={.75}/></mesh>
      <mesh position={[0,.12,0]}><planeGeometry args={[imageW,imageH]}/><meshBasicMaterial map={tex} toneMapped={false}/></mesh>
      <Html center position={[0,-1.19,.09]} transform distanceFactor={7}><div className="gallery-day" aria-hidden="true">{dateLabel(day)}</div></Html>
    </group>
  </Float>
}
function Display({photos,index,setIndex,reducedMotion}){
  const start=Math.max(0,index-2);
  return <Canvas frameloop={reducedMotion?'demand':'always'} camera={{position:[0,.1,7],fov:37}} dpr={[1,1.6]} gl={{alpha:true}}>
    <ambientLight intensity={2.2}/><directionalLight position={[3,5,4]} intensity={2}/>
    <Suspense fallback={null}>
      {photos.slice(start,index+3).map((p,i)=><PhotoCard key={p.day} day={p.day} url={p.url} index={start+i} activeIndex={index} onSelect={setIndex} reducedMotion={reducedMotion}/>)}
    </Suspense>
  </Canvas>;
}
export default function MemoryGallery({photos,onClose,reducedMotion}){
  const [selection,setIndex]=useState(0);
  const index=Math.min(selection,photos.length-1);
  const photo=photos[index];
  const fallback=<figure className="gallery-fallback"><img src={photo.url} alt={`Memory from December ${photo.day}`}/><figcaption className="gallery-day">{dateLabel(photo.day)}</figcaption></figure>;
  return <CalendarDialog label="Unlocked memories gallery" onClose={onClose}>
    <button className="gallery-close" onClick={onClose} aria-label="Close gallery"><X/></button>
    <div className="gallery-heading"><span className="kicker">the moments that made us</span><h2>Our little universe of memories</h2><p>{photos.length} unlocked {photos.length===1?'memory':'memories'}</p></div>
    <div className="gallery-stage"><SceneFallback fallback={fallback}><Display photos={photos} index={index} setIndex={setIndex} reducedMotion={reducedMotion}/></SceneFallback></div>
    <div className="gallery-controls">
      <button onClick={()=>setIndex(index-1)} disabled={index===0} aria-label="Previous photo"><ChevronLeft/></button>
      <span aria-live="polite" aria-label={`December ${photo.day}, photo ${index+1} of ${photos.length}`}>{index+1} / {photos.length}</span>
      <button onClick={()=>setIndex(index+1)} disabled={index===photos.length-1} aria-label="Next photo"><ChevronRight/></button>
    </div>
  </CalendarDialog>;
}
