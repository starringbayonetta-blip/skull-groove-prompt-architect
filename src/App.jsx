import { useState, useRef, useMemo } from "react";

const MOODS={default:{bg:"#0a0008",o1:"#4B0082",o2:"#B8860B",p:"#B8860B"},horror:{bg:"#0d0003",o1:"#8b0000",o2:"#1a0000",p:"#ff2244"},scifi:{bg:"#00030d",o1:"#003366",o2:"#001133",p:"#00aaff"},magic:{bg:"#06020f",o1:"#4B0082",o2:"#1a0040",p:"#cc88ff"},action:{bg:"#0d0500",o1:"#8b3300",o2:"#1a0800",p:"#ff8800"},romance:{bg:"#0d0205",o1:"#6b1030",o2:"#1a0510",p:"#ff6688"},fantasy:{bg:"#020d04",o1:"#1a4d00",o2:"#0a2200",p:"#44ff88"},transformation:{bg:"#040d08",o1:"#005533",o2:"#330055",p:"#00ffcc"},documentary:{bg:"#0a0800",o1:"#3d3000",o2:"#1a1400",p:"#ccaa66"},comedy:{bg:"#000d0a",o1:"#003d33",o2:"#001a16",p:"#00ddcc"},western:{bg:"#0d0800",o1:"#6b4400",o2:"#1a1000",p:"#ffaa44"},anime:{bg:"#05000d",o1:"#550066",o2:"#002244",p:"#ff44cc"}};

const GENRE_MOOD={scifi:"scifi",cyberpunk:"scifi",spaceopera:"scifi",dystopian:"scifi",mecha:"scifi",scifihorror:"scifi",scifiwestern:"scifi",scifiromance:"scifi",scifianime:"scifi",horror:"horror",bodyhorror:"horror",cosmichorror:"horror",slasher:"horror",paranormal:"horror",gothic:"horror",southerngothic:"horror",foundfootage:"horror",truecrime:"horror",animehorror:"horror",fashionhorror:"horror",horrorcomedy:"horror",fantasyhorror:"horror",horrormusical:"horror",fashionhorrorromcom:"horror",creaturefeature:"horror",action:"action",thriller:"action",noir:"action",neonoir:"action",crime:"action",heist:"action",adventure:"action",war:"action",superhero:"action",spy:"action",martialarts:"action",gangster:"action",sports:"action",postapocalyptic:"action",survival:"action",kaiju:"action",actionromance:"action",hiphopvisual:"action",concertfilm:"action",streetwear:"action",romance:"romance",drama:"romance",comingofage:"romance",sliceoflife:"romance",dance:"romance",eroticthrill:"romance",operafilm:"romance",balletfilm:"romance",fashionfilm:"romance",runwayfilm:"romance",comedy:"comedy",romcom:"comedy",darkcomedy:"comedy",satire:"comedy",absurdist:"comedy",musical:"comedy",mockumentary:"comedy",anim2d:"comedy",stopmotion:"comedy",comedydrama:"comedy",fantasy:"fantasy",darkfantasy:"fantasy",fairytale:"fantasy",mythological:"fantasy",supernatural:"fantasy",magicalrealism:"magic",wuxia:"fantasy",gospelfilm:"fantasy",wellness:"magic",hautecouture:"magic",surrealist:"magic",martialfantasy:"fantasy",isekai:"fantasy",documentary:"documentary",biopic:"documentary",arthouse:"documentary",experimental:"documentary",naturedoc:"documentary",socialcomment:"documentary",jazzfilm:"documentary",editorial:"documentary",culinary:"documentary",travel:"documentary",western:"western",spaghettiwestern:"western",historical:"western",samurai:"western",anime:"anime",shonen:"anime",shojo:"anime",seinen:"anime",musicvideo:"anime",transformation:"transformation",miniworld:"transformation"};

const PLATFORMS=[{id:"sora",label:"Sora",min:80,max:180,note:"80–180 words · one camera angle · name emotions out loud"},{id:"kling",label:"Kling",min:60,max:120,note:"60–120 words · describe motion first"},{id:"runway",label:"Runway Gen-3",min:50,max:100,note:"50–100 words · start with your style"},{id:"hailuo",label:"Hailuo",min:40,max:80,note:"40–80 words · keep sentences simple"},{id:"pika",label:"Pika",min:30,max:60,note:"30–60 words · lead with what you see"},{id:"other",label:"Universal",min:80,max:150,note:"80–150 words · works across platforms"}];

const TIERS=[{id:"auto",icon:"✦",label:"Full Auto",sub:"Perfect for Beginners",color:"#44ff88",desc:"Just pick your genre and style. Lala's AI builds your entire prompt. Zero writing needed.",hint:"Optional: drop a quick note if you want. AI builds everything regardless."},{id:"semi",icon:"◈",label:"Semi Auto",sub:"Casual Creator",color:"#00aaff",desc:"Write as much or as little as you want about your idea. We handle everything else around your story.",hint:"You keep full control. Edit anything after it generates."},{id:"manual",icon:"◆",label:"Full Control",sub:"Advanced Creator",color:"#B8860B",desc:"You write your own prompt and choose every detail. The AI structures it for your platform.",hint:"You drive. The Bartender is always available if you get stuck."}];

const ALL_GENRES=[{id:"scifi",label:"Science Fiction",cat:"Film"},{id:"cyberpunk",label:"Cyberpunk",cat:"Film"},{id:"spaceopera",label:"Space Opera",cat:"Film"},{id:"horror",label:"Horror",cat:"Film"},{id:"bodyhorror",label:"Body Horror",cat:"Film"},{id:"cosmichorror",label:"Cosmic Horror",cat:"Film"},{id:"slasher",label:"Slasher",cat:"Film"},{id:"psychological",label:"Psychological Thriller",cat:"Film"},{id:"thriller",label:"Thriller",cat:"Film"},{id:"noir",label:"Noir",cat:"Film"},{id:"neonoir",label:"Neo-Noir",cat:"Film"},{id:"mystery",label:"Mystery",cat:"Film"},{id:"crime",label:"Crime Drama",cat:"Film"},{id:"heist",label:"Heist",cat:"Film"},{id:"drama",label:"Drama",cat:"Film"},{id:"romance",label:"Romance",cat:"Film"},{id:"romcom",label:"Romantic Comedy",cat:"Film"},{id:"comedy",label:"Comedy",cat:"Film"},{id:"darkcomedy",label:"Dark Comedy",cat:"Film"},{id:"satire",label:"Satire",cat:"Film"},{id:"action",label:"Action",cat:"Film"},{id:"adventure",label:"Adventure",cat:"Film"},{id:"western",label:"Western",cat:"Film"},{id:"spaghettiwestern",label:"Spaghetti Western",cat:"Film"},{id:"fantasy",label:"Fantasy",cat:"Film"},{id:"darkfantasy",label:"Dark Fantasy",cat:"Film"},{id:"fairytale",label:"Fairy Tale",cat:"Film"},{id:"mythological",label:"Mythological / Epic",cat:"Film"},{id:"historical",label:"Historical / Period",cat:"Film"},{id:"war",label:"War / Military",cat:"Film"},{id:"biopic",label:"Biographical",cat:"Film"},{id:"comingofage",label:"Coming-of-Age",cat:"Film"},{id:"sliceoflife",label:"Slice of Life",cat:"Film"},{id:"dystopian",label:"Dystopian",cat:"Film"},{id:"postapocalyptic",label:"Post-Apocalyptic",cat:"Film"},{id:"survival",label:"Survival",cat:"Film"},{id:"supernatural",label:"Supernatural",cat:"Film"},{id:"paranormal",label:"Paranormal",cat:"Film"},{id:"gothic",label:"Gothic",cat:"Film"},{id:"southerngothic",label:"Southern Gothic",cat:"Film"},{id:"magicalrealism",label:"Magical Realism",cat:"Film"},{id:"surrealist",label:"Surrealist",cat:"Film"},{id:"absurdist",label:"Absurdist",cat:"Film"},{id:"arthouse",label:"Art House",cat:"Film"},{id:"experimental",label:"Experimental",cat:"Film"},{id:"superhero",label:"Superhero",cat:"Film"},{id:"spy",label:"Spy / Espionage",cat:"Film"},{id:"martialarts",label:"Martial Arts",cat:"Film"},{id:"wuxia",label:"Wuxia",cat:"Film"},{id:"samurai",label:"Samurai / Jidaigeki",cat:"Film"},{id:"gangster",label:"Gangster",cat:"Film"},{id:"sports",label:"Sports Drama",cat:"Film"},{id:"musical",label:"Musical Film",cat:"Film"},{id:"dance",label:"Dance Film",cat:"Film"},{id:"horrorcomedy",label:"Horror Comedy",cat:"Film"},{id:"scifihorror",label:"Sci-Fi Horror",cat:"Film"},{id:"eroticthrill",label:"Erotic Thriller",cat:"Film"},{id:"politicalthriller",label:"Political Thriller",cat:"Film"},{id:"documentary",label:"Documentary",cat:"Documentary"},{id:"mockumentary",label:"Mockumentary",cat:"Documentary"},{id:"foundfootage",label:"Found Footage",cat:"Documentary"},{id:"truecrime",label:"True Crime",cat:"Documentary"},{id:"naturedoc",label:"Nature / Wildlife",cat:"Documentary"},{id:"socialcomment",label:"Social Commentary",cat:"Documentary"},{id:"anime",label:"Anime",cat:"Animation"},{id:"shonen",label:"Shōnen Anime",cat:"Animation"},{id:"shojo",label:"Shōjo Anime",cat:"Animation"},{id:"seinen",label:"Seinen Anime",cat:"Animation"},{id:"mecha",label:"Mecha Anime",cat:"Animation"},{id:"isekai",label:"Isekai",cat:"Animation"},{id:"animehorror",label:"Horror Anime",cat:"Animation"},{id:"anim2d",label:"2D Animation",cat:"Animation"},{id:"stopmotion",label:"Stop Motion",cat:"Animation"},{id:"fashionfilm",label:"Fashion Film",cat:"Fashion & Arts"},{id:"fashionhorror",label:"Fashion Horror",cat:"Fashion & Arts"},{id:"fashionscifi",label:"Fashion Sci-Fi",cat:"Fashion & Arts"},{id:"runwayfilm",label:"Runway / Catwalk",cat:"Fashion & Arts"},{id:"editorial",label:"Editorial / Photo-Film",cat:"Fashion & Arts"},{id:"hautecouture",label:"Haute Couture Art Film",cat:"Fashion & Arts"},{id:"streetwear",label:"Streetwear / Urban",cat:"Fashion & Arts"},{id:"musicvideo",label:"Music Video",cat:"Music"},{id:"concertfilm",label:"Concert Film",cat:"Music"},{id:"operafilm",label:"Opera Film",cat:"Music"},{id:"balletfilm",label:"Ballet Film",cat:"Music"},{id:"hiphopvisual",label:"Hip-Hop Visual",cat:"Music"},{id:"jazzfilm",label:"Jazz Film",cat:"Music"},{id:"gospelfilm",label:"Gospel / Spiritual",cat:"Music"},{id:"transformation",label:"Transformation / Size Change",cat:"Specialty"},{id:"creaturefeature",label:"Creature Feature",cat:"Specialty"},{id:"kaiju",label:"Kaiju / Giant Monster",cat:"Specialty"},{id:"miniworld",label:"Micro World",cat:"Specialty"},{id:"horrorromcom",label:"Horror Rom-Com",cat:"Hybrid"},{id:"scifiwestern",label:"Sci-Fi Western",cat:"Hybrid"},{id:"fantasyhorror",label:"Fantasy Horror",cat:"Hybrid"},{id:"comedydrama",label:"Comedy Drama",cat:"Hybrid"},{id:"actionromance",label:"Action Romance",cat:"Hybrid"},{id:"scifiromance",label:"Sci-Fi Romance",cat:"Hybrid"},{id:"horrormusical",label:"Horror Musical",cat:"Hybrid"},{id:"fashionhorrorromcom",label:"Fashion Horror Rom-Com",cat:"Hybrid"},{id:"martialfantasy",label:"Martial Arts Fantasy",cat:"Hybrid"},{id:"scifianime",label:"Sci-Fi Anime",cat:"Hybrid"},{id:"culinary",label:"Culinary / Food Film",cat:"Lifestyle"},{id:"travel",label:"Travel / Wanderlust",cat:"Lifestyle"},{id:"wellness",label:"Wellness / Spiritual",cat:"Lifestyle"}];

const CAMERAS={"Shot Size":["Extreme Close-Up (ECU)","Close-Up (CU)","Medium Close-Up (MCU)","Medium Shot (MS)","Cowboy Shot","Full Shot (FS)","Wide Shot (WS)","Extreme Wide Shot","Two-Shot","Over-the-Shoulder","Insert Shot","Cutaway","Reaction Shot","POV / First Person"],"Angle":["Eye Level","Low Angle","High Angle","Bird's Eye / Overhead","Worm's Eye","Dutch Angle / Tilt","Oblique Angle","Aerial / Drone"],"Movement":["Static / Locked-Off","Pan Left","Pan Right","Tilt Up","Tilt Down","Dolly In","Dolly Out / Pull Back","Dolly Zoom / Vertigo / Zolly","Tracking / Follow","Handheld / Shaky Cam","Steadicam Smooth Follow","Arc / Orbit Shot","Crane / Jib Rise","Whip Pan","Snap Zoom / Crash Zoom","Slow Zoom In","Slow Zoom Out"],"Focus":["Rack Focus / Pull Focus","Deep Focus","Shallow Focus / Bokeh","Soft Focus","Split Diopter","Tilt-Shift Effect"],"Lens":["Anamorphic Wide","Fisheye / Distorted Wide","Telephoto Compressed","Macro / Extreme Macro","Long Lens Compression"],"Specialty":["Snorricam / Body Mount","Long Take / Oner","Slow Motion 120fps","Ultra Slow Motion 240fps","Time-Lapse","Freeze Frame","Reverse / Rewind","God's Eye View","Fly-Through","Impact / Crash Cam"]};

const TX_TYPES=[{id:"werewolf",label:"Werewolf Transformation",icon:"🐺"},{id:"weretiger",label:"Weretiger Transformation",icon:"🐯"},{id:"werebear",label:"Werebear Transformation",icon:"🐻"},{id:"werecreature",label:"Were-Creature (Any Animal)",icon:"🦁"},{id:"hybrid",label:"Hybrid Humanoid — Part Human Part Creature",icon:"⚡"},{id:"full_creature",label:"Full Creature Shift",icon:"🦎"},{id:"feral",label:"Feral Regression — Going Primal",icon:"🩸"},{id:"beast_emerge",label:"Beast Breaks Through Human Exterior",icon:"💥"},{id:"shrink",label:"Shrinking / Getting Smaller",icon:"🔬"},{id:"grow",label:"Growing / Getting Bigger",icon:"🏔"},{id:"person_obj",label:"Person Becomes an Object",icon:"🗿"},{id:"obj_person",label:"Object Comes to Life",icon:"✨"},{id:"obj_obj",label:"One Object Becomes Another",icon:"🔄"},{id:"petrify",label:"Turning to Stone / Ice / Crystal",icon:"❄️"},{id:"dissolve",label:"Melting / Dissolving / Fading",icon:"🌫"},{id:"mech",label:"Becoming a Machine / Cyborg",icon:"🤖"},{id:"elemental",label:"Merging with Fire / Water / Shadow",icon:"🔥"},{id:"energy",label:"Becoming Pure Energy or Light",icon:"✦"},{id:"age_up",label:"Rapid Aging Forward",icon:"⏩"},{id:"age_down",label:"Getting Younger Rapidly",icon:"⏪"},{id:"possess",label:"Possessed by Another Being",icon:"👁"},{id:"fusion",label:"Two Beings Merging into One",icon:"💫"},{id:"costume",label:"Outfit / Costume Transformation",icon:"👗"},{id:"custom",label:"My Own Transformation Type",icon:"✏️"}];

const MAGIC={"Elemental":["Fire / Pyrokinesis","Water / Ice","Lightning / Electricity","Earth / Stone","Wind / Air","Shadow / Darkness","Light / Holy Radiance","Void / Nothingness"],"Energy & Force":["Telekinesis — moving objects with mind","Force blast / Shockwave","Energy shield","Gravity distortion","Time freeze","Power aura flare"],"Summoning":["Creature from a portal","Ghost / Spirit appears","Glowing sigils appear","Portal / vortex opens","Reality tears open"],"Body Magic":["Healing — wounds closing","Levitation / Flying","Turning invisible","Soul leaving the body","Casting a spell on someone else"],"Dark Magic":["Curse casting — dark smoke","Soul being pulled out","Raising the dead","Blood moving on its own","Darkness spreading and consuming"],"Cosmic":["Channeling starlight","Reality cracking like glass","Void magic — absolute darkness","Sound becomes a physical force","Vision of the future appears"]};

const MAGIC_SRC=["Both hands outstretched","One hand extended","Glowing eyes","Voice — sound becomes visible","Whole body radiating","Weapon or staff","From the environment","Out of control — unintentional"];
const MAGIC_CLR=["Blue-white electric","Deep crimson","Golden light","Pure black void","Nature green","Shadow purple","Silver moonlight","Many colors","Corrupted dark orange","Blinding white"];
const MAGIC_TOLL=["Effortless — no struggle","Slight strain — sweating","Heavy cost — shaking, bleeding","Losing control — eyes changing","Body failing — overloaded","Euphoric — loving it"];

const KW={emotion:["terrified","desperate","determined","heartbroken","joyful","cold and distant","furious","quietly grieving","shocked","full of wonder","disgusted","guilt-ridden","defiant","tender and loving","paranoid","exhausted","driven","empty inside","overwhelmed","proud","out of control","numb","torn","ecstatic","mourning","betrayed","vengeful","at peace"],style:["film grain 35mm","anamorphic lens flare","desaturated blue-orange","high contrast black and white","neon lit","warm golden hour","cold and clinical","natural lighting only","deep shadows","bleached out","hyper vivid colors","raw documentary feel","slow motion","time-lapse","extreme detail","soft blurry background","hard single light","dreamy overexposed","dark and moody","editorial look"],lighting:["single lamp in room","neon signs only","moonlight through window","golden sunset","harsh ceiling fluorescent","candle flickering","colored LED strips","strobe / flash","backlit silhouette","fog diffused light","rim light at sunset","underwater light","firelight glow","spotlight from above","blue dusk light","lightning flash","torch only","cloudy daylight"],action:["reaches forward hesitantly","drops to knees","runs full speed","stares into camera","slams a door","pulls back quickly","whispers inaudible","raises both hands","steps into shadow","turns in slow motion","falls from above","catches someone","holds someone tight","pushes away","runs through crowd","stands completely still","exhales slowly","draws a weapon","throws something","steps in front of another","kneels down","crawls forward","backs into corner","lunges forward"],sound:["complete silence","only a heartbeat","distant thunder","crowd noise","a single musical note","only wind","rain falling","fire crackling","mechanical hum","footsteps echoing","breathing only","orchestra swelling","deep bass drop","silence then impact","low electronic drone"],texture:["wet skin catching light","rough concrete","cracked old leather","silk fabric moving","rusted metal","moss and bark","polished marble","broken glass","fur and feathers","scales catching light","liquid metal","burnt ash","neon on wet pavement","dust in light beam"],physics:["hair in slow motion","fabric billowing","water drops suspended","sparks flying","debris floating","smoke curling","gravity reversed","shockwave moving","liquid surface breaking","crater forming"]};

const SAFE=[{r:"mannequin",s:"motionless figure"},{r:"dead body",s:"fallen figure"},{r:"corpse",s:"unconscious subject"},{r:"blood",s:"crimson liquid"},{r:"naked",s:"bare-shouldered"},{r:"nude",s:"undraped figure"},{r:"strangling",s:"gripping the throat"},{r:"explosion",s:"shockwave blast"},{r:"gun",s:"raised firearm"},{r:"shooting",s:"weapon discharge"}];

const TUT=[{icon:"💀",title:"Welcome to Skull Groove",body:"This is your AI video prompt builder. Pick a genre, pick a style, and Lala's AI builds your prompt. Works with Sora, Kling, Runway, and more."},{icon:"🎯",title:"Pick Your Mode",body:"Full Auto = AI builds everything — zero writing needed. Semi Auto = Write your idea, AI fills the rest. Full Control = You write everything yourself. Start with Full Auto if you are new."},{icon:"📺",title:"Pick Your Platform",body:"Each AI video platform reads prompts differently. Sora needs 80 to 180 words. Kling needs motion described first. The app automatically adjusts for your platform."},{icon:"🎬",title:"Search and Pick Your Genre",body:"Over 100 genres. Search for any genre in the box. Pick one or mix several for hybrids like Horror Rom-Com or Sci-Fi Western. The background shifts to match your genre automatically."},{icon:"📷",title:"Camera Angles",body:"You can pick ONE angle from each camera group — Shot Size, Angle, Movement, Focus, Lens, Specialty. Never pick two from the same group or the AI gets confused."},{icon:"📊",title:"Word Count Guide",body:"Green = perfect range. Yellow = might be too short. Your prompt ALWAYS generates no matter what. The word count is just a helpful guide — it never blocks you."},{icon:"🍹",title:"The Bartender",body:"Stuck or unhappy with your result? Hit the Bartender button. Lala's assistant will help fix your prompt, give suggestions, or rewrite it better for you."},{icon:"🔬",title:"Transform and Magic Modes",body:"Use the Transform tab for werewolf shifts, size changes, creature transformations, and more. Use the Magic tab for fire, lightning, summoning, and cosmic magic scenes."},{icon:"✦",title:"Copy Save Export",body:"After generating — Copy grabs the text, Save keeps it in your Library, Export opens a popup where you can select all and copy manually if needed."},{icon:"🎉",title:"You Are Ready",body:"Pick Full Auto, choose a genre, hit Generate and see what Lala builds for you. Every test teaches you something. Let's go."}];

const api=async(sys,msg)=>{
  const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys,messages:[{role:"user",content:msg}]})});
  if(!r.ok)throw new Error(await r.text());
  const d=await r.json();
  return d.content?.map(b=>b.text||"").join("")||"";
};

const copy=(t)=>{try{if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(t);return true;}const e=document.createElement("textarea");e.value=t;e.style.cssText="position:fixed;opacity:0;";document.body.appendChild(e);e.focus();e.select();document.execCommand("copy");document.body.removeChild(e);return true;}catch{return false;}};

const sys=(pid)=>{const p=PLATFORMS.find(x=>x.id===pid)||PLATFORMS[5];return`You are Lalakisskissbeam — master of the Skull Groove Multiversal Nexus and the greatest AI video prompt engineer. Build prompts for ${p.label}. HARD RULES: Output MUST be ${p.min}–${p.max} words. Structure as labeled beats with duration timestamps: [BEAT 1 — 0.0s–2.0s] [BEAT 2 — 2.0s–5.0s] etc. ONE camera angle only — never combine two. Name emotions explicitly — never hint at them. For transformation: exact START STATE then transition verb then exact END STATE. For magic: describe the physical manifestation — not just "casts a spell." Full explicit description for underrepresented character appearances. Output the prompt ONLY. No explanation. No preamble.`;};

function Particles({c}){
  const ref=useRef(null),pts=useRef([]),af=useRef(null),ok=useRef(false);
  if(!ok.current){ok.current=true;setTimeout(()=>{const cv=ref.current;if(!cv)return;const ctx=cv.getContext("2d");cv.width=window.innerWidth;cv.height=window.innerHeight;pts.current=Array.from({length:28},()=>({x:Math.random()*cv.width,y:Math.random()*cv.height,r:Math.random()*2+.5,dx:(Math.random()-.5)*.3,dy:-Math.random()*.4-.1,a:Math.random()*.4+.1}));const draw=()=>{ctx.clearRect(0,0,cv.width,cv.height);pts.current.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=c+Math.floor(p.a*255).toString(16).padStart(2,"0");ctx.fill();p.x+=p.dx;p.y+=p.dy;p.a-=.0005;if(p.y<0||p.a<=0){p.y=cv.height+10;p.x=Math.random()*cv.width;p.a=Math.random()*.4+.1;}});af.current=requestAnimationFrame(draw);};draw();},200);}
  return <canvas ref={ref} style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}}/>;
}

const Bubble=({text,color})=>(
  <div style={{display:"flex",gap:"12px",background:"rgba(8,8,16,0.92)",border:`1px solid ${color}55`,borderRadius:"10px",padding:"14px 18px",marginBottom:"20px",backdropFilter:"blur(12px)"}}>
    <div style={{width:"40px",height:"40px",borderRadius:"50%",flexShrink:0,background:`radial-gradient(circle,${color}44,#080810)`,border:`2px solid ${color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"17px"}}>💀</div>
    <div>
      <div style={{fontSize:"9px",color,letterSpacing:"0.18em",marginBottom:"3px",fontFamily:"'DM Mono',monospace",fontWeight:600}}>LALA · SKULL GROOVE NEXUS</div>
      <div style={{fontSize:"14px",color:"#e8e4d9",fontFamily:"'Crimson Text',serif",fontStyle:"italic",lineHeight:1.6}}>"{text}"</div>
    </div>
  </div>
);

const Tag=({label,active,color,onClick})=>(
  <button onClick={onClick} style={{padding:"7px 13px",borderRadius:"4px",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"12px",border:active?`2px solid ${color}`:"2px solid #252535",background:active?`${color}28`:"#0e0e1a",color:active?color:"#888",transition:"all 0.12s",userSelect:"none",fontWeight:active?600:400,lineHeight:1.3}}>{label}</button>
);

const Card=({num,title,sub,color,children})=>(
  <div style={{background:"#0c0c18",border:"1px solid #1e1e2e",borderRadius:"10px",padding:"20px",marginBottom:"12px"}}>
    <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"13px"}}>
      <div style={{width:"26px",height:"26px",borderRadius:"50%",background:`${color}28`,border:`2px solid ${color}88`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",color,fontFamily:"'DM Mono',monospace",flexShrink:0,fontWeight:700}}>{num}</div>
      <div>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:"12px",color,letterSpacing:"0.13em",textTransform:"uppercase",fontWeight:600}}>{title}</div>
        {sub&&<div style={{fontFamily:"'DM Mono',monospace",fontSize:"10px",color:"#555",marginTop:"2px",lineHeight:1.4}}>{sub}</div>}
      </div>
    </div>
    {children}
  </div>
);

const Meter=({count,pid})=>{
  const p=PLATFORMS.find(x=>x.id===pid)||PLATFORMS[5];
  const pct=Math.min(count/p.max*100,100);
  const clr=count===0?"#2a2a3a":count<p.min?"#ffaa00":count<=p.max?"#44ff88":count<=400?"#ff8800":"#ff2244";
  const msg=count===0?"":count<p.min?"Short — more detail gives better results":count<=p.max?"✓ Great length — ready to generate!":count<=400?"Getting long — consider trimming":"Over the limit — split into two prompts";
  return(
    <div style={{marginTop:"10px"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:"4px"}}>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:"11px",color:clr}}>{msg}</span>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:"11px",color:"#444"}}>{count}w / {p.max}w</span>
      </div>
      <div style={{height:"4px",background:"#1a1a2a",borderRadius:"2px"}}>
        <div style={{height:"100%",width:`${pct}%`,background:clr,transition:"width 0.3s, background 0.3s",borderRadius:"2px"}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:"3px"}}>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:"9px",color:"#2a2a3a"}}>{p.min}w min</span>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:"9px",color:"#2a2a3a"}}>{p.max}w optimal · 400w absolute max</span>
      </div>
    </div>
  );
};

export default function App(){
  const [screen,setScreen]=useState("welcome");
  const [tier,setTier]=useState(null);
  const [pid,setPid]=useState(null);
  const [mk,setMk]=useState("default");
  const mood=MOODS[mk]||MOODS.default;
  const mp=mood.p;

  const [tab,setTab]=useState("build");
  const [gs,setGs]=useState("");
  const [genres,setGenres]=useState([]);
  const [note,setNote]=useState("");
  const [chars,setChars]=useState("");
  const [setting,setSetting]=useState("");
  const [action,setAction]=useState("");
  const [emo,setEmo]=useState([]);
  const [camSel,setCamSel]=useState({});
  const [camGrp,setCamGrp]=useState("Shot Size");
  const [vstyle,setVstyle]=useState([]);
  const [vlight,setVlight]=useState([]);
  const [vaction,setVaction]=useState([]);
  const [vsound,setVsound]=useState([]);
  const [soundTxt,setSoundTxt]=useState("");
  const [vtex,setVtex]=useState([]);
  const [vphy,setVphy]=useState([]);
  const [neg,setNeg]=useState("");
  const [safe,setSafe]=useState(false);
  const [showSafe,setShowSafe]=useState(false);
  const [beats,setBeats]=useState(3);
  const [kb,setKb]=useState("emotion");

  const [txType,setTxType]=useState(null);
  const [txCustom,setTxCustom]=useState("");
  const [txSubj,setTxSubj]=useState("");
  const [txStart,setTxStart]=useState("");
  const [txEnd,setTxEnd]=useState("");
  const [txSpd,setTxSpd]=useState("");
  const [txReact,setTxReact]=useState("");
  const [txCam,setTxCam]=useState("");
  const [txFx,setTxFx]=useState([]);
  const [txSet,setTxSet]=useState("");

  const [mTypes,setMTypes]=useState([]);
  const [mSrc,setMSrc]=useState("");
  const [mClr,setMClr]=useState("");
  const [mToll,setMToll]=useState("");
  const [mSubj,setMSubj]=useState("");
  const [mSet,setMSet]=useState("");

  const [out,setOut]=useState("");
  const [loading,setLoading]=useState(false);
  const [bMsg,setBMsg]=useState("");
  const [showB,setShowB]=useState(false);
  const [bIn,setBIn]=useState("");
  const [bLoad,setBLoad]=useState(false);
  const [copied,setCopied]=useState(false);
  const [saved,setSaved]=useState(false);
  const [lib,setLib]=useState([]);
  const [showExp,setShowExp]=useState(false);
  const [expTxt,setExpTxt]=useState("");
  const [tutOpen,setTutOpen]=useState(false);
  const [tutStep,setTutStep]=useState(0);
  const [err,setErr]=useState("");

  const platData=PLATFORMS.find(x=>x.id===pid)||PLATFORMS[5];
  const tierData=TIERS.find(x=>x.id===tier);
  const wc=out.trim()?out.trim().split(/\s+/).length:0;
  const glStr=genres.map(id=>ALL_GENRES.find(g=>g.id===id)?.label).filter(Boolean).join(" + ");
  const camSeld=Object.values(camSel).filter(Boolean);

  const fg=useMemo(()=>{const q=gs.toLowerCase();return q?ALL_GENRES.filter(g=>g.label.toLowerCase().includes(q)||g.cat.toLowerCase().includes(q)):ALL_GENRES;},[gs]);
  const gbc=useMemo(()=>{const m={};fg.forEach(g=>{if(!m[g.cat])m[g.cat]=[];m[g.cat].push(g);});return m;},[fg]);
  const tog=(arr,set,v)=>set(p=>p.includes(v)?p.filter(x=>x!==v):[...p,v]);

  const pickGenre=(id)=>{
    const next=genres.includes(id)?genres.filter(x=>x!==id):[...genres,id];
    setGenres(next);
    if(next.length>0){const m=GENRE_MOOD[next[0]];if(m&&MOODS[m])setMk(m);}
    else setMk("default");
  };

  const gen=async(mode)=>{
    setLoading(true);setOut("");setErr("");
    const camStr=camSeld.join(", ");
    let msg="";
    try{
      if(mode==="auto")msg=`Build a complete cinematic ${platData.label} video prompt. Genre: ${glStr||"cinematic thriller"}. Structure as exactly ${beats} labeled beats with duration timestamps. Max ${platData.max} words.${note?` Creator note: ${note}`:""}`;
      else if(mode==="tx"){const tl=txType==="custom"?txCustom:TX_TYPES.find(t=>t.id===txType)?.label||"";msg=`Build a transformation video prompt for ${platData.label}.\nType: ${tl}\nSubject: ${txSubj}\nSTART STATE: ${txStart}\nEND STATE: ${txEnd}\nSpeed: ${txSpd}\nReaction: ${txReact}\nCamera: ${txCam}\nEffects: ${txFx.join(", ")}\nSetting: ${txSet}\nUse ${beats} beats with timestamps.`;}
      else if(mode==="magic")msg=`Build a magic scene prompt for ${platData.label}. Describe PHYSICAL appearance of the magic.\nMagic: ${mTypes.join(", ")}\nCaster: ${mSubj}\nSource: ${mSrc}\nColor: ${mClr}\nToll: ${mToll}\nSetting: ${mSet}\nUse ${beats} beats with timestamps.`;
      else{const parts=[`Platform: ${platData.label}`,glStr&&`Genre: ${glStr}`,note&&`Story/idea: ${note}`,chars&&`Characters: ${chars}${emo.length?" | Emotion: "+emo.join(", "):""}`,setting&&`Setting: ${setting}`,action&&`Action: ${action}`,camStr&&`Camera: ${camStr}`,vstyle.length&&`Style: ${vstyle.join(", ")}`,vlight.length&&`Lighting: ${vlight.join(", ")}`,(soundTxt||vsound.length)&&`Sound: ${soundTxt||vsound.join(", ")}`,(vtex.length||vphy.length)&&`Detail: ${[...vtex,...vphy].join(", ")}`,neg&&`Avoid: ${neg}`].filter(Boolean).join("\n");msg=`Build a ${platData.label} video prompt as exactly ${beats} labeled beats with timestamps:\n\n${parts}`;}
      if(safe)msg+="\n\nUse Sora-safe cinematic vocabulary.";
      setOut(await api(sys(pid||"other"),msg));
    }catch(e){setErr("Could not connect. Check your internet and try again.");}
    setLoading(false);
  };

  const bartender=async()=>{
    if(!bIn.trim())return;
    setBLoad(true);setBMsg("");
    try{setBMsg(await api("You are the Bartender at Skull Groove — Lala's right hand. Help fix AI video prompts. Warm, direct, helpful. Under 120 words.",`Creator says: "${bIn}"\nCurrent prompt: "${out||"None"}"\nHelp them.`));}
    catch{setBMsg("Connection issue. Try again.");}
    setBLoad(false);
  };

  const doSave=()=>{if(!out)return;setLib(p=>[{id:Date.now(),pid,tier,genres:genres.map(id=>ALL_GENRES.find(g=>g.id===id)?.label).filter(Boolean),prompt:out,date:new Date().toLocaleDateString(),wc,mode:tab},...p]);setSaved(true);setTimeout(()=>setSaved(false),2000);};
  const doCopy=()=>{if(!out)return;if(!copy(out)){setExpTxt(out);setShowExp(true);}setCopied(true);setTimeout(()=>setCopied(false),2000);};
  const doExp=()=>{if(!out)return;setExpTxt(["SKULL GROOVE PROMPT ARCHITECT","=".repeat(36),`Platform: ${platData?.label}`,`Date: ${new Date().toLocaleString()}`,`Words: ${wc}`,"=".repeat(36),"",out,"","© Darrio · Grandmacyn · Skull Groove Multiversal Nexus"].join("\n"));setShowExp(true);};
  const doRemix=async()=>{if(!out||loading)return;setLoading(true);try{setOut(await api(sys(pid||"other"),`Remix this — same concept, different camera and pacing. Max ${platData.max} words:\n\n${out}`));}catch{setErr("Remix failed. Try again.");}setLoading(false);};

  const ta={width:"100%",background:"#080812",border:"2px solid #1e1e2e",borderRadius:"6px",color:"#ddd",fontFamily:"'DM Mono',monospace",fontSize:"13px",padding:"11px 14px",resize:"vertical",outline:"none",boxSizing:"border-box",lineHeight:1.7};
  const btn=(a,c)=>({padding:"7px 15px",borderRadius:"4px",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"11px",letterSpacing:"0.07em",textTransform:"uppercase",border:a?`2px solid ${c||mp}`:"2px solid #1e1e2e",background:a?`${c||mp}22`:"transparent",color:a?c||mp:"#777",transition:"all 0.15s",fontWeight:a?600:400});
  const bigB=(off,c)=>({width:"100%",padding:"16px",background:off?"#0e0e1a":c||mp,border:"none",borderRadius:"8px",color:off?"#444":"#000",fontFamily:"'Bebas Neue',sans-serif",fontSize:"21px",letterSpacing:"0.12em",cursor:off?"default":"pointer",transition:"all 0.2s",marginTop:"12px",fontWeight:700});

  const bg={minHeight:"100vh",background:mood.bg,transition:"background 0.7s",position:"relative",overflow:"hidden"};
  const orbs=<><div style={{position:"fixed",top:"-20%",right:"-15%",width:"70vw",height:"70vw",background:`radial-gradient(circle,${mood.o1}44 0%,transparent 65%)`,transition:"all 0.8s",borderRadius:"50%",zIndex:0,pointerEvents:"none"}}/><div style={{position:"fixed",bottom:"-25%",left:"-15%",width:"55vw",height:"55vw",background:`radial-gradient(circle,${mood.o2}33 0%,transparent 65%)`,transition:"all 0.8s",borderRadius:"50%",zIndex:0,pointerEvents:"none"}}/></>;
  const css=`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500;600&family=Crimson+Text:ital,wght@0,400;1,400&display=swap');*{box-sizing:border-box;margin:0;padding:0;}button{outline:none;}::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:#2a2a3a;}@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse{0%,100%{opacity:.3}50%{opacity:.8}}@keyframes spin{to{transform:rotate(360deg)}}`;

  const td=TUT[tutStep]||TUT[0];

  // modals
  const expModal=showExp&&(
    <div style={{position:"fixed",inset:0,zIndex:200,background:"#000000dd",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}} onClick={()=>setShowExp(false)}>
      <div style={{background:"#0c0c18",border:`2px solid ${mp}`,borderRadius:"12px",padding:"24px",maxWidth:"620px",width:"100%",maxHeight:"80vh",display:"flex",flexDirection:"column"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:"11px",color:mp,fontWeight:600,letterSpacing:"0.12em"}}>SELECT ALL TEXT AND COPY</div>
          <button onClick={()=>setShowExp(false)} style={{background:"transparent",border:"none",color:"#555",fontSize:"20px",cursor:"pointer"}}>✕</button>
        </div>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:"10px",color:"#444",marginBottom:"8px"}}>Click inside → Ctrl+A → Ctrl+C to copy</div>
        <textarea readOnly value={expTxt} style={{...ta,flex:1,minHeight:"240px",color:"#c8c0b4",fontSize:"13px",fontFamily:"'Crimson Text',serif",lineHeight:1.85,cursor:"text"}} onFocus={e=>e.target.select()}/>
        <button onClick={()=>{copy(expTxt);setShowExp(false);}} style={{...bigB(false),marginTop:"10px",fontSize:"16px"}}>TAP TO COPY AND CLOSE</button>
      </div>
    </div>
  );

  const tutModal=tutOpen&&(
    <div style={{position:"fixed",inset:0,zIndex:200,background:"#000000ee",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"}}>
      <div style={{background:"#0c0c18",border:`2px solid ${mp}`,borderRadius:"14px",padding:"28px",maxWidth:"480px",width:"100%"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"18px"}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:"10px",color:"#444",letterSpacing:"0.1em"}}>{tutStep+1} / {TUT.length}</div>
          <button onClick={()=>setTutOpen(false)} style={{background:"transparent",border:"none",color:"#555",fontSize:"15px",cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>SKIP ✕</button>
        </div>
        <div style={{textAlign:"center",fontSize:"48px",marginBottom:"14px"}}>{td.icon}</div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"24px",color:mp,letterSpacing:"0.08em",textAlign:"center",marginBottom:"12px"}}>{td.title}</div>
        <div style={{fontFamily:"'Crimson Text',serif",fontSize:"14px",color:"#aaa",lineHeight:1.75,textAlign:"center",marginBottom:"22px"}}>{td.body}</div>
        <div style={{display:"flex",gap:"8px"}}>
          {tutStep>0&&<button onClick={()=>setTutStep(s=>s-1)} style={{flex:1,padding:"10px",background:"transparent",border:"2px solid #1e1e2e",color:"#666",fontFamily:"'DM Mono',monospace",fontSize:"11px",cursor:"pointer",borderRadius:"6px"}}>← BACK</button>}
          <button onClick={()=>tutStep<TUT.length-1?setTutStep(s=>s+1):setTutOpen(false)} style={{flex:2,padding:"10px",background:mp,border:"none",color:"#000",fontFamily:"'Bebas Neue',sans-serif",fontSize:"18px",cursor:"pointer",borderRadius:"6px",fontWeight:700}}>
            {tutStep<TUT.length-1?"NEXT →":"LET'S BUILD ✦"}
          </button>
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:"5px",marginTop:"14px"}}>
          {TUT.map((_,i)=><div key={i} onClick={()=>setTutStep(i)} style={{width:i===tutStep?"20px":"6px",height:"4px",borderRadius:"2px",background:i===tutStep?mp:"#2a2a3a",transition:"all 0.2s",cursor:"pointer"}}/>)}
        </div>
      </div>
    </div>
  );

  const bartModal=showB&&(
    <div style={{position:"fixed",inset:0,zIndex:200,background:"#000000cc",display:"flex",alignItems:"flex-end",justifyContent:"center",padding:"20px"}} onClick={()=>setShowB(false)}>
      <div style={{background:"#0c0c18",border:`2px solid ${mp}`,borderRadius:"14px 14px 0 0",padding:"24px",maxWidth:"620px",width:"100%"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"14px"}}>
          <div style={{width:"40px",height:"40px",borderRadius:"50%",background:`radial-gradient(circle,${mp}44,#080810)`,border:`2px solid ${mp}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px",flexShrink:0}}>🍹</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"19px",color:mp,letterSpacing:"0.1em"}}>THE BARTENDER</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:"10px",color:"#555"}}>Lala's assistant · here to help you get unstuck</div>
          </div>
          <button onClick={()=>setShowB(false)} style={{background:"transparent",border:"none",color:"#555",fontSize:"18px",cursor:"pointer"}}>✕</button>
        </div>
        {bMsg&&<div style={{background:"#080812",border:"1px solid #1e1e2e",borderRadius:"7px",padding:"12px",marginBottom:"12px",fontFamily:"'Crimson Text',serif",fontSize:"14px",color:"#c8c0b4",lineHeight:1.75,fontStyle:"italic"}}>"{bMsg}"</div>}
        <textarea value={bIn} onChange={e=>setBIn(e.target.value)} placeholder="Tell the Bartender what is wrong or what you need help with..." rows={3} style={ta}/>
        <button onClick={bartender} disabled={bLoad||!bIn.trim()} style={{...bigB(!bIn.trim()),marginTop:"10px",fontSize:"16px"}}>
          {bLoad?"🍹 BARTENDER IS THINKING...":"🍹 ASK THE BARTENDER"}
        </button>
      </div>
    </div>
  );

  const outBlock=out&&(
    <div style={{background:"#0c0c18",border:`2px solid ${mp}55`,borderRadius:"10px",padding:"20px",marginTop:"12px",animation:"fadeUp 0.3s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px",flexWrap:"wrap",gap:"6px"}}>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:"11px",color:mp,letterSpacing:"0.14em",fontWeight:600}}>YOUR GENERATED PROMPT</div>
        <div style={{display:"flex",gap:"5px",flexWrap:"wrap"}}>
          <button onClick={doCopy} style={btn(copied)}>{copied?"✓ COPIED":"COPY"}</button>
          <button onClick={doRemix} disabled={loading} style={btn(false)}>🔀 REMIX</button>
          <button onClick={doExp} style={btn(false)}>⬇ EXPORT</button>
          <button onClick={doSave} style={{...btn(saved),color:saved?"#44ff88":undefined}}>{saved?"✓ SAVED":"SAVE"}</button>
          <button onClick={()=>{setBIn("");setBMsg("");setShowB(true);}} style={btn(false)}>🍹 BARTENDER</button>
        </div>
      </div>
      <div style={{fontFamily:"'Crimson Text',serif",fontSize:"15px",color:"#d8d0c4",lineHeight:2,whiteSpace:"pre-wrap"}}>{out}</div>
      <div style={{marginTop:"6px",fontFamily:"'DM Mono',monospace",fontSize:"10px",color:"#2a2a3a",fontStyle:"italic"}}>⚠ Prompts generate in English — the language AI video platforms understand best.</div>
      <Meter count={wc} pid={pid}/>
    </div>
  );

  const errBlock=err&&(
    <div style={{background:"#180808",border:"2px solid #ff2244",borderRadius:"8px",padding:"12px",marginTop:"10px"}}>
      <div style={{fontFamily:"'DM Mono',monospace",fontSize:"11px",color:"#ff2244",marginBottom:"4px",fontWeight:600}}>⚠ SOMETHING WENT WRONG</div>
      <div style={{fontFamily:"'DM Mono',monospace",fontSize:"10px",color:"#cc8888",lineHeight:1.6}}>{err}</div>
    </div>
  );

  // welcome
  if(screen==="welcome") return(
    <div style={bg}><style>{css}</style>{orbs}<Particles c={mp}/>
      {tutModal}
      <div style={{position:"relative",zIndex:1,minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"40px 24px"}}>
        <div style={{fontSize:"clamp(80px,13vw,120px)",marginBottom:"20px",filter:`drop-shadow(0 0 50px ${mp}88)`,animation:"pulse 3s infinite"}}>💀</div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(48px,9vw,90px)",color:"#B8860B",lineHeight:0.88,letterSpacing:"0.04em"}}>SKULL GROOVE</div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(18px,3.5vw,32px)",color:"#7B44C2",letterSpacing:"0.22em",marginBottom:"14px"}}>MULTIVERSAL NEXUS</div>
        <div style={{fontFamily:"'Crimson Text',serif",fontSize:"clamp(15px,2.5vw,19px)",color:"#666",fontStyle:"italic",marginBottom:"34px",maxWidth:"480px",lineHeight:1.5}}>"Music was the first magic of the universe."</div>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:"12px",color:"#333",letterSpacing:"0.16em",marginBottom:"8px",fontWeight:500}}>MASTER PROMPT BUILDER FOR AI VIDEO</div>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:"10px",color:"#1e1e1e",marginBottom:"30px",letterSpacing:"0.1em"}}>SORA · KLING · RUNWAY · HAILUO · PIKA</div>
        <button onClick={()=>setScreen("tier")} style={{padding:"16px 48px",background:"transparent",border:`3px solid ${mp}`,color:mp,fontFamily:"'Bebas Neue',sans-serif",fontSize:"22px",letterSpacing:"0.2em",cursor:"pointer",borderRadius:"6px",transition:"all 0.2s",boxShadow:`0 0 40px ${mp}33`}} onMouseEnter={e=>e.currentTarget.style.background=mp+"28"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          TOUCH THE EMBLEM · ENTER
        </button>
        <button onClick={()=>{setTutStep(0);setTutOpen(true);}} style={{marginTop:"14px",background:"transparent",border:"none",color:"#444",fontFamily:"'DM Mono',monospace",fontSize:"11px",cursor:"pointer",letterSpacing:"0.14em"}}>? HOW TO USE THIS APP</button>
      </div>
    </div>
  );

  if(screen==="tier") return(
    <div style={bg}><style>{css}</style>{orbs}<Particles c={mp}/>
      <div style={{position:"relative",zIndex:1,maxWidth:"700px",margin:"0 auto",padding:"48px 24px"}}>
        <Bubble text="Welcome to the Nexus. Every universe. Every story. One door. How do you want to build today?" color={mp}/>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:"11px",color:"#444",letterSpacing:"0.18em",marginBottom:"10px",fontWeight:500}}>CHOOSE YOUR EXPERIENCE</div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(28px,6vw,50px)",color:"#e8e4d9",marginBottom:"22px",lineHeight:0.95}}>HOW DO YOU WANT<br/><span style={{color:mp,transition:"color 0.4s"}}>TO BUILD TODAY?</span></div>
        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          {TIERS.map(t=>(
            <button key={t.id} onClick={()=>{setTier(t.id);setScreen("platform");}} style={{background:"#0c0c18",border:"2px solid #1e1e2e",borderRadius:"10px",padding:"18px 22px",cursor:"pointer",textAlign:"left",transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=t.color;e.currentTarget.style.background=t.color+"12";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="#1e1e2e";e.currentTarget.style.background="#0c0c18";}}>
              <div style={{display:"flex",alignItems:"center",gap:"14px"}}>
                <div style={{width:"44px",height:"44px",borderRadius:"50%",background:`${t.color}18`,border:`2px solid ${t.color}66`,display:"flex",alignItems:"center",justifyContent:"center",color:t.color,flexShrink:0,fontSize:"17px"}}>{t.icon}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"baseline",gap:"10px",marginBottom:"4px"}}><span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"22px",color:t.color,letterSpacing:"0.08em"}}>{t.label}</span><span style={{fontFamily:"'DM Mono',monospace",fontSize:"10px",color:"#444"}}>{t.sub}</span></div>
                  <div style={{fontFamily:"'Crimson Text',serif",fontSize:"14px",color:"#777",lineHeight:1.5,marginBottom:"4px"}}>{t.desc}</div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:"10px",color:"#444"}}>{t.hint}</div>
                </div>
                <div style={{color:"#333",fontSize:"17px"}}>→</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if(screen==="platform") return(
    <div style={bg}><style>{css}</style>{orbs}<Particles c={mp}/>
      <div style={{position:"relative",zIndex:1,maxWidth:"700px",margin:"0 auto",padding:"48px 24px"}}>
        <Bubble text="Every platform speaks a different language. Choose yours and I will make sure your prompt speaks it perfectly." color={mp}/>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:"11px",color:"#444",letterSpacing:"0.18em",marginBottom:"10px",fontWeight:500}}>WHICH PLATFORM ARE YOU USING?</div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(28px,6vw,50px)",color:"#e8e4d9",marginBottom:"22px",lineHeight:0.95}}>WHERE IS YOUR<br/><span style={{color:mp}}>VIDEO GOING?</span></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:"10px",marginBottom:"16px"}}>
          {PLATFORMS.map(p=>(
            <button key={p.id} onClick={()=>{setPid(p.id);setScreen("builder");}} style={{background:"#0c0c18",border:"2px solid #1e1e2e",borderRadius:"10px",padding:"16px",cursor:"pointer",textAlign:"left",transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=mp;e.currentTarget.style.background=mp+"12";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="#1e1e2e";e.currentTarget.style.background="#0c0c18";}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"21px",color:"#e8e4d9",marginBottom:"6px",letterSpacing:"0.06em"}}>{p.label}</div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:"10px",color:"#555",lineHeight:1.7}}>{p.note}</div>
            </button>
          ))}
        </div>
        <button onClick={()=>setScreen("tier")} style={{background:"transparent",border:"none",color:"#444",fontFamily:"'DM Mono',monospace",fontSize:"11px",cursor:"pointer",letterSpacing:"0.1em"}}>← BACK</button>
      </div>
    </div>
  );

  // builder
  return(
    <div style={bg}><style>{css}</style>{orbs}<Particles c={mp}/>
      {expModal}{tutModal}{bartModal}
      <div style={{position:"relative",zIndex:1,maxWidth:"860px",margin:"0 auto",padding:"26px 20px 100px"}}>

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px",flexWrap:"wrap",gap:"8px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <button onClick={()=>setScreen("platform")} style={{background:"transparent",border:"none",color:"#444",fontFamily:"'DM Mono',monospace",fontSize:"11px",cursor:"pointer",letterSpacing:"0.08em"}}>← BACK</button>
            <div style={{width:"1px",height:"15px",background:"#1e1e2e"}}/>
            <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"19px",color:"#B8860B",letterSpacing:"0.06em"}}>SKULL GROOVE</span>
          </div>
          <div style={{display:"flex",gap:"6px",flexWrap:"wrap",alignItems:"center"}}>
            <button onClick={()=>{setTutStep(0);setTutOpen(true);}} style={{...btn(false),padding:"4px 10px",fontSize:"10px",color:"#555"}}>? HOW TO USE</button>
            <button onClick={()=>{setBIn("");setBMsg("");setShowB(true);}} style={{...btn(false),padding:"4px 10px",fontSize:"10px",color:mp,borderColor:mp+"44"}}>🍹 BARTENDER</button>
            {tierData&&<div style={{fontFamily:"'DM Mono',monospace",fontSize:"10px",color:tierData.color,border:`2px solid ${tierData.color}44`,padding:"3px 8px",borderRadius:"4px",fontWeight:600}}>{tierData.icon} {tierData.label}</div>}
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:"10px",color:mp,border:`2px solid ${mp}44`,padding:"3px 8px",borderRadius:"4px",transition:"all 0.3s",fontWeight:600}}>{platData.label}</div>
          </div>
        </div>

        <div style={{display:"flex",gap:"5px",marginBottom:"18px",flexWrap:"wrap"}}>
          {[["build","▶ BUILD"],["transform","🔬 TRANSFORM"],["magic","✦ MAGIC"],["library","📁 LIBRARY"]].map(([id,lbl])=>(
            <button key={id} onClick={()=>{setTab(id);setOut("");setErr("");}} style={btn(tab===id)}>
              {id==="library"?`${lbl} (${lib.length})`:lbl}
            </button>
          ))}
        </div>

        {tab==="build"&&<div style={{animation:"fadeUp 0.3s ease"}}>
          <Bubble text={tier==="auto"?"Pick your genre and style. Lala builds everything for you. Zero writing needed.":tier==="semi"?"Give me a note — write your idea, short or long. I handle everything else around your story.":"You drive. Write your own prompt, choose your details. Call the Bartender if you need help."} color={mp}/>

          <Card num="🎨" title="Background Mood" sub="Changes the app background color only — does not affect your prompt" color={mp}>
            <div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>
              {Object.entries(MOODS).filter(([k])=>k!=="default").map(([k,v])=>(
                <button key={k} onClick={()=>setMk(k)} style={{padding:"6px 13px",borderRadius:"4px",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"11px",border:mk===k?`2px solid ${v.p}`:"2px solid #1e1e2e",background:mk===k?`${v.p}22`:"#0e0e1a",color:mk===k?v.p:"#666",transition:"all 0.12s",fontWeight:mk===k?600:400}}>
                  {k.charAt(0).toUpperCase()+k.slice(1)}
                </button>
              ))}
            </div>
          </Card>

          <Card num="①" title="Pick Your Genre" sub="Search over 100 genres — pick one or mix several together" color={mp}>
            <input value={gs} onChange={e=>setGs(e.target.value)} placeholder="Search any genre — horror, anime, fashion film, sci-fi western, hybrid rom-com..." style={{...ta,resize:"none",padding:"9px 14px",marginBottom:"10px",color:"#aaa",fontSize:"12px"}}/>
            <div style={{maxHeight:"220px",overflowY:"auto",paddingRight:"3px"}}>
              {Object.entries(gbc).map(([cat,items])=>(
                <div key={cat} style={{marginBottom:"10px"}}>
                  <div style={{fontSize:"9px",color:"#252535",letterSpacing:"0.14em",marginBottom:"5px",textTransform:"uppercase",fontFamily:"'DM Mono',monospace",fontWeight:600}}>{cat}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>{items.map(g=><Tag key={g.id} label={g.label} active={genres.includes(g.id)} color={mp} onClick={()=>pickGenre(g.id)}/>)}</div>
                </div>
              ))}
            </div>
            {genres.length>0&&<div style={{marginTop:"7px",fontFamily:"'DM Mono',monospace",fontSize:"11px",color:mp,fontWeight:600}}>✓ {glStr}</div>}
          </Card>

          <Card num="②" title={tier==="auto"?"Your Note — Totally Optional":tier==="semi"?"Give Me a Note — Write Your Idea":"Write Your Prompt"} sub={tier==="auto"?"Pick your genre and hit Generate. Add a note only if you want to. AI builds everything regardless.":tier==="semi"?"Short or long — one sentence or a full idea. We fill in the rest around your story.":"Write your full prompt here. The AI formats and structures it for your platform."} color={mp}>
            <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder={tier==="auto"?"Optional — add a note or leave empty and generate...":tier==="semi"?"Write your note here — short or long, anything goes...":"Write your full prompt — character, action, setting, everything you want..."} rows={tier==="manual"?5:3} style={ta}/>
          </Card>

          {tier!=="auto"&&<Card num="③" title="Who Is In This Scene?" sub="Name, age, appearance, skin tone, hair, clothing — be specific" color={mp}>
            <textarea value={chars} onChange={e=>setChars(e.target.value)} placeholder="Example: Marcus — 28-year-old Black man, short fade, grey hoodie, looking tense..." rows={2} style={ta}/>
            <div style={{marginTop:"10px",fontFamily:"'DM Mono',monospace",fontSize:"10px",color:"#555",marginBottom:"6px",fontWeight:600}}>HOW ARE THEY FEELING?</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>{KW.emotion.map(e=><Tag key={e} label={e} active={emo.includes(e)} color={mp} onClick={()=>tog(emo,setEmo,e)}/>)}</div>
          </Card>}

          {tier!=="auto"&&<Card num="④" title="Where Does This Take Place?" sub="Location, lighting, time of day, weather, atmosphere" color={mp}>
            <textarea value={setting} onChange={e=>setSetting(e.target.value)} placeholder="Example: Dimly lit underground garage, one flickering fluorescent light, concrete walls..." rows={2} style={ta}/>
          </Card>}

          {tier!=="auto"&&<Card num="⑤" title="What Happens?" sub="Describe the action. For transformations — write START state then END state." color={mp}>
            <textarea value={action} onChange={e=>setAction(e.target.value)} placeholder="Example: Danny reaches for the device, then pulls his hand back sharply when it shocks him..." rows={2} style={ta}/>
            <div style={{marginTop:"7px",display:"flex",flexWrap:"wrap",gap:"4px"}}>{KW.action.slice(0,16).map(a=><Tag key={a} label={a} active={vaction.includes(a)} color={mp} onClick={()=>tog(vaction,setVaction,a)}/>)}</div>
          </Card>}

          {tier!=="auto"&&<Card num="⑥" title="Camera Angles" sub="Pick ONE angle from each group — one per category, never two from the same group" color={mp}>
            <div style={{background:"#080812",border:"1px solid #ff224433",borderRadius:"5px",padding:"8px 12px",marginBottom:"9px"}}>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:"11px",color:"#ff6688",fontWeight:600}}>⚠ One angle per group only. Mixing two from the same group confuses the AI.</div>
            </div>
            <div style={{display:"flex",gap:"4px",marginBottom:"9px",flexWrap:"wrap"}}>
              {Object.keys(CAMERAS).map(g=>(
                <button key={g} onClick={()=>setCamGrp(g)} style={{...btn(camGrp===g),padding:"5px 10px",fontSize:"10px",position:"relative"}}>
                  {g}{camSel[g]&&<span style={{position:"absolute",top:"-3px",right:"-3px",width:"7px",height:"7px",borderRadius:"50%",background:mp}}/>}
                </button>
              ))}
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>
              {CAMERAS[camGrp].map(c=><Tag key={c} label={c} active={camSel[camGrp]===c} color={mp} onClick={()=>setCamSel(p=>({...p,[camGrp]:p[camGrp]===c?null:c}))}/>)}
            </div>
            {camSeld.length>0&&<div style={{marginTop:"7px",fontFamily:"'DM Mono',monospace",fontSize:"11px",color:mp,fontWeight:600}}>✓ {camSeld.join(" · ")}</div>}
          </Card>}

          {tier!=="auto"&&<Card num="⑦" title="Style · Lighting · Sound · Texture · Physics" sub="Click any keyword to add it to your prompt" color={mp}>
            <div style={{display:"flex",gap:"4px",marginBottom:"9px",flexWrap:"wrap"}}>
              {["emotion","style","lighting","sound","texture","physics"].map(b=><button key={b} onClick={()=>setKb(b)} style={{...btn(kb===b),padding:"5px 9px",fontSize:"10px",textTransform:"uppercase"}}>{b}</button>)}
            </div>
            {kb==="emotion"&&<div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>{KW.emotion.map(e=><Tag key={e} label={e} active={emo.includes(e)} color={mp} onClick={()=>tog(emo,setEmo,e)}/>)}</div>}
            {kb==="style"&&<div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>{KW.style.map(s=><Tag key={s} label={s} active={vstyle.includes(s)} color={mp} onClick={()=>tog(vstyle,setVstyle,s)}/>)}</div>}
            {kb==="lighting"&&<div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>{KW.lighting.map(l=><Tag key={l} label={l} active={vlight.includes(l)} color={mp} onClick={()=>tog(vlight,setVlight,l)}/>)}</div>}
            {kb==="sound"&&<><textarea value={soundTxt} onChange={e=>setSoundTxt(e.target.value)} placeholder="Describe the sound or audio feel..." rows={1} style={{...ta,marginBottom:"6px"}}/><div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>{KW.sound.map(s=><Tag key={s} label={s} active={vsound.includes(s)} color={mp} onClick={()=>tog(vsound,setVsound,s)}/>)}</div></>}
            {kb==="texture"&&<div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>{KW.texture.map(t=><Tag key={t} label={t} active={vtex.includes(t)} color={mp} onClick={()=>tog(vtex,setVtex,t)}/>)}</div>}
            {kb==="physics"&&<div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>{KW.physics.map(p=><Tag key={p} label={p} active={vphy.includes(p)} color={mp} onClick={()=>tog(vphy,setVphy,p)}/>)}</div>}
          </Card>}

          <Card num="⑧" title="What to Avoid" sub="Optional — tell the AI what you do NOT want in your video" color={mp}>
            <textarea value={neg} onChange={e=>setNeg(e.target.value)} placeholder="Example: no blurry shots, no cartoon style, no text on screen, no jumpcuts..." rows={2} style={ta}/>
            <div style={{display:"flex",gap:"6px",marginTop:"9px",flexWrap:"wrap"}}>
              <button onClick={()=>setSafe(!safe)} style={btn(safe)}>{safe?"✓ SAFE VOCABULARY ON":"○ SAFE VOCABULARY (OPTIONAL)"}</button>
              <button onClick={()=>setShowSafe(!showSafe)} style={btn(false)}>{showSafe?"HIDE GUIDE":"VIEW WORD SWAP GUIDE"}</button>
            </div>
            {safe&&<div style={{marginTop:"8px",fontFamily:"'DM Mono',monospace",fontSize:"10px",color:"#444",lineHeight:1.7}}>Safe mode on. The AI will use Sora-friendly cinematic vocabulary. Your prompt is never changed without you knowing.</div>}
            {showSafe&&<div style={{marginTop:"10px",background:"#080812",border:"1px solid #1e1e2e",borderRadius:"6px",padding:"12px"}}>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:"10px",color:"#2a2a3a",letterSpacing:"0.1em",marginBottom:"8px",fontWeight:600}}>IF YOUR PROMPT KEEPS GETTING FLAGGED — TRY THESE SWAPS</div>
              {SAFE.map((v,i)=><div key={i} style={{display:"flex",gap:"10px",alignItems:"center",marginBottom:"5px",fontFamily:"'DM Mono',monospace",fontSize:"11px"}}><span style={{color:"#ff4444",minWidth:"110px",fontWeight:600}}>{v.r}</span><span style={{color:"#2a2a3a"}}>→</span><span style={{color:"#44ff88",fontWeight:600}}>{v.s}</span></div>)}
            </div>}
          </Card>

          <Card num="⑨" title="How Many Beats?" sub="Beats are sections of your scene — each gets a time stamp like [BEAT 1 — 0.0s–2.0s]" color={mp}>
            <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"8px"}}>
              {[2,3,4,5,6,7].map(n=><button key={n} onClick={()=>setBeats(n)} style={{padding:"8px 14px",borderRadius:"4px",cursor:"pointer",fontFamily:"'Bebas Neue',sans-serif",fontSize:"20px",border:beats===n?`2px solid ${mp}`:"2px solid #1e1e2e",background:beats===n?`${mp}22`:"#080812",color:beats===n?mp:"#444",transition:"all 0.15s",fontWeight:700}}>{n}</button>)}
            </div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:"10px",color:"#444",lineHeight:1.7}}>3 beats works great for a 10 second video. Each beat gets a duration stamp so Sora knows exactly how long to hold each moment.</div>
          </Card>

          <button onClick={()=>gen(tier==="auto"?"auto":"manual")} disabled={loading} style={bigB(loading)}>
            {loading?<span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"10px"}}><span style={{display:"inline-block",width:"18px",height:"18px",border:"3px solid #00000044",borderTop:"3px solid #000",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>LALA IS BUILDING YOUR PROMPT...</span>:"▶  GENERATE MY PROMPT"}
          </button>
          {errBlock}{outBlock}
        </div>}

        {tab==="transform"&&<div style={{animation:"fadeUp 0.3s ease"}}>
          <Bubble text="Transformation is not just change — it is revelation. Tell me where they start, where they end, and what breaks in between." color={mp}/>
          <Card num="①" title="Transformation Type" color={mp}>
            <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>
              {TX_TYPES.map(t=><button key={t.id} onClick={()=>setTxType(txType===t.id?null:t.id)} style={{padding:"6px 12px",borderRadius:"4px",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"11px",border:txType===t.id?`2px solid ${mp}`:"2px solid #1e1e2e",background:txType===t.id?`${mp}22`:"#0e0e1a",color:txType===t.id?mp:"#666",transition:"all 0.12s",fontWeight:txType===t.id?600:400}}>{t.icon} {t.label}</button>)}
            </div>
            {txType==="custom"&&<textarea value={txCustom} onChange={e=>setTxCustom(e.target.value)} placeholder="Describe your own transformation type..." rows={2} style={{...ta,marginTop:"9px"}}/>}
          </Card>
          <Card num="②" title="Who or What Is Transforming?" sub="Full description — name, skin tone, hair, clothing, posture" color={mp}>
            <textarea value={txSubj} onChange={e=>setTxSubj(e.target.value)} placeholder="Example: Danny — 19-year-old Black man, short locs, grey hoodie, standing in a lab..." rows={2} style={ta}/>
          </Card>
          <Card num="③" title="Start State → End State" sub="IMPORTANT: Describe both exactly. The AI cannot guess what it is not told." color={mp}>
            <div style={{background:"#0d0808",border:"1px solid #ff224433",borderRadius:"5px",padding:"8px 12px",marginBottom:"9px"}}><div style={{fontFamily:"'DM Mono',monospace",fontSize:"11px",color:"#ff6688",fontWeight:600}}>⚠ Be specific about both states. Vague descriptions give vague results.</div></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}}>
              <div><div style={{fontFamily:"'DM Mono',monospace",fontSize:"10px",color:"#555",marginBottom:"4px",fontWeight:600}}>WHERE THEY START</div><textarea value={txStart} onChange={e=>setTxStart(e.target.value)} placeholder="Standing 6 feet tall, normal human, wool jacket..." rows={3} style={ta}/></div>
              <div><div style={{fontFamily:"'DM Mono',monospace",fontSize:"10px",color:"#555",marginBottom:"4px",fontWeight:600}}>WHERE THEY END UP</div><textarea value={txEnd} onChange={e=>setTxEnd(e.target.value)} placeholder="7-foot wolf hybrid, fur through skin, face elongated..." rows={3} style={ta}/></div>
            </div>
          </Card>
          <Card num="④" title="How Fast Does It Happen?" color={mp}>
            <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>{["Instant flash","Rapid — 1 to 2 seconds","Steady — 3 to 5 seconds","Gradual — over the whole scene","Frame by frame — very slow creep"].map(s=><Tag key={s} label={s} active={txSpd===s} color={mp} onClick={()=>setTxSpd(txSpd===s?"":s)}/>)}</div>
          </Card>
          <Card num="⑤" title="How Does the Character React?" sub="Name the emotion out loud — never hint at it" color={mp}>
            <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>{["Terrified — screaming","Stunned silent","Fighting it — resisting","Giving in — going limp","Euphoric — embracing it","In pain — writhing","Confused — watching themselves","Laughing — manic","Crying quietly","Roaring — primal release","Blacking out"].map(r=><Tag key={r} label={r} active={txReact===r} color={mp} onClick={()=>setTxReact(txReact===r?"":r)}/>)}</div>
          </Card>
          <Card num="⑥" title="Camera Angle" sub="Pick one only" color={mp}>
            <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>{["Extreme close-up on changing body part","Medium shot — full body visible","Wide shot — scale vs environment","POV of the subject transforming","Witness reaction shot","Slow orbit around transformation","Low angle as they grow","High angle as they shrink"].map(c=><Tag key={c} label={c} active={txCam===c} color={mp} onClick={()=>setTxCam(txCam===c?"":c)}/>)}</div>
          </Card>
          <Card num="⑦" title="What Does the Transformation Look Like?" sub="Select all that apply" color={mp}>
            <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>{["Skin rippling like water","Bones visibly shifting","Fur erupting through skin","Glowing cracks splitting","Particles dissolving away","Clothes tearing apart","Shadow moving on its own","Color draining from skin","Veins lighting up","Voice pitch shifting","Floor cracking","Eyes changing color","Teeth growing longer","Muscles rapidly expanding","Steam rising from skin","Scales forming over flesh"].map(e=><Tag key={e} label={e} active={txFx.includes(e)} color={mp} onClick={()=>tog(txFx,setTxFx,e)}/>)}</div>
          </Card>
          <Card num="⑧" title="Setting (Optional)" color={mp}>
            <textarea value={txSet} onChange={e=>setTxSet(e.target.value)} placeholder="Where does it happen? Location and lighting..." rows={2} style={ta}/>
          </Card>
          <div style={{display:"flex",gap:"6px",justifyContent:"center",marginBottom:"4px"}}>
            {[2,3,4,5,6,7].map(n=><button key={n} onClick={()=>setBeats(n)} style={{padding:"7px 13px",borderRadius:"4px",cursor:"pointer",fontFamily:"'Bebas Neue',sans-serif",fontSize:"18px",border:beats===n?`2px solid ${mp}`:"2px solid #1e1e2e",background:beats===n?`${mp}22`:"#0e0e1a",color:beats===n?mp:"#444",transition:"all 0.15s"}}>{n}</button>)}
          </div>
          <button onClick={()=>gen("tx")} disabled={loading||!txType} style={bigB(loading||!txType)}>
            {loading?"⏳ BUILDING TRANSFORMATION PROMPT...":"🔬 BUILD TRANSFORMATION PROMPT"}
          </button>
          {errBlock}{outBlock}
        </div>}

        {tab==="magic"&&<div style={{animation:"fadeUp 0.3s ease"}}>
          <Bubble text="Music was the first magic of the universe. Every form of it that exists — I helped bring into the world. Show me what yours looks like." color={mp}/>
          <Card num="①" title="What Kind of Magic?" sub="Pick one or combine several" color={mp}>
            {Object.entries(MAGIC).map(([cat,types])=>(
              <div key={cat} style={{marginBottom:"10px"}}>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:"9px",color:"#252535",letterSpacing:"0.12em",marginBottom:"5px",textTransform:"uppercase",fontWeight:600}}>{cat}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>{types.map(t=><Tag key={t} label={t} active={mTypes.includes(t)} color={mp} onClick={()=>tog(mTypes,setMTypes,t)}/>)}</div>
              </div>
            ))}
          </Card>
          <Card num="②" title="Who Is Casting?" sub="Full description — appearance, emotion, clothing, stance" color={mp}>
            <textarea value={mSubj} onChange={e=>setMSubj(e.target.value)} placeholder="Example: An elderly woman in a tattered white robe, silver hair, eyes glowing faintly..." rows={2} style={ta}/>
          </Card>
          <Card num="③" title="Where Does the Magic Come From?" color={mp}>
            <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>{MAGIC_SRC.map(s=><Tag key={s} label={s} active={mSrc===s} color={mp} onClick={()=>setMSrc(mSrc===s?"":s)}/>)}</div>
          </Card>
          <Card num="④" title="What Color and Look Does It Have?" color={mp}>
            <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>{MAGIC_CLR.map(c=><Tag key={c} label={c} active={mClr===c} color={mp} onClick={()=>setMClr(mClr===c?"":c)}/>)}</div>
          </Card>
          <Card num="⑤" title="What Does It Cost the Caster?" sub="Magic has a price — how does it affect them physically?" color={mp}>
            <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>{MAGIC_TOLL.map(t=><Tag key={t} label={t} active={mToll===t} color={mp} onClick={()=>setMToll(mToll===t?"":t)}/>)}</div>
          </Card>
          <Card num="⑥" title="Setting (Optional)" color={mp}>
            <textarea value={mSet} onChange={e=>setMSet(e.target.value)} placeholder="Environment, lighting, atmosphere..." rows={2} style={ta}/>
          </Card>
          <div style={{display:"flex",gap:"6px",justifyContent:"center",marginBottom:"4px"}}>
            {[2,3,4,5,6,7].map(n=><button key={n} onClick={()=>setBeats(n)} style={{padding:"7px 13px",borderRadius:"4px",cursor:"pointer",fontFamily:"'Bebas Neue',sans-serif",fontSize:"18px",border:beats===n?`2px solid ${mp}`:"2px solid #1e1e2e",background:beats===n?`${mp}22`:"#0e0e1a",color:beats===n?mp:"#444",transition:"all 0.15s"}}>{n}</button>)}
          </div>
          <button onClick={()=>gen("magic")} disabled={loading||mTypes.length===0} style={bigB(loading||mTypes.length===0)}>
            {loading?"⏳ CHANNELING THE FIRST MAGIC...":"✦ BUILD MAGIC PROMPT"}
          </button>
          {errBlock}{outBlock}
        </div>}

        {tab==="library"&&<div style={{animation:"fadeUp 0.3s ease"}}>
          <Bubble text="Every story you have built lives here. The Nexus remembers what you create." color={mp}/>
          {lib.length===0
            ?<div style={{background:"#0c0c18",border:"2px solid #1e1e2e",borderRadius:"10px",padding:"48px",textAlign:"center",color:"#2a2a3a",fontFamily:"'DM Mono',monospace",fontSize:"12px",lineHeight:2}}>No saved prompts yet. Build something and hit Save — it will appear here.</div>
            :lib.map(e=>(
              <div key={e.id} style={{background:"#0c0c18",border:"2px solid #1e1e2e",borderLeft:`4px solid ${mp}`,borderRadius:"10px",padding:"16px",marginBottom:"9px"}}>
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:"4px",marginBottom:"7px"}}>
                  <div style={{display:"flex",gap:"6px",fontFamily:"'DM Mono',monospace",fontSize:"10px",flexWrap:"wrap",alignItems:"center"}}>
                    <span style={{color:mp,fontWeight:600}}>{e.pid?.toUpperCase()}</span>
                    <span style={{color:"#1e1e2e"}}>·</span><span style={{color:"#555"}}>{e.mode}</span>
                    <span style={{color:"#1e1e2e"}}>·</span><span style={{color:"#555"}}>{e.genres?.join(" + ")}</span>
                  </div>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:"10px",color:"#1e1e2e"}}>{e.date} · {e.wc}w</span>
                </div>
                <div style={{fontFamily:"'Crimson Text',serif",fontSize:"13px",color:"#777",lineHeight:1.85,whiteSpace:"pre-wrap",marginBottom:"9px"}}>{e.prompt}</div>
                <div style={{display:"flex",gap:"5px",flexWrap:"wrap"}}>
                  <button onClick={()=>copy(e.prompt)} style={btn(false)}>COPY</button>
                  <button onClick={()=>{setExpTxt(e.prompt);setShowExp(true);}} style={btn(false)}>EXPORT</button>
                  <button onClick={()=>setLib(p=>p.filter(x=>x.id!==e.id))} style={{...btn(false),color:"#ff3333",borderColor:"#33000055"}}>DELETE</button>
                </div>
              </div>
            ))
          }
        </div>}

      </div>
      <div style={{position:"fixed",bottom:0,left:0,right:0,padding:"8px 20px",display:"flex",justifyContent:"space-between",zIndex:10,background:`linear-gradient(transparent,${mood.bg})`,pointerEvents:"none"}}>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:"9px",color:"#0e0e1a",letterSpacing:"0.1em"}}>SKULL GROOVE PROMPT ARCHITECT v4.0</span>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:"9px",color:"#0e0e1a",letterSpacing:"0.1em"}}>© DARRIO · GRANDMACYN</span>
      </div>
    </div>
  );
}

