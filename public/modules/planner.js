import { getToken } from './auth.js';
import { wrapSelect } from './ui.js';

export async function showPlanner(root) {
  root.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'container max planner-wrap';
  root.append(wrap);

  let cursor = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  let mode   = 'month';   // month week
  document.body.classList.add('month');

  const templates = await fetch('/api/templates', {
    headers: { Authorization: 'Bearer ' + getToken() }
  }).then(r => r.json());

  const header = document.createElement('div');
  header.className = 'row'; header.style.alignItems = 'center'; header.style.gap = '6px';
  wrap.append(header);

  const prev   = btnIcon('‹');
  const next   = btnIcon('›');
  const title  = document.createElement('h2');
  title.style.flex = '1';
  title.style.textAlign = 'center';
  title.style.fontSize = 'var(--step-1)';
  const toggle = btnIcon('Week');

  header.append(prev, title, next, toggle);

  const scroll = document.createElement('div');
  scroll.className = 'planner-scroll';
  wrap.append(scroll);

  const grid = document.createElement('div');
  grid.className = 'planner-grid';
  scroll.append(grid);

  // nav handler
  prev.onclick = () => {
    cursor = mode === 'month'
      ? new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1)
      : new Date(cursor.setDate(cursor.getDate() - 7));
    load();
  };
  next.onclick = () => {
    cursor = mode === 'month'
      ? new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
      : new Date(cursor.setDate(cursor.getDate() + 7));
    load();
  };
  toggle.onclick = e => {
    e.stopPropagation();                     // stop arrow hit, TODO: fix bug
    mode = mode === 'month' ? 'week' : 'month';
    toggle.textContent = mode === 'month' ? 'Week' : 'Month';
    document.body.classList.toggle('month', mode === 'month');
    document.body.classList.toggle('week',  mode === 'week');

    if (mode === 'week') {
      const dow = cursor.getDay();                       
      cursor = new Date(cursor.setDate(cursor.getDate() - (dow === 0 ? 6 : dow - 1))); 
    } else {
      cursor = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    }
    load();
  };

  function btnIcon(txt) {
    const b = document.createElement('button');
    b.className = 'btn-icon';
    b.innerHTML = `<span>${txt}</span>`;    
    return b;
  }


function showDayInfo(template) {

  if (!template.title) {
    template = templates.find(t => t._id === template._id) || template;
  }

  let overlay = document.querySelector('.day-info');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'modal day-info';
    overlay.innerHTML = `
      <div class="modal-content" role="dialog" aria-modal="true">
        <button class="modal-close" aria-label="Close">&times;</button>
        <h2 id="day-title"></h2>
        <ul id="day-exs" class="col"></ul>
      </div>`;
    document.body.append(overlay);

    overlay.querySelector('.modal-close').onclick = () => overlay.classList.remove('open');
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  }

  // fill title
  overlay.querySelector('#day-title').textContent = template.title || 'Workout';
  const ul = overlay.querySelector('#day-exs');
  ul.innerHTML = '';

  (template.items || []).forEach(it => {
    ul.insertAdjacentHTML('beforeend',
      `<li>${it.exercise?.name || '…'} — <strong>${it.sets} × ${it.reps}</strong></li>`);
  });

  overlay.classList.add('open');
}



  async function load() {
    grid.innerHTML = '';
    const year  = cursor.getFullYear();
    const month = cursor.getMonth();

    const plans = await fetch(`/api/plans?month=${year}-${String(month + 1).padStart(2, '0')}`, {
      headers: { Authorization: 'Bearer ' + getToken() }
    }).then(r => r.json());
    const planMap = Object.fromEntries(
      plans.map(p => [new Date(p.date).toDateString(), p])
    );

    mode === 'month'
      ? renderMonth(year, month, planMap)
      : renderWeek(cursor, planMap);
  }

  function renderMonth(year, month, planMap) {
    title.textContent = `${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][month]} ${year}`;

    const firstDow = new Date(year, month, 1).getDay() || 7; // Mon=1 … Sun=7
    const daysInMo = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i < firstDow; i++) grid.append(document.createElement('div'));

    for (let d = 1; d <= daysInMo; d++) {
      const date = new Date(year, month, d);
      makeCell(date, planMap);
    }
  }

  function renderWeek(start, planMap) {
    const monday = new Date(start);
    const sunday = new Date(start); sunday.setDate(monday.getDate() + 6);

    title.textContent =
      `${monday.toLocaleDateString(undefined,{day:'numeric',month:'short'})} – ` +
      `${sunday.toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'})}`;

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday); date.setDate(monday.getDate() + i);
      makeCell(date, planMap);
    }
  }

  // single day cell
  function makeCell(date, planMap) {
  const cell = document.createElement('div');
  cell.className = 'planner-day';
  cell.innerHTML = `<span>${date.getDate()}</span><div class="name"></div>`;
  const lbl  = cell.querySelector('.name');
  const plan = planMap[date.toDateString()];

  if (plan) {
    const clr = plan.template.color || '#4f46e5';
    lbl.innerHTML = `<span class="dot" style="background:${clr}"></span> ${plan.template.title}`;
  }

  grid.append(cell);

if (mode === 'month') {
  cell.onclick = () => editDay(date, lbl);
  // long press
  let timer;
  const LONG = 500;        // inb ms
  const start = () => {
    timer = setTimeout(() => {
      if (plan) showDayInfo(plan.template);  
    }, LONG);
  };
  const clear = () => clearTimeout(timer);

  cell.onmousedown   = start;
  cell.onmouseup     = clear;
  cell.onmouseleave  = clear;
  cell.ontouchstart  = start;
  cell.ontouchend    = clear;
  cell.ontouchcancel = clear;
} else {
  // week mode
  cell.onclick = () => editDay(date, lbl);
}

}

  function editDay(date, labelEl) {
    const dialog = document.createElement('div');
    dialog.className = 'card col';
    Object.assign(dialog.style, {
    position: 'fixed',
    top: '25%',
    left: '10%',
    right: '10%',
    zIndex: '120',
    padding: '1.25rem',      
    boxSizing: 'border-box',
    maxWidth: '400px',
    minHeight: '240px',      
    margin: '0 auto',
   
  });
    dialog.innerHTML = `<button id="closeBtn" style="
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      border: none;
      background: transparent;
      font-size: 2rem;
      cursor: pointer;
    ">&times;</button><h3>Choose template for<br>${date.toDateString()}</h3>
      <select id="pick"></select>
      <button class="btn btn-success">Save</button>`;
    document.body.append(dialog);

    const sel = dialog.querySelector('select');
    templates.forEach(t =>
      sel.insertAdjacentHTML('beforeend', `<option value="${t._id}">${t.title}</option>`));
    wrapSelect(sel);

    dialog.querySelector('button').onclick = async () => {
      await fetch('/api/plans', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + getToken() },
        body: JSON.stringify({ date: date.toISOString(), template: sel.value })
      });
      const chosen = templates.find(t => t._id === sel.value);
      labelEl.innerHTML = `<span class="dot" style="background:${chosen.color}"></span> ${chosen.title}`;
      dialog.remove();
    };
  }

  load();  
}
