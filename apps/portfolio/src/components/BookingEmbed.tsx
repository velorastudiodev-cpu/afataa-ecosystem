'use client';
import Cal, {getCalApi} from '@calcom/embed-react';
import {useEffect} from 'react';
export default function BookingEmbed({slug}:{slug:string}){
 useEffect(()=>{let active=true;getCalApi({namespace:'discovery'}).then(cal=>{if(active)cal('ui',{theme:'light',cssVarsPerTheme:{light:{'cal-brand':'#1E3A5F'},dark:{'cal-brand':'#6BA3D6'}},hideEventTypeDetails:false,layout:'month_view'});}).catch(()=>{});return()=>{active=false;};},[]);
 return <div className="cal-embed"><Cal namespace="discovery" calLink={slug} config={{layout:'month_view',theme:'light'}} style={{width:'100%',height:620,overflow:'auto'}}/><p className="preview-note">If the calendar does not load, <a href={`https://cal.com/${slug}`} target="_blank" rel="noreferrer">open booking in a new tab</a>.</p></div>;
}
