import{n as v,h as R,i as M,k as O,l as _,q as D,d as T,t as N,s as q,v as K,x as U,y as W,z as X,o as A,u as Y,e as F,r as I,j as u}from"./index-D3FqsL_Q.js";var H=t=>{const e=t.reduce((s,n)=>{const o=v(n).chroma;return o!==void 0&&(s[o]=s[o]||v(n).name),s},{});return s=>e[s]};function J(t,e={}){const s=t.map(o=>v(o).pc).filter(o=>o);return v.length===0?[]:st(s,1,e).filter(o=>o.weight).sort((o,c)=>c.weight-o.weight).map(o=>o.name)}var P={anyThirds:384,perfectFifth:16,nonPerfectFifths:40,anySeventh:3},w=t=>e=>!!(e&t),Q=w(P.anyThirds),V=w(P.perfectFifth),Z=w(P.anySeventh),tt=w(P.nonPerfectFifths);function et(t){const e=parseInt(t.chroma,2);return Q(e)&&V(e)&&Z(e)}function nt(t){const e=parseInt(t,2);return tt(e)?t:(e|16).toString(2)}function st(t,e,s){const n=t[0],o=v(n).chroma,c=H(t),h=R(t,!1),m=[];return h.forEach((p,d)=>{const $=s.assumePerfectFifth&&nt(p);M().filter(i=>s.assumePerfectFifth&&et(i)?i.chroma===$:i.chroma===p).forEach(i=>{const S=i.aliases[0],j=c(d);d!==o?m.push({weight:.5*e,name:`${j}${S}/${n}`}):m.push({weight:1*e,name:`${j}${S}`})})}),m}var ot=rt((t,e)=>[t[0]-e[0],t[1]-e[1]]);function rt(t){return(e,s)=>{const n=O(e).coord,o=O(s).coord;if(n&&o){const c=t(n,o);return _(c).name}}}var G={empty:!0,name:"",symbol:"",root:"",bass:"",rootDegree:0,type:"",tonic:null,setNum:NaN,quality:"Unknown",chroma:"",normalized:"",aliases:[],notes:[],intervals:[]};function B(t){const[e,s,n,o]=D(t);return e===""?k("",t):e==="A"&&o==="ug"?k("","aug"):k(e+s,n+o)}function k(t,e){const s=e.split("/");if(s.length===1)return[t,s[0],""];const[n,o,c,h]=D(s[1]);return n!==""&&c===""&&h===""?[t,s[0],n+o]:[t,e,""]}function g(t){if(Array.isArray(t))return C(t[1]||"",t[0],t[2]);if(t==="")return G;{const[e,s,n]=B(t),o=C(s,e,n);return o.empty?C(t):o}}function C(t,e,s){const n=X(t),o=v(e||""),c=v(s||"");if(n.empty||e&&o.empty||s&&c.empty)return G;const h=T(o.pc,c.pc),m=n.intervals.indexOf(h),p=m>=0,d=p?c:v(""),$=m===-1?NaN:m+1,y=c.pc&&c.pc!==o.pc,i=Array.from(n.intervals);if(p)for(let a=1;a<$;a++){const l=i[0][0],f=i[0][1],x=parseInt(l,10)+7;i.push(`${x}${f}`),i.shift()}else if(y){const a=ot(T(o.pc,c.pc),"8P");a&&i.unshift(a)}const S=o.empty?[]:i.map(a=>N(o.pc,a));t=n.aliases.indexOf(t)!==-1?t:n.aliases[0];const j=`${o.empty?"":o.pc}${t}${p&&$>1?"/"+d.pc:y?"/"+c.pc:""}`,r=`${e?o.pc+" ":""}${n.name}${p&&$>1?" over "+d.pc:y?" over "+c.pc:""}`;return{...n,name:r,symbol:j,tonic:o.pc,type:n.name,root:d.pc,bass:y?c.pc:"",intervals:i,rootDegree:$,notes:S}}var ct=g;function at(t,e){const[s,n,o]=B(t);if(!s)return t;const c=N(o,e),h=c?"/"+c:"";return N(s,e)+n+h}function it(t){const e=g(t),s=q(e.chroma);return K().filter(n=>s(n.chroma)).map(n=>n.name)}function lt(t){const e=g(t),s=q(e.chroma);return M().filter(n=>s(n.chroma)).map(n=>e.tonic+n.aliases[0])}function ft(t){const e=g(t),s=U(e.chroma);return M().filter(n=>s(n.chroma)).map(n=>e.tonic+n.aliases[0])}function ut(t,e){const s=g(t),n=e||s.tonic;return!n||s.empty?[]:s.intervals.map(o=>N(n,o))}function ht(t,e){const s=g(t),n=e||s.tonic,o=W(s.intervals,n);return c=>c?o(c>0?c-1:c):""}function mt(t,e){const s=g(t),n=e||s.tonic;return W(s.intervals,n)}var pt={getChord:C,get:g,detect:J,chordScales:it,extended:lt,reduced:ft,tokenize:B,transpose:at,degrees:ht,steps:mt,notes:ut,chord:ct};function $t(){const s=A.value.allNotes,{activeNotes:n,pianoOnce:o}=Y(),c=n.map(r=>F.fromMidiSharps(r)),h=400/2,m=400/2,p=r=>{const a=r/26.67,l=r/33.33,f=r/40,x=r/11,b=r/2.8,z=r/6.67,E=r/8,L=r/4;return`M 0,0 a ${a},${a},0,0,0,${l},${-f} l ${x} ${-b} a ${z},${z},0,0,0,1,${-f} a ${E},${E},0,0,0,${-L},0 a ${z},${z},0,0,0,1,${f} l ${x},${b} a ${a},${a},0,0,0,${l},${f}z`},[d,$]=I.useState([]),[y,i]=I.useState("#000");function S(r){const a=r*2*Math.PI/12-Math.PI/2,l={x:(400/2+80/6-80)*Math.cos(a),y:(400/2+80/6-80)*Math.sin(a)};o(`${Object.keys(s)[r]}${r<3?3:4}`),i("#555"),$(f=>{const x=f.find(b=>b.x===l.x&&b.y===l.y);return x?f.filter(b=>b!==x):[...f,l]})}const j=[["C4","F4","A4","C5"],["G4","D4","B4","B5"],["C4","E4","G4","C5"]];return I.useEffect(()=>{j.forEach((r,a)=>setTimeout(()=>r.forEach(l=>o(l,1.4)),a*1500))},[]),u.jsx("div",{className:"flex flex-col size-full",children:u.jsxs("svg",{viewBox:`-80 -80 ${400+2*80} ${400+2*80}`,xmlns:"http://www.w3.org/2000/svg",textAnchor:"middle",dominantBaseline:"middle",children:[u.jsx("text",{x:400/2,y:400/2,style:{fontSize:"1.2rem"},fill:"white",children:pt.detect(c)[0]}),u.jsxs("g",{transform:`translate(${h}, ${m}) `,children:[Object.keys(s).map((r,a)=>{const l=n.some(f=>F.pitchClass(F.fromMidiSharps(f))===r);return u.jsxs("g",{onClick:()=>S(a),style:{transition:"opacity 500ms ease-out",cursor:"pointer",opacity:l?"1":"0.35"},children:[u.jsx("g",{transform:` rotate(${a*30}) translate(0, -${400/8}) `,children:u.jsx("path",{d:p(400),fill:r.length>1?"#222":"#eee"})}),u.jsxs("g",{transform:`rotate(${a*30}) translate(0, -${400/2+80/6}) `,children:[u.jsx("circle",{cx:"0",cy:"0",r:400/10,fill:s[r]}),u.jsx("text",{x:"0",y:"0",fill:"white",fontFamily:"monospace",fontSize:400/10,fontWeight:"bold",textAnchor:"middle",dominantBaseline:"middle",transform:`rotate(${a*-30})`,children:A.value.notation==="chromatic"?a:A.value.notation==="do-re-mi"?A.value.doremiArray[a]:r}),l&&u.jsx("circle",{cx:"0",cy:80,r:400/40,fill:s[r]})]})]},`chroma-petals-${r}`)}),d.length>1&&u.jsx("polygon",{points:d.map(r=>`${r.x},${r.y}`).join(" "),fill:y,stroke:y,strokeWidth:"4",opacity:"0.75"})]})]})})}export{$t as default};
