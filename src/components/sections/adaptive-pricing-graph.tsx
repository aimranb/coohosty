'use client';
import {useEffect,useState} from 'react';
import {Pause,Play} from 'lucide-react';
import type {Locale} from '@/config/site';
import {useVisibleMotion} from '@/components/ui/use-visible-motion';
import styles from './adaptive-pricing-graph.module.css';

const content={
 fr:{title:'Vos tarifs s’adaptent à la demande.',description:'Quand la demande du marché évolue, on ajuste le prix de votre appartement.',note:'Exemple illustratif',demand:'Demande du marché',price:'Tarif par nuit · MAD',days:['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'],pause:'Mettre le graphique en pause',play:'Reprendre le graphique'},
 en:{title:'Your rates adapt to demand.',description:'When market demand changes, we adjust your apartment’s nightly rate.',note:'Illustrative example',demand:'Market demand',price:'Nightly rate · MAD',days:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],pause:'Pause the chart',play:'Resume the chart'},
 ar:{title:'نعدّل أسعارك حسب الطلب.',description:'نراقب الطلب في السوق ونكيّف سعر الليلة ليواكب تغيّراته.',note:'مثال توضيحي',demand:'الطلب في السوق',price:'سعر الليلة · درهم',days:['الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت','الأحد'],pause:'إيقاف حركة الرسم',play:'استئناف حركة الرسم'},
};
const demand=[42,48,46,63,83,94,71];const rates=[480,520,510,590,690,760,620];
export function AdaptivePricingGraph({locale}:{locale:Locale}){
 const t=content[locale];const{root,running,reduced,ready,paused,setPaused}=useVisibleMotion();const[active,setActive]=useState(0);
 useEffect(()=>{if(!running)return;const timer=window.setInterval(()=>setActive(day=>(day+1)%7),3000);return()=>window.clearInterval(timer)},[running]);
 const points=rates.map((value,index)=>({x:54+index*60,y:210-value/800*160}));const path=points.map((point,index)=>`${index===0?'M':'L'}${point.x} ${point.y}`).join(' ');
 return <div ref={root} className={styles.root} data-running={running}><figure className={styles.graph}>
  <figcaption><div><h3>{t.title}</h3><p>{t.description}</p></div><span className={styles.note}>{t.note}</span></figcaption>
  <div className={styles.legend}><span><i className={styles.demandMark}/>{t.demand}</span><span><i className={styles.priceMark}/>{t.price}</span></div>
  <svg viewBox="0 0 480 275" role="img" aria-label={`${t.title} ${t.description} ${t.note}`}>
   <defs><linearGradient id="adaptive-price-area" x1="0" y1="0" x2="0" y2="1"><stop stopColor="var(--chart-price,#171717)" stopOpacity=".08"/><stop offset="1" stopColor="var(--chart-price,#171717)" stopOpacity="0"/></linearGradient></defs>
   {[50,90,130,170,210].map(y=><line key={y} x1="32" x2="447" y1={y} y2={y} stroke="var(--brand-border,#e5dbcf)" strokeDasharray="3 6"/>)}
   <rect x={points[active].x-23} y="30" width="46" height="183" rx="8" fill="var(--chart-demand,#ff852b)" fillOpacity=".055"/>
   {demand.map((value,index)=><rect className={styles.bar} key={index} x={points[index].x-13} y={210-value/100*160} width="26" height={value/100*160} rx="5" fill={index===active?'var(--chart-demand,#ff852b)':'var(--chart-demand-soft,#ffd3b0)'}/>) }
   <path d={`${path} L414 210 L54 210 Z`} fill="url(#adaptive-price-area)"/>
   <path d={path} fill="none" stroke="var(--chart-price,#171717)" strokeWidth="2.8" strokeLinejoin="round"/>
   {points.map((point,index)=><g key={index}><circle cx={point.x} cy={point.y} r="4" fill="#fff" stroke="var(--chart-price,#171717)" strokeWidth="2"/><text x={point.x} y={point.y-15} textAnchor="middle" fontSize="14" fontWeight="600" fill="#171717">{rates[index]}</text><text x={point.x} y="245" textAnchor="middle" fontSize={locale==='ar'?12:14} fill="#56514b">{t.days[index]}</text></g>)}
   <circle className={styles.activePoint} cx="0" cy="0" r="6" fill="var(--chart-price,#171717)" stroke="#fff" strokeWidth="2.5" style={{transform:`translate(${points[active].x}px,${points[active].y}px)`}}/>
  </svg>
  {ready&&!reduced&&<button className={styles.pause} type="button" aria-label={paused?t.play:t.pause} aria-pressed={paused} onClick={()=>setPaused(value=>!value)}>{paused?<Play size={16}/>:<Pause size={16}/>}</button>}
 </figure></div>;
}
