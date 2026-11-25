import React,{lazy,Suspense,useEffect,useMemo,useRef,useState,useSyncExternalStore} from 'react';
import {motion} from 'framer-motion';
import {ArrowUpRight,Gift,Images,Menu,Snowflake,Sparkles} from 'lucide-react';
import SnowGlobe from './components/SnowGlobe';
import Aurora from './components/Aurora';
import photosManifest from './data/photos.json';
const MemoryGallery=lazy(()=>import('./components/MemoryGallery'));
const GiftScene=lazy(()=>import('./components/GiftScene'));
const BASE=import.meta.env.BASE_URL;
const FRIENDS=['upasana','savani','ramyani','shreya','priya'];
const displayName=s=>s[0].toUpperCase()+s.slice(1);
const readRoute=()=>{
 const hash=location.hash.slice(1).toLowerCase();
 return FRIENDS.includes(hash.replace(/-preview$/,''))?hash:null;
};
const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
const subscribeMotion=listener=>{
 motionPreference.addEventListener('change',listener);
 return ()=>motionPreference.removeEventListener('change',listener);
};
function readCompleted(slug){try{const n=JSON.parse(localStorage.getItem('adv:'+slug)||'[]');return Array.isArray(n)?n:[]}catch{return []}}
function FallSnow(){const snow=useMemo(()=>Array.from({length:22},(_,i)=>({id:i,left:(i*47.83)%100,size:11+i%4*4,delay:-((i*2.1)%15),duration:15+i%8*2})),[]);return <div className="snow-layer" aria-hidden="true">{snow.map(f=><span key={f.id} style={{left:f.left+'%',fontSize:f.size,animationDelay:f.delay+'s',animationDuration:f.duration+'s'}}>❄</span>)}</div>}
function PhotoFloat({src,idx,reducedMotion}){
 const ref=useRef();
 const configs=[[-42,12,-12],[9,-14,8],[59,3,-7],[-16,108,8],[41,107,-6]];
 const [x,y,rotate]=configs[idx];
 const [v,setV]=useState({x:0,y:0});
 return <motion.div ref={ref} className={'hero-photo hero-photo-'+idx} style={{'--x':x+'%','--y':y+'px'}} animate={reducedMotion?{y:0,rotate}:{y:[0,-5,0],rotate:[rotate,rotate+.8,rotate]}} transition={reducedMotion?{duration:0}:{repeat:Infinity,duration:13+idx*2,ease:'easeInOut'}} onPointerMove={e=>{if(reducedMotion||!ref.current||matchMedia('(pointer:coarse)').matches)return;const r=ref.current.getBoundingClientRect();setV({x:(e.clientX-r.left-r.width/2)/18,y:(e.clientY-r.top-r.height/2)/18})}} onPointerLeave={()=>setV({x:0,y:0})}>
   <div className="hero-photo-frame" style={{transform:reducedMotion?undefined:`perspective(700px) rotateY(${v.x}deg) rotateX(${-v.y}deg)`}}><img src={src} alt="A shared memory" loading="lazy"/></div>
 </motion.div>;
}
function Home({onChoose,reducedMotion}){
 const [name,setName]=useState('');const [error,setError]=useState('');
 const picks=[8,12,5,21,16].map(d=>photosManifest.upasana[String(d)]).filter(Boolean);
 function submit(e){e.preventDefault();const slug=name.trim().toLowerCase();if(FRIENDS.includes(slug))onChoose(slug);else setError('We couldn’t find that calendar. Try one of the five names below.')}
 return <main className="landing">
   <div className="topline"><span className="tiny-star">✳</span> a little winter magic for our favorite people <span className="tiny-star">✳</span></div>
   <div className="home-hero">
     <div className="home-copy"><div className="eyebrow"><Snowflake size={14}/> the most wonderful time of the year</div>
       <h1>Puzzled <span>Pint Gals</span></h1><div className="advent-subtitle">ADVENT CALENDAR <span>✦</span> 2026</div>
       <p>Twenty-four little puzzles. Twenty-four memories. One whole season of us.</p>
       <form className="name-form" onSubmit={submit}><label htmlFor="friend-input">THIS ONE'S FOR YOU</label>
         <div className="input-wrap"><input id="friend-input" placeholder="Enter your name" value={name} onChange={e=>{setName(e.target.value);setError('')}} autoComplete="off"/><button type="submit">Open my calendar <ArrowUpRight size={17}/></button></div>
         {error&&<div className="form-error" role="alert">{error}</div>}
       </form>
       <div className="friend-links">{FRIENDS.map(f=><button key={f} onClick={()=>onChoose(f)}>{displayName(f)}</button>)}</div>
       <div className="fine-note"><span>made with love ♡</span><span>scroll for memories ↓</span></div>
     </div>
     <div className="globe-side"><SnowGlobe reducedMotion={reducedMotion}/><div className="globe-caption">a little world made just for us <span>✧</span></div></div>
   </div>
   <div className="floating-wall"><div className="floating-label"><Sparkles size={14}/> our moments, sprinkled everywhere</div>{picks.map((p,i)=><PhotoFloat key={i} src={BASE+p} idx={i} reducedMotion={reducedMotion}/>)}</div>
   <div className="home-footer">Here’s to the people who make every season feel warmer. <span>♡</span></div>
 </main>;
}
function App(){
 const [route,setRoute]=useState(readRoute);
 const friend=route?.replace(/-preview$/,'');
 const reducedMotion=useSyncExternalStore(subscribeMotion,()=>motionPreference.matches);
 const [completed,setCompleted]=useState(()=>friend?readCompleted(friend):[]);
 const [height,setHeight]=useState(1700);
 const [gallery,setGallery]=useState(false);
 const [finale,setFinale]=useState(false);
 const [mobileNav,setMobileNav]=useState(false);
 const iframe=useRef(null);
 useEffect(()=>{const onHash=()=>setRoute(readRoute());addEventListener('hashchange',onHash);return()=>removeEventListener('hashchange',onHash)},[]);
 useEffect(()=>{setCompleted(friend?readCompleted(friend):[]);setHeight(1700);setGallery(false);setFinale(false);},[route,friend]);
 const scrollHome=()=>window.scrollTo({top:0,behavior:motionPreference.matches?'instant':'smooth'});
 const choose=f=>{location.hash=f;setRoute(f);scrollHome()};
 const home=()=>{location.hash='';setRoute(null);scrollHome()};
 useEffect(()=>{const onMessage=e=>{
   if(e.origin!==location.origin||e.source!==iframe.current?.contentWindow)return;
   if(e.data?.type==='pint-resize')setHeight(Math.max(700,Math.min(10000,Number(e.data.height)||1700)));
   if(e.data?.type==='pint-progress')setCompleted(friend?readCompleted(friend):[]);
   if(e.data?.type==='pint-scroll')iframe.current.scrollIntoView({block:'start',behavior:'instant'});
   if(e.data?.type==='pint-home')home();
 };addEventListener('message',onMessage);return()=>removeEventListener('message',onMessage)},[friend]);
 const all=photosManifest[friend]||{};
 const unlocked=Object.entries(all).filter(([day])=>completed.includes(Number(day))).sort((a,b)=>Number(a[0])-Number(b[0])).map(([day,src])=>({day:Number(day),url:BASE+src}));
 const finalUnlocked=completed.includes(24);
 return <div className="app-root"><Aurora reducedMotion={reducedMotion}/>{!reducedMotion&&<FallSnow/>}
   {friend? <>
     <header className="app-header"><button className="brand" onClick={home}><span>❄</span> Puzzled Pint Gals</button>
       <div className="header-right"><div className="progress-chip"><span className="progress-dot"/>{completed.length} / 24 memories</div>
         <button className="header-pill" onClick={()=>setGallery(true)} disabled={!unlocked.length}><Images size={17}/> Memory gallery</button>
         <button className="header-pill gift-pill" onClick={()=>setFinale(true)} disabled={!finalUnlocked}><Gift size={17}/> Christmas gift</button>
         <button className="header-icon" onClick={()=>setMobileNav(v=>!v)} aria-label="Select friend"><Menu size={20}/></button>
       </div>
     </header>
     {mobileNav&&<div className="mobile-nav">{FRIENDS.map(f=><button key={f} onClick={()=>{choose(f);setMobileNav(false)}}>{displayName(f)}</button>)}</div>}
     <main className="calendar-shell"><div className="calendar-head"><div className="eyebrow">a December made for you <span>✳</span></div><h1>Dear {displayName(friend)}, <em>let's play.</em></h1><p>24 surprises, each with a little piece of our story.</p></div>
       <div className="embedded-wrapper"><iframe key={route} ref={iframe} src={`${BASE}legacy.html?embed=1#${route}`} title={`${displayName(friend)} Advent puzzles`} style={{height:height+'px'}} allow="autoplay"/></div>
     </main>
     <div className="footer">Made with all the love, laughter, and questionable decisions ♡</div>
   </> : <Home onChoose={choose} reducedMotion={reducedMotion}/>}
   <Suspense fallback={null}>
     {gallery&&unlocked.length>0&&<MemoryGallery photos={unlocked} reducedMotion={reducedMotion} onClose={()=>setGallery(false)}/>}
     {finale&&finalUnlocked&&<GiftScene reducedMotion={reducedMotion} message="Our greatest gift is getting to make memories together. Merry Christmas, darling! ♡" onClose={()=>setFinale(false)}/>}
   </Suspense>
 </div>;
}
export default App;
