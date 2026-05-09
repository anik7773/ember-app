import React, { useState, useRef } from "react";

const PROFILES = [
  { id:1, name:"Natalie", age:27, city:"New York", tagline:"I'll cook, you bring the wine 🍷", bio:"Tired of talking about Netflix. I want someone who makes me forget my phone exists.", height:"5'6\"", prompts:[{q:"The way to my heart is...",a:"A surprise picnic. Or sushi. Both."},{q:"I get unreasonably excited about...",a:"Thunderstorms at 2am with tea and a good book"}], verified:true, active:true, accent:"#c9845a", emoji:"🌹", photos:4 },
  { id:2, name:"Marcus", age:31, city:"London", tagline:"Let's get lost somewhere new 🌍", bio:"Done with situationships. Ready to build something real.", height:"6'1\"", prompts:[{q:"First date I'd plan...",a:"Rooftop at sunset, no phones allowed"},{q:"I'm hard to reach unless...",a:"You match my playlist energy"}], verified:true, active:false, accent:"#6a9fd8", emoji:"🌊", photos:6 },
  { id:3, name:"Zara", age:25, city:"Paris", tagline:"Soft mornings, wild nights 🌙", bio:"Long dinners, longer conversations, never sleeping before midnight.", height:"5'4\"", prompts:[{q:"My love language is...",a:"Showing up unannounced with food"},{q:"You'll know I like you when...",a:"I send you a voice note at 1am"}], verified:true, active:true, accent:"#b87fd4", emoji:"🌸", photos:5 },
  { id:4, name:"Diego", age:29, city:"Madrid", tagline:"Fluent in food and affection 🍳", bio:"Looking for my last first date. No games, no grey areas.", height:"5'11\"", prompts:[{q:"Saturday morning looks like...",a:"Farmers market, cooking something ambitious"},{q:"Green flag I look for...",a:"You remember small things I said weeks ago"}], verified:false, active:false, accent:"#7db87f", emoji:"🌿", photos:3 },
];

const MATCHES = [
  { id:1, name:"Natalie", age:27, emoji:"🌹", accent:"#c9845a", active:true, lastMsg:"Can't stop thinking about that conversation 😊", time:"now", unread:2 },
  { id:3, name:"Zara", age:25, emoji:"🌸", accent:"#b87fd4", active:true, lastMsg:"Did you listen to my voice note yet?", time:"1h", unread:1 },
  { id:2, name:"Marcus", age:31, emoji:"🌊", accent:"#6a9fd8", active:false, lastMsg:"You: Rooftop sounds perfect 🌅", time:"3h", unread:0 },
];

const INIT_MSGS = {
  1:[{from:"them",text:"Did you actually read my prompts or just swipe? 😂",time:"8:14 PM"},{from:"me",text:"Thunderstorm + tea got me. I'm that person too",time:"8:17 PM"},{from:"them",text:"Ok you're different 😊",time:"8:19 PM"}],
  3:[{from:"them",text:"Voice note incoming 🎤",time:"1:12 AM",voice:true},{from:"me",text:"You actually did it 😭",time:"1:18 AM"}],
};

const PLANS = [
  { id:"week", label:"1 Week", price:6.99, per:"week", total:6.99, save:null, popular:false },
  { id:"month", label:"1 Month", price:19.99, per:"month", total:19.99, save:"30%", popular:true },
  { id:"six", label:"6 Months", price:8.99, per:"month", total:53.94, save:"55%", popular:false },
];

const LEVELS = [
  { id:0, name:"Unverified", icon:"👤", color:"#555", badge:null, unlocks:["Basic swiping","5 likes/day","Text chat only"], locked:["See who liked you","Voice & video","Private albums"] },
  { id:1, name:"Verified", icon:"✓", color:"#6a9fd8", badge:"VERIFIED", unlocks:["Blue badge","Unlimited likes","Voice messages","See 3 admirers/day"], locked:["Video calls","Private albums","Ember Boost"] },
  { id:2, name:"Trusted", icon:"🔰", color:"#c9845a", badge:"TRUSTED", unlocks:["Gold badge","Video calls","Private albums","See all admirers"], locked:["Intimate content","Elite events"] },
  { id:3, name:"Ember Elite", icon:"🔥", color:"#e8a030", badge:"ELITE", unlocks:["Elite badge","Full access","Exclusive events","2x daily Boost"], locked:[] },
];

const fmtCard = v => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
const fmtExpiry = v => { const d=v.replace(/\D/g,"").slice(0,4); return d.length>=3?d.slice(0,2)+"/"+d.slice(2):d; };
const cardBrand = n => { const s=n.replace(/\s/g,""); if(s[0]==="4") return "VISA"; if(s[0]==="5") return "MC"; if(s[0]==="3") return "AMEX"; return ""; };

function PaymentModal({ onClose, onSuccess }) {
  const [plan, setPlan] = useState("month");
  const [payTab, setPayTab] = useState("card");
  const [step, setStep] = useState("plans");
  const [card, setCard] = useState({ number:"", expiry:"", cvv:"", name:"" });
  const [errors, setErrors] = useState({});
  const sel = PLANS.find(p => p.id === plan);

  const validate = () => {
    const e = {};
    if (card.number.replace(/\s/g,"").length < 16) e.number = "Invalid";
    if (card.expiry.length < 5) e.expiry = "Invalid";
    if (card.cvv.length < 3) e.cvv = "Invalid";
    if (!card.name.trim()) e.name = "Required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const pay = () => {
    if (payTab === "card" && !validate()) return;
    setStep("processing");
    setTimeout(() => setStep("success"), 2400);
  };

  return (
    <div onClick={e => e.target===e.currentTarget && onClose()}
      style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:999,display:"flex",alignItems:"flex-end" }}>
      <div style={{ background:"#0d0806",borderRadius:"24px 24px 0 0",width:"100%",border:"1px solid #2a1810",maxHeight:"90vh",overflowY:"auto" }}>

        {step==="plans" && (
          <div style={{ padding:"24px 20px 32px" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
              <div style={{ fontFamily:"Georgia,serif",fontSize:24,fontWeight:700,color:"#f5ede6" }}>Ember<span style={{ color:"#c9845a" }}>+</span></div>
              <button onClick={onClose} style={{ background:"none",border:"none",fontSize:22,color:"#5a4035",cursor:"pointer" }}>✕</button>
            </div>
            <div style={{ fontSize:11,color:"#5a4035",letterSpacing:1.5,fontWeight:700,marginBottom:12 }}>CHOOSE YOUR PLAN</div>
            {PLANS.map(p => (
              <div key={p.id} onClick={() => setPlan(p.id)}
                style={{ background:plan===p.id?"#2a1200":"#110a05",border:`1.5px solid ${plan===p.id?"#c9845a":"#1e1008"}`,borderRadius:14,padding:"14px 16px",marginBottom:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",position:"relative" }}>
                {p.popular && <div style={{ position:"absolute",top:-9,left:14,background:"linear-gradient(135deg,#c9845a,#e8603a)",color:"#fff",fontSize:9,fontWeight:800,borderRadius:50,padding:"2px 10px" }}>POPULAR</div>}
                <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                  <div style={{ width:18,height:18,borderRadius:"50%",border:`2px solid ${plan===p.id?"#c9845a":"#3a2218"}`,background:plan===p.id?"#c9845a":"transparent",display:"flex",alignItems:"center",justifyContent:"center" }}>
                    {plan===p.id && <div style={{ width:7,height:7,borderRadius:"50%",background:"#fff" }} />}
                  </div>
                  <div>
                    <div style={{ fontWeight:600,fontSize:14,color:plan===p.id?"#f5ede6":"#7a5040" }}>{p.label}</div>
                    {p.save && <div style={{ fontSize:10,color:"#c9845a",fontWeight:700 }}>Save {p.save}</div>}
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:plan===p.id?"#c9845a":"#5a4035" }}>${p.price}</div>
                  <div style={{ fontSize:10,color:"#3a2218" }}>/{p.per}</div>
                </div>
              </div>
            ))}
            <button onClick={() => setStep("card")} style={{ width:"100%",marginTop:6,background:"linear-gradient(135deg,#c9845a,#e8603a)",border:"none",borderRadius:50,padding:"16px",color:"#fff",fontWeight:800,fontSize:15,cursor:"pointer" }}>
              Continue → ${sel.total.toFixed(2)}
            </button>
          </div>
        )}

        {step==="card" && (
          <div style={{ padding:"20px 20px 32px" }}>
            <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:18 }}>
              <button onClick={() => setStep("plans")} style={{ background:"none",border:"none",color:"#c9845a",fontSize:20,cursor:"pointer" }}>←</button>
              <div style={{ fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:"#f5ede6" }}>Payment</div>
              <div style={{ marginLeft:"auto",background:"#1a0f0a",border:"1px solid #2a1810",borderRadius:50,padding:"4px 14px",fontSize:12,fontWeight:700,color:"#c9845a" }}>${sel.total.toFixed(2)}</div>
            </div>
            <div style={{ display:"flex",gap:8,marginBottom:16 }}>
              {[["card","💳 Card"],["apple","🍎 Apple"],["google","G Pay"]].map(([id,label]) => (
                <button key={id} onClick={() => setPayTab(id)}
                  style={{ flex:1,padding:"9px 4px",borderRadius:10,border:`1.5px solid ${payTab===id?"#c9845a":"#2a1810"}`,background:payTab===id?"#2a1200":"#110a05",color:payTab===id?"#c9845a":"#5a4035",fontSize:11,fontWeight:600,cursor:"pointer" }}>{label}</button>
              ))}
            </div>
            {payTab==="card" && (
              <>
                <div style={{ background:"linear-gradient(135deg,#1e0e00,#3a1800)",border:"1px solid #3a2010",borderRadius:14,padding:"18px",marginBottom:14 }}>
                  <div style={{ display:"flex",justifyContent:"space-between",marginBottom:16 }}>
                    <div style={{ fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,color:"#c9845a" }}>ember+</div>
                    <div style={{ fontSize:12,fontWeight:700,color:"#5a4035" }}>{cardBrand(card.number)||"CARD"}</div>
                  </div>
                  <div style={{ fontFamily:"monospace",fontSize:15,color:"#f5ede6",letterSpacing:2,marginBottom:14 }}>{card.number||"•••• •••• •••• ••••"}</div>
                  <div style={{ display:"flex",justifyContent:"space-between" }}>
                    <div><div style={{ fontSize:8,color:"#5a4035" }}>NAME</div><div style={{ fontSize:12,color:"#d0b8a8" }}>{card.name||"YOUR NAME"}</div></div>
                    <div><div style={{ fontSize:8,color:"#5a4035" }}>EXPIRES</div><div style={{ fontSize:12,color:"#d0b8a8" }}>{card.expiry||"MM/YY"}</div></div>
                  </div>
                </div>
                {[{label:"CARD NUMBER",key:"number",ph:"1234 5678 9012 3456",max:19,fmt:fmtCard},{label:"NAME ON CARD",key:"name",ph:"Your name",max:40,fmt:v=>v}].map(f => (
                  <div key={f.key} style={{ marginBottom:10 }}>
                    <div style={{ fontSize:10,color:errors[f.key]?"#c06050":"#5a4035",letterSpacing:1,fontWeight:600,marginBottom:5 }}>{f.label}</div>
                    <input value={card[f.key]} onChange={e => setCard(c=>({...c,[f.key]:f.fmt(e.target.value)}))} placeholder={f.ph} maxLength={f.max}
                      style={{ width:"100%",background:"#0d0806",border:`1px solid ${errors[f.key]?"#6a2020":"#2a1810"}`,borderRadius:10,padding:"12px 14px",fontSize:14,color:"#f5ede6",boxSizing:"border-box" }} />
                    {errors[f.key] && <div style={{ fontSize:11,color:"#c06050",marginTop:4 }}>⚠ {errors[f.key]}</div>}
                  </div>
                ))}
                <div style={{ display:"flex",gap:10,marginBottom:14 }}>
                  {[{label:"EXPIRY",key:"expiry",ph:"MM/YY",max:5,fmt:fmtExpiry,w:"55%"},{label:"CVV",key:"cvv",ph:"•••",max:4,fmt:v=>v.replace(/\D/g,""),w:"45%"}].map(f => (
                    <div key={f.key} style={{ width:f.w }}>
                      <div style={{ fontSize:10,color:errors[f.key]?"#c06050":"#5a4035",letterSpacing:1,fontWeight:600,marginBottom:5 }}>{f.label}</div>
                      <input value={card[f.key]} onChange={e => setCard(c=>({...c,[f.key]:f.fmt(e.target.value)}))} placeholder={f.ph} maxLength={f.max}
                        style={{ width:"100%",background:"#0d0806",border:`1px solid ${errors[f.key]?"#6a2020":"#2a1810"}`,borderRadius:10,padding:"12px 14px",fontSize:14,color:"#f5ede6",boxSizing:"border-box" }} />
                      {errors[f.key] && <div style={{ fontSize:11,color:"#c06050",marginTop:4 }}>⚠ {errors[f.key]}</div>}
                    </div>
                  ))}
                </div>
              </>
            )}
            {payTab!=="card" && (
              <div style={{ textAlign:"center",padding:"28px 0 16px" }}>
                <div style={{ fontSize:52,marginBottom:10 }}>{payTab==="apple"?"🍎":"G"}</div>
                <div style={{ fontSize:14,color:"#d0b8a8",marginBottom:4 }}>{payTab==="apple"?"Apple Pay ready":"Google Pay ready"}</div>
                <div style={{ fontSize:12,color:"#5a4035" }}>Tap below to authenticate</div>
              </div>
            )}
            <button onClick={pay} style={{ width:"100%",background:"linear-gradient(135deg,#c9845a,#e8603a)",border:"none",borderRadius:50,padding:"17px",color:"#fff",fontWeight:800,fontSize:15,cursor:"pointer",marginTop:8 }}>
              🔒 Pay ${sel.total.toFixed(2)}
            </button>
            <div style={{ textAlign:"center",fontSize:11,color:"#3a2218",marginTop:10 }}>Cancel anytime · SSL Secured</div>
          </div>
        )}

        {step==="processing" && (
          <div style={{ padding:"60px 20px",textAlign:"center" }}>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <div style={{ width:60,height:60,borderRadius:"50%",border:"3px solid #1a1008",borderTop:"3px solid #c9845a",margin:"0 auto 20px",animation:"spin 1s linear infinite" }} />
            <div style={{ fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:"#f5ede6",marginBottom:6 }}>Processing...</div>
            <div style={{ fontSize:13,color:"#5a4035" }}>Securing your payment</div>
          </div>
        )}

        {step==="success" && (
          <div style={{ padding:"32px 20px 40px",textAlign:"center" }}>
            <style>{`@keyframes popin{0%{transform:scale(0)}60%{transform:scale(1.2)}100%{transform:scale(1)}}`}</style>
            <div style={{ width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,#c9845a,#e8603a)",margin:"0 auto 18px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:38,boxShadow:"0 0 40px rgba(201,132,90,0.5)",animation:"popin .5s ease" }}>🔥</div>
            <div style={{ fontFamily:"Georgia,serif",fontSize:28,fontWeight:700,color:"#f5ede6",marginBottom:4 }}>Payment Successful!</div>
            <div style={{ fontSize:13,color:"#7a5040",marginBottom:20,lineHeight:1.7 }}>Ember+ is now active 🎉</div>
            <div style={{ background:"#110a05",border:"1px solid #2a1810",borderRadius:14,padding:"14px 16px",marginBottom:20,textAlign:"left" }}>
              {[["Plan",`Ember+ ${sel.label}`],["Charged",`$${sel.total.toFixed(2)}`],["Status","✅ Paid"],["Renews",sel.id==="week"?"In 7 days":"In 30 days"]].map(([k,v]) => (
                <div key={k} style={{ display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #1a1008" }}>
                  <span style={{ fontSize:12,color:"#5a4035" }}>{k}</span>
                  <span style={{ fontSize:13,color:k==="Charged"?"#c9845a":"#d0b8a8",fontWeight:k==="Charged"?700:400 }}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={onSuccess} style={{ width:"100%",background:"linear-gradient(135deg,#c9845a,#e8603a)",border:"none",borderRadius:50,padding:"16px",color:"#fff",fontWeight:800,fontSize:15,cursor:"pointer" }}>
              Start Discovering 🔥
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function NavBar({ screen, setScreen }) {
  const tabs = [
    { icon:"🔥", label:"DISCOVER", s:"discover" },
    { icon:"💌", label:"MATCHES", s:"matches", badge:2 },
    { icon:"💬", label:"CHATS", s:"chats" },
    { icon:"🔐", label:"VERIFY", s:"verify" },
    { icon:"👤", label:"ME", s:"profile" },
  ];
  return (
    <div style={{ display:"flex",borderTop:"1px solid #1a100a",background:"#0a0603",flexShrink:0 }}>
      {tabs.map(t => (
        <button key={t.s} onClick={() => setScreen(t.s)}
          style={{ flex:1,padding:"9px 0 11px",border:"none",background:"transparent",cursor:"pointer",position:"relative" }}>
          <div style={{ fontSize:18 }}>{t.icon}</div>
          <div style={{ fontSize:8,color:screen===t.s?"#c9845a":"#3a2218",marginTop:2,fontWeight:screen===t.s?700:400 }}>{t.label}</div>
          {t.badge && <div style={{ position:"absolute",top:5,right:"calc(50% - 18px)",background:"#c9845a",color:"#fff",fontSize:8,fontWeight:800,borderRadius:"50%",width:14,height:14,display:"flex",alignItems:"center",justifyContent:"center" }}>{t.badge}</div>}
          {screen===t.s && <div style={{ position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:18,height:2,background:"#c9845a",borderRadius:2 }} />}
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("discover");
  const [idx, setIdx] = useState(0);
  const [swipeAnim, setSwipeAnim] = useState(null);
  const [matchPopup, setMatchPopup] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState(INIT_MSGS);
  const [draft, setDraft] = useState("");
  const [swipesUsed, setSwipesUsed] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [verifyStep, setVerifyStep] = useState(0);
  const [dob, setDob] = useState({ day:"",month:"",year:"" });
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [idUploaded, setIdUploaded] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const cardRef = useRef(null);
  const startX = useRef(0);
  const dragX = useRef(0);

  const profile = PROFILES[idx % PROFILES.length];
  const level = LEVELS[currentLevel];

  const openPayment = () => setShowPayment(true);
  const onPaySuccess = () => { setShowPayment(false); setCurrentLevel(l => Math.min(l+1,3)); };

  const doSwipe = dir => {
    if (dir==="right" && swipesUsed>=5) { openPayment(); return; }
    setSwipeAnim(dir);
    setTimeout(() => {
      if (dir==="right") { setSwipesUsed(s=>s+1); if (Math.random()>0.35) setMatchPopup(profile); }
      setIdx(i=>i+1); setSwipeAnim(null);
      if (cardRef.current) cardRef.current.style.transform="";
    }, 380);
  };

  const onTouchStart = e => { startX.current=e.touches[0].clientX; };
  const onTouchMove = e => {
    dragX.current=e.touches[0].clientX-startX.current;
    if (cardRef.current) { cardRef.current.style.transform=`translateX(${dragX.current}px) rotate(${dragX.current*0.06}deg)`; cardRef.current.style.transition="none"; }
  };
  const onTouchEnd = () => {
    if (Math.abs(dragX.current)>80) doSwipe(dragX.current>0?"right":"left");
    else if (cardRef.current) { cardRef.current.style.transform=""; cardRef.current.style.transition=""; }
    dragX.current=0;
  };

  const sendMsg = () => {
    if (!draft.trim()||!activeChat) return;
    setMessages(m=>({...m,[activeChat.id]:[...(m[activeChat.id]||[]),{from:"me",text:draft,time:"Now"}]}));
    setDraft("");
  };

  const ageValid = () => { const y=parseInt(dob.year),mo=parseInt(dob.month),d=parseInt(dob.day); if(!y||!mo||!d) return false; return new Date().getFullYear()-y>=18; };
  const simulateVerify = () => { setVerifying(true); setTimeout(()=>{ setVerifying(false); setVerifyStep(s=>s+1); },1800); };

  return (
    <div style={{ background:"#0d0806",height:"100vh",maxWidth:430,margin:"0 auto",fontFamily:"DM Sans,sans-serif",color:"#f5ede6",display:"flex",flexDirection:"column",overflow:"hidden" }}>
      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:0; }
        input,button { outline:none; font-family:DM Sans,sans-serif; }
        .card { transition:transform 0.38s cubic-bezier(.4,0,.2,1),opacity 0.38s; }
        .go-r { transform:translateX(120%) rotate(20deg)!important; opacity:0!important; }
        .go-l { transform:translateX(-120%) rotate(-20deg)!important; opacity:0!important; }
        @keyframes pop { 0%{transform:scale(0)} 60%{transform:scale(1.2)} 100%{transform:scale(1)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes fi { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        @keyframes bl { 0%,100%{opacity:1} 50%{opacity:.4} }
        .fi { animation:fi .3s ease; }
        .blink { animation:bl 2s infinite; }
      `}</style>

      {showPayment && <PaymentModal onClose={() => setShowPayment(false)} onSuccess={onPaySuccess} />}

      {matchPopup && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:500,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32 }}>
          <div style={{ textAlign:"center",width:"100%",animation:"pop .5s ease" }}>
            <div style={{ fontSize:64,marginBottom:8 }}>🔥</div>
            <div style={{ fontFamily:"Georgia,serif",fontSize:44,fontWeight:700,color:"#c9845a",lineHeight:1 }}>It's a</div>
            <div style={{ fontFamily:"Georgia,serif",fontSize:44,fontWeight:700,color:"#f5ede6",marginBottom:6 }}>Connection.</div>
            <div style={{ color:"#7a5040",fontSize:13,marginBottom:28 }}>You and {matchPopup.name} both felt something</div>
            <div style={{ width:80,height:80,borderRadius:"50%",background:`${matchPopup.accent}33`,border:`3px solid ${matchPopup.accent}`,margin:"0 auto 28px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:42 }}>{matchPopup.emoji}</div>
            <button onClick={() => { setActiveChat(MATCHES.find(m=>m.id===matchPopup.id)||MATCHES[0]); setScreen("chats"); setMatchPopup(null); }}
              style={{ width:"100%",background:"linear-gradient(135deg,#c9845a,#e8603a)",border:"none",borderRadius:50,padding:"16px",color:"#fff",fontWeight:700,fontSize:15,marginBottom:10,cursor:"pointer" }}>
              💬 Start the conversation
            </button>
            <button onClick={() => setMatchPopup(null)} style={{ background:"none",border:"1px solid #2a1810",borderRadius:50,padding:"13px 32px",color:"#5a4035",fontSize:13,cursor:"pointer" }}>Keep discovering</button>
          </div>
        </div>
      )}

      {screen==="discover" && (
        <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 20px 8px",flexShrink:0 }}>
            <div>
              <div style={{ fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,color:"#f5ede6" }}>ember<span style={{ color:"#c9845a" }}>.</span></div>
              <div style={{ fontSize:8,color:"#4a2a18",letterSpacing:2.5,fontWeight:600 }}>REAL CONNECTIONS</div>
            </div>
            <div style={{ display:"flex",gap:10,alignItems:"center" }}>
              <div onClick={openPayment} style={{ background:"linear-gradient(135deg,#c9845a,#e8603a)",borderRadius:50,padding:"5px 12px",fontSize:11,fontWeight:700,color:"#fff",cursor:"pointer" }}>🔥 Ember+</div>
              <div onClick={() => setScreen("profile")} style={{ width:34,height:34,borderRadius:"50%",background:"#1e120c",border:"1px solid #3a2218",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,cursor:"pointer" }}>😊</div>
            </div>
          </div>
          <div style={{ textAlign:"center",fontSize:11,marginBottom:4,flexShrink:0 }}>
            {swipesUsed<5 ? <span style={{ color:"#3a2218" }}>{5-swipesUsed} free likes left</span> : <span style={{ color:"#c9845a",cursor:"pointer" }} onClick={openPayment}>🔥 Unlock unlimited likes</span>}
          </div>
          <div style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 14px",position:"relative",overflow:"hidden" }}>
            <div style={{ position:"absolute",width:"calc(100% - 48px)",maxWidth:360,borderRadius:26,background:"linear-gradient(160deg,#1a0a00,#2a1500)",height:480,transform:"scale(0.94) translateY(14px)",opacity:0.5,zIndex:1 }} />
            <div ref={cardRef} className={`card ${swipeAnim==="right"?"go-r":swipeAnim==="left"?"go-l":""}`}
              onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
              style={{ width:"100%",maxWidth:370,borderRadius:26,overflow:"hidden",zIndex:2,background:"linear-gradient(155deg,#1a0a00,#2a1500)",boxShadow:"0 20px 70px rgba(0,0,0,0.65)",cursor:"grab",userSelect:"none",border:"1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ height:280,background:`linear-gradient(140deg,${profile.accent}18,#2a1500)`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative" }}>
                <div style={{ fontSize:100 }}>{profile.emoji}</div>
                <div style={{ position:"absolute",top:12,left:12,display:"flex",gap:4 }}>
                  {Array(profile.photos).fill(0).map((_,i)=><div key={i} style={{ height:3,width:i===0?24:12,borderRadius:2,background:i===0?"#fff":"rgba(255,255,255,0.25)" }} />)}
                </div>
                <div style={{ position:"absolute",top:12,right:12,display:"flex",flexDirection:"column",gap:5,alignItems:"flex-end" }}>
                  {profile.verified && <div style={{ background:profile.accent,borderRadius:50,padding:"2px 8px",fontSize:9,fontWeight:700,color:"#fff" }}>✓ Verified</div>}
                  <div style={{ background:"rgba(0,0,0,0.5)",borderRadius:50,padding:"2px 8px",fontSize:9,color:"rgba(255,255,255,0.8)",display:"flex",alignItems:"center",gap:4 }}>
                    {profile.active && <span className="blink" style={{ display:"inline-block",width:6,height:6,borderRadius:"50%",background:"#4CAF50" }} />}
                    {profile.active?"Active now":"2h ago"}
                  </div>
                </div>
                <div style={{ position:"absolute",bottom:0,left:0,right:0,height:80,background:"linear-gradient(transparent,#2a1500)" }} />
              </div>
              <div style={{ padding:"14px 18px 18px" }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4 }}>
                  <div><span style={{ fontFamily:"Georgia,serif",fontSize:28,fontWeight:700,color:"#f5ede6" }}>{profile.name}</span><span style={{ fontSize:18,color:"rgba(245,237,230,0.5)",marginLeft:8 }}>{profile.age}</span></div>
                  <div style={{ fontSize:11,color:profile.accent }}>{profile.city}</div>
                </div>
                <div style={{ fontFamily:"Georgia,serif",fontSize:14,fontStyle:"italic",color:profile.accent,marginBottom:8 }}>"{profile.tagline}"</div>
                <p style={{ fontSize:12,color:"rgba(245,237,230,0.6)",lineHeight:1.7,marginBottom:12 }}>{profile.bio}</p>
                {profile.prompts.map((p,i)=>(
                  <div key={i} style={{ background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"10px 12px",marginBottom:8 }}>
                    <div style={{ fontSize:9,color:profile.accent,fontWeight:600,letterSpacing:0.5,marginBottom:3 }}>{p.q}</div>
                    <div style={{ fontSize:12,color:"#f0e8e0",lineHeight:1.5 }}>{p.a}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display:"flex",justifyContent:"center",alignItems:"center",gap:18,padding:"10px 0 14px",flexShrink:0 }}>
            <button onClick={() => doSwipe("left")} style={{ width:54,height:54,borderRadius:"50%",background:"#1a0f0a",border:"1px solid #3a2218",fontSize:20,color:"#c0705a",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
            <button onClick={openPayment} style={{ width:42,height:42,borderRadius:"50%",background:"#1a0f0a",border:"1px solid #3a2218",fontSize:16,cursor:"pointer" }}>⭐</button>
            <button onClick={() => doSwipe("right")} style={{ width:66,height:66,borderRadius:"50%",background:"linear-gradient(135deg,#c9845a,#e8603a)",border:"none",fontSize:24,color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 30px rgba(201,132,90,0.45)" }}>♥</button>
            <button onClick={openPayment} style={{ width:42,height:42,borderRadius:"50%",background:"#1a0f0a",border:"1px solid #3a2218",fontSize:16,cursor:"pointer" }}>🔁</button>
            <button onClick={() => doSwipe("right")} style={{ width:54,height:54,borderRadius:"50%",background:"#1a0f0a",border:"1px solid #3a2218",fontSize:20,color:"#6ab87f",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>💬</button>
          </div>
          <NavBar screen={screen} setScreen={setScreen} />
        </div>
      )}

      {screen==="matches" && (
        <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
          <div style={{ padding:"20px 20px 12px",flexShrink:0 }}>
            <div style={{ fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,color:"#f5ede6" }}>Your Matches</div>
          </div>
          <div onClick={openPayment} style={{ margin:"0 18px 14px",background:"linear-gradient(135deg,#2a1200,#4a1e00)",border:"1px solid #6a3010",borderRadius:16,padding:"14px 16px",display:"flex",alignItems:"center",gap:12,cursor:"pointer",flexShrink:0 }}>
            <div style={{ fontSize:28 }}>🔥</div>
            <div style={{ flex:1 }}><div style={{ fontWeight:700,fontSize:14,color:"#e8a87c" }}>12 people liked you</div><div style={{ fontSize:11,color:"#7a5040" }}>Upgrade to see who</div></div>
            <div style={{ background:"#c9845a",borderRadius:50,padding:"5px 12px",fontSize:11,fontWeight:700,color:"#fff" }}>See →</div>
          </div>
          <div style={{ flex:1,overflowY:"auto",padding:"0 18px" }}>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
              {MATCHES.map(m=>(
                <div key={m.id} onClick={() => { setActiveChat(m); setScreen("chats"); }}
                  style={{ borderRadius:18,overflow:"hidden",background:`${m.accent}22`,aspectRatio:"3/4",cursor:"pointer",position:"relative",display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${m.accent}33` }}>
                  <div style={{ fontSize:60 }}>{m.emoji}</div>
                  <div style={{ position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(transparent,rgba(0,0,0,0.7))",padding:"20px 12px 12px" }}>
                    <div style={{ fontFamily:"Georgia,serif",fontSize:18,color:"#fff",fontWeight:700 }}>{m.name}, {m.age}</div>
                  </div>
                  {m.unread>0 && <div style={{ position:"absolute",top:8,left:8,background:"#c9845a",color:"#fff",fontSize:10,fontWeight:800,borderRadius:"50%",width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center" }}>{m.unread}</div>}
                </div>
              ))}
            </div>
          </div>
          <NavBar screen={screen} setScreen={setScreen} />
        </div>
      )}

      {screen==="chats" && !activeChat && (
        <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
          <div style={{ padding:"20px 20px 12px",flexShrink:0 }}><div style={{ fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,color:"#f5ede6" }}>Messages</div></div>
          <div style={{ flex:1,overflowY:"auto" }}>
            {MATCHES.map(m=>(
              <div key={m.id} onClick={() => setActiveChat(m)} style={{ display:"flex",alignItems:"center",gap:14,padding:"14px 20px",cursor:"pointer",borderBottom:"1px solid #1a100a" }}>
                <div style={{ width:54,height:54,borderRadius:"50%",background:`${m.accent}33`,border:`2px solid ${m.accent}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0 }}>{m.emoji}</div>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontWeight:600,fontSize:15,color:"#f5ede6",marginBottom:2 }}>{m.name}, {m.age}</div>
                  <div style={{ fontSize:12,color:"#5a4035",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{m.lastMsg}</div>
                </div>
                <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5 }}>
                  <div style={{ fontSize:10,color:"#3a2218" }}>{m.time}</div>
                  {m.unread>0 && <div style={{ background:"#c9845a",borderRadius:"50%",width:18,height:18,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:"#fff" }}>{m.unread}</div>}
                </div>
              </div>
            ))}
          </div>
          <NavBar screen={screen} setScreen={setScreen} />
        </div>
      )}

      {screen==="chats" && activeChat && (
        <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
          <div style={{ padding:"16px 16px 12px",display:"flex",alignItems:"center",gap:12,borderBottom:"1px solid #1a100a",flexShrink:0 }}>
            <button onClick={() => setActiveChat(null)} style={{ background:"none",border:"none",fontSize:18,color:"#c9845a",cursor:"pointer" }}>←</button>
            <div style={{ width:40,height:40,borderRadius:"50%",background:`${activeChat.accent}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>{activeChat.emoji}</div>
            <div style={{ flex:1 }}><div style={{ fontWeight:600,fontSize:15,color:"#f5ede6" }}>{activeChat.name}</div><div style={{ fontSize:10,color:"#4CAF50" }}>● Online now</div></div>
          </div>
          <div style={{ flex:1,overflowY:"auto",padding:"14px",display:"flex",flexDirection:"column",gap:10 }}>
            {(messages[activeChat.id]||[]).map((msg,i)=>(
              <div key={i} className="fi" style={{ display:"flex",justifyContent:msg.from==="me"?"flex-end":"flex-start" }}>
                <div style={{ background:msg.from==="me"?"linear-gradient(135deg,#c9845a,#e8603a)":"#1e120c",borderRadius:msg.from==="me"?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"11px 14px",maxWidth:"72%",border:msg.from==="them"?"1px solid #2a1810":"none" }}>
                  <div style={{ fontSize:13,color:msg.from==="me"?"#fff":"#e0d4cc",lineHeight:1.6 }}>{msg.text}</div>
                  <div style={{ fontSize:9,color:msg.from==="me"?"rgba(255,255,255,0.5)":"#3a2218",marginTop:3,textAlign:msg.from==="me"?"right":"left" }}>{msg.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div onClick={openPayment} style={{ margin:"0 14px 8px",background:"#1a100a",border:"1px dashed #3a2218",borderRadius:10,padding:"9px 12px",fontSize:11,color:"#c9845a",cursor:"pointer",display:"flex",alignItems:"center",gap:8 }}>
            <span>✨</span><span style={{ flex:1 }}>AI suggests: "Are you free this Sunday?"</span><span style={{ background:"#c9845a22",padding:"2px 8px",borderRadius:50,fontSize:9,fontWeight:700 }}>PRO</span>
          </div>
          <div style={{ display:"flex",gap:10,padding:"8px 14px 20px",flexShrink:0 }}>
            <input value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()} placeholder="Say something real..."
              style={{ flex:1,background:"#1e120c",border:"1px solid #2a1810",borderRadius:50,padding:"0 16px",fontSize:13,color:"#f5ede6",height:42 }} />
            <button onClick={sendMsg} style={{ width:42,height:42,borderRadius:"50%",background:"linear-gradient(135deg,#c9845a,#e8603a)",border:"none",fontSize:16,color:"#fff",cursor:"pointer" }}>→</button>
          </div>
        </div>
      )}

      {screen==="verify" && (
        <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
          <div style={{ padding:"18px 18px 0",flexShrink:0 }}>
            <div style={{ fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:"#f5ede6",marginBottom:14 }}>ember<span style={{ color:"#c9845a" }}>.</span> Trust</div>
            <div style={{ display:"flex",gap:4,marginBottom:16 }}>
              {[0,1,2,3].map(i=><div key={i} style={{ flex:1,height:3,borderRadius:2,background:i<=verifyStep?"#c9845a":"#2a1810",transition:"background 0.4s" }} />)}
            </div>
          </div>
          <div style={{ flex:1,overflowY:"auto",padding:"0 18px 20px" }}>
            <div style={{ background:"#1a1a1a",border:`1px solid ${level.color}44`,borderRadius:18,padding:"18px",marginBottom:14 }}>
              <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:12 }}>
                <div style={{ width:46,height:46,borderRadius:"50%",background:`${level.color}22`,border:`2px solid ${level.color}66`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22 }}>{level.icon}</div>
                <div>
                  <div style={{ fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:"#f5ede6" }}>{level.name}</div>
                  {level.badge && <div style={{ display:"inline-block",background:level.color,borderRadius:50,padding:"2px 10px",fontSize:9,fontWeight:800,color:"#fff",letterSpacing:1 }}>{level.badge}</div>}
                </div>
              </div>
              <div style={{ height:4,background:"#2a1810",borderRadius:2,overflow:"hidden",marginBottom:12 }}>
                <div style={{ height:"100%",width:`${(currentLevel/3)*100}%`,background:`linear-gradient(90deg,#c9845a,${level.color})`,borderRadius:2,transition:"width 0.6s" }} />
              </div>
              {currentLevel<3 && (
                <div style={{ marginBottom:12 }}>
                  <div style={{ fontSize:10,color:"#5a4035",letterSpacing:1,fontWeight:700,marginBottom:8 }}>🔒 UNLOCK NEXT LEVEL</div>
                  {LEVELS[currentLevel+1].unlocks.map((u,i)=>(
                    <div key={i} onClick={openPayment} style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<LEVELS[currentLevel+1].unlocks.length-1?"1px solid #1a1008":"none",cursor:"pointer" }}>
                      <div style={{ width:5,height:5,borderRadius:"50%",background:LEVELS[currentLevel+1].color,flexShrink:0 }} />
                      <span style={{ fontSize:12,color:"#d0b8a8",flex:1 }}>{u}</span>
                      <span style={{ fontSize:10,color:"#c9845a",fontWeight:600 }}>Unlock →</span>
                    </div>
                  ))}
                </div>
              )}
              {currentLevel<3 && <button onClick={openPayment} style={{ width:"100%",background:"linear-gradient(135deg,#c9845a,#e8603a)",border:"none",borderRadius:12,padding:"12px",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer" }}>🔓 Unlock Next Level</button>}
              {currentLevel===3 && <div style={{ textAlign:"center",color:"#e8a030",fontWeight:700 }}>🔥 You're Ember Elite!</div>}
            </div>
            <div style={{ background:"#0f0805",border:"1px dashed #2a1810",borderRadius:14,padding:"16px",marginBottom:12 }}>
              <div style={{ fontSize:12,color:"#7a5040",marginBottom:12 }}>🪪 Free identity verification</div>
              {verifyStep===0 && (
                <div className="fi">
                  <div style={{ fontSize:10,color:"#5a4035",marginBottom:8 }}>DATE OF BIRTH</div>
                  <div style={{ display:"flex",gap:8,marginBottom:12 }}>
                    {[["Day","day","DD",2],["Month","month","MM",2],["Year","year","YYYY",4]].map(([label,key,ph,max])=>(
                      <div key={key} style={{ flex:key==="year"?2:1 }}>
                        <div style={{ fontSize:9,color:"#5a4035",marginBottom:4 }}>{label}</div>
                        <input maxLength={max} placeholder={ph} value={dob[key]} onChange={e=>setDob(d=>({...d,[key]:e.target.value.replace(/\D/g,"")}))}
                          style={{ width:"100%",background:"#0d0806",border:"1px solid #2a1810",borderRadius:8,padding:"10px 6px",fontSize:14,color:"#f5ede6",textAlign:"center" }} />
                      </div>
                    ))}
                  </div>
                  <button onClick={() => ageValid()&&setVerifyStep(1)} style={{ width:"100%",background:ageValid()?"linear-gradient(135deg,#c9845a,#e8603a)":"#1a1008",border:"none",borderRadius:50,padding:"12px",color:ageValid()?"#fff":"#3a2218",fontWeight:700,fontSize:13,cursor:"pointer" }}>Confirm Age →</button>
                </div>
              )}
              {verifyStep===1 && (
                <div className="fi">
                  <div style={{ fontSize:10,color:"#5a4035",marginBottom:8 }}>PHONE NUMBER</div>
                  <div style={{ display:"flex",gap:8,marginBottom:10 }}>
                    <div style={{ background:"#0d0806",border:"1px solid #2a1810",borderRadius:8,padding:"10px",fontSize:12,color:"#5a4035" }}>+1</div>
                    <input placeholder="(555) 000-0000" value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,"").slice(0,10))}
                      style={{ flex:1,background:"#0d0806",border:"1px solid #2a1810",borderRadius:8,padding:"10px 12px",fontSize:13,color:"#f5ede6" }} />
                  </div>
                  {!otpSent
                    ? <button onClick={() => phone.length===10&&setOtpSent(true)} style={{ width:"100%",background:phone.length===10?"linear-gradient(135deg,#c9845a,#e8603a)":"#1a1008",border:"none",borderRadius:50,padding:"12px",color:phone.length===10?"#fff":"#3a2218",fontWeight:700,fontSize:13,cursor:"pointer" }}>Send Code →</button>
                    : <><input placeholder="••••••" maxLength={6} value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,""))}
                        style={{ width:"100%",background:"#0d0806",border:"1px solid #2a1810",borderRadius:8,padding:"12px",fontSize:18,color:"#f5ede6",textAlign:"center",letterSpacing:8,marginBottom:10 }} />
                      <button onClick={() => otp.length===6&&setVerifyStep(2)} style={{ width:"100%",background:otp.length===6?"linear-gradient(135deg,#c9845a,#e8603a)":"#1a1008",border:"none",borderRadius:50,padding:"12px",color:otp.length===6?"#fff":"#3a2218",fontWeight:700,fontSize:13,cursor:"pointer" }}>Verify →</button></>
                  }
                </div>
              )}
              {verifyStep===2 && (
                <div className="fi">
                  <div onClick={() => setIdUploaded(true)} style={{ background:idUploaded?"#0a1a0a":"#1a0f0a",border:`2px dashed ${idUploaded?"#4CAF50":"#2a1810"}`,borderRadius:12,padding:"22px",textAlign:"center",marginBottom:10,cursor:"pointer" }}>
                    {idUploaded?<><div style={{ fontSize:32,marginBottom:6 }}>✅</div><div style={{ color:"#4CAF50",fontWeight:600,fontSize:13 }}>ID Uploaded</div></>:<><div style={{ fontSize:32,marginBottom:6 }}>📤</div><div style={{ color:"#5a4035",fontSize:12 }}>Tap to upload ID</div></>}
                  </div>
                  <button onClick={() => idUploaded&&simulateVerify()} style={{ width:"100%",background:idUploaded?"linear-gradient(135deg,#c9845a,#e8603a)":"#1a1008",border:"none",borderRadius:50,padding:"12px",color:idUploaded?"#fff":"#3a2218",fontWeight:700,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
                    {verifying?<><div style={{ width:16,height:16,border:"2px solid rgba(255,255,255,0.3)",borderTop:"2px solid #fff",borderRadius:"50%",animation:"spin 1s linear infinite" }} />Verifying...</>:"Submit ID →"}
                  </button>
                </div>
              )}
              {verifyStep===3 && (
                <div className="fi" style={{ textAlign:"center" }}>
                  <div style={{ width:70,height:70,borderRadius:"50%",background:"linear-gradient(135deg,#c9845a,#e8603a)",margin:"0 auto 14px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,boxShadow:"0 0 40px rgba(201,132,90,0.5)" }}>✓</div>
                  <div style={{ fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:"#f5ede6",marginBottom:6 }}>Verified!</div>
                  <button onClick={openPayment} style={{ width:"100%",background:"linear-gradient(135deg,#c9845a,#e8603a)",border:"none",borderRadius:50,padding:"14px",color:"#fff",fontWeight:800,fontSize:14,cursor:"pointer" }}>🔓 Unlock Premium Features</button>
                </div>
              )}
            </div>
            <div style={{ background:"#0f0805",border:"1px dashed #1a1008",borderRadius:12,padding:12 }}>
              <div style={{ fontSize:9,color:"#3a2218",letterSpacing:1,marginBottom:8 }}>DEMO — SET LEVEL</div>
              <div style={{ display:"flex",gap:6 }}>
                {LEVELS.map(l=><button key={l.id} onClick={() => setCurrentLevel(l.id)} style={{ flex:1,background:currentLevel===l.id?l.color:"#1a1008",border:`1px solid ${l.color}55`,borderRadius:6,padding:"5px 2px",fontSize:9,color:currentLevel===l.id?"#fff":l.color,fontWeight:700,cursor:"pointer" }}>{l.id}</button>)}
              </div>
            </div>
          </div>
          <NavBar screen={screen} setScreen={setScreen} />
        </div>
      )}

      {screen==="profile" && (
        <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
          <div style={{ background:"linear-gradient(160deg,#2a1200,#1a0a00)",padding:"36px 22px 60px",textAlign:"center",flexShrink:0 }}>
            <div style={{ width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,#c9845a,#e8603a)",margin:"0 auto 12px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,boxShadow:"0 8px 30px rgba(201,132,90,0.4)" }}>😊</div>
            <div style={{ fontFamily:"Georgia,serif",fontSize:24,fontWeight:700,color:"#f5ede6" }}>Your Profile</div>
          </div>
          <div style={{ flex:1,overflowY:"auto",padding:"20px 18px",marginTop:-20,background:"#0d0806",borderRadius:"22px 22px 0 0" }}>
            <div onClick={openPayment} style={{ background:"linear-gradient(135deg,#2a1200,#4a1e00)",border:"1px solid #6a3010",borderRadius:14,padding:"14px 16px",marginBottom:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
              <div><div style={{ color:"#e8a87c",fontWeight:700,fontSize:14 }}>🔥 Upgrade to Ember+</div><div style={{ color:"#5a4035",fontSize:11,marginTop:1 }}>Unlimited likes · See admirers · Global</div></div>
              <div style={{ color:"#c9845a",fontSize:18 }}>›</div>
            </div>
            {[["✏️","Edit Profile"],["🔥","Boost My Profile"],["🌍","Change Location"],["🔒","Privacy"],["🔔","Notifications"],["❓","Help"]].map(([icon,label])=>(
              <div key={label} style={{ display:"flex",alignItems:"center",gap:14,padding:"14px 0",borderBottom:"1px solid #1a100a" }}>
                <span style={{ fontSize:18,width:26,textAlign:"center" }}>{icon}</span>
                <span style={{ fontSize:14,color:"#d5c8c0",flex:1 }}>{label}</span>
                <span style={{ color:"#3a2218" }}>›</span>
              </div>
            ))}
          </div>
          <NavBar screen={screen} setScreen={setScreen} />
        </div>
      )}
    </div>
  );
}