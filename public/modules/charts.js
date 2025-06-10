import { getToken } from './auth.js';

export async function showStats(root) {
  root.innerHTML='';
  const logs = await fetch('/api/logs',{headers:{Authorization:'Bearer '+getToken()}}).then(r=>r.json());
  if(!logs.length){
    
    root.innerHTML='<p class="card">No logs yet.</p>';
    return;
  }

  // flatten {exerciseId -> [ {date, weight, reps} … ] }
  const map={};
  logs.forEach(l=>{
    l.entries.forEach(e=>{
      e.sets.forEach(s=>{
        (map[e.exercise._id]??=[]).push({name:e.exercise.name,date:l.date,weight:s.weight,reps:s.reps});
      });
    });
  });

  // build select
  const sel=document.createElement('select');
  Object.values(map).forEach(arr=>{
    sel.insertAdjacentHTML('beforeend',`<option value="${arr[0].name}">${arr[0].name}</option>`);
  });
  root.append(sel);

  const canvas=document.createElement('canvas'); root.append(canvas);
  sel.onchange=()=>draw(sel.value);
  draw(sel.value);

  function draw(name){
    const arr=map[Object.keys(map).find(k=>map[k][0].name===name)];
    const byDate={};
    arr.forEach(p=>{
      const d=new Date(p.date).toLocaleDateString();
      byDate[d]=(byDate[d]||0)+p.weight;           
    });
    const labels = Object.keys(byDate).sort((a,b)=>{
    const [da,ma,ya] = a.split('.');     // dd.mm.yyyy
    const [db,mb,yb] = b.split('.');
    return new Date(ya,ma-1,da) - new Date(yb,mb-1,db); });
    const data=labels.map(l=>byDate[l]);

    if(window.__chart) window.__chart.destroy();  
    window.__chart=new Chart(canvas,{
      type:'line',
      data:{labels,datasets:[{label:name,data,tension:.3}]},
      options:{scales:{y:{beginAtZero:true}},plugins:{legend:{display:false}}}
    });
  }
}
