async function api(path, opts={}){
  const res = await fetch(path, opts);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function refresh() {
  const pets = await api('/api/pets');
  const meds = await api('/api/medicines');
  const sched = await api('/api/schedules');

  const petSelect = document.getElementById('petSelect');
  const medSelect = document.getElementById('medSelect');
  petSelect.innerHTML = pets.map(p=>`<option value="${p.id}">${p.name}</option>`).join('');
  medSelect.innerHTML = meds.map(m=>`<option value="${m.id}">${m.name}${m.dose?(' — '+m.dose):''}</option>`).join('');

  const lists = document.getElementById('lists');
  if (!sched.length) { lists.innerHTML = '<p>No scheduled doses.</p>'; return }
  lists.innerHTML = sched.map(s=>{
    const pet = pets.find(p=>p.id===s.petId)?.name || s.petId;
    const med = meds.find(m=>m.id===s.medicineId)?.name || s.medicineId;
    return `<div class="card"><strong>${pet}</strong> — ${med} @ ${new Date(s.time).toLocaleString()}<div>${s.note||''}</div></div>`
  }).join('');
}

document.getElementById('petForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const fd = new FormData(e.target);
  await api('/api/pets', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name: fd.get('name') }) });
  e.target.reset();
  refresh();
});

document.getElementById('medForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const fd = new FormData(e.target);
  await api('/api/medicines', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name: fd.get('name'), dose: fd.get('dose') }) });
  e.target.reset();
  refresh();
});

document.getElementById('schedForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const fd = new FormData(e.target);
  await api('/api/schedules', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ petId: fd.get('petId'), medicineId: fd.get('medicineId'), time: fd.get('time'), note: fd.get('note') }) });
  e.target.reset();
  refresh();
});

window.addEventListener('load', ()=>{ refresh().catch(err=>{document.getElementById('lists').innerText='Failed to load: '+err.message}) });
