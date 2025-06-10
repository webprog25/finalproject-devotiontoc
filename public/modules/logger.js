import { getToken } from './auth.js';
import { startRest } from './timer.js';
import { showModal } from './builder.js';
import { wrapSelect } from './ui.js';
import { toast } from './toast.js';

export async function showLogger(root) {
  root.innerHTML = '';                       // clear
  const container = document.createElement('div');
  container.className = 'container';
  root.append(container);

  const templates = await fetch('/api/templates', {
    headers: { Authorization: 'Bearer ' + getToken() }
  }).then(r => r.json());

  if (!templates.length) {
    container.innerHTML = '<p class="card">No templates yet.</p>';
    return;
  }

  const sel = document.createElement('select');
  
  templates.forEach(t =>
    sel.insertAdjacentHTML('beforeend', `<option value="${t._id}">${t.title}</option>`));
  
  const wrapped = wrapSelect(sel); //TODO: fix
  container.append(wrapped);


  const session = document.createElement('div');
  session.className = 'col';
  container.append(session);
  
  sel.onchange = () => load(sel.value);
  load(sel.value);
  
  const dateInput = document.createElement('input');
  dateInput.type = 'date';
  dateInput.value = new Date().toISOString().split('T')[0];
  wrapSelect(dateInput);            
  session.append(dateInput);

  function load(id) {
    session.innerHTML = '';
    const tpl = templates.find(x => x._id === id);

    tpl.items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card col';
      card.innerHTML = `
        <strong class="ex-link">${item.exercise.name}</strong>
        <ul class="col sets"></ul>
        <button class="add-set primary">Add Set</button>`;
      const ul   = card.querySelector('.sets');
      const add  = card.querySelector('.add-set');

      // helper to create one set row
      const addRow = (prefill = {}) => {
        const li = document.createElement('li');
        li.className = 'row';
        li.innerHTML = `
          <input type="number" placeholder="kg"  style="width:5rem" value="${prefill.weight ?? ''}">
          <input type="number" placeholder="reps" style="width:4rem" value="${prefill.reps   ?? item.reps}">
          <button class="del" aria-label="Remove">&times;</button>`;
        li.querySelector('.del').onclick = () => li.remove();
        ul.append(li);
      };
      card.querySelector('.ex-link').onclick =
      card.querySelector('.ex-link').onkeydown = ev => {
      if (ev.type === 'click' || ev.key === 'Enter' || ev.key === ' ') {
        showModal(item.exercise);          
      }
      };
      // create as many rows as template says 
      for (let i = 0; i < item.sets; i++) addRow();

      add.onclick = () => addRow();       
      session.append(card);
    });

    // save log
    const save = document.createElement('button');
    save.textContent = 'Save Session';
    save.className   = 'btn btn-success';
    session.append(save);

    save.onclick = async () => {
      const entries = [...session.querySelectorAll('.card')].map(card => {
        const name = card.querySelector('strong').textContent;
        const exId = tpl.items.find(i => i.exercise.name === name).exercise._id;
        const sets = [...card.querySelectorAll('li')].map(li => {
          const [w, r] = li.querySelectorAll('input');
          return { weight: +w.value || 0, reps: +r.value || 0 };
        }).filter(s => s.reps > 0);
        return { exercise: exId, sets };
      });

      await fetch('/api/logs', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + getToken() },
        body: JSON.stringify({ date: dateInput.value, entries })
      });
      toast('Session saved!');
    };
  }
}
