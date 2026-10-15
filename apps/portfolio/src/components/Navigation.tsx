'use client';
import {useEffect,useState} from 'react';
import {ArrowUpRight,Menu,X} from 'lucide-react';
import AAKLogo from './AAKLogo';
const links=[['Ringkasan','top'],['Rekam Jejak','pedigree'],['Karya Unggulan','work'],['Laboratorium','workspace'],['Kontak','contact']];
export default function Navigation(){const [open,setOpen]=useState(false),[active,setActive]=useState('top');
 useEffect(()=>{const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)setActive(e.target.id==='hero'?'top':e.target.id);});},{rootMargin:'-20% 0px -50% 0px'});links.forEach(([,id])=>{const el=document.getElementById(id==='top'?'hero':id);if(el)observer.observe(el);});return()=>observer.disconnect();},[]);
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false)};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);},[]);
 return <header className="nav-wrap"><nav className="nav" aria-label="Navigasi utama"><a className="brand" href="#top" aria-label="Ahmad Afataa Kusdianto, beranda"><AAKLogo size={28}/>AAK<span>.</span></a><div id="nav-links" className={`nav-links ${open?'nav-open':''}`}>{links.map(([name,id])=><a key={id} href={`#${id}`} aria-current={active===id?'location':undefined} onClick={()=>setOpen(false)}>{name}</a>)}</div><a className="button small" href="#contact">Jadwalkan Konsultasi<ArrowUpRight size={14}/></a><button className="menu-toggle icon-button" aria-controls="nav-links" aria-expanded={open} aria-label={open?'Tutup menu':'Buka menu'} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></nav></header>;
}
