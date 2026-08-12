import React, { useEffect, useMemo, useState } from "react";
import {
  Activity, AlertTriangle, BarChart3, Bell, Check, ChevronRight, CircleHelp,
  ClipboardCheck, Clock3, FileText, Hospital, LayoutDashboard, Menu, Package,
  RefreshCcw, Search, ShieldCheck, Stethoscope, UserRound, Users, X, Zap
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";

const KEY = "medflow-ai-demo-v1";
const today = new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });

const patients0 = [
  {id:"P-1001",name:"Aarav Sharma",age:47,procedure:"Laparoscopic Cholecystectomy",doctor:"Dr. Mehta",ward:"Ward 3",time:"09:30",check:{registration:1,blood:1,consent:0,insurance:1,doctor:1,transfer:1,ot:1}},
  {id:"P-1002",name:"Priya Deshmukh",age:34,procedure:"Appendectomy",doctor:"Dr. Kulkarni",ward:"Ward 2",time:"10:15",check:{registration:1,blood:1,consent:1,insurance:1,doctor:1,transfer:1,ot:1}},
  {id:"P-1003",name:"Rohan Patil",age:62,procedure:"Knee Replacement",doctor:"Dr. Shah",ward:"Ward 5",time:"11:00",check:{registration:1,blood:0,consent:1,insurance:1,doctor:1,transfer:1,ot:1}},
  {id:"P-1004",name:"Sneha Joshi",age:29,procedure:"Hernia Repair",doctor:"Dr. Mehta",ward:"Ward 1",time:"11:30",check:{registration:1,blood:1,consent:1,insurance:1,doctor:1,transfer:1,ot:1}},
  {id:"P-1005",name:"Vikram Rao",age:55,procedure:"CABG",doctor:"Dr. Shah",ward:"ICU",time:"12:00",check:{registration:1,blood:1,consent:1,insurance:1,doctor:0,transfer:1,ot:1}},
  {id:"P-1006",name:"Neha Gupta",age:41,procedure:"Thyroidectomy",doctor:"Dr. Joshi",ward:"Ward 4",time:"13:00",check:{registration:1,blood:1,consent:1,insurance:1,doctor:1,transfer:0,ot:1}},
  {id:"P-1007",name:"Aditya Verma",age:38,procedure:"ACL Reconstruction",doctor:"Dr. Shah",ward:"Ward 2",time:"14:00",check:{registration:1,blood:1,consent:1,insurance:1,doctor:1,transfer:1,ot:1}},
  {id:"P-1008",name:"Kavya Nair",age:51,procedure:"Cataract Surgery",doctor:"Dr. Rao",ward:"Ward 1",time:"14:30",check:{registration:1,blood:1,consent:1,insurance:1,doctor:1,transfer:1,ot:1}},
  {id:"P-1009",name:"Manish Yadav",age:45,procedure:"TURP",doctor:"Dr. Rao",ward:"Ward 3",time:"15:00",check:{registration:1,blood:1,consent:1,insurance:1,doctor:1,transfer:1,ot:1}},
  {id:"P-1010",name:"Isha Singh",age:27,procedure:"C-Section",doctor:"Dr. Kulkarni",ward:"Maternity",time:"16:00",check:{registration:1,blood:1,consent:0,insurance:1,doctor:1,transfer:1,ot:1}}
];

const surgeries0 = [
  ...patients0.map((p,i)=>({id:`S-${1024+i}`,patient:p.id,procedure:p.procedure,doctor:p.doctor,ot:["OT-02","OT-01","OT-03"][i%3],time:p.time,duration:[90,60,120,75,180][i%5],status:["Scheduled","Patient Ready","In Progress","Scheduled","Delayed"][i%5]})),
  {id:"S-1034",patient:"P-1001",procedure:"Follow-up Procedure",doctor:"Dr. Mehta",ot:"OT-01",time:"16:30",duration:60,status:"Scheduled"},
  {id:"S-1035",patient:"P-1002",procedure:"Minor Procedure",doctor:"Dr. Kulkarni",ot:"OT-02",time:"17:00",duration:45,status:"Scheduled"},
  {id:"S-1036",patient:"P-1003",procedure:"Revision Procedure",doctor:"Dr. Shah",ot:"OT-03",time:"17:30",duration:90,status:"Scheduled"},
  {id:"S-1037",patient:"P-1004",procedure:"Endoscopy",doctor:"Dr. Mehta",ot:"OT-01",time:"18:00",duration:45,status:"Scheduled"},
  {id:"S-1038",patient:"P-1005",procedure:"Vascular Procedure",doctor:"Dr. Shah",ot:"OT-02",time:"18:30",duration:90,status:"Scheduled"},
  {id:"S-1039",patient:"P-1006",procedure:"Biopsy",doctor:"Dr. Joshi",ot:"OT-03",time:"19:00",duration:45,status:"Scheduled"},
  {id:"S-1040",patient:"P-1007",procedure:"Arthroscopy",doctor:"Dr. Shah",ot:"OT-01",time:"19:30",duration:75,status:"Scheduled"},
  {id:"S-1041",patient:"P-1008",procedure:"Lens Procedure",doctor:"Dr. Rao",ot:"OT-02",time:"20:00",duration:45,status:"Scheduled"}
];

const ots0 = [
  {id:"OT-01",status:"IN SURGERY",surgery:"S-1025",start:"10:15",expected:"11:15",next:"S-1027"},
  {id:"OT-02",status:"AT RISK",surgery:"S-1024",start:"09:30",expected:"11:00",next:"S-1026"},
  {id:"OT-03",status:"AVAILABLE",surgery:"S-1026",start:"—",expected:"—",next:"S-1028"}
];

const packs0 = [
  ["CSSD-011","General Surgery","10 Aug 2026","18 Aug 2026","AVAILABLE","—","CSSD Shelf A"],
  ["CSSD-012","Ortho Set","10 Aug 2026","17 Aug 2026","RESERVED","OT-03","OT-03"],
  ["CSSD-013","Cardiac Set","09 Aug 2026","16 Aug 2026","AVAILABLE","—","CSSD Shelf B"],
  ["CSSD-014","Laparoscopy","09 Aug 2026","15 Aug 2026","AVAILABLE","—","CSSD Shelf A"],
  ["CSSD-015","General Surgery","08 Aug 2026","14 Aug 2026","IN USE","OT-01","OT-01"],
  ["CSSD-016","Ortho Set","08 Aug 2026","13 Aug 2026","AVAILABLE","—","CSSD Shelf B"],
  ["CSSD-017","ENT Set","07 Aug 2026","12 Aug 2026","AVAILABLE","—","CSSD Shelf C"],
  ["CSSD-018","Laparoscopy","01 Aug 2026","10 Aug 2026","EXPIRED","—","CSSD Quarantine"],
  ["CSSD-019","Cardiac Set","10 Aug 2026","19 Aug 2026","STERILIZING","—","CSSD Bay 2"],
  ["CSSD-020","General Surgery","09 Aug 2026","17 Aug 2026","AVAILABLE","—","CSSD Shelf A"]
].map(x=>({id:x[0],type:x[1],sterilized:x[2],expiry:x[3],status:x[4],ot:x[5],location:x[6]}));

const alerts0 = [
  {id:1,severity:"CRITICAL",message:"OT-02: Consent pending for S-1024",department:"Ward 3",time:"09:22",action:"Complete patient consent"},
  {id:2,severity:"CRITICAL",message:"OT-02: Instrument pack unavailable",department:"CSSD",time:"09:25",action:"Assign alternative CSSD pack"},
  {id:3,severity:"WARNING",message:"S-1025: Blood report pending",department:"Lab",time:"09:40",action:"Upload / verify report"},
  {id:4,severity:"WARNING",message:"OT-01: Cleaning turnaround is above target",department:"Housekeeping",time:"10:05",action:"Prioritize OT cleaning"},
  {id:5,severity:"INFO",message:"Dr. Shah is expected in OT-03",department:"Surgery",time:"10:15",action:"Confirm arrival"} 
];

const base = {patients:patients0,surgeries:surgeries0,ots:ots0,packs:packs0,alerts:alerts0,resolved:[],simulated:false};

const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || base; } catch { return base; }
};
const save = d => localStorage.setItem(KEY, JSON.stringify(d));

const delayRules = {consent:10,blood:10,transfer:15,pack:20,doctor:20,cleaning:10};
const checkLabels = {registration:"Registration",blood:"Blood report",consent:"Consent",insurance:"Insurance",doctor:"Doctor approval",transfer:"Ward transfer",ot:"OT readiness"};

function readiness(p){
  const vals = Object.values(p.check);
  return Math.round(vals.filter(Boolean).length / vals.length * 100);
}
function patientFor(s, patients){ return patients.find(p=>p.id===s.patient); }
function packFor(s, packs){ return packs.find(p=>p.ot===s.ot && ["RESERVED","IN USE"].includes(p.status)); }
function intelligence(s, patients, packs, ots){
  const p = patientFor(s,patients);
  if(!p) return {delay:0,causes:[],ready:0,status:"GREEN"};
  let delay=0, causes=[];
  if(!p.check.consent){delay+=10;causes.push(["Consent pending",10,"consent"])}
  if(!p.check.blood){delay+=10;causes.push(["Blood report pending",10,"blood"])}
  if(!p.check.transfer){delay+=15;causes.push(["Patient not ready",15,"transfer"])}
  if(!p.check.doctor){delay+=20;causes.push(["Doctor unavailable",20,"doctor"])}
  const pack = packFor(s,packs);
  if(!pack && ["Scheduled","Patient Ready","Delayed"].includes(s.status)){delay+=20;causes.push(["Instrument pack unavailable",20,"pack"])}
  const ot = ots.find(o=>o.id===s.ot);
  if(ot?.status==="CLEANING"){delay+=10;causes.push(["OT cleaning delay",10,"cleaning"])}
  const ready = readiness(p);
  const status = delay>=20 || ready<60 ? "RED" : delay>0 || ready<90 ? "YELLOW" : "GREEN";
  return {delay,causes,ready,status};
}

function statusClass(s){
  const m={GREEN:"bg-emerald-50 text-emerald-700",YELLOW:"bg-amber-50 text-amber-700",RED:"bg-red-50 text-red-700",AVAILABLE:"bg-emerald-50 text-emerald-700","IN SURGERY":"bg-blue-50 text-blue-700","AT RISK":"bg-red-50 text-red-700",PREPARING:"bg-amber-50 text-amber-700",CLEANING:"bg-amber-50 text-amber-700",CRITICAL:"bg-red-50 text-red-700",WARNING:"bg-amber-50 text-amber-700",INFO:"bg-blue-50 text-blue-700"}; return m[s]||"bg-slate-100 text-slate-700";
}

function Stat({icon:Icon,label,value,sub,accent="text-teal-600"}){
  return <div className="card p-4"><div className="flex items-center justify-between"><div className={`rounded-xl bg-slate-50 p-2.5 ${accent}`}><Icon size={19}/></div><span className="text-xs text-slate-400">{sub}</span></div><div className="mt-3 text-2xl font-bold">{value}</div><div className="mt-1 text-sm text-slate-500">{label}</div></div>
}

function Badge({children}){return <span className={`badge ${statusClass(children)}`}>{children}</span>}

function App(){
  const [data,setData] = useState(load);
  const [page,setPage] = useState("Dashboard");
  const [mobile,setMobile] = useState(false);
  const [selected,setSelected] = useState(null);
  const [search,setSearch] = useState("");
  const update = fn => setData(d=>{const n=fn(structuredClone(d));save(n);return n});
  const reset = ()=>{localStorage.removeItem(KEY);setData(structuredClone(base));setSelected(null)};
  const computed = useMemo(()=>data.surgeries.map(s=>({...s,patientObj:patientFor(s,data.patients),intel:intelligence(s,data.patients,data.packs,data.ots)})),[data]);
  const activeRisks = computed.filter(s=>s.intel.delay>0 || s.intel.ready<90).slice(0,5);
  const delayed = computed.filter(s=>s.status==="Delayed" || s.intel.delay>0).length;
  const completed = computed.filter(s=>s.status==="Completed").length;
  const atRisk = computed.filter(s=>s.intel.status!=="GREEN").length;
  const util = Math.min(100, Math.round(72 + (completed*2) - (delayed*0.5)));

  const resolveBottleneck = s => update(d=>{
    const p=d.patients.find(x=>x.id===s.patient);
    if(p){ Object.keys(p.check).forEach(k=>p.check[k]=1); }
    const free=d.packs.find(x=>x.status==="AVAILABLE");
    if(free){free.status="RESERVED";free.ot=s.ot;}
    const ot=d.ots.find(x=>x.id===s.ot); if(ot) ot.status="IN SURGERY";
    d.alerts=d.alerts.filter(a=>!a.message.includes(s.id) && !a.message.includes(s.ot));
    return d;
  });

  const setCheck=(pid,key,val)=>update(d=>{const p=d.patients.find(x=>x.id===pid);if(p)p.check[key]=val?1:0;return d});
  const setSurgeryStatus=(sid,status)=>update(d=>{const s=d.surgeries.find(x=>x.id===sid);if(s)s.status=status;return d});
  const assignPack=(packId,ot)=>update(d=>{const p=d.packs.find(x=>x.id===packId);if(!p||p.status!=="AVAILABLE")return d;p.status="RESERVED";p.ot=ot;return d});
  const resolveAlert=id=>update(d=>{d.alerts=d.alerts.filter(a=>a.id!==id);d.resolved=[...(d.resolved||[]),id];return d});

  return <div className="min-h-screen bg-slate-50">
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200 bg-white transition-transform lg:translate-x-0 ${mobile?"translate-x-0":"-translate-x-full"}`}>
      <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-5"><div className="rounded-xl bg-teal-600 p-2 text-white"><Hospital size={20}/></div><div><div className="font-bold">MedFlow AI</div><div className="text-[10px] font-medium text-slate-400">WORKFLOW INTELLIGENCE</div></div></div>
      <nav className="space-y-1 p-3">
        {[["Dashboard",LayoutDashboard],["Patients",Users],["Surgery Management",Stethoscope],["OT Management",Activity],["CSSD Tracking",Package],["Alerts",Bell],["Analytics",BarChart3]].map(([n,I])=><button key={n} onClick={()=>{setPage(n);setMobile(false)}} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${page===n?"bg-teal-50 text-teal-700":"text-slate-600 hover:bg-slate-50"}`}><I size={18}/>{n}{n==="Alerts"&&data.alerts.length>0?<span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-[10px] text-white">{data.alerts.length}</span>:null}</button>)}
      </nav>
      <div className="absolute bottom-0 w-full border-t border-slate-100 p-3"><div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500"><div className="font-semibold text-slate-700">Prototype / Decision Support</div><div className="mt-1">Rule-based demo. Not a clinical system.</div></div></div>
    </aside>

    <main className="lg:pl-64">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:px-7">
        <div className="flex items-center gap-3"><button className="btn-soft lg:hidden" onClick={()=>setMobile(true)}><Menu size={18}/></button><div><div className="text-sm font-semibold">{page}</div><div className="text-xs text-slate-400">{today}</div></div></div>
        <div className="flex items-center gap-3"><div className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 md:flex"><Bell size={17} className="text-slate-500"/><span className="text-xs">{data.alerts.length} active alerts</span></div><div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2"><div className="rounded-full bg-teal-100 p-1.5 text-teal-700"><UserRound size={15}/></div><span className="hidden text-xs font-semibold sm:block">Hospital Administrator</span></div></div>
      </header>

      <div className="p-4 lg:p-7">
        {page==="Dashboard" && <Dashboard computed={computed} activeRisks={activeRisks} data={data} util={util} resolveBottleneck={resolveBottleneck} setPage={setPage} setSelected={setSelected}/>}
        {page==="Patients" && <Patients data={data} search={search} setSearch={setSearch} setSelected={setSelected}/>}
        {page==="Surgery Management" && <Surgeries computed={computed} setStatus={setSurgeryStatus}/>}
        {page==="OT Management" && <OTs data={data} computed={computed} update={update} resolveBottleneck={resolveBottleneck}/>}
        {page==="CSSD Tracking" && <CSSD data={data} assignPack={assignPack}/>}
        {page==="Alerts" && <Alerts data={data} resolveAlert={resolveAlert}/>}
        {page==="Analytics" && <Analytics computed={computed} data={data} util={util} simulated={data.simulated} update={update}/>}
      </div>
    </main>

    {selected && <PatientDrawer p={data.patients.find(x=>x.id===selected)} close={()=>setSelected(null)} setCheck={setCheck}/>}
    <button title="Reset demo data" onClick={reset} className="fixed bottom-4 right-4 rounded-full border border-slate-200 bg-white p-3 text-slate-500 shadow-lg hover:text-red-600"><RefreshCcw size={17}/></button>
  </div>
}

function Dashboard({computed,activeRisks,data,util,resolveBottleneck,setPage,setSelected}){
  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-teal-600"><Zap size={14}/> Hospital command center</div><h1 className="mt-1 text-2xl font-bold tracking-tight">Good evening, Administrator</h1><p className="mt-1 text-sm text-slate-500">See what is slowing your operating theatres down — and resolve it.</p></div><div className="rounded-xl border border-teal-100 bg-teal-50 px-3 py-2 text-xs text-teal-800"><b>Workflow Intelligence Engine</b> · rule-based prototype</div></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <Stat icon={ClipboardCheck} label="Surgeries Today" value="18" sub="scheduled" />
      <Stat icon={Check} label="Completed" value={computed.filter(s=>s.status==="Completed").length||"2"} sub="today" accent="text-emerald-600"/>
      <Stat icon={Clock3} label="Delayed" value={computed.filter(s=>s.status==="Delayed").length||"3"} sub="needs action" accent="text-amber-600"/>
      <Stat icon={Activity} label="OT Utilization" value={`${util}%`} sub="live estimate" accent="text-blue-600"/>
      <Stat icon={AlertTriangle} label="At-Risk Surgeries" value={activeRisks.length} sub="radar" accent="text-red-600"/>
    </div>

    <div className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
      <section className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 p-5"><div><h2 className="font-bold">Bottleneck Radar</h2><p className="text-xs text-slate-500">Why is an OT likely to be delayed?</p></div><span className="badge bg-slate-100 text-slate-600">{activeRisks.length} detected</span></div>
        <div className="divide-y divide-slate-100">
          {activeRisks.map(s=><div key={s.id} className="p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div className="flex gap-3"><div className={`mt-1 h-3 w-3 rounded-full ${s.intel.status==="RED"?"bg-red-500":s.intel.status==="YELLOW"?"bg-amber-500":"bg-emerald-500"}`}/><div><div className="font-semibold">{s.ot} · {s.id}</div><div className="mt-1 text-sm text-slate-500">{s.patientObj?.name} · {s.procedure}</div><div className="mt-2 flex flex-wrap gap-1.5"><Badge>{s.intel.status}</Badge>{s.intel.delay>0&&<span className="badge bg-red-50 text-red-700">{s.intel.delay} min predicted delay</span>}</div></div></div>
              <button className="btn-primary shrink-0" onClick={()=>resolveBottleneck(s)}>Resolve Bottleneck <ChevronRight size={16}/></button>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2"><div className="rounded-xl bg-red-50 p-3"><div className="text-xs font-bold uppercase tracking-wide text-red-700">Root causes</div>{s.intel.causes.length?<ul className="mt-2 space-y-1 text-sm text-red-900">{s.intel.causes.map(c=><li key={c[2]} className="flex justify-between"><span>• {c[0]}</span><b>+{c[1]}m</b></li>)}</ul>:<div className="mt-2 text-sm text-red-900">No active delay factor</div>}</div><div className="rounded-xl bg-teal-50 p-3"><div className="text-xs font-bold uppercase tracking-wide text-teal-700">Recommended actions</div><div className="mt-2 text-sm text-teal-900">{s.intel.causes.slice(0,2).map(c=><div key={c[2]}>→ Resolve {c[0].toLowerCase()}</div>)}</div></div></div>
          </div>)}
        </div>
      </section>
      <section className="card p-5"><div className="flex items-center justify-between"><div><h2 className="font-bold">OT Status</h2><p className="text-xs text-slate-500">Live theatre overview</p></div><button className="btn-soft" onClick={()=>setPage("OT Management")}>Open OT view</button></div><div className="mt-4 space-y-3">{data.ots.map(o=><div key={o.id} className="rounded-xl border border-slate-100 p-3"><div className="flex items-center justify-between"><span className="font-semibold">{o.id}</span><Badge>{o.status}</Badge></div><div className="mt-2 text-sm text-slate-600">{o.surgery||"No active surgery"}</div><div className="mt-1 text-xs text-slate-400">Expected completion: {o.expected}</div></div>)}</div></section>
    </div>

    <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
      <section className="card"><div className="flex items-center justify-between p-5"><div><h2 className="font-bold">Upcoming Surgeries</h2><p className="text-xs text-slate-500">Readiness updates automatically from checklist state.</p></div><button className="btn-soft" onClick={()=>setPage("Surgery Management")}>View all</button></div><div className="table-wrap"><table><thead><tr><th>Patient</th><th>Procedure</th><th>OT</th><th>Time</th><th>Readiness</th><th>Status</th></tr></thead><tbody>{computed.slice(0,6).map(s=><tr key={s.id}><td><button className="font-semibold text-teal-700 hover:underline" onClick={()=>setSelected(s.patient)}>{s.patientObj?.name}</button><div className="text-xs text-slate-400">{s.id}</div></td><td>{s.procedure}</td><td>{s.ot}</td><td>{s.time}</td><td><div className="flex items-center gap-2"><div className="h-1.5 w-16 rounded-full bg-slate-100"><div className={`h-1.5 rounded-full ${s.intel.ready>=90?"bg-emerald-500":s.intel.ready>=60?"bg-amber-500":"bg-red-500"}`} style={{width:`${s.intel.ready}%`}}/></div><span className="text-xs font-semibold">{s.intel.ready}%</span></div></td><td><Badge>{s.intel.status}</Badge></td></tr>)}</tbody></table></div></section>
      <section className="card p-5"><div className="flex items-center justify-between"><div><h2 className="font-bold">Recent Alerts</h2><p className="text-xs text-slate-500">Automated workflow events</p></div><button className="btn-soft" onClick={()=>setPage("Alerts")}>View alerts</button></div><div className="mt-4 space-y-3">{data.alerts.slice(0,4).map(a=><div key={a.id} className="rounded-xl border border-slate-100 p-3"><div className="flex items-center justify-between"><Badge>{a.severity}</Badge><span className="text-xs text-slate-400">{a.time}</span></div><div className="mt-2 text-sm font-medium">{a.message}</div><div className="mt-1 text-xs text-slate-500">{a.department}</div></div>)}</div></section>
    </div>
    <Future/>
  </div>
}

function Patients({data,search,setSearch,setSelected}){
  const rows=data.patients.filter(p=>(p.name+p.id+p.procedure).toLowerCase().includes(search.toLowerCase()));
  return <div className="space-y-5"><div><h1 className="text-2xl font-bold">Patients</h1><p className="text-sm text-slate-500">Patient readiness visibility for scheduled procedures.</p></div><div className="card overflow-hidden"><div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 sm:w-80"><Search size={16} className="text-slate-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search patient..." className="w-full bg-transparent text-sm outline-none"/></div><span className="text-xs text-slate-400">{rows.length} patients</span></div><div className="table-wrap"><table><thead><tr><th>Patient</th><th>Age</th><th>Procedure</th><th>Doctor</th><th>Ward</th><th>Time</th><th>Readiness</th><th>Status</th></tr></thead><tbody>{rows.map(p=>{const r=readiness(p);return <tr key={p.id}><td><button onClick={()=>setSelected(p.id)} className="text-left font-semibold text-teal-700 hover:underline">{p.name}</button><div className="text-xs text-slate-400">{p.id}</div></td><td>{p.age}</td><td>{p.procedure}</td><td>{p.doctor}</td><td>{p.ward}</td><td>{p.time}</td><td className="font-semibold">{r}%</td><td><Badge>{r>=90?"GREEN":r>=60?"YELLOW":"RED"}</Badge></td></tr>})}</tbody></table></div></div></div>
}

function PatientDrawer({p,close,setCheck}){
  if(!p)return null; const r=readiness(p);
  return <><div className="fixed inset-0 z-40 bg-slate-900/30" onClick={close}/><aside className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto bg-white shadow-2xl"><div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white p-5"><div><div className="text-xs text-slate-400">{p.id}</div><h2 className="text-xl font-bold">{p.name}</h2></div><button className="btn-soft" onClick={close}><X size={17}/></button></div><div className="space-y-5 p-5"><div className="rounded-2xl bg-slate-50 p-4"><div className="flex items-end justify-between"><div><div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Surgery readiness</div><div className="mt-1 text-3xl font-bold">{r}%</div></div><Badge>{r>=90?"GREEN":r>=60?"YELLOW":"RED"}</Badge></div><div className="mt-3 h-2 rounded-full bg-slate-200"><div className={`h-2 rounded-full ${r>=90?"bg-emerald-500":r>=60?"bg-amber-500":"bg-red-500"}`} style={{width:`${r}%`}}/></div></div><div><h3 className="font-bold">Readiness checklist</h3><div className="mt-3 space-y-2">{Object.entries(p.check).map(([k,v])=><button key={k} onClick={()=>setCheck(p.id,k,!v)} className="flex w-full items-center justify-between rounded-xl border border-slate-100 p-3 text-left hover:bg-slate-50"><span className="text-sm">{checkLabels[k]}</span><span className={`rounded-full p-1.5 ${v?"bg-emerald-100 text-emerald-700":"bg-red-100 text-red-700"}`}>{v?<Check size={15}/>:<X size={15}/>}</span></button>)}</div></div><div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs text-blue-800"><b>Demo behavior:</b> changing a checklist item recalculates readiness, workflow risk, and dashboard intelligence instantly.</div></div></aside></>
}

function Surgeries({computed,setStatus}){
  const statuses=["Scheduled","Patient Ready","In Progress","Completed","Delayed","Cancelled"];
  return <div className="space-y-5"><div><h1 className="text-2xl font-bold">Surgery Management</h1><p className="text-sm text-slate-500">Control workflow state and watch readiness impact the command center.</p></div><div className="card overflow-hidden"><div className="table-wrap"><table><thead><tr><th>Surgery</th><th>Patient</th><th>Procedure</th><th>Doctor</th><th>OT</th><th>Time</th><th>Duration</th><th>Readiness</th><th>Status</th></tr></thead><tbody>{computed.map(s=><tr key={s.id}><td className="font-semibold">{s.id}</td><td>{s.patientObj?.name}</td><td>{s.procedure}</td><td>{s.doctor}</td><td>{s.ot}</td><td>{s.time}</td><td>{s.duration}m</td><td>{s.intel.ready}%</td><td><select value={s.status} onChange={e=>setStatus(s.id,e.target.value)} className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs">{statuses.map(x=><option key={x}>{x}</option>)}</select></td></tr>)}</tbody></table></div></div></div>
}

function OTs({data,computed,update,resolveBottleneck}){
  const simulate=(id)=>update(d=>{const o=d.ots.find(x=>x.id===id);if(!o)return d;const seq={AVAILABLE:"PREPARING",PREPARING:"IN SURGERY","IN SURGERY":"CLEANING",CLEANING:"AVAILABLE","AT RISK":"IN SURGERY"};o.status=seq[o.status]||"AVAILABLE";if(o.status==="AVAILABLE")o.surgery="—";return d});
  return <div className="space-y-5"><div><h1 className="text-2xl font-bold">OT Management</h1><p className="text-sm text-slate-500">Simulate theatre events and identify idle time root causes.</p></div><div className="grid gap-5 lg:grid-cols-3">{data.ots.map(o=>{const s=computed.find(x=>x.id===o.surgery);const intel=s?.intel||{delay:0,causes:[]};return <div className="card p-5" key={o.id}><div className="flex items-center justify-between"><div className="text-lg font-bold">{o.id}</div><Badge>{o.status}</Badge></div><div className="mt-4 space-y-3 text-sm"><div><span className="text-slate-400">Current surgery</span><div className="font-semibold">{o.surgery||"None"}</div></div><div className="grid grid-cols-2 gap-3"><div><span className="text-slate-400">Start</span><div>{o.start}</div></div><div><span className="text-slate-400">Expected</span><div>{o.expected}</div></div></div><div><span className="text-slate-400">Next surgery</span><div>{o.next}</div></div><div className={`rounded-xl p-3 ${intel.delay>0||o.status==="AT RISK"?"bg-red-50":"bg-slate-50"}`}><div className="text-xs font-bold uppercase tracking-wide">Why is my OT idle?</div><div className="mt-1 font-semibold">{intel.causes[0]?.[0]|| (o.status==="CLEANING"?"OT cleaning in progress":"No active bottleneck")}</div><div className="mt-1 text-xs text-slate-500">{intel.causes[0]?"Recommended: resolve the root cause":"The theatre is operationally clear."}</div></div></div><div className="mt-4 grid grid-cols-2 gap-2"><button className="btn-primary" onClick={()=>simulate(o.id)}>Next event</button>{s&&intel.delay>0?<button className="btn-soft" onClick={()=>resolveBottleneck(s)}>Resolve</button>:<button className="btn-soft" onClick={()=>simulate(o.id)}>Simulate</button>}</div></div>})}</div><div className="card p-5"><h2 className="font-bold">OT Timeline</h2><div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-7">{["Scheduled","Patient Arrived","OT Prepared","Surgery Started","Surgery Completed","Cleaning","Ready"].map((x,i)=><div key={x} className="relative rounded-xl border border-slate-100 p-3 text-center"><div className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full ${i<4?"bg-teal-600 text-white":"bg-slate-100 text-slate-400"}`}>{i<4?<Check size={15}/>:i+1}</div><div className="mt-2 text-xs font-medium">{x}</div></div>)}</div></div></div>
}

function CSSD({data,assignPack}){
  const [ot,setOt]=useState("OT-02");
  return <div className="space-y-5"><div><h1 className="text-2xl font-bold">CSSD Instrument Tracking</h1><p className="text-sm text-slate-500">Sterile pack visibility with expiry protection.</p></div><div className="grid gap-4 md:grid-cols-3"><Stat icon={Package} label="Available packs" value={data.packs.filter(p=>p.status==="AVAILABLE").length} sub="ready to assign"/><Stat icon={ShieldCheck} label="Reserved / In use" value={data.packs.filter(p=>["RESERVED","IN USE"].includes(p.status)).length} sub="allocated" accent="text-blue-600"/><Stat icon={AlertTriangle} label="Expired / blocked" value={data.packs.filter(p=>p.status==="EXPIRED").length} sub="cannot assign" accent="text-red-600"/></div><div className="card overflow-hidden"><div className="table-wrap"><table><thead><tr><th>Pack ID</th><th>Pack Type</th><th>Sterilization</th><th>Expiry</th><th>Status</th><th>Assigned OT</th><th>Last Location</th><th>Action</th></tr></thead><tbody>{data.packs.map(p=><tr key={p.id}><td className="font-semibold">{p.id}</td><td>{p.type}</td><td>{p.sterilized}</td><td>{p.expiry}</td><td><Badge>{p.status==="EXPIRED"?"EXPIRED":p.status}</Badge></td><td>{p.ot}</td><td>{p.location}</td><td>{p.status==="EXPIRED"?<span className="badge bg-red-100 text-red-700">EXPIRED — BLOCKED</span>:p.status==="AVAILABLE"?<div className="flex items-center gap-2"><select value={ot} onChange={e=>setOt(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-1 text-xs">{["OT-01","OT-02","OT-03"].map(x=><option key={x}>{x}</option>)}</select><button className="btn-primary px-2 py-1.5" onClick={()=>assignPack(p.id,ot)}>Assign</button></div>:<span className="text-xs text-slate-400">Allocated</span>}</td></tr>)}</tbody></table></div></div></div>
}

function Alerts({data,resolveAlert}){
  return <div className="space-y-5"><div><h1 className="text-2xl font-bold">Alerts</h1><p className="text-sm text-slate-500">Automated alerts generated from workflow state.</p></div><div className="space-y-3">{data.alerts.map(a=><div key={a.id} className="card p-4"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div className="flex gap-3"><div className={`rounded-xl p-2 ${a.severity==="CRITICAL"?"bg-red-50 text-red-600":a.severity==="WARNING"?"bg-amber-50 text-amber-600":"bg-blue-50 text-blue-600"}`}><AlertTriangle size={18}/></div><div><div className="flex items-center gap-2"><Badge>{a.severity}</Badge><span className="text-xs text-slate-400">{a.time}</span></div><div className="mt-1 font-semibold">{a.message}</div><div className="mt-1 text-xs text-slate-500">{a.department} · Recommended: {a.action}</div></div></div><button className="btn-primary" onClick={()=>resolveAlert(a.id)}><Check size={15}/> Resolve</button></div></div>)}</div>{!data.alerts.length&&<div className="card p-10 text-center"><Check className="mx-auto text-emerald-600"/><div className="mt-2 font-semibold">All alerts resolved</div><div className="text-sm text-slate-500">The workflow is clear.</div></div>}</div>
}

function Analytics({computed,data,util,simulated,update}){
  const [ran,setRan]=useState(simulated);
  const causes=[{name:"CSSD availability",value:42},{name:"Patient readiness",value:31},{name:"Consent",value:18},{name:"OT cleaning",value:9}];
  const weekly=[{day:"Mon",util:68},{day:"Tue",util:71},{day:"Wed",util:69},{day:"Thu",util:74},{day:"Fri",util:72},{day:"Sat",util:76},{day:"Sun",util:72}];
  const run=()=>{setRan(true);update(d=>({...d,simulated:true}))};
  return <div className="space-y-5"><div><h1 className="text-2xl font-bold">Analytics & Reports</h1><p className="text-sm text-slate-500">Operational performance and a clearly labeled demo what-if simulation.</p></div><div className="grid gap-4 md:grid-cols-3"><Stat icon={Activity} label="OT Utilization" value={`${util}%`} sub="current estimate"/><Stat icon={Clock3} label="Average Surgery Delay" value="14 min" sub="demo metric" accent="text-amber-600"/><Stat icon={RefreshCcw} label="Average OT Turnover" value="18 min" sub="demo metric" accent="text-blue-600"/><Stat icon={Check} label="Surgeries Completed" value={computed.filter(s=>s.status==="Completed").length+2} sub="today" accent="text-emerald-600"/><Stat icon={AlertTriangle} label="Delayed Surgeries" value={computed.filter(s=>s.status==="Delayed").length+2} sub="today" accent="text-red-600"/><Stat icon={Package} label="CSSD Availability" value="70%" sub="demo metric" accent="text-violet-600"/></div><div className="grid gap-5 lg:grid-cols-2"><div className="card p-5"><h2 className="font-bold">OT Utilization Trend</h2><div className="mt-4 h-64"><ResponsiveContainer width="100%" height="100%"><LineChart data={weekly}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="day"/><YAxis domain={[50,90]}/><Tooltip/><Line type="monotone" dataKey="util" stroke="#0f766e" strokeWidth={3}/></LineChart></ResponsiveContainer></div></div><div className="card p-5"><h2 className="font-bold">Most Common Bottlenecks</h2><div className="mt-4 h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={causes} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label>{causes.map((x,i)=><Cell key={i}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div><div className="grid grid-cols-2 gap-2 text-xs">{causes.map(x=><div key={x.name} className="flex justify-between rounded-lg bg-slate-50 p-2"><span>{x.name}</span><b>{x.value}%</b></div>)}</div></div></div><div className="card border-teal-100 bg-teal-50 p-5"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-center"><div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-teal-700"><CircleHelp size={15}/> What-if simulator · demo only</div><h2 className="mt-1 text-lg font-bold">Simulate bottleneck resolution</h2><p className="mt-1 text-sm text-teal-900/70">Models the operational effect of clearing active bottlenecks. It is not a clinical prediction.</p></div><button className="btn-primary" onClick={run}>Simulate Bottleneck Resolution</button></div>{ran&&<div className="mt-4 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-white p-4"><div className="text-xs text-slate-400">Current utilization</div><div className="text-2xl font-bold">72%</div></div><div className="rounded-xl bg-white p-4"><div className="text-xs text-slate-400">Projected utilization</div><div className="text-2xl font-bold text-emerald-600">84%</div></div><div className="rounded-xl bg-white p-4"><div className="text-xs text-slate-400">Potential improvement</div><div className="text-2xl font-bold text-teal-600">+12%</div></div></div>}</div><Future/></div>
}

function Future(){return <section className="card p-5"><h2 className="font-bold">Future Expansion</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{["Phase 1 · Software workflow automation","Phase 2 · QR/barcode instrument tracking","Phase 3 · RFID + ESP32 IoT tracking","Phase 4 · Computer vision for OT stage detection","Phase 5 · ML delay prediction","Phase 6 · Hospital HIS integration"].map(x=><div key={x} className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm font-medium text-slate-700">{x}</div>)}</div></section>}

export default App;