import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import SceneFallback from './SceneFallback';

const green='#335f52', pink='#cf8b92', cream='#f9f1df', gold='#e6be79';
const upright=new THREE.Vector3(0,1,0);
function Pine({at=[0,0,0],size=1}) {
  return <group position={at} scale={size}>
    <mesh position={[0,.30,0]} castShadow><cylinderGeometry args={[.075,.12,.6,8]}/><meshStandardMaterial color="#8e6b5c"/></mesh>
    {[0,.32,.65].map((t,i)=><mesh key={i} position={[0,.65+t,0]} castShadow>
      <coneGeometry args={[.55-i*.12,.83,9]}/><meshStandardMaterial color={i===1?'#4a806b':green} roughness={.83}/>
    </mesh>)}
    <mesh position={[0,1.71,0]}><octahedronGeometry args={[.12,0]}/><meshStandardMaterial color={gold} emissive={gold} emissiveIntensity={.7}/></mesh>
  </group>;
}
function Cabin() {
  return <group position={[0,.05,0]}>
    <mesh position={[0,.45,0]} castShadow><boxGeometry args={[.86,.84,.72]}/><meshStandardMaterial color="#eec6b6" roughness={.9}/></mesh>
    <mesh position={[0,1.02,0]} rotation={[0,0,Math.PI/4]} castShadow><boxGeometry args={[.75,.75,.83]}/><meshStandardMaterial color="#a5575b" roughness={.75}/></mesh>
    <mesh position={[0,.35,.37]}><boxGeometry args={[.25,.48,.03]}/><meshStandardMaterial color="#946a5e"/></mesh>
    {[-.26,.26].map(x=><mesh key={x} position={[x,.65,.371]}><boxGeometry args={[.16,.17,.025]}/><meshStandardMaterial color="#ffe8a5" emissive="#e7b76c" emissiveIntensity={.7}/></mesh>)}
    <mesh position={[0,.045,0]}><cylinderGeometry args={[1.25,1.36,.14,36]}/><meshStandardMaterial color="#fbf4e6" roughness={1}/></mesh>
  </group>;
}
function SnowDust({reducedMotion}) {
  const geom=useMemo(()=>{
    const coords=[];
    for(let i=0;i<190;i++){
      const y=Math.random()*2.7-.2;
      const radius=Math.sqrt(Math.random())*Math.sqrt(Math.max(0,1.55*1.55-(y-1.22)**2));
      const angle=Math.random()*Math.PI*2;
      coords.push(Math.cos(angle)*radius,y,Math.sin(angle)*radius);
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(coords,3));return g;
  },[]);
  const ref=useRef();
  useFrame(({clock},dt)=>{if(!reducedMotion&&ref.current){ref.current.rotation.y+=dt*.055; ref.current.position.y=Math.sin(clock.elapsedTime*.43)*.055;}});
  return <points ref={ref} geometry={geom}><pointsMaterial color="#ffffff" size={.028} transparent opacity={.86} sizeAttenuation depthWrite={false}/></points>;
}
function GlobeModel({shake,reducedMotion}){
  const group=useRef();
  useFrame(({clock},dt)=>{
    if(!group.current)return;
    if(reducedMotion){group.current.rotation.z=0;return;}
    const target=shake ? Math.sin(clock.elapsedTime*22)*.11 : 0;
    group.current.rotation.z=THREE.MathUtils.lerp(group.current.rotation.z,target,Math.min(1,dt*6));
  });
  return <Float enabled={!reducedMotion} speed={.65} floatIntensity={.13} rotationIntensity={.045}>
    <group ref={group} position={[0,-.48,0]}>
      <mesh position={[0,-.25,0]} receiveShadow><cylinderGeometry args={[1.35,1.55,.43,72]}/><meshStandardMaterial color="#b88777" metalness={.25} roughness={.27}/></mesh>
      <mesh position={[0,-.03,0]}><cylinderGeometry args={[1.39,1.35,.07,72]}/><meshStandardMaterial color={gold} metalness={.75} roughness={.23}/></mesh>
      <group position={[0,.07,0]}>
        <mesh position={[0,1.12,0]} renderOrder={5}>
          <sphereGeometry args={[1.62,64,48]}/>
          <meshPhysicalMaterial color="#ffffff" transparent opacity={.18} metalness={.02} roughness={.025} clearcoat={1} clearcoatRoughness={.04} transmission={.6} thickness={.16} ior={1.25} depthWrite={false}/>
        </mesh>
        <mesh position={[-.46,2.14,1.05]} rotation={[.2,0,-.48]}><sphereGeometry args={[.23,20,12]}/><meshBasicMaterial color="#ffffff" transparent opacity={.17} depthWrite={false}/></mesh>
        <Cabin/>
        <Pine at={[-1.04,.1,-.34]} size={.72}/><Pine at={[1.07,.1,-.2]} size={.7}/>
        <Pine at={[-.73,.15,.78]} size={.39}/>
        <SnowDust reducedMotion={reducedMotion}/>
        {!reducedMotion&&<Sparkles count={32} scale={[2.7,2.6,2.6]} size={1.4} speed={.36} color="#fffdf3"/>}
      </group>
    </group>
  </Float>;
}
export default function SnowGlobe({reducedMotion}){
  const [shake,setShake]=useState(false);
  const shakeTimer=useRef();
  const controls=useRef(null);
  useEffect(()=>()=>clearTimeout(shakeTimer.current),[]);
  function shakeGlobe(){
    if(reducedMotion)return;
    clearTimeout(shakeTimer.current);
    setShake(true);
    shakeTimer.current=setTimeout(()=>setShake(false),850);
  }
  function rotateGlobe(event){
    if(event.target!==event.currentTarget||!['ArrowLeft','ArrowRight'].includes(event.key)||!controls.current)return;
    event.preventDefault();
    const {object:camera,target}=controls.current;
    const angle=event.key==='ArrowLeft'?.2:-.2;
    camera.position.sub(target).applyAxisAngle(upright,angle).add(target);
    controls.current.update();
  }
  const fallback=<div className="globe-fallback" role="img" aria-label="A Christmas tree inside a snow globe"><span aria-hidden="true">🎄</span></div>;
  return <div className="globe-wrap">
    <SceneFallback fallback={fallback}>
    <div className="globe-interactive" tabIndex={0} role="region" aria-label="Interactive snow globe. Use the left and right arrow keys to rotate." onKeyDown={rotateGlobe}>
    <Canvas onClick={shakeGlobe} frameloop={reducedMotion?'demand':'always'} shadows dpr={[1,1.7]} camera={{position:[0,1.42,6.25],fov:39}} gl={{antialias:true,alpha:true}}>
      <ambientLight intensity={1.55}/><hemisphereLight intensity={1.2} color="#f3f8ff" groundColor="#b69c8b"/>
      <directionalLight castShadow position={[3.5,7,5]} intensity={2.3} shadow-mapSize={[1024,1024]}/>
      <pointLight position={[-3,2,3]} color="#f7b6ac" intensity={20} distance={9}/>
      <GlobeModel shake={shake} reducedMotion={reducedMotion}/><OrbitControls ref={controls} enableDamping={!reducedMotion} enableZoom={false} enablePan={false} minPolarAngle={Math.PI*.33} maxPolarAngle={Math.PI*.65} rotateSpeed={.36}/>
    </Canvas>
    <div className="globe-instruction">Drag to spin{!reducedMotion&&<> · <button type="button" onClick={shakeGlobe}>Shake the globe</button></>}</div>
    </div>
    </SceneFallback>
  </div>;
}
