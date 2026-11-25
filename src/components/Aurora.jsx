import React,{useMemo,useRef} from 'react';
import {Canvas,useFrame,useThree} from '@react-three/fiber';
import SceneFallback from './SceneFallback';
function AuroraPlane({reducedMotion}){
 const ref=useRef();const {viewport}=useThree();
 const uniforms=useMemo(()=>({uTime:{value:0}}),[]);
 useFrame(({clock})=>{if(ref.current)ref.current.uniforms.uTime.value=reducedMotion?0:clock.elapsedTime;});
 const shader={uniforms,vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,1.0);}`,
 fragmentShader:`precision mediump float;uniform float uTime;varying vec2 vUv;
 vec3 pal(float t){return mix(vec3(.96,.945,.915),vec3(.82,.905,.86),clamp(t,0.,1.));}
 void main(){vec2 p=vUv;float t=uTime*.055;
 float wave=sin((p.x*2.1+p.y*.7)*3.+t)*.5+.5;
 float x=sin(p.y*3.5+t+p.x*2.)*.5+.5;
 float a=exp(-length((p-vec2(.17+sin(t*.8)*.13,.76))*vec2(1.0,1.25))*3.0);
 float b=exp(-length((p-vec2(.9,.38+cos(t*.7)*.14))*vec2(1.1,1.5))*2.7);
 vec3 col=vec3(.975,.965,.945);
 col=mix(col,vec3(.87,.94,.88),a*.49);
 col=mix(col,vec3(.96,.84,.85),b*.43);
 col=mix(col,vec3(.94,.87,.76),wave*x*.11);
 gl_FragColor=vec4(col,1.0);}`};
 return <mesh scale={[viewport.width/2,viewport.height/2,1]}><planeGeometry args={[2,2]}/><shaderMaterial ref={ref} args={[shader]} depthTest={false} depthWrite={false}/></mesh>;
}
export default function Aurora({reducedMotion}){
 return <div className="aurora-shader" aria-hidden="true"><SceneFallback fallback={null}>
   <Canvas frameloop={reducedMotion?'demand':'always'} orthographic camera={{position:[0,0,1],zoom:1}} gl={{alpha:false,antialias:false}} dpr={[1,1.25]}><AuroraPlane reducedMotion={reducedMotion}/></Canvas>
 </SceneFallback></div>;
}
