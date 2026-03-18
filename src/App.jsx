import { useState, useEffect, useRef, useMemo } from "react";

const MOODS = {
  default:        { bg:"#0a0008", orb1:"#4B0082", orb2:"#B8860B", particle:"#B8860B", label:"The Nexus" },
  horror:         { bg:"#0d0003", orb1:"#8b0000", orb2:"#1a0000", particle:"#ff2244", label:"Horror" },
  scifi:          { bg:"#00030d", orb1:"#003366", orb2:"#001133", particle:"#00aaff", label:"Sci-Fi" },
  magic:          { bg:"#06020f", orb1:"#4B0082", orb2:"#1a0040", particle:"#cc88ff", label:"Magic" },
  action:         { bg:"#0d0500", orb1:"#8b3300", orb2:"#1a0800", particle:"#ff8800", label:"Action" },
  romance:        { bg:"#0d0205", orb1:"#6b1030", orb2:"#1a0510", particle:"#ff6688", label:"Romance" },
  fantasy:        { bg:"#020d04", orb1:"#1a4d00", orb2:"#0a2200", particle:"#44ff88", label:"Fantasy" },
  transformation: { bg:"#040d08", orb1:"#005533", orb2:"#330055", particle:"#00ffcc", label:"Transformation" },
  documentary:    { bg:"#0a0800", orb1:"#3d3000", orb2:"#1a1400", particle:"#ccaa66", label:"Documentary" },
  comedy:         { bg:"#000d0a", orb1:"#003d33", orb2:"#001a16", particle:"#00ddcc", label:"Comedy" },
  western:        { bg:"#0d0800", orb1:"#6b4400", orb2:"#1a1000", particle:"#ffaa44", label:"Western" },
  anime:          { bg:"#05000d", orb1:"#550066", orb2:"#002244", particle:"#ff44cc", label:"Anime" },
};

const PLATFORMS = [
  { id:"sora",   label:"Sora",         min:80,  max:180, note:"Single camera · event label · explicit emotion" },
  { id:"kling",  label:"Kling",        min:60,  max:120, note:"Motion first · explicit emotion" },
  { id:"runway", label:"Runway Gen-3", min:50,  max:100, note:"Style anchor first · strong verb" },
  { id:"hailuo", label:"Hailuo",       min:40,  max:80,  note:"Simple sentences · concrete nouns" },
  { id:"pika",   label:"Pika",         min:30,  max:60,  note:"Visual noun first · minimal adjectives" },
  { id:"other",  label:"Universal",    min:80,  max:150, note:"Balanced · works across platforms" },
];

const TIERS = [
  { id:"auto",   icon:"✦", label:"Full Auto",    sublabel:"Beginner",       color:"#44ff88", desc:"Pick a few things. Press one button. Lala builds everything for you." },
  { id:"semi",   icon:"◈", label:"Semi-Auto",    sublabel:"Casual Creator", color:"#00aaff", desc:"Give a small idea. The app fills in everything around it." },
  { id:"manual", icon:"◆", label:"Full Control", sublabel:"Intermediate",   color:"#B8860B", desc:"You drive every section. Full keyword banks. Full control." },
];

const ALL_GENRES = [
  {id:"scifi",label:"Science Fiction",cat:"Film · Narrative",mood:"scifi"},{id:"cyberpunk",label:"Cyberpunk",cat:"Film · Narrative",mood:"scifi"},{id:"spaceopera",label:"Space Opera",cat:"Film · Narrative",mood:"scifi"},{id:"horror",label:"Horror",cat:"Film · Narrative",mood:"horror"},{id:"bodyhorror",label:"Body Horror",cat:"Film · Narrative",mood:"horror"},{id:"cosmichorror",label:"Cosmic Horror",cat:"Film · Narrative",mood:"horror"},{id:"slasher",label:"Slasher",cat:"Film · Narrative",mood:"horror"},{id:"psychological",label:"Psychological Thriller",cat:"Film · Narrative",mood:"horror"},{id:"thriller",label:"Thriller",cat:"Film · Narrative",mood:"action"},{id:"noir",label:"Noir",cat:"Film · Narrative",mood:"action"},{id:"neonoir",label:"Neo-Noir",cat:"Film · Narrative",mood:"action"},{id:"mystery",label:"Mystery",cat:"Film · Narrative",mood:"horror"},{id:"crime",label:"Crime Drama",cat:"Film · Narrative",mood:"action"},{id:"heist",label:"Heist",cat:"Film · Narrative",mood:"action"},{id:"drama",label:"Drama",cat:"Film · Narrative",mood:"romance"},{id:"romance",label:"Romance",cat:"Film · Narrative",mood:"romance"},{id:"romcom",label:"Romantic Comedy",cat:"Film · Narrative",mood:"comedy"},{id:"comedy",label:"Comedy",cat:"Film · Narrative",mood:"comedy"},{id:"darkcomedy",label:"Dark Comedy",cat:"Film · Narrative",mood:"comedy"},{id:"satire",label:"Satire",cat:"Film · Narrative",mood:"comedy"},{id:"action",label:"Action",cat:"Film · Narrative",mood:"action"},{id:"adventure",label:"Adventure",cat:"Film · Narrative",mood:"action"},{id:"western",label:"Western",cat:"Film · Narrative",mood:"western"},{id:"spaghettiwestern",label:"Spaghetti Western",cat:"Film · Narrative",mood:"western"},{id:"fantasy",label:"Fantasy",cat:"Film · Narrative",mood:"fantasy"},{id:"darkfantasy",label:"Dark Fantasy",cat:"Film · Narrative",mood:"fantasy"},{id:"fairytale",label:"Fairy Tale",cat:"Film · Narrative",mood:"fantasy"},{id:"mythological",label:"Mythological / Epic",cat:"Film · Narrative",mood:"fantasy"},{id:"historical",label:"Historical / Period",cat:"Film · Narrative",mood:"western"},{id:"war",label:"War / Military",cat:"Film · Narrative",mood:"action"},{id:"biopic",label:"Biographical / Biopic",cat:"Film · Narrative",mood:"documentary"},{id:"comingofage",label:"Coming-of-Age",cat:"Film · Narrative",mood:"romance"},{id:"sliceoflife",label:"Slice of Life",cat:"Film · Narrative",mood:"romance"},{id:"dystopian",label:"Dystopian",cat:"Film · Narrative",mood:"scifi"},{id:"postapocalyptic",label:"Post-Apocalyptic",cat:"Film · Narrative",mood:"action"},{id:"survival",label:"Survival",cat:"Film · Narrative",mood:"action"},{id:"supernatural",label:"Supernatural",cat:"Film · Narrative",mood:"magic"},{id:"paranormal",label:"Paranormal",cat:"Film · Narrative",mood:"horror"},{id:"gothic",label:"Gothic",cat:"Film · Narrative",mood:"horror"},{id:"southerngothic",label:"Southern Gothic",cat:"Film · Narrative",mood:"horror"},{id:"magicalrealism",label:"Magical Realism",cat:"Film · Narrative",mood:"magic"},{id:"surrealist",label:"Surrealist",cat:"Film · Narrative",mood:"magic"},{id:"absurdist",label:"Absurdist",cat:"Film · Narrative",mood:"comedy"},{id:"arthouse",label:"Art House",cat:"Film · Narrative",mood:"documentary"},{id:"experimental",label:"Experimental / Avant-Garde",cat:"Film · Narrative",mood:"documentary"},{id:"superhero",label:"Superhero",cat:"Film · Narrative",mood:"action"},{id:"spy",label:"Spy / Espionage",cat:"Film · Narrative",mood:"action"},{id:"martialarts",label:"Martial Arts",cat:"Film · Narrative",mood:"action"},{id:"wuxia",label:"Wuxia",cat:"Film · Narrative",mood:"fantasy"},{id:"samurai",label:"Samurai / Jidaigeki",cat:"Film · Narrative",mood:"western"},{id:"gangster",label:"Gangster",cat:"Film · Narrative",mood:"action"},{id:"sports",label:"Sports Drama",cat:"Film · Narrative",mood:"action"},{id:"musical",label:"Musical Film",cat:"Film · Narrative",mood:"comedy"},{id:"dance",label:"Dance Film",cat:"Film · Narrative",mood:"romance"},{id:"horrorcomedy",label:"Horror Comedy",cat:"Film · Narrative",mood:"horror"},{id:"scifihorror",label:"Sci-Fi Horror",cat:"Film · Narrative",mood:"horror"},{id:"eroticthrill",label:"Erotic Thriller",cat:"Film · Narrative",mood:"romance"},{id:"politicalthriller",label:"Political Thriller",cat:"Film · Narrative",mood:"action"},
  {id:"documentary",label:"Documentary",cat:"Documentary",mood:"documentary"},{id:"mockumentary",label:"Mockumentary",cat:"Documentary",mood:"comedy"},{id:"foundfootage",label:"Found Footage",cat:"Documentary",mood:"horror"},{id:"truecrime",label:"True Crime",cat:"Documentary",mood:"horror"},{id:"naturedoc",label:"Nature / Wildlife",cat:"Documentary",mood:"documentary"},{id:"socialcomment",label:"Social Commentary",cat:"Documentary",mood:"documentary"},
  {id:"anime",label:"Anime",cat:"Animation",mood:"anime"},{id:"shonen",label:"Shōnen Anime",cat:"Animation",mood:"action"},{id:"shojo",label:"Shōjo Anime",cat:"Animation",mood:"romance"},{id:"seinen",label:"Seinen Anime",cat:"Animation",mood:"action"},{id:"mecha",label:"Mecha Anime",cat:"Animation",mood:"scifi"},{id:"isekai",label:"Isekai",cat:"Animation",mood:"fantasy"},{id:"animehorror",label:"Horror Anime",cat:"Animation",mood:"horror"},{id:"anim2d",label:"2D Animation Classic",cat:"Animation",mood:"comedy"},{id:"anim3d",label:"3D CGI Animation",cat:"Animation",mood:"scifi"},{id:"stopmotion",label:"Stop Motion",cat:"Animation",mood:"comedy"},
  {id:"fashionfilm",label:"Fashion Film",cat:"Fashion & Arts",mood:"romance"},{id:"fashionhorror",label:"Fashion Horror",cat:"Fashion & Arts",mood:"horror"},{id:"fashionscifi",label:"Fashion Sci-Fi",cat:"Fashion & Arts",mood:"scifi"},{id:"runwayfilm",label:"Runway / Catwalk Film",cat:"Fashion & Arts",mood:"romance"},{id:"editorial",label:"Editorial / Photo-Film",cat:"Fashion & Arts",mood:"documentary"},{id:"hautecouture",label:"Haute Couture Art Film",cat:"Fashion & Arts",mood:"magic"},{id:"streetwear",label:"Streetwear / Urban Culture",cat:"Fashion & Arts",mood:"action"},
  {id:"musicvideo",label:"Music Video",cat:"Music & Performance",mood:"anime"},{id:"concertfilm",label:"Concert Film",cat:"Music & Performance",mood:"action"},{id:"operafilm",label:"Opera Film",cat:"Music & Performance",mood:"romance"},{id:"balletfilm",label:"Ballet Film",cat:"Music & Performance",mood:"romance"},{id:"hiphopvisual",label:"Hip-Hop Visual",cat:"Music & Performance",mood:"action"},{id:"jazzfilm",label:"Jazz Film",cat:"Music & Performance",mood:"documentary"},{id:"gospelfilm",label:"Gospel / Spiritual Film",cat:"Music & Performance",mood:"magic"},
  {id:"transformation",label:"Transformation / Size Change",cat:"Specialty",mood:"transformation"},{id:"creaturefeature",label:"Creature Feature",cat:"Specialty",mood:"horror"},{id:"kaiju",label:"Kaiju / Giant Monster",cat:"Specialty",mood:"action"},{id:"miniworld",label:"Micro World / Miniaturization",cat:"Specialty",mood:"transformation"},
  {id:"horrorromcom",label:"Horror Rom-Com",cat:"Hybrid",mood:"horror"},{id:"scifiwestern",label:"Sci-Fi Western",cat:"Hybrid",mood:"scifi"},{id:"fantasyhorror",label:"Fantasy Horror",cat:"Hybrid",mood:"horror"},{id:"comedydrama",label:"Comedy Drama",cat:"Hybrid",mood:"comedy"},{id:"actionromance",label:"Action Romance",cat:"Hybrid",mood:"action"},{id:"scifiromance",label:"Sci-Fi Romance",cat:"Hybrid",mood:"scifi"},{id:"horrormusical",label:"Horror Musical",cat:"Hybrid",mood:"horror"},{id:"fashionhorrorromcom",label:"Fashion Horror Rom-Com",cat:"Hybrid",mood:"horror"},{id:"martialfantasy",label:"Martial Arts Fantasy",cat:"Hybrid",mood:"fantasy"},{id:"scifianime",label:"Sci-Fi Anime",cat:"Hybrid",mood:"anime"},
  {id:"culinary",label:"Culinary / Food Film",cat:"Lifestyle",mood:"documentary"},{id:"travel",label:"Travel / Wanderlust",cat:"Lifestyle",mood:"documentary"},{id:"wellness",label:"Wellness / Spiritual",cat:"Lifestyle",mood:"magic"},
];

const CAMERA_LIBRARY = {
  "Shot Size":["Extreme Close-Up (ECU)","Close-Up (CU)","Medium Close-Up (MCU)","Medium Shot (MS)","Cowboy Shot / Medium Full","Full Shot (FS)","Wide Shot (WS)","Extreme Wide Shot (EWS)","Two-Shot","Over-the-Shoulder (OTS)","Insert Shot","Cutaway","Reaction Shot","POV / First Person","Reverse Shot"],
  "Angle":["Eye Level","Low Angle","High Angle","Bird's Eye / Top-Down","Worm's Eye","Dutch Angle / Tilt","Oblique Angle","Aerial / Drone"],
  "Movement":["Static / Locked-Off","Pan Left","Pan Right","Tilt Up","Tilt Down","Dolly In / Push","Dolly Out / Pull Back","Dolly Zoom / Vertigo / Zolly","Lateral Truck","Tracking / Follow","Handheld / Shaky Cam","Steadicam Smooth Follow","Arc / Orbit Shot","Crane / Jib Rise","Whip Pan / Swish Pan","Snap Zoom / Crash Zoom","Slow Zoom In","Slow Zoom Out"],
  "Focus":["Rack Focus / Pull Focus","Deep Focus","Shallow Focus / Bokeh","Soft Focus","Split Diopter","Tilt-Shift Effect"],
  "Lens":["Anamorphic Wide","Fisheye / Distorted Wide","Telephoto Compressed","Macro / Extreme Macro","Long Lens Compression"],
  "Specialty":["Snorricam / Body Mount","Long Take / Oner","Slow Motion 120fps","Ultra Slow Motion 240fps","Time-Lapse","Hyper-Lapse","Freeze Frame","Reverse / Rewind","God's Eye View","Fly-Through","Impact / Crash Cam"],
};

const TRANSFORM_TYPES = [
  {id:"werewolf",label:"Werewolf Transformation",icon:"🐺"},{id:"weretiger",label:"Weretiger Transformation",icon:"🐯"},{id:"werebear",label:"Werebear Transformation",icon:"🐻"},{id:"werecreature",label:"Were-Creature (Custom Animal)",icon:"🦁"},{id:"hybrid_humanoid",label:"Hybrid Humanoid — Mid-State",icon:"⚡"},{id:"full_creature",label:"Full Creature Shift",icon:"🦎"},{id:"feral",label:"Feral Regression",icon:"🩸"},{id:"beast_emerge",label:"Beast Emergence — Breaks Through",icon:"💥"},{id:"shrink",label:"Shrinking / Miniaturization",icon:"🔬"},{id:"grow",label:"Growing / Gigantism",icon:"🏔"},{id:"selective_scale",label:"Selective Scale — Part of Body Only",icon:"✋"},{id:"person_to_object",label:"Person to Object / Inanimate",icon:"🗿"},{id:"object_to_person",label:"Object Gains Life",icon:"✨"},{id:"object_to_object",label:"Object to Object",icon:"🔄"},{id:"petrification",label:"Petrification / Freezing / Crystal",icon:"❄️"},{id:"dissolution",label:"Dissolving / Dispersal",icon:"🌫"},{id:"reconstruction",label:"Reconstruction from Fragments",icon:"🔩"},{id:"mechanization",label:"Mechanization / Cyborg Conversion",icon:"🤖"},{id:"elemental_merge",label:"Elemental Merge — Fire / Water / Shadow",icon:"🔥"},{id:"energy_form",label:"Becoming Pure Energy / Light",icon:"⚡"},{id:"age_forward",label:"Age Progression",icon:"⏩"},{id:"age_backward",label:"Age Regression",icon:"⏪"},{id:"possession",label:"Possession / Entity Takeover",icon:"👁"},{id:"duality",label:"Duality — Two Selves Simultaneously",icon:"🪞"},{id:"fusion",label:"Fusion with Another Being",icon:"💫"},{id:"costume_transform",label:"Costume / Outfit Transformation",icon:"👗"},{id:"custom",label:"Custom Transformation",icon:"✏️"},
];

const MAGIC_TYPES = {
  "Elemental":["Fire conjuring / Pyrokinesis","Water / Ice manipulation","Lightning / Electricity","Earth / Stone control","Wind / Air distortion","Shadow / Darkness","Light / Holy radiance","Void / Nothingness"],
  "Energy & Force":["Telekinesis — objects lifting and hurling","Force blast / Shockwave","Energy shield / Barrier","Gravity distortion","Time freeze / Slow field","Aura / Power flare"],
  "Summoning":["Creature summoning from portal","Spirit / Ghost materialization","Sigil / Rune activation","Portal / Vortex opening","Dimensional rift tearing"],
  "Body Magic":["Healing — wounds closing","Levitation / Flight ignition","Invisibility fade","Astral projection — soul leaving body","Transformation spell on another"],
  "Dark / Forbidden":["Curse casting — black smoke veins","Soul extraction — visible pull","Necromancy — dead rising","Blood magic — liquid moving unnaturally","Corruption spread — darkness consuming"],
  "Cosmic / Ancient":["Starlight channeling","Reality fracturing — world cracks like glass","Void magic — absolute black consuming","Music-based magic — sound becomes physical force","Prophecy vision overlay"],
};

const MAGIC_SOURCES=["Both hands outstretched","Single hand extended","Eyes glowing and emanating","Voice — sound becomes visible","Full body radiating","Weapon / Staff / Object","Environmental — from surroundings","Involuntary — uncontrolled release"];
const MAGIC_COLORS=["Blue-white electric","Deep crimson","Golden radiant","Void black","Nature green","Shadow purple","Silver moonlight","Cosmic multicolor","Corrupted dark orange","Pure white blinding"];
const MAGIC_TOLL=["Effortless — no strain","Slight strain — sweat, clenched jaw","Heavy cost — bleeding, shaking","Losing control — eyes changing, veins visible","Complete overload — body failing","Euphoric — feeding on the power"];

const KEYWORD_BANKS = {
  emotion:["terrified","desperate","resolute","heartbroken","euphoric","cold and detached","seething rage","quiet grief","disbelief","wonder and awe","contempt","guilt-ridden","defiant","tender","paranoid","exhausted","burning determination","hollow emptiness","overwhelmed","proud","hysterical","numb","conflicted","ecstatic","mournful","betrayed","vengeful","serene"],
  style:["film grain 35mm","anamorphic lens flare","desaturated teal-orange","high contrast noir","neon-soaked","golden hour warmth","cold clinical","practical lighting only","chiaroscuro shadows","bleach bypass","hyper-saturated","documentary vérité","slow-motion 120fps","timelapse","macro texture","soft bokeh","hard directional","overexposed dreamlike","underexposed moody","editorial color grade","black and white"],
  lighting:["single practical lamp","neon signs only","moonlight through window","golden magic hour","harsh fluorescent overhead","candlelight flickering","LED strip ambient","strobe / flash","silhouette backlight","fog diffused light","sunset rim light","underwater caustic","firelight glow","surgical spotlight","dusk blue hour","lightning flash","torch fire only","natural daylight overcast"],
  action:["reaches hesitantly","collapses to knees","breaks into a sprint","stares into camera","slams a door","pulls back sharply","whispers inaudible","raises both hands slowly","disappears into shadow","turns in slow motion","falls from height","catches someone","embraces tightly","pushes away","runs through crowd","stands perfectly still","exhales slowly","draws a weapon","throws an object","shields another","kneels","crawls forward","backs into a corner","lunges forward"],
  sound:["dead silence","heartbeat only","distant thunder","crowd murmur","single musical note","wind only","rainfall","crackling fire","mechanical hum","footsteps echoing","breath only","orchestral swell","bass drop","silence broken by impact","ambient electronic drone"],
  texture:["wet skin glistening","rough concrete","cracked leather","silk catching light","rusted metal","moss and bark","polished marble","shattered glass","fur and feathers","scales reflecting","liquid metal","burnt ash","neon on wet pavement","dust in light beam"],
  physics:["hair in slow motion","fabric billowing","water droplets suspended","sparks arcing","debris floating","smoke curling","gravity reversed","shockwave rippling","surface tension breaking","impact crater forming"],
};

const SAFE_VOCAB=[{risky:"mannequin",safe:"motionless figure"},{risky:"dead body",safe:"fallen figure"},{risky:"corpse",safe:"unconscious subject"},{risky:"blood",safe:"crimson liquid"},{risky:"naked",safe:"bare-shouldered / undraped"},{risky:"nude",safe:"undraped figure"},{risky:"strangling",safe:"grasping at the throat"},{risky:"explosion",safe:"shockwave eruption"},{risky:"gun",safe:"firearm raised"},{risky:"shooting",safe:"weapon discharge"},{risky:"decapitation",safe:"lethal impact"},{risky:"torture",safe:"severe duress"}];

const callClaude=async(system,userMsg)=>{
  const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system,messages:[{role:"user",content:userMsg}]})});
  const data=await res.json();
  return data.content?.map(b=>b.text||"").join("")||"";
};

// Fallback copy that works in sandboxed environments
const safeCopy=(text)=>{
  try{
    const ta=document.createElement("textarea");
    ta.value=text;
    ta.style.cssText="position:fixed;top:0;left:0;opacity:0;pointer-events:none;";
    document.body.appendChild(ta);
    ta.focus();ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    return true;
  }catch{return false;}
};

// Tutorial steps
const TUTORIAL_STEPS=[
  {icon:"💀",title:"Welcome to the Skull Groove Nexus",body:"This is your master prompt builder for AI video. Every genre. Every style. Every platform. Lala will guide you through it. Let's take a quick tour — it only takes 2 minutes."},
  {icon:"🎯",title:"Step 1 — Choose Your Experience",body:"Full Auto means Lala builds everything for you — just pick a few buttons. Semi-Auto means you give a small idea and the AI fills the rest. Full Control means you write every section yourself. Start with Full Auto if you're new."},
  {icon:"📺",title:"Step 2 — Pick Your Platform",body:"Each AI video platform reads prompts differently. Sora needs 80–180 words with an event label. Kling needs motion described first. Runway needs a style anchor. The app adjusts everything for the platform you choose."},
  {icon:"🌍",title:"Step 3 — Set the Atmosphere",body:"Pick a mood first — Horror, Sci-Fi, Fantasy, Romance, Action, and more. Watch the background shift to match. This sets the tone for your entire prompt and filters the genre suggestions."},
  {icon:"🎬",title:"Step 4 — Choose Your Genre",body:"Search any genre — there are 100+ including hybrids like Fashion Horror Rom-Com, Sci-Fi Western, Horror Musical. Pick one or combine multiple. The app suggests the best camera angles and styles for what you picked."},
  {icon:"📷",title:"Step 5 — Camera & Keywords",body:"IMPORTANT: Pick only ONE camera angle. Using two angles confuses the AI. Browse Shot Size, Angle, Movement, Focus, Lens, and Specialty shots. Click keyword tags to add emotion, style, lighting, sound, and physics detail."},
  {icon:"🔬",title:"Transform & Magic Modes",body:"Use the TRANSFORM tab for werewolf shifts, size changes, object transforms and more. Use the MAGIC tab for fire, lightning, necromancy, cosmic magic and more. Both tabs have dedicated fields built from real research."},
  {icon:"📊",title:"Word Count Zones",body:"Green = perfect range. Yellow = too short, add more detail. Orange = getting long. Red = over limit, Sora will start ignoring parts of your prompt. Always aim for green before you generate."},
  {icon:"✦",title:"Copy, Save & Export",body:"After generating — use COPY to grab the text, SAVE to add it to your Library, and EXPORT to open the full text in a pop-up you can select and copy manually. Your library saves everything this session."},
  {icon:"🎉",title:"You're Ready",body:"That's everything. Start with Full Auto, pick a genre, hit Generate, and see what Lala builds. If it gets flagged, turn on Sora-Safe Mode in the Negative section. Every test teaches you something. Let's build."},
];

const buildSystem=(platform)=>{
  const p=PLATFORMS.find(x=>x.id===platform)||PLATFORMS[5];
  return `You are Lalakisskissbeam — master of the Skull Groove Multiversal Nexus and the greatest AI video prompt engineer across all universes. You build prompts for ${p.label}.

HARD RULES:
- Output MUST be ${p.min}–${p.max} words. Count every word. Never exceed ${p.max}.
- Structure as labeled beats ONLY — no walls of text:
  [SCENE] ...
  [SUBJECT] ...  
  [ACTION] ...
  [CAMERA] ...
  [STYLE] ...
  [MOOD] ...
- ONE camera angle only — never two
- Emotions named explicitly — never implied
- Transformation: exact START STATE → transition verb → exact END STATE
- Magic: describe physical manifestation, not concept. "Light gathers at her palms" not "she casts a spell"
- Underrepresented characters: full detail — skin tone, hair texture, facial features
- Output ONLY the prompt. No preamble. No explanation.`;
};

function Particles({color}){
  const ref=useRef(null),parts=useRef([]),anim=useRef(null);
  useEffect(()=>{
    const c=ref.current;if(!c)return;
    const ctx=c.getContext("2d");c.width=window.innerWidth;c.height=window.innerHeight;
    parts.current=Array.from({length:36},()=>({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*2+.5,dx:(Math.random()-.5)*.35,dy:-Math.random()*.45-.1,a:Math.random()*.45+.1}));
    const draw=()=>{ctx.clearRect(0,0,c.width,c.height);parts.current.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=color+Math.floor(p.a*255).toString(16).padStart(2,"0");ctx.fill();p.x+=p.dx;p.y+=p.dy;p.a-=.0007;if(p.y<0||p.a<=0){p.y=c.height+10;p.x=Math.random()*c.width;p.a=Math.random()*.45+.1;}});anim.current=requestAnimationFrame(draw);};
    draw();return()=>cancelAnimationFrame(anim.current);
  },[color]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}}/>;
}

function Bubble({text,color}){
  return(
    <div style={{display:"flex",gap:"12px",background:"#0a0a0a99",border:`1px solid ${color}44`,borderRadius:"10px",padding:"14px 18px",marginBottom:"22px",backdropFilter:"blur(8px)"}}>
      <div style={{width:"38px",height:"38px",borderRadius:"50%",flexShrink:0,background:`radial-gradient(circle,${color}33,#0a0008)`,border:`2px solid ${color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"17px"}}>💀</div>
      <div>
        <div style={{fontSize:"9px",color,letterSpacing:"0.18em",marginBottom:"4px",fontFamily:"'DM Mono',monospace"}}>LALA · SKULL GROOVE NEXUS</div>
        <div style={{fontSize:"13px",color:"#e8e4d9",fontFamily:"'Crimson Text',serif",fontStyle:"italic",lineHeight:1.6}}>"{text}"</div>
      </div>
    </div>
  );
}

function Tag({label,active,color="#B8860B",onClick}){
  return <button onClick={onClick} style={{padding:"5px 11px",borderRadius:"3px",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"10px",letterSpacing:"0.03em",border:active?`1px solid ${color}`:"1px solid #1e1e28",background:active?`${color}22`:"#080810",color:active?color:"#444",transition:"all 0.12s",userSelect:"none"}}>{label}</button>;
}

function Card({num,title,color,children}){
  return(
    <div style={{background:"#0c0c14",border:"1px solid #1a1a24",borderRadius:"8px",padding:"20px",marginBottom:"10px"}}>
      <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"14px"}}>
        <div style={{width:"22px",height:"22px",borderRadius:"50%",background:`${color}22`,border:`1px solid ${color}66`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",color,fontFamily:"'DM Mono',monospace",flexShrink:0}}>{num}</div>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:"10px",color,letterSpacing:"0.18em",textTransform:"uppercase"}}>{title}</div>
      </div>
      {children}
    </div>
  );
}

function WordMeter({count,platform}){
  const p=PLATFORMS.find(x=>x.id===platform)||PLATFORMS[5];
  const pct=Math.min(count/p.max*100,100);
  const color=count===0?"#222":count<p.min?"#ffaa00":count<=p.max?"#44ff88":count<=400?"#ff8800":"#ff2244";
  const msg=count===0?"No output yet":count<p.min?`⚠ Too short — add ${p.min-count} more words`:count<=p.max?"✓ Perfect range":count<=400?`⚠ Getting long — ${p.max}w is optimal`:"✗ Over limit — may cause issues";
  return(
    <div style={{marginTop:"10px"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:"4px"}}>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:"10px",color,letterSpacing:"0.04em"}}>{msg}</span>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:"10px",color:"#333"}}>{count}w / {p.max}w max</span>
      </div>
      <div style={{height:"3px",background:"#111",borderRadius:"2px"}}>
        <div style={{height:"100%",width:`${pct}%`,background:color,transition:"width 0.3s, background 0.3s",borderRadius:"2px"}}/>
      </div>
    </div>
  );
}

export default function App(){
  const [screen,setScreen]=useState("welcome");
  const [tier,setTier]=useState(null);
  const [platform,setPlatform]=useState(null);
  const [moodKey,setMoodKey]=useState("default");
  const mood=MOODS[moodKey]||MOODS.default;
  const [tab,setTab]=useState("build");
  const [genreSearch,setGenreSearch]=useState("");
  const [genres,setGenres]=useState([]);
  const [settingText,setSettingText]=useState("");
  const [charText,setCharText]=useState("");
  const [actionText,setActionText]=useState("");
  const [userIdea,setUserIdea]=useState("");
  const [selEmotion,setSelEmotion]=useState([]);
  const [selCamera,setSelCamera]=useState("");
  const [camGroup,setCamGroup]=useState("Shot Size");
  const [selStyle,setSelStyle]=useState([]);
  const [selLight,setSelLight]=useState([]);
  const [selAction,setSelAction]=useState([]);
  const [soundText,setSoundText]=useState("");
  const [selSound,setSelSound]=useState([]);
  const [selTexture,setSelTexture]=useState([]);
  const [selPhysics,setSelPhysics]=useState([]);
  const [negText,setNegText]=useState("");
  const [safeMode,setSafeMode]=useState(false);
  const [showSafe,setShowSafe]=useState(false);
  const [beatCount,setBeatCount]=useState(3);
  const [keyBank,setKeyBank]=useState("emotion");
  const [txType,setTxType]=useState(null);
  const [txCustom,setTxCustom]=useState("");
  const [txSubject,setTxSubject]=useState("");
  const [txStart,setTxStart]=useState("");
  const [txEnd,setTxEnd]=useState("");
  const [txSpeed,setTxSpeed]=useState("");
  const [txReaction,setTxReaction]=useState("");
  const [txCamera,setTxCamera]=useState("");
  const [txEffects,setTxEffects]=useState([]);
  const [txSetting,setTxSetting]=useState("");
  const [magicTypes,setMagicTypes]=useState([]);
  const [magicSource,setMagicSource]=useState("");
  const [magicColor,setMagicColor]=useState("");
  const [magicToll,setMagicToll]=useState("");
  const [magicSubject,setMagicSubject]=useState("");
  const [magicSetting,setMagicSetting]=useState("");
  const [output,setOutput]=useState("");
  const [preview,setPreview]=useState("");
  const [loading,setLoading]=useState(false);
  const [copied,setCopied]=useState(false);
  const [saved,setSaved]=useState(false);
  const [library,setLibrary]=useState([]);
  const [showExport,setShowExport]=useState(false);
  const [exportText,setExportText]=useState("");
  const [tutorialOpen,setTutorialOpen]=useState(false);
  const [tutorialStep,setTutorialStep]=useState(0);

  const platData=PLATFORMS.find(p=>p.id===platform)||PLATFORMS[5];
  const tierData=TIERS.find(t=>t.id===tier);
  const wc=output.trim()?output.trim().split(/\s+/).length:0;
  const pwc=preview.trim()?preview.trim().split(/\s+/).length:0;

  const filteredGenres=useMemo(()=>{const q=genreSearch.toLowerCase();return q?ALL_GENRES.filter(g=>g.label.toLowerCase().includes(q)||g.cat.toLowerCase().includes(q)):ALL_GENRES;},[genreSearch]);
  const genreByCat=useMemo(()=>{const m={};filteredGenres.forEach(g=>{if(!m[g.cat])m[g.cat]=[];m[g.cat].push(g);});return m;},[filteredGenres]);
  const toggleArr=(arr,set,val)=>set(p=>p.includes(val)?p.filter(x=>x!==val):[...p,val]);

  useEffect(()=>{
    const gl=genres.map(id=>ALL_GENRES.find(g=>g.id===id)?.label).filter(Boolean).join(" + ");
    const lines=[gl&&`[GENRE] ${gl}`,settingText&&`[SETTING] ${settingText}`,charText&&`[CHARACTER] ${charText}${selEmotion.length?" · "+selEmotion.join(", "):""}`,actionText&&`[ACTION] ${actionText}`,selCamera&&`[CAMERA] ${selCamera}`,(selStyle.length||selLight.length)&&`[STYLE] ${[...selStyle,...selLight].slice(0,3).join(" · ")}`,negText&&`[NEGATIVE] ${negText}`].filter(Boolean).join("\n");
    setPreview(lines);
  },[genres,settingText,charText,selEmotion,actionText,selCamera,selStyle,selLight,negText]);

  const doGenerate=async(mode)=>{
    setLoading(true);setOutput("");
    const gl=genres.map(id=>ALL_GENRES.find(g=>g.id===id)?.label).filter(Boolean).join(" + ");
    let msg="";
    if(mode==="auto") msg=`Build a complete cinematic ${platData.label} video prompt. Genre: ${gl||"cinematic thriller"}. Structure as ${beatCount} labeled beats. Maximum ${platData.max} words.`;
    else if(mode==="tx"){
      const tl=txType==="custom"?txCustom:TRANSFORM_TYPES.find(t=>t.id===txType)?.label||"";
      msg=`Build a transformation video prompt:\nType: ${tl}\nSubject: ${txSubject}\nSTART: ${txStart}\nEND: ${txEnd}\nSpeed: ${txSpeed}\nReaction: ${txReaction}\nCamera: ${txCamera}\nEffects: ${txEffects.join(", ")}\nSetting: ${txSetting}`;
    } else if(mode==="magic"){
      msg=`Build a magic scene prompt. Describe PHYSICAL manifestation not concept.\nMagic: ${magicTypes.join(", ")}\nCaster: ${magicSubject}\nSource: ${magicSource}\nColor: ${magicColor}\nToll: ${magicToll}\nSetting: ${magicSetting}`;
    } else {
      const parts=[`Platform: ${platData.label}`,gl&&`Genre: ${gl}`,tier==="semi"&&userIdea&&`User idea: ${userIdea}`,settingText&&`Setting: ${settingText}`,charText&&`Characters: ${charText}${selEmotion.length?" | Emotion: "+selEmotion.join(", "):""}`,actionText&&`Action: ${actionText}`,selCamera&&`Camera: ${selCamera}`,selStyle.length&&`Style: ${selStyle.join(", ")}`,selLight.length&&`Lighting: ${selLight.join(", ")}`,(soundText||selSound.length)&&`Sound: ${soundText||selSound.join(", ")}`,(selTexture.length||selPhysics.length)&&`Detail: ${[...selTexture,...selPhysics].join(", ")}`,negText&&`Avoid: ${negText}`].filter(Boolean).join("\n");
      msg=`Build a ${platData.label} video prompt as ${beatCount} labeled beats from:\n\n${parts}`;
    }
    if(safeMode)msg+="\n\nUse Sora-safe cinematic vocabulary.";
    try{const r=await callClaude(buildSystem(platform||"other"),msg);setOutput(r);}catch{setOutput("Error generating. Please try again.");}
    setLoading(false);
  };

  const doSave=()=>{if(!output)return;setLibrary(p=>[{id:Date.now(),platform,tier,genres:genres.map(id=>ALL_GENRES.find(g=>g.id===id)?.label).filter(Boolean),prompt:output,date:new Date().toLocaleDateString(),words:wc,mode:tab},...p]);setSaved(true);setTimeout(()=>setSaved(false),2000);};
  const doCopy=()=>{if(!output)return;const ok=safeCopy(output);setCopied(true);setTimeout(()=>setCopied(false),2000);if(!ok){setExportText(output);setShowExport(true);}};
  const doExport=()=>{if(!output)return;const txt=["SKULL GROOVE PROMPT ARCHITECT","=".repeat(40),`Platform: ${platData?.label}`,`Date: ${new Date().toLocaleString()}`,`Words: ${wc}`,"=".repeat(40),"",output,"","© Darrio · Grandmacyn · Skull Groove Multiversal Nexus"].join("\n");setExportText(txt);setShowExport(true);};
  const doRemix=async()=>{if(!output)return;setLoading(true);try{const r=await callClaude(buildSystem(platform||"other"),`Remix this prompt — same concept, different camera angle and pacing:\n\n${output}`);setOutput(r);}catch{}setLoading(false);};

  // ── STYLE ATOMS ─────────────────────────────────────────────────────────────
  const ta={width:"100%",background:"#050508",border:"1px solid #1a1a24",borderRadius:"4px",color:"#bbb",fontFamily:"'DM Mono',monospace",fontSize:"12px",padding:"10px 12px",resize:"vertical",outline:"none",boxSizing:"border-box",lineHeight:1.7};
  const tb=(active)=>({padding:"7px 16px",borderRadius:"3px",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"10px",letterSpacing:"0.1em",textTransform:"uppercase",border:active?`1px solid ${mood.particle}`:"1px solid #1a1a24",background:active?`${mood.particle}18`:"transparent",color:active?mood.particle:"#444",transition:"all 0.15s"});
  const bigBtn=(off)=>({width:"100%",padding:"15px",background:off?"#111":mood.particle,border:"none",borderRadius:"6px",color:off?"#333":"#000",fontFamily:"'Bebas Neue',sans-serif",fontSize:"20px",letterSpacing:"0.12em",cursor:off?"default":"pointer",transition:"all 0.2s",marginTop:"12px"});
  const bg={minHeight:"100vh",background:mood.bg,transition:"background 0.6s",position:"relative",overflow:"hidden"};
  const fixedBg=<><div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}}><div style={{position:"absolute",top:"-20%",right:"-15%",width:"70vw",height:"70vw",background:`radial-gradient(circle,${mood.orb1}44 0%,transparent 65%)`,transition:"all 0.8s",borderRadius:"50%"}}/><div style={{position:"absolute",bottom:"-25%",left:"-15%",width:"55vw",height:"55vw",background:`radial-gradient(circle,${mood.orb2}33 0%,transparent 65%)`,transition:"all 0.8s",borderRadius:"50%"}}/></div><Particles color={mood.particle}/></>;
  const css=`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=Crimson+Text:ital,wght@0,400;1,400&display=swap');*{box-sizing:border-box;margin:0;padding:0;}button{outline:none;}::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:#222;}@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse{0%,100%{opacity:.3}50%{opacity:.7}}`;

  // ── EXPORT MODAL ─────────────────────────────────────────────────────────────
  const exportModal=showExport&&(
    <div style={{position:"fixed",inset:0,zIndex:100,background:"#000000cc",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}} onClick={()=>setShowExport(false)}>
      <div style={{background:"#0c0c14",border:`1px solid ${mood.particle}`,borderRadius:"10px",padding:"24px",maxWidth:"640px",width:"100%",maxHeight:"80vh",display:"flex",flexDirection:"column"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:"10px",color:mood.particle,letterSpacing:"0.2em"}}>SELECT ALL TEXT BELOW AND COPY</div>
          <button onClick={()=>setShowExport(false)} style={{background:"transparent",border:"none",color:"#555",fontSize:"18px",cursor:"pointer"}}>✕</button>
        </div>
        <div style={{fontSize:"9px",color:"#444",fontFamily:"'DM Mono',monospace",marginBottom:"10px",letterSpacing:"0.1em"}}>Tap inside the box → Select All (Ctrl+A or long press) → Copy</div>
        <textarea readOnly value={exportText} style={{...ta,flex:1,minHeight:"260px",color:"#c8c0b4",fontSize:"13px",fontFamily:"'Crimson Text',serif",lineHeight:1.8,cursor:"text"}} onFocus={e=>e.target.select()}/>
        <button onClick={()=>{safeCopy(exportText);setShowExport(false);}} style={{...bigBtn(false),marginTop:"12px",fontSize:"16px"}}>TAP TO COPY & CLOSE</button>
      </div>
    </div>
  );

  // ── TUTORIAL MODAL ────────────────────────────────────────────────────────────
  const step=TUTORIAL_STEPS[tutorialStep];
  const tutorialModal=tutorialOpen&&(
    <div style={{position:"fixed",inset:0,zIndex:100,background:"#000000dd",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div style={{background:"#0c0c14",border:`1px solid ${mood.particle}`,borderRadius:"12px",padding:"28px",maxWidth:"500px",width:"100%"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:"9px",color:"#444",letterSpacing:"0.15em"}}>TUTORIAL {tutorialStep+1} / {TUTORIAL_STEPS.length}</div>
          <button onClick={()=>setTutorialOpen(false)} style={{background:"transparent",border:"none",color:"#444",fontSize:"16px",cursor:"pointer"}}>✕ SKIP</button>
        </div>
        <div style={{textAlign:"center",fontSize:"48px",marginBottom:"16px"}}>{step.icon}</div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"24px",color:mood.particle,letterSpacing:"0.08em",textAlign:"center",marginBottom:"14px"}}>{step.title}</div>
        <div style={{fontFamily:"'Crimson Text',serif",fontSize:"15px",color:"#aaa",lineHeight:1.7,textAlign:"center",marginBottom:"24px"}}>{step.body}</div>
        <div style={{display:"flex",gap:"8px"}}>
          {tutorialStep>0&&<button onClick={()=>setTutorialStep(s=>s-1)} style={{flex:1,padding:"10px",background:"transparent",border:"1px solid #1a1a24",color:"#555",fontFamily:"'DM Mono',monospace",fontSize:"11px",cursor:"pointer",borderRadius:"4px",letterSpacing:"0.1em"}}>← BACK</button>}
          <button onClick={()=>{if(tutorialStep<TUTORIAL_STEPS.length-1){setTutorialStep(s=>s+1);}else{setTutorialOpen(false);}}} style={{flex:2,padding:"10px",background:mood.particle,border:"none",color:"#000",fontFamily:"'Bebas Neue',sans-serif",fontSize:"18px",cursor:"pointer",borderRadius:"4px",letterSpacing:"0.1em"}}>
            {tutorialStep<TUTORIAL_STEPS.length-1?"NEXT →":"LET'S BUILD ✦"}
          </button>
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:"5px",marginTop:"14px"}}>
          {TUTORIAL_STEPS.map((_,i)=><div key={i} style={{width:i===tutorialStep?"20px":"6px",height:"4px",borderRadius:"2px",background:i===tutorialStep?mood.particle:"#222",transition:"all 0.2s"}}/>)}
        </div>
      </div>
    </div>
  );

  if(screen==="welcome") return(
    <div style={bg}><style>{css}</style>{fixedBg}
      <div style={{position:"relative",zIndex:1,minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"40px 24px"}}>
        <div style={{fontSize:"clamp(70px,13vw,120px)",marginBottom:"20px",filter:`drop-shadow(0 0 40px ${mood.particle}66)`,animation:"pulse 3s infinite"}}>💀</div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(40px,8vw,80px)",color:"#B8860B",lineHeight:0.92,letterSpacing:"0.04em"}}>SKULL GROOVE</div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(16px,3vw,28px)",color:"#4B0082",letterSpacing:"0.22em",marginBottom:"14px"}}>MULTIVERSAL NEXUS</div>
        <div style={{fontFamily:"'Crimson Text',serif",fontSize:"15px",color:"#444",fontStyle:"italic",marginBottom:"40px"}}>"Music was the first magic of the universe."</div>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:"10px",color:"#2a2a2a",letterSpacing:"0.18em",marginBottom:"8px"}}>MASTER PROMPT BUILDER FOR AI VIDEO</div>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:"9px",color:"#1e1e1e",marginBottom:"32px"}}>SORA · KLING · RUNWAY · HAILUO · PIKA</div>
        <button onClick={()=>setScreen("tier")} style={{padding:"14px 44px",background:"transparent",border:`2px solid ${mood.particle}`,color:mood.particle,fontFamily:"'Bebas Neue',sans-serif",fontSize:"20px",letterSpacing:"0.2em",cursor:"pointer",borderRadius:"4px",transition:"all 0.2s"}} onMouseEnter={e=>e.currentTarget.style.background=mood.particle+"22"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>TOUCH THE EMBLEM · ENTER</button>
        <button onClick={()=>{setTutorialStep(0);setTutorialOpen(true);}} style={{marginTop:"14px",background:"transparent",border:"none",color:"#333",fontFamily:"'DM Mono',monospace",fontSize:"10px",cursor:"pointer",letterSpacing:"0.15em"}}>? HOW TO USE THIS APP</button>
      </div>
    </div>
  );

  if(screen==="tier") return(
    <div style={bg}><style>{css}</style>{fixedBg}
      <div style={{position:"relative",zIndex:1,maxWidth:"720px",margin:"0 auto",padding:"48px 24px"}}>
        <Bubble text="Welcome to the Nexus. Every universe. Every story. One door. How do you want to build today?" color={mood.particle}/>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(26px,5vw,46px)",color:"#e8e4d9",marginBottom:"24px",lineHeight:1}}>HOW DO YOU WANT<br/><span style={{color:mood.particle}}>TO BUILD TODAY?</span></div>
        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          {TIERS.map(t=>(
            <button key={t.id} onClick={()=>{setTier(t.id);setScreen("platform");}} style={{background:"#0c0c14",border:"1px solid #1a1a24",borderRadius:"8px",padding:"18px 22px",cursor:"pointer",textAlign:"left",transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=t.color;e.currentTarget.style.background=t.color+"12";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="#1a1a24";e.currentTarget.style.background="#0c0c14";}}>
              <div style={{display:"flex",alignItems:"center",gap:"14px"}}>
                <div style={{width:"40px",height:"40px",borderRadius:"50%",background:`${t.color}18`,border:`1px solid ${t.color}55`,display:"flex",alignItems:"center",justifyContent:"center",color:t.color,flexShrink:0,fontSize:"16px"}}>{t.icon}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"baseline",gap:"10px",marginBottom:"3px"}}><span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"20px",color:t.color,letterSpacing:"0.08em"}}>{t.label}</span><span style={{fontFamily:"'DM Mono',monospace",fontSize:"9px",color:"#333"}}>{t.sublabel}</span></div>
                  <div style={{fontFamily:"'Crimson Text',serif",fontSize:"13px",color:"#555",lineHeight:1.5}}>{t.desc}</div>
                </div>
                <div style={{color:"#2a2a2a",fontSize:"16px"}}>→</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if(screen==="platform") return(
    <div style={bg}><style>{css}</style>{fixedBg}
      <div style={{position:"relative",zIndex:1,maxWidth:"720px",margin:"0 auto",padding:"48px 24px"}}>
        <Bubble text="Every platform speaks a different language. Choose yours and I'll speak it fluently." color={mood.particle}/>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(26px,5vw,46px)",color:"#e8e4d9",marginBottom:"24px",lineHeight:1}}>WHERE IS YOUR<br/><span style={{color:mood.particle}}>VIDEO GOING?</span></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:"8px",marginBottom:"18px"}}>
          {PLATFORMS.map(p=>(
            <button key={p.id} onClick={()=>{setPlatform(p.id);setScreen("builder");}} style={{background:"#0c0c14",border:"1px solid #1a1a24",borderRadius:"8px",padding:"16px",cursor:"pointer",textAlign:"left",transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=mood.particle;e.currentTarget.style.background=mood.particle+"12";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="#1a1a24";e.currentTarget.style.background="#0c0c14";}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"18px",color:"#e8e4d9",marginBottom:"5px"}}>{p.label}</div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:"9px",color:"#2a2a2a",lineHeight:1.6}}>{p.note}</div>
            </button>
          ))}
        </div>
        <button onClick={()=>setScreen("tier")} style={{background:"transparent",border:"none",color:"#2a2a2a",fontFamily:"'DM Mono',monospace",fontSize:"10px",cursor:"pointer",letterSpacing:"0.1em"}}>← back</button>
      </div>
    </div>
  );

  // ── BUILDER ──────────────────────────────────────────────────────────────────
  const outputBlock=output&&(
    <div style={{background:"#0c0c14",border:`1px solid ${mood.particle}44`,borderRadius:"8px",padding:"20px",marginTop:"14px",animation:"fadeUp 0.3s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px",flexWrap:"wrap",gap:"7px"}}>
        <div style={{fontSize:"10px",color:mood.particle,letterSpacing:"0.18em",fontFamily:"'DM Mono',monospace"}}>GENERATED PROMPT</div>
        <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
          <button onClick={doCopy} style={tb(copied)}>{copied?"✓ COPIED":"COPY"}</button>
          <button onClick={doRemix} disabled={loading} style={tb(false)}>🔀 REMIX</button>
          <button onClick={doExport} style={tb(false)}>⬇ EXPORT</button>
          <button onClick={doSave} style={{...tb(saved),color:saved?"#44ff88":undefined}}>{saved?"✓ SAVED":"SAVE"}</button>
        </div>
      </div>
      <div style={{fontFamily:"'Crimson Text',serif",fontSize:"14px",color:"#c8c0b4",lineHeight:1.9,whiteSpace:"pre-wrap"}}>{output}</div>
      <WordMeter count={wc} platform={platform}/>
    </div>
  );

  return(
    <div style={bg}><style>{css}</style>{fixedBg}
      {exportModal}
      {tutorialModal}
      <div style={{position:"relative",zIndex:1,maxWidth:"880px",margin:"0 auto",padding:"28px 20px 100px"}}>

        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"22px",flexWrap:"wrap",gap:"8px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
            <button onClick={()=>setScreen("platform")} style={{background:"transparent",border:"none",color:"#2a2a2a",fontFamily:"'DM Mono',monospace",fontSize:"10px",cursor:"pointer",letterSpacing:"0.08em"}}>← BACK</button>
            <div style={{width:"1px",height:"16px",background:"#1a1a24"}}/>
            <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"18px",color:"#B8860B",letterSpacing:"0.06em"}}>SKULL GROOVE</span>
          </div>
          <div style={{display:"flex",gap:"6px",flexWrap:"wrap",alignItems:"center"}}>
            <button onClick={()=>{setTutorialStep(0);setTutorialOpen(true);}} style={{...tb(false),padding:"4px 10px",fontSize:"9px",color:"#555",borderColor:"#1a1a24"}}>? HOW TO USE</button>
            {tierData&&<div style={{fontFamily:"'DM Mono',monospace",fontSize:"9px",color:tierData.color,border:`1px solid ${tierData.color}44`,padding:"3px 8px",borderRadius:"2px"}}>{tierData.icon} {tierData.label}</div>}
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:"9px",color:mood.particle,border:`1px solid ${mood.particle}44`,padding:"3px 8px",borderRadius:"2px",transition:"all 0.3s"}}>{platData.label} · {platData.min}–{platData.max}w</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:"5px",marginBottom:"20px",flexWrap:"wrap"}}>
          {[["build","▶ BUILD"],["transform","🔬 TRANSFORM"],["magic","✦ MAGIC"],["library",`📁 LIBRARY (${library.length})`]].map(([id,lbl])=>(
            <button key={id} onClick={()=>{setTab(id);setOutput("");}} style={tb(tab===id)}>{lbl}</button>
          ))}
        </div>

        {/* ── BUILD ── */}
        {tab==="build"&&<div style={{animation:"fadeUp 0.3s ease"}}>
          <Bubble text={tier==="auto"?"Tell me almost nothing. I'll build the rest. That's what I'm here for.":tier==="semi"?"Give me a seed — just a small idea. I'll grow it into something real.":"You know what you want. Good. I'll make sure the tools are sharp."} color={mood.particle}/>

          <Card num="①" title="Atmosphere" color={mood.particle}>
            <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>
              {Object.entries(MOODS).filter(([k])=>k!=="default").map(([k,v])=><Tag key={k} label={v.label} active={moodKey===k} color={v.particle} onClick={()=>setMoodKey(k)}/>)}
            </div>
          </Card>

          <Card num="②" title="Genre — Every Genre Known to Cinema" color={mood.particle}>
            <input value={genreSearch} onChange={e=>setGenreSearch(e.target.value)} placeholder="Search — horror, wuxia, fashion film, anime, hybrid rom-com..." style={{...ta,resize:"none",padding:"8px 12px",marginBottom:"12px",color:"#888"}}/>
            <div style={{maxHeight:"240px",overflowY:"auto",paddingRight:"3px"}}>
              {Object.entries(genreByCat).map(([cat,gs])=>(
                <div key={cat} style={{marginBottom:"10px"}}>
                  <div style={{fontSize:"9px",color:"#1e1e1e",letterSpacing:"0.16em",marginBottom:"5px",textTransform:"uppercase",fontFamily:"'DM Mono',monospace"}}>{cat}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>{gs.map(g=><Tag key={g.id} label={g.label} active={genres.includes(g.id)} color={mood.particle} onClick={()=>toggleArr(genres,setGenres,g.id)}/>)}</div>
                </div>
              ))}
            </div>
            {genres.length>0&&<div style={{marginTop:"8px",fontSize:"10px",color:mood.particle,fontFamily:"'DM Mono',monospace"}}>✓ {genres.map(id=>ALL_GENRES.find(g=>g.id===id)?.label).join(" + ")}</div>}
          </Card>

          {tier==="semi"&&<Card num="②½" title="Your Idea — Give Me a Seed" color={mood.particle}>
            <textarea value={userIdea} onChange={e=>setUserIdea(e.target.value)} placeholder="Write a small idea, concept, or scene detail. AI fills in the rest..." rows={2} style={ta}/>
          </Card>}

          {tier!=="auto"&&<Card num="③" title="Characters — Who Is In This Scene?" color={mood.particle}>
            <textarea value={charText} onChange={e=>setCharText(e.target.value)} placeholder="Name · age · gender · ethnicity · skin tone · hair texture · clothing · posture..." rows={2} style={ta}/>
            <div style={{marginTop:"10px",fontSize:"9px",color:"#2a2a2a",letterSpacing:"0.12em",marginBottom:"6px",fontFamily:"'DM Mono',monospace"}}>EMOTION</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>{KEYWORD_BANKS.emotion.map(e=><Tag key={e} label={e} active={selEmotion.includes(e)} color={mood.particle} onClick={()=>toggleArr(selEmotion,setSelEmotion,e)}/>)}</div>
          </Card>}

          {tier!=="auto"&&<Card num="④" title="Setting & Environment" color={mood.particle}>
            <textarea value={settingText} onChange={e=>setSettingText(e.target.value)} placeholder="Architecture · lighting · time of day · textures · weather · atmosphere..." rows={2} style={ta}/>
          </Card>}

          {tier!=="auto"&&<Card num="⑤" title="Action / Event — What Happens?" color={mood.particle}>
            <textarea value={actionText} onChange={e=>setActionText(e.target.value)} placeholder="What happens? For transformation: START STATE → transition verb → END STATE..." rows={2} style={ta}/>
            <div style={{marginTop:"8px",display:"flex",flexWrap:"wrap",gap:"4px"}}>{KEYWORD_BANKS.action.slice(0,18).map(a=><Tag key={a} label={a} active={selAction.includes(a)} color={mood.particle} onClick={()=>toggleArr(selAction,setSelAction,a)}/>)}</div>
          </Card>}

          {tier!=="auto"&&<Card num="⑥" title="Camera — Every Cinematic Angle Known to Film" color={mood.particle}>
            <div style={{fontSize:"9px",color:"#cc2222",letterSpacing:"0.1em",marginBottom:"8px",fontFamily:"'DM Mono',monospace"}}>⚠ SELECT ONE ANGLE ONLY — ENFORCED BY RESEARCH</div>
            <div style={{display:"flex",gap:"4px",marginBottom:"10px",flexWrap:"wrap"}}>
              {Object.keys(CAMERA_LIBRARY).map(g=><button key={g} onClick={()=>setCamGroup(g)} style={tb(camGroup===g)}>{g}</button>)}
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>{CAMERA_LIBRARY[camGroup].map(c=><Tag key={c} label={c} active={selCamera===c} color={mood.particle} onClick={()=>setSelCamera(selCamera===c?"":c)}/>)}</div>
            {selCamera&&<div style={{marginTop:"7px",fontSize:"10px",color:mood.particle,fontFamily:"'DM Mono',monospace"}}>✓ {selCamera}</div>}
          </Card>}

          {tier!=="auto"&&<Card num="⑦" title="Style · Lighting · Sound · Texture · Physics" color={mood.particle}>
            <div style={{display:"flex",gap:"4px",marginBottom:"10px",flexWrap:"wrap"}}>
              {["emotion","style","lighting","sound","texture","physics"].map(b=><button key={b} onClick={()=>setKeyBank(b)} style={tb(keyBank===b)}>{b}</button>)}
            </div>
            {keyBank==="emotion"&&<div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>{KEYWORD_BANKS.emotion.map(e=><Tag key={e} label={e} active={selEmotion.includes(e)} color={mood.particle} onClick={()=>toggleArr(selEmotion,setSelEmotion,e)}/>)}</div>}
            {keyBank==="style"&&<div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>{KEYWORD_BANKS.style.map(s=><Tag key={s} label={s} active={selStyle.includes(s)} color={mood.particle} onClick={()=>toggleArr(selStyle,setSelStyle,s)}/>)}</div>}
            {keyBank==="lighting"&&<div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>{KEYWORD_BANKS.lighting.map(l=><Tag key={l} label={l} active={selLight.includes(l)} color={mood.particle} onClick={()=>toggleArr(selLight,setSelLight,l)}/>)}</div>}
            {keyBank==="sound"&&<><textarea value={soundText} onChange={e=>setSoundText(e.target.value)} placeholder="Sound, audio, or dialogue cues..." rows={1} style={{...ta,marginBottom:"7px"}}/><div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>{KEYWORD_BANKS.sound.map(s=><Tag key={s} label={s} active={selSound.includes(s)} color={mood.particle} onClick={()=>toggleArr(selSound,setSelSound,s)}/>)}</div></>}
            {keyBank==="texture"&&<div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>{KEYWORD_BANKS.texture.map(t=><Tag key={t} label={t} active={selTexture.includes(t)} color={mood.particle} onClick={()=>toggleArr(selTexture,setSelTexture,t)}/>)}</div>}
            {keyBank==="physics"&&<div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>{KEYWORD_BANKS.physics.map(p=><Tag key={p} label={p} active={selPhysics.includes(p)} color={mood.particle} onClick={()=>toggleArr(selPhysics,setSelPhysics,p)}/>)}</div>}
          </Card>}

          <Card num="⑧" title="Negative Constraints + Safe Vocabulary" color={mood.particle}>
            <textarea value={negText} onChange={e=>setNegText(e.target.value)} placeholder="What to avoid — blurry, cartoon, watermark, jumpcuts, text on screen..." rows={2} style={ta}/>
            <div style={{display:"flex",gap:"7px",marginTop:"10px",flexWrap:"wrap"}}>
              <button onClick={()=>setSafeMode(!safeMode)} style={tb(safeMode)}>{safeMode?"✓ SORA-SAFE ON":"○ SORA-SAFE MODE (OPTIONAL)"}</button>
              <button onClick={()=>setShowSafe(!showSafe)} style={tb(false)}>{showSafe?"HIDE":"VIEW"} VOCAB GUIDE</button>
            </div>
            {showSafe&&<div style={{marginTop:"10px",background:"#080810",border:"1px solid #1a1a24",borderRadius:"4px",padding:"12px"}}>
              <div style={{fontSize:"9px",color:"#333",letterSpacing:"0.14em",marginBottom:"8px",fontFamily:"'DM Mono',monospace"}}>USE IF YOUR PROMPT KEEPS GETTING FLAGGED</div>
              {SAFE_VOCAB.map((v,i)=><div key={i} style={{display:"flex",gap:"10px",alignItems:"center",marginBottom:"5px",fontFamily:"'DM Mono',monospace",fontSize:"10px"}}><span style={{color:"#ff4444",minWidth:"110px"}}>{v.risky}</span><span style={{color:"#333"}}>→</span><span style={{color:"#44ff88"}}>{v.safe}</span></div>)}
            </div>}
          </Card>

          <Card num="⑨" title="Beat Builder — How Many Beats?" color={mood.particle}>
            <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
              {[2,3,4,5,6,7].map(n=><button key={n} onClick={()=>setBeatCount(n)} style={{padding:"8px 15px",borderRadius:"3px",cursor:"pointer",fontFamily:"'Bebas Neue',sans-serif",fontSize:"18px",border:beatCount===n?`1px solid ${mood.particle}`:"1px solid #1a1a24",background:beatCount===n?`${mood.particle}22`:"#080810",color:beatCount===n?mood.particle:"#2a2a2a",transition:"all 0.15s"}}>{n}</button>)}
            </div>
          </Card>

          {preview&&<div style={{background:"#0c0c14",border:`1px dashed ${mood.particle}33`,borderRadius:"8px",padding:"18px",marginBottom:"10px"}}>
            <div style={{fontSize:"9px",color:"#2a2a2a",letterSpacing:"0.18em",marginBottom:"8px",fontFamily:"'DM Mono',monospace"}}>LIVE PREVIEW — EDIT SECTIONS ABOVE TO ADJUST</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:"11px",color:"#333",whiteSpace:"pre-wrap",lineHeight:1.8}}>{preview}</div>
            <WordMeter count={pwc} platform={platform}/>
          </div>}

          <button onClick={()=>doGenerate(tier==="auto"?"auto":"manual")} disabled={loading} style={bigBtn(loading)}>
            {loading?"⏳  LALA IS BUILDING YOUR PROMPT...":"▶  GENERATE PROMPT"}
          </button>
          {outputBlock}
        </div>}

        {/* ── TRANSFORM ── */}
        {tab==="transform"&&<div style={{animation:"fadeUp 0.3s ease"}}>
          <Bubble text="Transformation is not just change. It is revelation. Tell me where they start, where they end, and what breaks in between." color={mood.particle}/>

          <Card num="①" title="Transformation Type" color={mood.particle}>
            <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>
              {TRANSFORM_TYPES.map(t=><button key={t.id} onClick={()=>setTxType(txType===t.id?null:t.id)} style={{padding:"6px 12px",borderRadius:"3px",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"10px",border:txType===t.id?`1px solid ${mood.particle}`:"1px solid #1a1a24",background:txType===t.id?`${mood.particle}22`:"#080810",color:txType===t.id?mood.particle:"#444",transition:"all 0.12s"}}>{t.icon} {t.label}</button>)}
            </div>
            {txType==="custom"&&<textarea value={txCustom} onChange={e=>setTxCustom(e.target.value)} placeholder="Describe your transformation..." rows={2} style={{...ta,marginTop:"10px"}}/>}
          </Card>

          <Card num="②" title="Subject — Who or What Is Transforming?" color={mood.particle}>
            <textarea value={txSubject} onChange={e=>setTxSubject(e.target.value)} placeholder="Full description — name, appearance, skin tone, hair, clothing, posture before transformation..." rows={2} style={ta}/>
          </Card>

          <Card num="③" title="START STATE → END STATE" color={mood.particle}>
            <div style={{fontSize:"9px",color:"#cc2222",letterSpacing:"0.1em",marginBottom:"8px",fontFamily:"'DM Mono',monospace"}}>⚠ RESEARCH RULE: Describe both states explicitly. Sora cannot infer what it is not told.</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}}>
              <div><div style={{fontSize:"9px",color:"#2a2a2a",marginBottom:"4px",fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em"}}>START STATE</div><textarea value={txStart} onChange={e=>setTxStart(e.target.value)} placeholder="e.g. Standing 6 feet tall — normal human, wool jacket..." rows={3} style={ta}/></div>
              <div><div style={{fontSize:"9px",color:"#2a2a2a",marginBottom:"4px",fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em"}}>END STATE</div><textarea value={txEnd} onChange={e=>setTxEnd(e.target.value)} placeholder="e.g. Full wolf-hybrid — 7 feet, fur through skin, face elongated..." rows={3} style={ta}/></div>
            </div>
          </Card>

          <Card num="④" title="Transformation Speed" color={mood.particle}>
            <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>
              {["Instantaneous flash","Rapid 1–2 seconds","Steady 3–5 seconds","Gradual over full scene","Frame-by-frame creep"].map(s=><Tag key={s} label={s} active={txSpeed===s} color={mood.particle} onClick={()=>setTxSpeed(txSpeed===s?"":s)}/>)}
            </div>
          </Card>

          <Card num="⑤" title="Character Reaction — Explicit Emotion" color={mood.particle}>
            <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>
              {["Terrified — screaming","Stunned — silent disbelief","Fighting it — resisting","Surrendering — going limp","Euphoric — embracing it","In pain — writhing","Confused — disoriented","Laughing — manic","Crying quietly","Roaring — primal release","Blacking out","Eyes wide watching themselves"].map(r=><Tag key={r} label={r} active={txReaction===r} color={mood.particle} onClick={()=>setTxReaction(txReaction===r?"":r)}/>)}
            </div>
          </Card>

          <Card num="⑥" title="Camera Angle — Transformation Specific" color={mood.particle}>
            <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>
              {["Extreme close-up on changing body part","Medium shot — full body visible","Wide shot — scale vs environment","POV of the subject transforming","Witness reaction shot","Split focus — subject sharp world blurs","Slow orbit around transformation","Low angle as they grow","High angle as they shrink"].map(c=><Tag key={c} label={c} active={txCamera===c} color={mood.particle} onClick={()=>setTxCamera(txCamera===c?"":c)}/>)}
            </div>
          </Card>

          <Card num="⑦" title="Visual Effects — What Does It Look Like?" color={mood.particle}>
            <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>
              {["Skin rippling like water","Bones visibly reshaping","Fur erupting through skin","Glowing seams splitting","Particles dissolving outward","Clothes tearing apart","Shadow growing independently","Color draining from skin","Veins lighting up","Voice pitch shifting","Environment reacting — floor cracking","Eyes changing color completely","Teeth elongating","Muscles expanding rapidly","Steam rising from skin","Scales forming over flesh"].map(e=><Tag key={e} label={e} active={txEffects.includes(e)} color={mood.particle} onClick={()=>toggleArr(txEffects,setTxEffects,e)}/>)}
            </div>
          </Card>

          <Card num="⑧" title="Setting (Optional)" color={mood.particle}>
            <textarea value={txSetting} onChange={e=>setTxSetting(e.target.value)} placeholder="Where does it happen? Lighting, environment..." rows={2} style={ta}/>
          </Card>

          <button onClick={()=>doGenerate("tx")} disabled={loading||!txType} style={bigBtn(loading||!txType)}>
            {loading?"⏳  BUILDING TRANSFORMATION PROMPT...":"🔬  BUILD TRANSFORMATION PROMPT"}
          </button>
          {outputBlock}
        </div>}

        {/* ── MAGIC ── */}
        {tab==="magic"&&<div style={{animation:"fadeUp 0.3s ease"}}>
          <Bubble text="Music was the first magic of the universe. Every form of it that exists — I helped bring into the world. Show me what yours looks like." color={mood.particle}/>

          <Card num="①" title="Magic Type" color={mood.particle}>
            {Object.entries(MAGIC_TYPES).map(([cat,types])=>(
              <div key={cat} style={{marginBottom:"10px"}}>
                <div style={{fontSize:"9px",color:"#1e1e1e",letterSpacing:"0.14em",marginBottom:"5px",fontFamily:"'DM Mono',monospace",textTransform:"uppercase"}}>{cat}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>{types.map(t=><Tag key={t} label={t} active={magicTypes.includes(t)} color={mood.particle} onClick={()=>toggleArr(magicTypes,setMagicTypes,t)}/>)}</div>
              </div>
            ))}
          </Card>

          <Card num="②" title="The Caster" color={mood.particle}>
            <textarea value={magicSubject} onChange={e=>setMagicSubject(e.target.value)} placeholder="Full description of caster — appearance, emotion, clothing, stance..." rows={2} style={ta}/>
          </Card>

          <Card num="③" title="Magic Source" color={mood.particle}>
            <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>{MAGIC_SOURCES.map(s=><Tag key={s} label={s} active={magicSource===s} color={mood.particle} onClick={()=>setMagicSource(magicSource===s?"":s)}/>)}</div>
          </Card>

          <Card num="④" title="Color & Visual Signature" color={mood.particle}>
            <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>{MAGIC_COLORS.map(c=><Tag key={c} label={c} active={magicColor===c} color={mood.particle} onClick={()=>setMagicColor(magicColor===c?"":c)}/>)}</div>
          </Card>

          <Card num="⑤" title="Physical Toll on the Caster" color={mood.particle}>
            <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>{MAGIC_TOLL.map(t=><Tag key={t} label={t} active={magicToll===t} color={mood.particle} onClick={()=>setMagicToll(magicToll===t?"":t)}/>)}</div>
          </Card>

          <Card num="⑥" title="Setting (Optional)" color={mood.particle}>
            <textarea value={magicSetting} onChange={e=>setMagicSetting(e.target.value)} placeholder="Environment, lighting, atmosphere where magic happens..." rows={2} style={ta}/>
          </Card>

          <button onClick={()=>doGenerate("magic")} disabled={loading||magicTypes.length===0} style={bigBtn(loading||magicTypes.length===0)}>
            {loading?"⏳  CHANNELING THE FIRST MAGIC...":"✦  BUILD MAGIC PROMPT"}
          </button>
          {outputBlock}
        </div>}

        {/* ── LIBRARY ── */}
        {tab==="library"&&<div style={{animation:"fadeUp 0.3s ease"}}>
          <Bubble text="Every story you've built lives here. The Nexus remembers what you create." color={mood.particle}/>
          {library.length===0
            ?<div style={{background:"#0c0c14",border:"1px solid #1a1a24",borderRadius:"8px",padding:"48px",textAlign:"center",color:"#222",fontFamily:"'DM Mono',monospace",fontSize:"11px"}}>No saved prompts yet. Build something and save it.</div>
            :library.map(e=>(
              <div key={e.id} style={{background:"#0c0c14",border:"1px solid #1a1a24",borderLeft:`3px solid ${mood.particle}`,borderRadius:"8px",padding:"18px",marginBottom:"8px"}}>
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:"5px",marginBottom:"8px"}}>
                  <div style={{display:"flex",gap:"7px",fontFamily:"'DM Mono',monospace",fontSize:"9px",flexWrap:"wrap"}}>
                    <span style={{color:mood.particle}}>{e.platform?.toUpperCase()}</span>
                    <span style={{color:"#222"}}>·</span><span style={{color:"#333"}}>{e.mode}</span>
                    <span style={{color:"#222"}}>·</span><span style={{color:"#333"}}>{e.genres?.join(" + ")}</span>
                  </div>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:"9px",color:"#1e1e1e"}}>{e.date} · {e.words}w</span>
                </div>
                <div style={{fontFamily:"'Crimson Text',serif",fontSize:"13px",color:"#777",lineHeight:1.8,whiteSpace:"pre-wrap",marginBottom:"10px"}}>{e.prompt}</div>
                <div style={{display:"flex",gap:"5px"}}>
                  <button onClick={()=>navigator.clipboard.writeText(e.prompt)} style={tb(false)}>COPY</button>
                  <button onClick={()=>setLibrary(p=>p.filter(x=>x.id!==e.id))} style={{...tb(false),color:"#ff3333",borderColor:"#33000055"}}>DELETE</button>
                </div>
              </div>
            ))
          }
        </div>}

      </div>
      <div style={{position:"fixed",bottom:0,left:0,right:0,padding:"8px 20px",display:"flex",justifyContent:"space-between",zIndex:10,background:`linear-gradient(transparent,${mood.bg})`,pointerEvents:"none"}}>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:"9px",color:"#111",letterSpacing:"0.1em"}}>SKULL GROOVE PROMPT ARCHITECT v2.0</span>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:"9px",color:"#111",letterSpacing:"0.1em"}}>© DARRIO · GRANDMACYN</span>
      </div>
    </div>
  );
}

