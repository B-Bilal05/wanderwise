'use client';
import { useState } from 'react';
import Link from 'next/link';

interface BudgetPlan {
  destination: string; departure: string; flag: string;
  totalBudget: number; days: number; currency: string;
  flight: { economy: number; business: number; firstClass: number; selected: number; selectedClass: string; tip: string };
  accommodation: { hostel: number; budgetHotel: number; midHotel: number; luxuryHotel: number; airbnb: number; selected: number; selectedType: string; totalStay: number };
  food: { streetFood: number; localRestaurant: number; midRange: number; fineDining: number; selected: number; selectedStyle: string; total: number; breakdown: {meal:string;price:number}[] };
  transport: { publicTransport: number; taxiUber: number; carRental: number; walking: number; selected: number; selectedMode: string; total: number; tips: string };
  activities: { daily: number; total: number; mustSee: {name:string;price:number}[] };
  misc: { daily: number; total: number; includes: string };
  summary: { totalEstimated: number; remaining: number; isEnough: boolean; verdict: string; savingTips: string[] };
}

const SEL = (label: string, value: string, onChange: (v:string)=>void, options: [string,string][]) => (
  <div>
    <label style={{fontSize:'11px',color:'#64748b',fontWeight:600,textTransform:'uppercase',letterSpacing:'1px',display:'block',marginBottom:'6px'}}>{label}</label>
    <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
      {options.map(([v,l]) => (
        <button key={v} onClick={()=>onChange(v)}
          style={{padding:'7px 14px',fontSize:'12px',borderRadius:'20px',cursor:'pointer',border: value===v ? 'none' : '1px solid #e2e8f0',background: value===v ? '#0a1628' : '#f8fafc',color: value===v ? '#d4af37' : '#475569',fontWeight: value===v ? 700 : 400,transition:'all .2s'}}>
          {l}
        </button>
      ))}
    </div>
  </div>
);

export default function BudgetPlanner() {
  const [form, setForm] = useState({
    departure: '', destination: '', budget: '', days: '7',
    flightClass: 'Economy',
    accommodation: 'Mid-range Hotel',
    foodStyle: 'Local restaurants',
    transport: 'Public transport',
  });
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<BudgetPlan | null>(null);
  const [error, setError] = useState('');

  const calculate = async () => {
    if (!form.departure || !form.destination || !form.budget) return;
    setLoading(true); setError(''); setPlan(null);
    try {
      const res = await fetch('/api/budget-planner', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Erreur API');
      setPlan(await res.json());
    } catch { setError('Erreur lors du calcul. Réessaie.'); }
    finally { setLoading(false); }
  };

  const fmt = (n: number) => `$${(n||0).toLocaleString()}`;
  const pct = (v: number, t: number) => Math.min(100, Math.round((v / (t||1)) * 100));

  const CATS = plan ? [
    {label:'✈️ Vol', value: plan.flight.selected, color:'#3b82f6'},
    {label:'🏨 Hébergement', value: plan.accommodation.totalStay, color:'#d4af37'},
    {label:'🍽 Nourriture', value: plan.food.total, color:'#4ade80'},
    {label:'🚌 Transport', value: plan.transport.total, color:'#f87171'},
    {label:'🎯 Activités', value: plan.activities.total, color:'#a78bfa'},
    {label:'🛍 Divers', value: plan.misc.total, color:'#fb923c'},
  ] : [];

  const s = { card: { background:'#fff', borderRadius:'16px', padding:'1.2rem', boxShadow:'0 2px 12px rgba(0,0,0,0.05)', marginBottom:'12px' } };

  return (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",minHeight:'100vh',background:'#f1f5f9'}}>

      {/* NAVBAR */}
      <div style={{background:'#0a1628',padding:'10px 2rem',display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 12px rgba(0,0,0,0.3)'}}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:'8px',textDecoration:'none'}}>
          <span style={{fontSize:'18px'}}>🌍</span>
          <span style={{color:'#d4af37',fontWeight:700,fontSize:'15px'}}>WanderWise</span>
        </Link>
        <div style={{display:'flex',gap:'6px'}}>
          {[['/',  '🔍 Explorer'], ['/compare','🔄 Comparer'], ['/favorites','❤️ Favoris']].map(([href,label])=>(
            <Link key={href} href={href} style={{color:'rgba(255,255,255,0.6)',fontSize:'11px',textDecoration:'none',border:'1px solid rgba(255,255,255,0.15)',padding:'5px 10px',borderRadius:'20px'}}>{label}</Link>
          ))}
        </div>
      </div>

      {/* HERO */}
      <div style={{background:'linear-gradient(135deg,#0a1628,#1a3a5c)',padding:'2.5rem 1.5rem',textAlign:'center'}}>
        <div style={{display:'inline-block',background:'rgba(212,175,55,0.12)',border:'1px solid rgba(212,175,55,0.35)',color:'#d4af37',fontSize:'10px',letterSpacing:'3px',textTransform:'uppercase',padding:'5px 16px',borderRadius:'20px',marginBottom:'1rem'}}>
          Planificateur de Budget
        </div>
        <h1 style={{color:'#fff',fontSize:'2rem',fontWeight:800,marginBottom:'.5rem'}}>Mon voyage, mon budget 💰</h1>
        <p style={{color:'rgba(255,255,255,0.5)',fontSize:'13px'}}>Choisis tes préférences et l&apos;IA calcule tous tes frais estimés</p>
      </div>

      <div style={{maxWidth:'720px',margin:'-1rem auto 0',padding:'0 1rem 3rem',position:'relative',zIndex:10}}>

        {/* FORM */}
        <div style={{background:'#fff',borderRadius:'20px',boxShadow:'0 4px 32px rgba(0,0,0,0.08)',padding:'1.8rem',marginBottom:'1.5rem'}}>

          {/* Villes + budget */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'1.5rem'}}>
            {[['🛫 Ville de départ','departure','ex: Casablanca','text'],['🛬 Destination','destination','ex: Paris','text'],['💰 Mon budget (USD)','budget','ex: 1500','number'],['📅 Durée (jours)','days','ex: 7','number']].map(([label,key,ph,type])=>(
              <div key={key}>
                <label style={{fontSize:'11px',color:'#64748b',fontWeight:600,textTransform:'uppercase',letterSpacing:'1px',display:'block',marginBottom:'6px'}}>{label as string}</label>
                <input value={form[key as keyof typeof form]} onChange={e=>setForm({...form,[key]:e.target.value})}
                  placeholder={ph as string} type={type as string}
                  style={{width:'100%',padding:'10px 14px',border:'1px solid #e2e8f0',borderRadius:'10px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}/>
              </div>
            ))}
          </div>

          <div style={{borderTop:'1px solid #f1f5f9',paddingTop:'1.5rem',display:'flex',flexDirection:'column',gap:'16px'}}>

            {SEL('✈️ Classe de vol', form.flightClass, v=>setForm({...form,flightClass:v}), [
              ['Economy','🪑 Économique'],['Business','💺 Business'],['First Class','👑 Première classe']
            ])}

            {SEL('🏨 Type d\'hébergement', form.accommodation, v=>setForm({...form,accommodation:v}), [
              ['Hostel','🛏 Auberge'],['Budget Hotel','🏩 Hôtel budget'],['Mid-range Hotel','🏨 Confort'],['Luxury Hotel','💎 Luxe'],['Airbnb','🏠 Airbnb']
            ])}

            {SEL('🍽 Style alimentaire', form.foodStyle, v=>setForm({...form,foodStyle:v}), [
              ['Street food','🌮 Street food'],['Local restaurants','🍜 Resto local'],['Mid-range','🍽 Mid-range'],['Fine dining','🥂 Gastronomique']
            ])}

            {SEL('🚌 Transport local', form.transport, v=>setForm({...form,transport:v}), [
              ['Walking','🚶 À pied'],['Public transport','🚇 Transports'],['Taxi/Uber','🚕 Taxi/Uber'],['Car rental','🚗 Location voiture']
            ])}
          </div>

          <button onClick={calculate} disabled={loading||!form.departure||!form.destination||!form.budget}
            style={{width:'100%',marginTop:'1.5rem',background:loading?'#a08020':'#d4af37',color:'#0a1628',border:'none',borderRadius:'12px',padding:'14px',fontWeight:700,fontSize:'15px',cursor:'pointer',opacity:(!form.departure||!form.destination||!form.budget)?0.5:1}}>
            {loading ? '⏳ Calcul en cours...' : '🧮 Calculer mon budget'}
          </button>
        </div>

        {loading && (
          <div style={{textAlign:'center',padding:'3rem',background:'#fff',borderRadius:'16px',boxShadow:'0 4px 24px rgba(0,0,0,0.08)'}}>
            <div style={{width:'40px',height:'40px',border:'3px solid #e2e8f0',borderTopColor:'#d4af37',borderRadius:'50%',animation:'spin 0.8s linear infinite',margin:'0 auto 1rem'}}/>
            <p style={{color:'#64748b'}}>L&apos;IA calcule les frais pour <strong>{form.destination}</strong>...</p>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}

        {error && <div style={{background:'#fef2f2',border:'1px solid #fecaca',color:'#dc2626',padding:'1rem',borderRadius:'12px'}}>{error}</div>}

        {plan && (<>

          {/* VERDICT */}
          <div style={{background:plan.summary.isEnough?'linear-gradient(135deg,#0a1628,#1a3a5c)':'linear-gradient(135deg,#7f1d1d,#991b1b)',borderRadius:'20px',padding:'1.5rem',marginBottom:'1.2rem',boxShadow:'0 4px 24px rgba(0,0,0,0.15)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'1rem'}}>
              <div>
                <div style={{fontSize:'2.5rem',marginBottom:'4px'}}>{plan.flag}</div>
                <div style={{fontSize:'10px',color:'rgba(255,255,255,0.5)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'4px'}}>{plan.departure} → {plan.destination} · {plan.days} jours</div>
                <div style={{fontSize:'18px',fontWeight:800,color:plan.summary.isEnough?'#4ade80':'#f87171'}}>{plan.summary.isEnough?'✅ Budget suffisant !':'⚠️ Budget insuffisant'}</div>
                <p style={{fontSize:'13px',color:'rgba(255,255,255,0.7)',margin:'8px 0 0',lineHeight:1.7}}>{plan.summary.verdict}</p>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',marginBottom:'4px'}}>Budget total</div>
                <div style={{fontSize:'2rem',fontWeight:800,color:'#d4af37'}}>{fmt(plan.totalBudget)}</div>
                <div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',marginTop:'8px'}}>Estimé total</div>
                <div style={{fontSize:'1.3rem',fontWeight:700,color:plan.summary.isEnough?'#4ade80':'#f87171'}}>{fmt(plan.summary.totalEstimated)}</div>
                <div style={{fontSize:'12px',marginTop:'4px',color:plan.summary.remaining>=0?'#4ade80':'#f87171',fontWeight:600}}>
                  {plan.summary.remaining>=0?`+${fmt(plan.summary.remaining)} restant`:`${fmt(Math.abs(plan.summary.remaining))} manquant`}
                </div>
              </div>
            </div>
          </div>

          {/* GRAPHIQUE */}
          <div style={s.card}>
            <div style={{fontSize:'13px',fontWeight:700,marginBottom:'1rem',color:'#0f172a'}}>📊 Répartition des dépenses</div>
            {CATS.map((cat,i)=>(
              <div key={i} style={{marginBottom:'12px'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
                  <span style={{fontSize:'12px',fontWeight:600,color:'#0f172a'}}>{cat.label}</span>
                  <span style={{fontSize:'12px',fontWeight:700,color:cat.color}}>{fmt(cat.value)} <span style={{color:'#94a3b8',fontWeight:400}}>({pct(cat.value,plan.summary.totalEstimated)}%)</span></span>
                </div>
                <div style={{height:'8px',background:'#f1f5f9',borderRadius:'4px',overflow:'hidden'}}>
                  <div style={{width:`${pct(cat.value,plan.summary.totalEstimated)}%`,height:'100%',background:cat.color,borderRadius:'4px',transition:'width .6s ease'}}/>
                </div>
              </div>
            ))}
          </div>

          {/* VOL */}
          <div style={s.card}>
            <div style={{fontSize:'11px',color:'#64748b',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'10px',fontWeight:600}}>✈️ Options de vol — {plan.departure} → {plan.destination}</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'8px',marginBottom:'10px'}}>
              {[['🪑 Économique', plan.flight.economy, 'Economy'],['💺 Business', plan.flight.business, 'Business'],['👑 Première', plan.flight.firstClass, 'First Class']].map(([label,price,cls])=>(
                <div key={cls as string} style={{background: form.flightClass===cls?'#0a1628':'#f8fafc',border:`1px solid ${form.flightClass===cls?'#d4af37':'#e2e8f0'}`,borderRadius:'12px',padding:'12px',textAlign:'center'}}>
                  <div style={{fontSize:'13px',marginBottom:'4px'}}>{label as string}</div>
                  <div style={{fontSize:'16px',fontWeight:800,color: form.flightClass===cls?'#d4af37':'#3b82f6'}}>{fmt(price as number)}</div>
                  {form.flightClass===cls && <div style={{fontSize:'10px',color:'#d4af37',marginTop:'4px'}}>✓ Sélectionné</div>}
                </div>
              ))}
            </div>
            <div style={{fontSize:'12px',color:'#64748b',background:'#f8fafc',padding:'8px 12px',borderRadius:'8px'}}>{plan.flight.tip}</div>
          </div>

          {/* HÉBERGEMENT */}
          <div style={s.card}>
            <div style={{fontSize:'11px',color:'#64748b',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'10px',fontWeight:600}}>🏨 Options d'hébergement — par nuit</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(110px,1fr))',gap:'8px',marginBottom:'8px'}}>
              {[['🛏 Auberge',plan.accommodation.hostel,'Hostel'],['🏩 Budget',plan.accommodation.budgetHotel,'Budget Hotel'],['🏨 Confort',plan.accommodation.midHotel,'Mid-range Hotel'],['💎 Luxe',plan.accommodation.luxuryHotel,'Luxury Hotel'],['🏠 Airbnb',plan.accommodation.airbnb,'Airbnb']].map(([label,price,type])=>(
                <div key={type as string} style={{background:form.accommodation===type?'#0a1628':'#f8fafc',border:`1px solid ${form.accommodation===type?'#d4af37':'#e2e8f0'}`,borderRadius:'10px',padding:'10px',textAlign:'center'}}>
                  <div style={{fontSize:'11px',marginBottom:'3px',color:form.accommodation===type?'rgba(255,255,255,0.7)':'#64748b'}}>{label as string}</div>
                  <div style={{fontSize:'14px',fontWeight:800,color:form.accommodation===type?'#d4af37':'#0f172a'}}>{fmt(price as number)}</div>
                  {form.accommodation===type && <div style={{fontSize:'9px',color:'#d4af37',marginTop:'3px'}}>✓</div>}
                </div>
              ))}
            </div>
            <div style={{fontSize:'12px',color:'#64748b'}}>Total séjour ({plan.days} nuits) : <strong style={{color:'#d4af37'}}>{fmt(plan.accommodation.totalStay)}</strong></div>
          </div>

          {/* NOURRITURE */}
          <div style={s.card}>
            <div style={{fontSize:'11px',color:'#64748b',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'10px',fontWeight:600}}>🍽 Style alimentaire — par jour</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:'8px',marginBottom:'12px'}}>
              {[['🌮 Street',plan.food.streetFood,'Street food'],['🍜 Local',plan.food.localRestaurant,'Local restaurants'],['🍽 Mid',plan.food.midRange,'Mid-range'],['🥂 Gastro',plan.food.fineDining,'Fine dining']].map(([label,price,style])=>(
                <div key={style as string} style={{background:form.foodStyle===style?'#0a1628':'#f8fafc',border:`1px solid ${form.foodStyle===style?'#d4af37':'#e2e8f0'}`,borderRadius:'10px',padding:'10px',textAlign:'center'}}>
                  <div style={{fontSize:'11px',marginBottom:'3px',color:form.foodStyle===style?'rgba(255,255,255,0.7)':'#64748b'}}>{label as string}</div>
                  <div style={{fontSize:'14px',fontWeight:800,color:form.foodStyle===style?'#d4af37':'#0f172a'}}>{fmt(price as number)}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:'12px',color:'#64748b',marginBottom:'8px'}}>Détail journalier ({plan.food.selectedStyle}) :</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px'}}>
              {plan.food.breakdown.map(item=>(
                <div key={item.meal} style={{display:'flex',justifyContent:'space-between',background:'#f8fafc',borderRadius:'8px',padding:'8px 12px'}}>
                  <span style={{fontSize:'12px',color:'#475569'}}>{item.meal}</span>
                  <span style={{fontSize:'12px',fontWeight:700,color:'#4ade80'}}>${item.price}</span>
                </div>
              ))}
            </div>
            <div style={{marginTop:'8px',fontSize:'12px',color:'#64748b'}}>Total nourriture : <strong style={{color:'#4ade80'}}>{fmt(plan.food.total)}</strong></div>
          </div>

          {/* TRANSPORT */}
          <div style={s.card}>
            <div style={{fontSize:'11px',color:'#64748b',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'10px',fontWeight:600}}>🚌 Transport local — par jour</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:'8px',marginBottom:'10px'}}>
              {[['🚶 À pied',plan.transport.walking,'Walking'],['🚇 Transports',plan.transport.publicTransport,'Public transport'],['🚕 Taxi',plan.transport.taxiUber,'Taxi/Uber'],['🚗 Location',plan.transport.carRental,'Car rental']].map(([label,price,mode])=>(
                <div key={mode as string} style={{background:form.transport===mode?'#0a1628':'#f8fafc',border:`1px solid ${form.transport===mode?'#d4af37':'#e2e8f0'}`,borderRadius:'10px',padding:'10px',textAlign:'center'}}>
                  <div style={{fontSize:'11px',marginBottom:'3px',color:form.transport===mode?'rgba(255,255,255,0.7)':'#64748b'}}>{label as string}</div>
                  <div style={{fontSize:'14px',fontWeight:800,color:form.transport===mode?'#d4af37':'#0f172a'}}>{fmt(price as number)}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:'12px',color:'#64748b',background:'#f8fafc',padding:'8px 12px',borderRadius:'8px',marginBottom:'6px'}}>{plan.transport.tips}</div>
            <div style={{fontSize:'12px',color:'#64748b'}}>Total transport : <strong style={{color:'#f87171'}}>{fmt(plan.transport.total)}</strong></div>
          </div>

          {/* ACTIVITÉS */}
          <div style={s.card}>
            <div style={{fontSize:'11px',color:'#64748b',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'10px',fontWeight:600}}>🎯 Activités incontournables</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:'8px',marginBottom:'8px'}}>
              {plan.activities.mustSee.map(act=>(
                <div key={act.name} style={{background:'#f8fafc',border:'1px solid #f1f5f9',borderRadius:'10px',padding:'10px 12px'}}>
                  <div style={{fontSize:'12px',fontWeight:600,color:'#0f172a',marginBottom:'3px'}}>{act.name}</div>
                  <div style={{fontSize:'14px',color:'#a78bfa',fontWeight:700}}>{act.price===0?'Gratuit':`$${act.price}`}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:'12px',color:'#64748b'}}>Total activités + divers : <strong style={{color:'#a78bfa'}}>{fmt(plan.activities.total + plan.misc.total)}</strong></div>
          </div>

          {/* CONSEILS */}
          <div style={{background:'linear-gradient(135deg,rgba(10,22,40,0.04),rgba(212,175,55,0.07))',border:'1px solid rgba(212,175,55,0.25)',borderRadius:'16px',padding:'1.2rem'}}>
            <div style={{fontSize:'10px',color:'#d4af37',textTransform:'uppercase',letterSpacing:'1.5px',fontWeight:700,marginBottom:'10px'}}>💡 Conseils pour économiser</div>
            {plan.summary.savingTips.map((tip,i)=>(
              <div key={i} style={{display:'flex',gap:'8px',marginBottom:'8px',fontSize:'13px',color:'#475569',lineHeight:1.6}}>
                <span style={{color:'#d4af37',flexShrink:0}}>→</span> {tip}
              </div>
            ))}
          </div>

        </>)}
      </div>
    </div>
  );
}
