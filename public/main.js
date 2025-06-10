import { initAuth, onAuth }   from './modules/auth.js';
import { showBuilder }        from './modules/builder.js';
import { showLogger }         from './modules/logger.js';
import { showStats }          from './modules/charts.js';
import { showPlanner }        from './modules/planner.js';
import { initHeader }         from './modules/header.js';
import { showProfile }        from './modules/profile.js';

initHeader();


const app = document.getElementById('app');
const nav = {
  log    : document.getElementById('nav-log'),
  build  : document.getElementById('nav-build'),
  stats  : document.getElementById('nav-stats'),
  plan   : document.getElementById('nav-plan'),
  profile: document.getElementById('nav-profile')
};

let currentState = 'log';

function clear() { app.innerHTML = ''; }

function setActive(state) {
  Object.values(nav).forEach(btn => btn.classList.toggle('active', btn === nav[state]));
}

async function render(state) {
  currentState = state;
  setActive(state);
  clear();
  switch (state) {
    case 'build'  : await showBuilder(app); break;
    case 'stats'  : await showStats(app);   break;
    case 'plan'   : await showPlanner(app); break;
    case 'profile': await showProfile(app); break;
    default       : await showLogger(app);  break; 
  }
}

for (const [state, btn] of Object.entries(nav)) {
  btn.addEventListener('click', () => render(state));
}

initAuth().then(() => {
  render('log');        
});

onAuth(() => render(currentState));   
