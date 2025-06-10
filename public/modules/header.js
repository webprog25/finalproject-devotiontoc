import { getAvatar, getUname, logout } from './auth.js';

export function initHeader(){
  const btn = document.getElementById('avatar-btn');
  const img = document.getElementById('avatar-img');
  img.src = getAvatar();

  //popup once
  const panel = document.createElement('div');
  panel.className = 'profile-panel';
  panel.innerHTML = `
    <h3>${getUname()}</h3>
    <button class="btn btn-primary" id="overall">Overall stats</button>
    <button class="btn btn-icon"    id="logout">Log&nbsp;out</button>`;
  btn.append(panel);

  btn.onclick = e => {
    e.stopPropagation();
    panel.classList.toggle('show');
  };
  document.addEventListener('click', () => panel.classList.remove('show'));

  panel.querySelector('#logout').onclick = logout;
  panel.querySelector('#overall').onclick = () => {
    panel.classList.remove('show');
    document.getElementById('nav-stats').click();
  };

  const profBtn = document.createElement('button');
  profBtn.className = 'btn btn-primary'; profBtn.textContent = 'Profile';
  panel.insertBefore(profBtn, panel.firstChild);

  profBtn.onclick = () => {
  panel.classList.remove('show');
  document.getElementById('nav-profile').click();           
};
}
