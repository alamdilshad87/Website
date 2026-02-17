
(function(){
  var root=document.documentElement;
  root.classList.add('js');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $=function(s,c){return (c||document).querySelector(s);};
  var $$=function(s,c){return [].slice.call((c||document).querySelectorAll(s));};

  /* Public email shown in the contact section. Clear the string to hide it. */
  var CONTACT_EMAIL='dilshadand@gmail.com';

  /* ---------- data ---------- */
  var PROJECTS=[
    {id:'specguard',wide:1,cat:'web ai',tag:'backend · ai',kind:'API analysis platform',title:'SpecGuard',
     desc:'Reads OpenAPI specs and source code, then generates documentation, examples and test cases. Compares API versions to flag breaking changes in endpoints, request schemas and response contracts, and answers questions through a RAG assistant.',
     stack:['.NET Core','FastAPI','React','PostgreSQL','RAG'],art:'diff'},
    {id:'selfhosted',wide:1,cat:'ai web',tag:'ai/ml · backend',kind:'runs offline',title:'Self-Hosted AI Support System',
     desc:'Document Q&A with no cloud calls. Hierarchical chunking, a FAISS semantic index, and Llama-3.2-1B running locally through llama.cpp with quantization and GPU acceleration. Packaged in Docker and covered by 40+ API test cases at an 85% pass rate.',
     stack:['Python','FastAPI','FAISS','llama.cpp','Docker'],art:'flow'},
    {id:'fundoo',cat:'web',tag:'full-stack',kind:'BridgeLabZ',title:'Fundoo Notes',
     desc:'Notes app with a REST API secured by JWT, with Redis, NLog, NUnit tests and Swagger docs. The Angular frontend covers CRUD, reminders, labels and collaborators.',
     stack:['ASP.NET Core','Angular','JWT','Redis','NUnit'],art:'notes'},
    {id:'jobmatrix',cat:'ai',tag:'ai/ml',kind:'NLP matching',title:'JobMatrix',
     desc:'Extracts text from PDF and DOCX resumes and job descriptions, scores them with TF-IDF and cosine similarity, then ranks the top 5 candidates for shortlisting.',
     stack:['Python','Flask','scikit-learn','Pandas'],art:'bars'},
    {id:'bookstore',cat:'web',tag:'backend + web',kind:'BridgeLabZ',title:'Bookstore',
     desc:'Online bookstore built on ASP.NET WebForms with ADO.NET data access and a SQL Server database.',
     stack:['ASP.NET WebForms','ADO.NET','SQL Server'],art:'books'},
    {id:'iot',cat:'hw',tag:'hardware',kind:'IoT',title:'IoT Train Track Switcher',
     desc:'Servo-driven track switching controlled from an ESP32, with state reported through ThingSpeak.',
     stack:['ESP32','Servo','ThingSpeak'],art:'rails'},
    {id:'rfid',cat:'hw',tag:'hardware',kind:'access control',title:'RFID Door Lock',
     desc:'Card-based door lock built around an Arduino Nano and an RFID reader.',
     stack:['Arduino Nano','RFID'],art:'rfid'},
    {id:'thirdeye',cat:'hw',tag:'hardware',kind:'assistive tech',title:'Third Eye',
     desc:'Obstacle detector for visually impaired users. An ultrasonic sensor measures distance and the device answers with a buzzer and a vibration motor.',
     stack:['Arduino','Ultrasonic','Buzzer','Vibration motor'],art:'radar'},
    {id:'damage',cat:'ai',tag:'ai/ml',kind:'computer vision',title:'Deep Object Damage Analysis',
     desc:'Computer vision project that detects and analyses damage on objects using YOLOv3 and OpenCV.',
     stack:['Python','OpenCV','YOLOv3'],art:'boxes'},
    {id:'health',cat:'ai',tag:'ai/ml',kind:'NLP + classification',title:'Healthcare Chatbot',
     desc:'Symptom assessment and disease prediction chatbot built around a decision-tree classifier trained on symptom datasets.',
     stack:['Python','scikit-learn','spaCy','Pandas'],art:'ecg'}
  ];

  function art(k){
    var S='<svg class="art" viewBox="0 0 240 110" role="img" aria-hidden="true">';
    switch(k){
      case 'diff': return '<div class="viz"><span class="cap">example: version diff</span><span class="row del">- GET /users/{id}  200 { name, email }</span><span class="row add">+ GET /users/{id}  200 { name }</span><span class="row">  breaking: response field "email" removed</span></div>';
      case 'flow': return '<div class="flow" aria-label="Pipeline: parse, chunk, index, search, generate"><span>parse</span><i>→</i><span>chunk</span><i>→</i><span>index</span><i>→</i><span>search</span><i>→</i><span>generate</span></div>';
      case 'notes': return S+'<rect class="f1" x="30" y="24" width="78" height="62" rx="4" transform="rotate(-6 69 55)"/><rect class="f3" x="132" y="26" width="78" height="62" rx="4" transform="rotate(7 171 57)"/><rect class="f2" x="82" y="18" width="78" height="62" rx="4"/><path class="ln" d="M96 38h50M96 50h38M96 62h44"/></svg>';
      case 'bars': return S+'<g class="fp"><rect x="40" y="14" width="168" height="12" rx="2"/></g><g class="fo"><rect x="40" y="34" width="138" height="12" rx="2"/></g><g class="ft"><rect x="40" y="54" width="110" height="12" rx="2"/></g><g class="fv"><rect x="40" y="74" width="84" height="12" rx="2"/></g><g class="fp" opacity=".5"><rect x="40" y="94" width="56" height="8" rx="2"/></g></svg>';
      case 'books': return S+'<rect class="fo" x="52" y="30" width="16" height="64" rx="2"/><rect class="fp" x="72" y="20" width="16" height="74" rx="2"/><rect class="ft" x="92" y="36" width="16" height="58" rx="2"/><rect class="fv" x="112" y="24" width="16" height="70" rx="2"/><rect class="fo" x="132" y="40" width="16" height="54" rx="2"/><rect class="fp" x="152" y="28" width="16" height="66" rx="2" transform="rotate(8 160 94)"/><path class="st" d="M40 96h160"/></svg>';
      case 'rails': return S+'<path class="st" d="M10 74H118C148 74 156 40 192 40H232"/><path class="st2" d="M118 74H232"/><circle class="pulse fo" cx="118" cy="74" r="6"/><circle class="ft" cx="30" cy="74" r="5"/></svg>';
      case 'rfid': return S+'<rect class="st" x="40" y="34" width="70" height="46" rx="5"/><path class="st2" d="M54 48h22M54 60h14"/><path class="st3 pulse" d="M132 42a22 22 0 0 1 0 30M146 34a34 34 0 0 1 0 46M160 26a46 46 0 0 1 0 62"/></svg>';
      case 'radar': return S+'<circle class="fo" cx="40" cy="55" r="5"/><path class="st3 pulse" d="M62 38a28 28 0 0 1 0 34M80 28a46 46 0 0 1 0 54M98 18a64 64 0 0 1 0 74"/><rect class="fp" x="178" y="38" width="26" height="34" rx="3"/></svg>';
      case 'boxes': return S+'<rect class="st" x="46" y="18" width="148" height="76" rx="3" opacity=".5"/><path class="st2 draw" d="M88 36h58v44H88z" stroke-dasharray="6 4"/><rect class="fo" x="88" y="26" width="40" height="10"/><path class="st3" d="M60 84l30-22 22 14 28-26 34 34"/></svg>';
      case 'ecg': return S+'<path class="st2 draw" d="M10 62H70L82 28L96 92L108 48L118 62H232"/><circle class="ft pulse" cx="232" cy="62" r="4"/></svg>';
    }
    return '';
  }

  var CH=[
    {t:'Pro Nite',sub:'Vivek Patil, sand artist',cat:'events',yr:'2024',img:['assets/images/pro-nite.jpg'],d:'Poster for the Pro Nite with sand artist Vivek Patil. Warm gradients and deep shadows echo the flow of sand. The brief was to turn a live, fleeting art form into a still image that keeps its energy.'},
    {t:'Comedy Night',sub:'Maheep Singh, stand-up comedian',cat:'events',yr:'2024',img:['assets/images/comedy-night.jpg'],d:'Pro Nite poster for Maheep Singh. Playful emoji motifs, a textured red ground and heavy type carry the mood of the show.'},
    {t:'Tech Rally + Induction',sub:'Motorsport event and orientation post',cat:'events',yr:'2025',img:['assets/images/tech-rally.jpg'],d:'A tech rally with TVS Apache that built up to AARUUSH, and the induction post that welcomed new members. Teal and green for speed, violet and magenta for the orientation.'},
    {t:'Instagram Stories',sub:'Social media design',cat:'social',yr:'2023 to 2025',img:['assets/images/stories.jpg'],d:'Vertical, mobile-first stories for festivals, student organisations and campus communities: event promos, greetings, awareness campaigns and announcements.'},
    {t:'Festive Wall',sub:'Greetings, one system',cat:'social',yr:'2023 to 2025',img:['assets/images/festive-wall.jpg'],d:'Greetings for Easter, Raksha Bandhan, Puthandu, Rath Yatra, Diwali, Krishna Janmashtami and Children’s Day. Each has its own illustration style and palette, all under one brand.'},
    {t:'Posters',sub:'Events, ideas, impact',cat:'print',yr:'2023 to 2025',img:['assets/images/posters-1.jpg','assets/images/posters-2.jpg'],d:'Posters for fests, technical events, workshops and competitions, including MILAN, AARUUSH, Mozofest and Mozo Hack. Each one starts from the event’s own story.'},
    {t:'Carousels',sub:'Stories, one swipe at a time',cat:'social',yr:'2023 to 2025',img:['assets/images/carousel-promised-land.jpg','assets/images/carousel-aaruush-times.jpg'],d:'Swipeable sequences. A documentary-style series on the Arab-Israeli conflict for a Model UN society, and AARUUSH Times, a newspaper-style set for campus and tech news.'},
    {t:'Workshop Series',sub:'Speakers, sub-topics, schedules',cat:'print',yr:'2023 to 2025',img:['assets/images/workshop-series.jpg'],d:'Promotional posters for workshop series, with speakers, sub-topics and schedules in clear hierarchies. They flex across sizes without losing the identity.'},
    {t:'Banners',sub:'Ceremonies and talks',cat:'print',yr:'2023 to 2025',img:['assets/images/banners.jpg'],d:'Banners for ceremonies, talks and institutional events. Speakers, dates and venues are arranged to read at large-format distance.'},
    {t:'Standees',sub:'Stand tall',cat:'print',yr:'2024',img:['assets/images/standees.jpg'],d:'Standees for the LANStorm gaming competitions at AARUUSH ’24. Bold type, character art and prize details that read from a distance.'},
    {t:'T-Shirts',sub:'Wear the spirit',cat:'merch',yr:'2025',img:['assets/images/t-shirts.jpg'],d:'The SRM Run eco-run tee and AARUUSH organiser and committee tees, with personalised details and close-up print placement.'},
    {t:'Bag Tags + Placards',sub:'Small things, sharp details',cat:'merch',yr:'2022 to 2025',img:['assets/images/bag-tags-placards.jpg'],d:'Lanyard-style bag tags for AARUUSH events, and table placards for summits and Model UN committees.'},
    {t:'ID Cards',sub:'Credentials that create experience',cat:'merch',yr:'2024',img:['assets/images/id-cards.jpg'],d:'Event ID cards for AARUUSH ’24 that share one identity across teams, with role-specific graphics and fields that stay functional.'},
    {t:'Tickets',sub:'More than access',cat:'merch',yr:'2023 to 2025',img:['assets/images/tickets.jpg'],d:'Registration tickets that carry practical information and the event’s personality, with clear fields and a strong hierarchy.'}
  ];
  CH.forEach(function(c,i){c.n=i+1;});

  var ROLES=[
    {id:'r1',lane:'eng',org:'BridgeLabZ',role:'.NET Developer with Angular',s:'2025-10',e:'2026-01',note:'Four-month internship and training. Built the Fundoo Notes API and Angular frontend, plus Employee Payroll, Address Book, India State Census Analyzer and Bookstore exercises.'},
    {id:'r2',lane:'aar',org:'AARUUSH',role:'Volunteer',s:'2022-10',e:'2023-09',note:'Joined the SRMIST techno-management fest team as a volunteer.'},
    {id:'r3',lane:'aar',org:'AARUUSH',role:'Committee Member, Creatives and Highlights',s:'2023-09',e:'2024-10',note:'Posters, social creatives and highlight content for the fest.'},
    {id:'r4',lane:'aar',org:'AARUUSH',role:'Head of Creatives',s:'2024-09',e:'2025-09',note:'Ran the creatives team and mentored 100+ members.'},
    {id:'r5',lane:'aar',org:'AARUUSH',role:'Organiser',s:'2025-04',e:'2026-04',note:'Mentored 250+ members across the organising team.'},
    {id:'r6',lane:'srk',org:'SRMKZILLA',role:'Editorial (GFX) Member',s:'2023-09',e:'2024-10',note:'Graphics and editorial work for the club.'},
    {id:'r7',lane:'srk',org:'SRMKZILLA',role:'Editorial Lead',s:'2024-10',e:'2025-09',note:'Led the editorial and graphics team.'},
    {id:'r8',lane:'srk',org:'SRMKZILLA',role:'Mentor',s:'2025-09',e:'now',note:'Creative and editorial guidance, with a focus on design consistency.'},
    {id:'r9',lane:'edu',org:'SRMIST Kattankulathur',role:'B.Tech, Computer Science and Engineering',s:'2022-06',e:'2026-05',note:'Graduated in 2026 with a CGPA of 8.99.'}
  ];
  var LANES=[
    {k:'eng',name:'BridgeLabZ',grp:'engineering',g:'eng',c:'var(--tf)'},
    {k:'aar',name:'AARUUSH',grp:'creative + leadership',g:'cre',c:'var(--of)'},
    {k:'srk',name:'SRMKZILLA',grp:'creative + leadership',g:'cre',c:'var(--vf)'},
    {k:'edu',name:'SRMIST',grp:'education',g:'edu',c:'var(--pf)'}
  ];

  var SK=[
    {c:'Languages',i:['C','C++','Java','Python','C#','JavaScript','HTML','CSS']},
    {c:'Backend',i:['ASP.NET Core','Web API','ADO.NET','JWT','Redis','NLog','Swagger','NUnit','FastAPI','Flask']},
    {c:'Frontend',i:['Angular','RxJS','HTML5 / CSS3','JavaScript','React|learning']},
    {c:'Databases',i:['SQL Server','MySQL','PostgreSQL','MongoDB','Redis','Firestore']},
    {c:'AI / ML',i:['NumPy','Pandas','scikit-learn','PyTorch','OpenCV','YOLOv3','spaCy','NLTK','RAG','FAISS','llama.cpp']},
    {c:'Cloud + DevOps',i:['Docker','Git','GitHub','AWS (EC2, S3)|basic','Google Cloud','Linux|basic']},
    {c:'Hardware',i:['Arduino','ESP32','RFID','Raspberry Pi','ThingSpeak','Ultrasonic sensors']},
    {c:'Creative',i:['Photoshop','Illustrator','Premiere Pro','After Effects','Figma','CorelDRAW','Photography','VFX']}
  ];
  var TC=['var(--pf)','var(--of)','var(--tf)','var(--vf)'];

  /* ---------- theme + menu + progress ---------- */
  var KEY='mda-theme', tbtn=$('#theme');
  try{var sv=localStorage.getItem(KEY); if(sv==='light'||sv==='dark') root.setAttribute('data-theme',sv);}catch(e){}
  function effective(){var a=root.getAttribute('data-theme'); if(a) return a; return window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}
  function syncTheme(){var m=effective(); tbtn.setAttribute('data-mode',m); tbtn.setAttribute('aria-label',m==='dark'?'Switch to light theme':'Switch to dark theme');}
  tbtn.addEventListener('click',function(){var n=effective()==='dark'?'light':'dark'; root.setAttribute('data-theme',n); try{localStorage.setItem(KEY,n);}catch(e){} syncTheme(); readColors();});
  syncTheme();
  var menu=$('#menu'), links=$('#links');
  menu.addEventListener('click',function(){var o=links.classList.toggle('open'); menu.setAttribute('aria-expanded',o?'true':'false');});
  links.addEventListener('click',function(e){if(e.target.closest('a')){links.classList.remove('open'); menu.setAttribute('aria-expanded','false');}});
  var bar=$('.progress'), tick=false;
  function onScroll(){if(tick) return; tick=true; requestAnimationFrame(function(){var h=document.documentElement.scrollHeight-window.innerHeight; bar.style.setProperty('--p',h>0?Math.min(1,window.scrollY/h).toFixed(4):0); tick=false;});}
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  /* ---------- hero: scramble, glitch, typed ---------- */
  var hero=$('.hero'), nm=$('#name');
  var letters=[], gi=0, CH_='ABCDEFGHKMNPRSTUXYZ0123456789#<>/';
  $$('.name .ln').forEach(function(line,li){
    var fin=line.getAttribute('data-t'), ink=$('.ink',line); ink.textContent='';
    fin.split('').forEach(function(c,i){var sp=document.createElement('span'); sp.className='lt'; sp.textContent=c; ink.appendChild(sp); letters.push({el:sp,c:c,i:gi++});});
  });
  function initName(){
    fitName(); letters.forEach(function(l){l.w=l.el.getBoundingClientRect().width;});
    if(reduce) return;
    letters.forEach(function(l,n){
      l.el.style.width=l.w+'px';
      var tries=0, base=140+n*70;
      setTimeout(function(){var iv=setInterval(function(){tries++; if(tries>7){clearInterval(iv); l.el.textContent=l.c; l.el.style.width=''; return;} l.el.textContent=CH_.charAt(Math.floor(Math.random()*CH_.length));},48);},base);
    });
  }
  function fitName(){
    var wrapW=$('.hero .wrap').clientWidth, line=$('.name .ln.big'); nm.style.setProperty('--fs','100px');
    var w=line.getBoundingClientRect().width; if(w>0) nm.style.setProperty('--fs',Math.max(32,Math.min(250,Math.floor(100*wrapW*.8/w)))+'px');
  }
  window.addEventListener('resize',fitName);
  var started=false; function go(){if(started) return; started=true; fitName(); initName();}
  if(document.fonts&&document.fonts.ready){document.fonts.ready.then(go); setTimeout(go,1600);} else go();
  var mx=-9999,my=-9999,heroVis=true;
  hero.addEventListener('pointermove',function(e){mx=e.clientX; my=e.clientY;});
  hero.addEventListener('pointerleave',function(){mx=-9999; my=-9999;});
  if('IntersectionObserver' in window) new IntersectionObserver(function(en){heroVis=en[0].isIntersecting;}).observe(hero);
  function nameLoop(t){
    if(heroVis){
      var sweep=(t/90)%(letters.length+14);
      letters.forEach(function(l){
        var r=l.el.getBoundingClientRect(), d=Math.hypot(r.left+r.width/2-mx, r.top+r.height/2-my), k=Math.max(0,1-d/280);
        var w=Math.max(0,1-Math.abs(l.i-sweep)/2.2)*.8; k=Math.max(k*k*1.15,w); if(k>1) k=1;
        l.el.style.setProperty('--k',k.toFixed(3));
      });
    }
    requestAnimationFrame(nameLoop);
  }
  if(!reduce) requestAnimationFrame(nameLoop);
  var hotT;
  hero.addEventListener('pointermove',function(e){
    var r=hero.getBoundingClientRect(), x=e.clientX-r.left, y=e.clientY-r.top;
    hero.style.setProperty('--mx',x+'px'); hero.style.setProperty('--my',y+'px');
    if(!reduce){
      nm.style.setProperty('--gx',(((x/r.width)-.5)*40).toFixed(1)+'px');
      nm.classList.add('hot'); clearTimeout(hotT); hotT=setTimeout(function(){nm.classList.remove('hot');},700);
    }
  });
  hero.addEventListener('pointerleave',function(){nm.style.removeProperty('--gx'); nm.classList.remove('hot');});

  var typed=$('#typed');
  if(typed && !reduce){
    var P=['scalable .NET backends','retrieval AI that runs offline','Angular interfaces','posters, identities and merch'];
    var pi=0,pj=P[0].length,del=true;
    var typeTick=function(){
      var w=P[pi];
      if(del){pj--; typed.textContent=w.slice(0,pj); if(pj<=0){del=false; pi=(pi+1)%P.length; setTimeout(typeTick,260); return;} setTimeout(typeTick,26);}
      else{w=P[pi]; pj++; typed.textContent=w.slice(0,pj); if(pj>=w.length){del=true; setTimeout(typeTick,1900); return;} setTimeout(typeTick,52);}
    };
    setTimeout(typeTick,2800);
  }

  /* ---------- orb (canvas) ---------- */
  var COL={o:'#FF5A1F',p:'#9AA8FF',t:'#1DE9A6',f:'#F2EFE9'};
  function readColors(){var cs=getComputedStyle(root); COL.o=cs.getPropertyValue('--of').trim()||COL.o; COL.p=cs.getPropertyValue('--pf').trim()||COL.p; COL.t=cs.getPropertyValue('--tf').trim()||COL.t; COL.f=cs.getPropertyValue('--fg').trim()||COL.f;}
  readColors();
  (function orb(){
    var cv=$('#orb'); if(!cv||!cv.getContext) return;
    var ctx=cv.getContext('2d'), dpr=Math.min(2,window.devicePixelRatio||1), W=0, N=190, pts=[], pairs=[], tags=['.NET','RAG','UI','API','Ps','Ai','SQL','</>'], tagAt={};
    for(var i=0;i<N;i++){var y=1-(i/(N-1))*2, r=Math.sqrt(1-y*y), th=i*2.399963; pts.push({x:Math.cos(th)*r,y:y,z:Math.sin(th)*r,c:i%3});}
    tags.forEach(function(t,k){tagAt[Math.floor((k+.5)*N/tags.length)]=t;});
    for(var a=0;a<N;a++){for(var b=a+1;b<N;b++){var dx=pts[a].x-pts[b].x,dy=pts[a].y-pts[b].y,dz=pts[a].z-pts[b].z; if(dx*dx+dy*dy+dz*dz<.17) pairs.push([a,b]);}}
    var ry=0,rx=.35,tx=.35,ty=0,vis=true,t0=0;
    function size(){var r=cv.getBoundingClientRect(); W=r.width||200; cv.width=Math.round(W*dpr); cv.height=Math.round(W*dpr); ctx.setTransform(dpr,0,0,dpr,0,0);}
    size(); window.addEventListener('resize',size);
    hero.addEventListener('pointermove',function(e){var r=hero.getBoundingClientRect(); ty=((e.clientX-r.left)/r.width-.5)*1.1; tx=.35+((e.clientY-r.top)/r.height-.5)*.7;});
    function proj(p,ca,sa,cx,sx){var x=p.x*ca+p.z*sa, z=-p.x*sa+p.z*ca, y=p.y*cx-z*sx; z=p.y*sx+z*cx; var s=3/(3-z); return {x:W/2+x*s*W*.36,y:W/2+y*s*W*.36,z:z,s:s};}
    function draw(t){
      ctx.clearRect(0,0,W,W);
      var ang=(reduce?0:t*.00018)+ry, ca=Math.cos(ang), sa=Math.sin(ang), cx=Math.cos(rx), sx=Math.sin(rx), P=pts.map(function(p){return proj(p,ca,sa,cx,sx);});
      ctx.lineWidth=.7;
      pairs.forEach(function(pr){var A=P[pr[0]],B=P[pr[1]],z=(A.z+B.z)/2; if(z<-.15) return; ctx.globalAlpha=.1+.32*(z+1)/2; ctx.strokeStyle=COL.p; ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(B.x,B.y); ctx.stroke();});
      for(var i=0;i<N;i++){
        var q=P[i], d=(q.z+1)/2, col=pts[i].c===0?COL.o:(pts[i].c===1?COL.p:COL.t);
        ctx.globalAlpha=.25+.75*d; ctx.fillStyle=col; ctx.beginPath(); ctx.arc(q.x,q.y,(.9+1.7*d)*q.s*(W/220),0,6.283); ctx.fill();
        if(tagAt[i]&&d>.35){ctx.globalAlpha=.35+.65*d; ctx.font='500 '+Math.max(9,W*.05)+'px "DM Mono",monospace'; ctx.fillStyle=COL.f; ctx.fillText(tagAt[i],q.x+6,q.y-6); ctx.strokeStyle=col; ctx.lineWidth=1.2; ctx.beginPath(); ctx.arc(q.x,q.y,5*q.s,0,6.283); ctx.stroke(); ctx.lineWidth=.7;}
      }
      ctx.globalAlpha=1;
    }
    function frame(t){ry+=(ty-ry)*.04; rx+=(tx-rx)*.04; if(vis) draw(t); if(!reduce) requestAnimationFrame(frame);}
    if('IntersectionObserver' in window){new IntersectionObserver(function(en){vis=en[0].isIntersecting;}).observe(cv);}
    if(reduce){draw(0);} else requestAnimationFrame(frame);
  })();

  /* ---------- ribbons ---------- */
  var RB={
    a:['Design with purpose','Building ideas, designing experiences','Full-stack','RAG','Event branding','Let’s make something loud'],
    b:['.NET','Angular','Python','FastAPI','Photoshop','Illustrator','Figma','Docker','Posters','Merch'],
    c:['Let’s make something loud','Design with purpose','Open to roles','India and abroad'],
    d:['Backend','Frontend','AI / ML','Visual identity','Social media','Merchandise']
  };
  $$('[data-ribbon]').forEach(function(g){
    var items=RB[g.getAttribute('data-ribbon')]; items=items.concat(items);
    items.forEach(function(t){var s=document.createElement('span'); s.textContent=t; g.appendChild(s);});
    var c=g.cloneNode(true); c.setAttribute('aria-hidden','true'); g.parentNode.appendChild(c);
  });

  /* ---------- reveal ---------- */
  var rv=$$('.rv');
  if('IntersectionObserver' in window && !reduce){
    var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in'); io.unobserve(x.target);}});},{rootMargin:'0px 0px -6% 0px',threshold:.06});
    rv.forEach(function(el){io.observe(el);});
  }else{rv.forEach(function(el){el.classList.add('in');});}

  /* ---------- nav highlight ---------- */
  var navA=$$('a',links);
  if('IntersectionObserver' in window){
    var so=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){navA.forEach(function(a){a.removeAttribute('aria-current'); if(a.getAttribute('href')==='#'+x.target.id) a.setAttribute('aria-current','true');});}});},{rootMargin:'-40% 0px -55% 0px'});
    ['about','work','design','journey','stack','contact'].forEach(function(id){var s=document.getElementById(id); if(s) so.observe(s);});
  }

  /* ---------- about ---------- */
  var about=$('#about'), seg=$('#seg'), ph=$('#ph');
  $$('button',seg).forEach(function(b){
    b.addEventListener('click',function(){
      var m=b.getAttribute('data-m'); if(about.getAttribute('data-mode')===m) return;
      about.setAttribute('data-mode',m);
      $$('button',seg).forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false');});
      $$('.mp',about).forEach(function(p){var on=p.getAttribute('data-m')===m; p.hidden=!on; if(on){p.style.animation='none'; void p.offsetWidth; p.style.animation='';}});
      ph.classList.remove('flash'); void ph.offsetWidth; ph.classList.add('flash');
    });
  });
  $('#pcount').setAttribute('data-count',PROJECTS.length); $('#pcount').textContent=PROJECTS.length;
  var counters=$$('[data-count]');
  function runCount(el){
    var to=parseFloat(el.getAttribute('data-count')), dec=parseInt(el.getAttribute('data-dec')||'0',10), suf=el.getAttribute('data-suffix')||'', t0=performance.now(), d=1300;
    (function step(now){var p=Math.min(1,(now-t0)/d), e=1-Math.pow(1-p,3); el.textContent=(to*e).toFixed(dec)+(p>=1?suf:''); if(p<1) requestAnimationFrame(step);})(t0);
  }
  if('IntersectionObserver' in window && !reduce){
    var co=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){runCount(x.target); co.unobserve(x.target);}});},{threshold:.6});
    counters.forEach(function(c){co.observe(c);});
  }

  /* ---------- work ---------- */
  var grid=$('#grid');
  function tone(p){return p.cat.indexOf('hw')>-1?'var(--tf)':(p.cat.indexOf('ai')>-1&&p.cat.indexOf('web')<0?'var(--vf)':'var(--pf)');}
  grid.innerHTML='<ol class="wl" id="wl">'+PROJECTS.map(function(p,i){
    var n=(i+1<10?'0':'')+(i+1);
    return '<li data-cat="'+p.cat+'" data-i="'+i+'"><button type="button" class="wr" aria-pressed="false" style="--tc:'+tone(p)+'"><span class="no">'+n+'</span><span class="rt">'+p.title+'</span><span class="rk">'+p.tag+'</span><span class="ar" aria-hidden="true">→</span></button></li>';
  }).join('')+'</ol><div class="wv" id="wv" aria-live="polite"></div>';
  var wl=$('#wl'), wv=$('#wv'), lis=$$('li',wl), chips=$$('#work .chip'), count=$('#count'), sel=0, shown=-1;
  function showP(i){
    if(i===shown) return; shown=i; var p=PROJECTS[i], n=(i+1<10?'0':'')+(i+1);
    wv.style.setProperty('--tc',tone(p));
    wv.innerHTML='<div class="in2"><div class="bp"><span class="dim">'+p.kind+'</span><div class="art-wrap">'+art(p.art)+'</div></div><div class="tx"><div class="ch"><span class="tag">'+p.tag+'</span><span class="kind">N°'+n+'</span></div><h3>'+p.title+'</h3><p>'+p.desc+'</p><div class="stack">'+p.stack.map(function(t,k){return '<span style="--sw:'+TC[k%4]+'">'+t+'</span>';}).join('')+'</div></div></div>';
    lis.forEach(function(li){$('.wr',li).setAttribute('aria-pressed',li.getAttribute('data-i')===String(i)?'true':'false');});
  }
  var canHover=window.matchMedia&&window.matchMedia('(hover: hover)').matches;
  lis.forEach(function(li){
    var b=$('.wr',li), i=parseInt(li.getAttribute('data-i'),10);
    b.addEventListener('click',function(){sel=i; showP(i); if(window.innerWidth<=900){wv.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'});}});
    if(canHover) b.addEventListener('pointerenter',function(){showP(i);});
    b.addEventListener('focus',function(){showP(i);});
    b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect(); b.style.setProperty('--px',(e.clientX-r.left)+'px'); b.style.setProperty('--py',(e.clientY-r.top)+'px');});
  });
  wl.addEventListener('pointerleave',function(){showP(sel);});
  chips.forEach(function(ch){
    ch.addEventListener('click',function(){
      var f=ch.getAttribute('data-f'), n=0, first=-1;
      chips.forEach(function(c){c.setAttribute('aria-pressed',c===ch?'true':'false');});
      lis.forEach(function(li){var show=f==='all'||li.getAttribute('data-cat').split(' ').indexOf(f)>-1; li.hidden=!show; if(show){n++; if(first<0) first=parseInt(li.getAttribute('data-i'),10);}});
      count.textContent='showing '+n+' of '+lis.length;
      if(lis[sel].hidden) sel=first; shown=-1; showP(sel);
    });
  });
  showP(0);

  /* ---------- design reel ---------- */
  var idx=$('#idx'), slide=$('#slide'), dots=$('#dots'), meta=$('#meta'), screen=$('#screen'), cur=0, sub=0, filt='all';
  idx.innerHTML=CH.map(function(c,i){return '<li data-cat="'+c.cat+'"><button type="button" data-i="'+i+'"><span class="no">'+(c.n<10?'0':'')+c.n+'</span><span class="tt">'+c.t+'</span></button></li>';}).join('');
  var catLabel={events:'events',social:'social',print:'posters + banners',merch:'merch + print'};
  function show(i,s,anim){
    cur=i; sub=s||0; var c=CH[i];
    slide.src=c.img[sub]; slide.alt=c.t+' design slide'+(c.img.length>1?', part '+(sub+1)+' of '+c.img.length:'');
    if(anim!==false && !reduce){slide.classList.remove('swap'); void slide.offsetWidth; slide.classList.add('swap');}
    dots.innerHTML=c.img.length>1?c.img.map(function(_,k){return '<button type="button" data-s="'+k+'" aria-label="Slide '+(k+1)+' of '+c.img.length+'"'+(k===sub?' aria-current="true"':'')+'></button>';}).join(''):'';
    meta.innerHTML='<div><p class="mk">N°'+(c.n<10?'0':'')+c.n+' · '+catLabel[c.cat]+'</p><h3>'+c.t+'</h3><p class="d" style="margin-top:12px">'+c.d+'</p></div><dl><dt>focus</dt><dd>'+c.sub+'</dd><dt>year</dt><dd>'+c.yr+'</dd><dt>tools</dt><dd>Photoshop and Illustrator</dd></dl>';
    $$('button',idx).forEach(function(b){b.setAttribute('aria-current',String(b.getAttribute('data-i'))===String(i)?'true':'false');});
    var nxt=CH[(i+1)%CH.length].img[0]; var im=new Image(); im.src=nxt;
  }
  function visible(){return CH.map(function(c,i){return i;}).filter(function(i){return filt==='all'||CH[i].cat===filt;});}
  function step(d){var v=visible(); if(!v.length) return; var k=v.indexOf(cur); k=k<0?0:(k+d+v.length)%v.length; show(v[k],0);}
  idx.addEventListener('click',function(e){var b=e.target.closest('button'); if(b) show(parseInt(b.getAttribute('data-i'),10),0);});
  dots.addEventListener('click',function(e){var b=e.target.closest('button'); if(b) show(cur,parseInt(b.getAttribute('data-s'),10));});
  $('#prev').addEventListener('click',function(e){e.stopPropagation(); step(-1);});
  $('#next').addEventListener('click',function(e){e.stopPropagation(); step(1);});
  $$('#dchips .chip').forEach(function(ch){
    ch.addEventListener('click',function(){
      filt=ch.getAttribute('data-f');
      $$('#dchips .chip').forEach(function(c){c.setAttribute('aria-pressed',c===ch?'true':'false');});
      $$('li',idx).forEach(function(li){li.hidden=!(filt==='all'||li.getAttribute('data-cat')===filt);});
      var v=visible(); if(v.length && v.indexOf(cur)<0) show(v[0],0);
    });
  });
  screen.addEventListener('pointermove',function(e){
    var r=screen.getBoundingClientRect(), x=(e.clientX-r.left)/r.width, y=(e.clientY-r.top)/r.height;
    screen.style.setProperty('--sx',(x*100)+'%'); screen.style.setProperty('--sy',(y*100)+'%');
    if(!reduce){screen.style.setProperty('--ry',((x-.5)*5).toFixed(2)+'deg'); screen.style.setProperty('--rx',((.5-y)*4).toFixed(2)+'deg');}
  });
  screen.addEventListener('pointerleave',function(){screen.style.setProperty('--rx','0deg'); screen.style.setProperty('--ry','0deg');});
  /* lightbox */
  var lb=$('#lb'), lbimg=$('#lbimg'), lbcap=$('#lbcap'), lastFocus=null;
  function lbShow(){var c=CH[cur]; lbimg.src=c.img[sub]; lbimg.alt=c.t+' design slide'; lbcap.textContent='N°'+(c.n<10?'0':'')+c.n+' · '+c.t+(c.img.length>1?' ('+(sub+1)+'/'+c.img.length+')':'');}
  function lbOpen(){lastFocus=document.activeElement; lb.hidden=false; lb.classList.add('open'); lbShow(); $('#lbclose').focus(); document.body.style.overflow='hidden';}
  function lbClose(){lb.classList.remove('open'); lb.hidden=true; document.body.style.overflow=''; if(lastFocus&&lastFocus.focus) lastFocus.focus();}
  function lbStep(d){var c=CH[cur]; if(c.img.length>1 && sub+d>=0 && sub+d<c.img.length){show(cur,sub+d,false);} else {step(d);} lbShow();}
  screen.addEventListener('click',function(e){if(e.target.closest('.ctl')||e.target.closest('.dots')) return; lbOpen();});
  $('#expand').addEventListener('click',function(e){e.stopPropagation(); lbOpen();});
  $('#lbclose').addEventListener('click',lbClose);
  $('#lbprev').addEventListener('click',function(){lbStep(-1);});
  $('#lbnext').addEventListener('click',function(){lbStep(1);});
  lb.addEventListener('click',function(e){if(e.target===lb) lbClose();});
  document.addEventListener('keydown',function(e){
    if(lb.classList.contains('open')){if(e.key==='Escape') lbClose(); else if(e.key==='ArrowLeft') lbStep(-1); else if(e.key==='ArrowRight') lbStep(1); return;}
    if(e.target.closest&&e.target.closest('#design')&&!/INPUT|TEXTAREA/.test(e.target.tagName)){if(e.key==='ArrowLeft') step(-1); else if(e.key==='ArrowRight') step(1);}
  });
  show(0,0,false);

  /* ---------- journey: gantt + cards ---------- */
  var MS=new Date(2022,5,1), TOTAL=54;
  function mi(s,end){var p=s.split('-'); var y=parseInt(p[0],10), m=parseInt(p[1],10)-1; return (y-2022)*12+(m-5)+(end?1:0);}
  function fmt(s){if(s==='now') return 'now'; var p=s.split('-'); return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(p[1],10)-1]+' '+p[0];}
  function dur(r){var a=mi(r.s), b=r.e==='now'?TOTAL-1:mi(r.e,true)-1; var m=b-a+1, y=Math.floor(m/12), mm=m%12; return (y?y+' yr'+(y>1?'s':'')+(mm?' ':''):'')+(mm?mm+' mo':'');}
  var laneC={}; LANES.forEach(function(l){laneC[l.k]=l;});
  function rows(list){var rws=[]; var out={}; list.slice().sort(function(a,b){return mi(a.s)-mi(b.s);}).forEach(function(r){var a=mi(r.s), placed=false; for(var k=0;k<rws.length;k++){if(rws[k]<=a){rws[k]=r.e==='now'?TOTAL:mi(r.e,true); out[r.id]=k; placed=true; break;}} if(!placed){rws.push(r.e==='now'?TOTAL:mi(r.e,true)); out[r.id]=rws.length-1;}}); return {rows:rws.length,map:out};}
  var gt=$('#gt'), html='';
  var yrs=[2022,2023,2024,2025,2026];
  html+='<div class="cell axis-l"></div><div class="cell yr" style="--yw:100%">'+yrs.map(function(y){var pos=y===2022?0:(((y-2022)*12-5)/TOTAL*100); return '<span style="left:calc('+pos+'% + 6px)">'+y+'</span>';}).join('')+'</div>';
  LANES.forEach(function(l){
    var list=ROLES.filter(function(r){return r.lane===l.k;}), R=rows(list), h=R.rows*38+12;
    html+='<div class="cell lab" data-g="'+l.g+'" style="--lc:'+l.c+';height:'+h+'px"><b><i></i>'+l.name+'</b><small>'+l.grp+'</small></div>';
    html+='<div class="cell track2" data-g="'+l.g+'" style="height:'+h+'px;--yw:calc(100%/4.5)">'+list.map(function(r){
      var a=mi(r.s), b=r.e==='now'?TOTAL:mi(r.e,true), left=a/TOTAL*100, w=(b-a)/TOTAL*100, short=w<15, lft=short&&(left+w)>70;
      return '<button type="button" class="bar'+(short?' short':'')+(r.e==='now'?' now':'')+'" data-id="'+r.id+'" style="--lc:'+l.c+';left:'+left+'%;width:'+w+'%;top:'+(6+R.map[r.id]*38)+'px" title="'+r.role+', '+fmt(r.s)+' to '+fmt(r.e)+'"><span>'+r.role+'</span></button>';
    }).join('')+'</div>';
  });
  gt.innerHTML=html;
  var nowIdx=(new Date().getFullYear()-2022)*12+new Date().getMonth()-5+.5; nowIdx=Math.max(0,Math.min(TOTAL,nowIdx));
  var tr=$$('.track2',gt); var td=document.createElement('div'); td.className='today'; td.style.left=(nowIdx/TOTAL*100)+'%';
  /* the today marker spans all lane rows, so draw it on the grid itself */
  td.style.cssText='position:absolute;top:30px;bottom:0;border-left:1px dashed var(--of);z-index:2;pointer-events:none;left:calc(168px + (100% - 168px)*'+(nowIdx/TOTAL)+')';
  gt.style.position='relative'; gt.appendChild(td);
  var jcards=$('#jcards');
  var GR=[
    {g:'eng',t:'Engineering',s:'Internship, training and builds',c:'var(--tf)',ic:'</>'},
    {g:'cre',t:'Creative + leadership',s:'Design teams, editorial and mentoring',c:'var(--of)',ic:'✱'},
    {g:'edu',t:'Education',s:'Degree programme',c:'var(--pf)',ic:'◆'}];
  function endv(r){return r.e==='now'?TOTAL:mi(r.e,true);}
  jcards.innerHTML=GR.map(function(G){
    var list=ROLES.filter(function(r){return laneC[r.lane].g===G.g;}).sort(function(a,b){return endv(b)-endv(a)||mi(b.s)-mi(a.s);});
    return '<section class="jg" data-g="'+G.g+'" style="--lc:'+G.c+'"><header class="jgh"><span class="ic" aria-hidden="true">'+G.ic+'</span><h3>'+G.t+'</h3><p>'+G.s+'</p><b>'+list.length+' role'+(list.length>1?'s':'')+'</b></header><ol class="je">'
      +list.map(function(r){return '<li class="jc" data-id="'+r.id+'" data-g="'+G.g+'"><div class="dt"><b>'+fmt(r.s)+'</b><span>→ '+(r.e==='now'?'present':fmt(r.e))+'</span></div><div class="bd2"><div class="tp"><h4>'+r.role+'</h4><span class="org">'+r.org+'</span></div><p>'+r.note+'</p><em class="du">'+dur(r)+'</em></div></li>';}).join('')
      +'</ol></section>';
  }).join('');
  $$('.jc',jcards).forEach(function(c){c.classList.add('in'); io&&io.unobserve&&io.unobserve(c);});
  function hl(id,on){$$('[data-id="'+id+'"]').forEach(function(e){e.classList.toggle('on',on);});}
  gt.addEventListener('pointerover',function(e){var b=e.target.closest('.bar'); if(b) hl(b.getAttribute('data-id'),true);});
  gt.addEventListener('pointerout',function(e){var b=e.target.closest('.bar'); if(b) hl(b.getAttribute('data-id'),false);});
  gt.addEventListener('focusin',function(e){var b=e.target.closest('.bar'); if(b) hl(b.getAttribute('data-id'),true);});
  gt.addEventListener('focusout',function(e){var b=e.target.closest('.bar'); if(b) hl(b.getAttribute('data-id'),false);});
  gt.addEventListener('click',function(e){var b=e.target.closest('.bar'); if(!b) return; var c=$('.jc[data-id="'+b.getAttribute('data-id')+'"]',jcards); if(c&&!c.hidden) c.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'});});
  $$('.jc',jcards).forEach(function(c){c.addEventListener('pointerenter',function(){hl(c.getAttribute('data-id'),true);}); c.addEventListener('pointerleave',function(){hl(c.getAttribute('data-id'),false);});});
  $$('#jchips .chip').forEach(function(ch){
    ch.addEventListener('click',function(){
      var f=ch.getAttribute('data-f');
      $$('#jchips .chip').forEach(function(c){c.setAttribute('aria-pressed',c===ch?'true':'false');});
      $$('[data-g]',gt).forEach(function(e){e.classList.toggle('dim',!(f==='all'||e.getAttribute('data-g')===f));});
      $$('.jg',jcards).forEach(function(g){g.hidden=!(f==='all'||g.getAttribute('data-g')===f);});
    });
  });

  /* ---------- stack ---------- */
  function norm(s){return s.toLowerCase().replace(/[^a-z0-9#+]/g,'');}
  function usedIn(name){
    var n=norm(name), out=[]; if(n.length<2) return out;
    PROJECTS.forEach(function(p){var hit=p.stack.some(function(t){var x=norm(t); if(n.length<=4||x.length<=4) return x===n; return x===n||x.indexOf(n)>-1||n.indexOf(x)>-1;}); if(hit) out.push(p.title);});
    return out;
  }
  var cats=$('#cats'), tiles=$('#tiles'), tline=$('#tline'), grepEl=$('#grep'), nohit=$('#nohit'), act=0;
  cats.innerHTML=SK.map(function(g,i){return '<li><button type="button" data-i="'+i+'" aria-pressed="'+(i===0)+'">'+g.c+'<small>'+g.i.length+'</small></button></li>';}).join('');
  function parse(raw){var p=raw.split('|'); return {name:p[0],lv:p[1]||''};}
  function renderStack(){
    var q=grepEl.value.trim().toLowerCase(), list=[];
    if(q){SK.forEach(function(g,gi){g.i.forEach(function(raw){var p=parse(raw); if(p.name.toLowerCase().indexOf(q)>-1) list.push({g:g.c,gi:gi,name:p.name,lv:p.lv});});});}
    else{SK[act].i.forEach(function(raw){var p=parse(raw); list.push({g:SK[act].c,gi:act,name:p.name,lv:p.lv});});}
    cats.classList.toggle('off',!!q);
    tline.innerHTML=q?'<b>$</b> grep -i "'+q.replace(/</g,'&lt;')+'" stack/* <em>→ '+list.length+' match'+(list.length===1?'':'es')+'</em>':'<b>$</b> ls stack/'+SK[act].c.toLowerCase().replace(/[^a-z]+/g,'-').replace(/-$/,'')+' <em>→ '+list.length+' items</em>';
    nohit.hidden=!(q&&!list.length);
    tiles.innerHTML=list.map(function(it,k){
      var u=usedIn(it.name), des=(it.name==='Photoshop'||it.name==='Illustrator'), bd='';
      if(des) bd+='<span>14 design chapters</span>'; else if(u.length) bd+='<span>'+u.length+' project'+(u.length>1?'s':'')+'</span>';
      if(it.lv) bd+='<span class="lv">'+it.lv+'</span>';
      return '<button type="button" class="tile" style="--i:'+k+';--tc:'+TC[it.gi%4]+'" data-u="'+(des?'Posters, banners, standees, merch and more':u.join(', '))+'" aria-expanded="false"><span class="nm">'+it.name+'</span><span class="cg">'+it.g+'</span><span class="bd">'+bd+'</span></button>';
    }).join('');
  }
  cats.addEventListener('click',function(e){var b=e.target.closest('button'); if(!b) return; act=parseInt(b.getAttribute('data-i'),10); grepEl.value=''; $$('button',cats).forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false');}); renderStack();});
  grepEl.addEventListener('input',renderStack);
  tiles.addEventListener('click',function(e){
    var t=e.target.closest('.tile'); if(!t) return; var open=t.getAttribute('aria-expanded')==='true';
    $$('.tile',tiles).forEach(function(x){x.setAttribute('aria-expanded','false'); var u=$('.used',x); if(u) u.remove();});
    if(!open){t.setAttribute('aria-expanded','true'); var u=t.getAttribute('data-u'); var p=document.createElement('span'); p.className='used'; p.textContent=u?'used in: '+u:'learning, practice and coursework'; t.insertBefore(p,$('.bd',t));}
  });
  tiles.addEventListener('pointermove',function(e){var t=e.target.closest('.tile'); if(!t) return; var r=t.getBoundingClientRect(); t.style.setProperty('--px',(e.clientX-r.left)+'px'); t.style.setProperty('--py',(e.clientY-r.top)+'px');});
  renderStack();

  /* ---------- contact ---------- */
  function copy(btn,text){
    function done(ok){var o=btn.textContent; btn.textContent=ok?'copied':'select + copy'; setTimeout(function(){btn.textContent=o;},1600);}
    function fb(){try{var code=btn.parentNode.querySelector('code'), r=document.createRange(); r.selectNodeContents(code); var s=window.getSelection(); s.removeAllRanges(); s.addRange(r);}catch(e){} done(false);}
    try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(function(){done(true);},fb);}else{fb();}}catch(e){fb();}
  }
  $$('[data-copy]').forEach(function(b){b.addEventListener('click',function(){copy(b,b.getAttribute('data-copy'));});});
  if(CONTACT_EMAIL){$('#emailtxt').textContent=CONTACT_EMAIL; $('#emailcopy').setAttribute('data-copy',CONTACT_EMAIL); $('#emailrow').hidden=false;}
  /* footer: fit wordmark, spotlight, clock */
  var big=$('#big'), bigt=$('#bigt'), foot=$('.foot');
  function fit(){bigt.style.fontSize='100px'; var w=bigt.getBoundingClientRect().width, av=big.clientWidth-32; if(w>0) bigt.style.fontSize=Math.max(24,Math.floor(100*av/w))+'px';}
  fit(); window.addEventListener('resize',fit); if(document.fonts&&document.fonts.ready) document.fonts.ready.then(fit);
  foot.addEventListener('pointermove',function(e){var r=bigt.getBoundingClientRect(); bigt.style.setProperty('--fx',(e.clientX-r.left)+'px'); bigt.style.setProperty('--fy',(e.clientY-r.top)+'px');});
  foot.addEventListener('pointerleave',function(){bigt.style.setProperty('--fx','-30%');});
  var clockEl=$('#clock'), upEl=$('#up'), t0s=Date.now();
  function tickClock(){
    try{clockEl.textContent=new Date().toLocaleTimeString('en-GB',{timeZone:'Asia/Kolkata',hour12:false});}catch(e){clockEl.textContent=new Date().toTimeString().slice(0,8);}
    var s=Math.floor((Date.now()-t0s)/1000); upEl.textContent=('0'+Math.floor(s/60)).slice(-2)+':'+('0'+(s%60)).slice(-2);
  }
  tickClock(); if(!reduce) setInterval(tickClock,1000);
  var lan=$('#lan'), swing=$('#swing');
  lan.addEventListener('pointermove',function(e){if(reduce) return; var r=lan.getBoundingClientRect(); swing.style.setProperty('--rot',((((e.clientX-r.left)/r.width)-.5)*14).toFixed(2)+'deg');});
  lan.addEventListener('pointerleave',function(){swing.style.setProperty('--rot','0deg');});
})();
/* 2026-02-11T09:20:00 */
/* 2026-02-13T13:17:00 */
/* 2026-02-13T15:06:00 */
/* 2026-02-14T12:49:00 */
/* 2026-02-14T10:28:00 */
/* 2026-02-16T09:39:00 */
/* 2026-02-17T13:22:00 */
/* 2026-02-17T10:00:00 */
/* 2026-02-17T13:20:00 */
