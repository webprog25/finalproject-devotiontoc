import { getToken }   from './auth.js';
import { wrapSelect } from './ui.js';
import { toast }      from './toast.js';

function createModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal';
  overlay.innerHTML = `
    <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button class="modal-close" aria-label="Close">&times;</button>
      <h2 id="modal-title"></h2>
      <img id="modal-gif" alt="" />
      <p id="modal-text"></p>
    </div>`;
  document.body.append(overlay);

  const close = () => overlay.classList.remove('open');
  overlay.querySelector('.modal-close').onclick = close;
  overlay.addEventListener('click', e => { 
    if (e.target === overlay) 
      close(); 
  });
  window.addEventListener('keydown', e => { 
    if (e.key === 'Escape') 
      close();
     });

  return exercise => {
    overlay.querySelector('#modal-title').textContent = exercise.name;
    overlay.querySelector('#modal-gif').src = exercise.gifUrl || '/placeholder.png';
    overlay.querySelector('#modal-gif').alt = `GIF of ${exercise.name}`;
    overlay.querySelector('#modal-text').textContent =
      exercise.description || `Primary muscle: ${exercise.muscle || '—'}`;
    overlay.classList.add('open');
  };
}
export const showModal = createModal();

/* builder UI */
export async function showBuilder(root) {
  root.innerHTML = '';
  const container = document.createElement('div');
  container.className = 'container max';
  root.append(container);

  const [exercises, templates] = await Promise.all([
    fetch('/api/exercises', { headers:{Authorization:'Bearer '+getToken()} }).then(r=>r.json()),
    fetch('/api/templates', { headers:{Authorization:'Bearer '+getToken()} }).then(r=>r.json())
  ]);

  const form = document.createElement('div');
  form.className = 'card col';
  form.innerHTML = `
    <select id="template-select"><option value="">New …</option></select>

    <label class="row" style="align-items:center;gap:.5rem;">
      Color <input type="color" id="color" value="#4f46e5" style="height:40px;width:40px;border:none;">
    </label>

    <input id="title" placeholder="Template title" />

    <select id="exercise-select"></select>
    <button id="add" class="btn btn-primary">Add Exercise</button>

    <ul id="list" class="col"></ul>

    <button id="save" class="btn btn-success">Save Template</button>`;
  container.append(form);

  const tsel   = form.querySelector('#template-select');
  templates.forEach(t =>
    tsel.insertAdjacentHTML('beforeend', `<option value="${t._id}">${t.title}</option>`));
  wrapSelect(tsel);

  const esel = form.querySelector('#exercise-select');
  exercises.forEach(ex =>
    esel.insertAdjacentHTML('beforeend', `<option value="${ex._id}">${ex.name}</option>`));
  wrapSelect(esel);

  const list   = form.querySelector('#list');
  const title  = form.querySelector('#title');
  const colorI = form.querySelector('#color');

  function addRow(name, sets = 3, reps = 8) {
    const li = document.createElement('li');
    li.className = 'row card';
    li.innerHTML = `
      <span class="grow ex-link" tabindex="0">${name}</span>
      <input type="number" placeholder="Sets" min="1" value="${sets}">
      <input type="number" placeholder="Reps" min="1" value="${reps}">
      <button class="btn-icon" aria-label="Remove">&times;</button>`;

    const exObj = exercises.find(e => e.name === name);
    li.querySelector('.ex-link').onclick =
    li.querySelector('.ex-link').onkeydown = ev => {
      if (ev.type === 'click' || ev.key === 'Enter' || ev.key === ' ') showModal(exObj);
    };
    li.querySelector('.btn-icon').onclick = () => li.remove();
    list.append(li);
  }

  form.querySelector('#add').onclick = () => {
    const ex = exercises.find(e => e._id === esel.value);
    if (ex) addRow(ex.name);
  };

  tsel.onchange = () => {
    list.innerHTML = '';
    if (!tsel.value) {
      title.value = '';
      colorI.value = '#4f46e5';
      return;
    }
    const t = templates.find(x => x._id === tsel.value);
    title.value  = t.title;
    colorI.value = t.color || '#4f46e5';
    t.items.forEach(i => addRow(i.exercise.name, i.sets, i.reps));
  };

  form.querySelector('#save').onclick = async () => {

    if (!list.children.length) { 
        toast('Add at least one exercise'); 
        return; 
    }

    const items = [...list.children].map(li => ({
      exercise: exercises.find(e => e.name === li.querySelector('.ex-link').textContent)._id,
      sets: +li.children[1].value,
      reps: +li.children[2].value
    }));

    const body = {
      title:  title.value.trim() || 'Untitled',
      color:  colorI.value,
      items
    };

    const isEdit = Boolean(tsel.value);
    const url    = '/api/templates' + (isEdit ? '/' + tsel.value : '');
    const method = isEdit ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers:{'Content-Type':'application/json', Authorization:'Bearer '+getToken()},
      body: JSON.stringify(body)
    });

    toast(isEdit ? 'Template updated' : 'Template created');
    if (!isEdit) { 
      title.value=''; 
      list.innerHTML=''; 
      colorI.value='#4f46e5'; 
    }
  };
}
