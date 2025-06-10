import { getAvatar, getUname, getToken } from './auth.js';
import { wrapSelect } from './ui.js';
import { toast } from './toast.js';

export async function showProfile(root) {
  root.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'card col max';
  card.style.alignItems = 'center';

  card.innerHTML = `
    <img id="prof-img" src="${getAvatar()}" alt="avatar" style="width:96px;height:96px;border-radius:50%;object-fit:cover;">
    <h2>${getUname()}</h2>

    <label class="btn">
      <input type="file" id="avatar-file" accept="image/*" style="display:none">
      Change picture
    </label>

    <h3 style="margin-top:1rem;">Settings</h3>
    <select id="theme">
      <option value="auto">Auto (system)</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>

    <button class="btn btn-success" id="save">Save changes</button>
  `;
  root.append(card);

  wrapSelect(card.querySelector('#theme'));

  card.querySelector('#avatar-file').onchange = e => {
    const file = e.target.files[0];
    if (file) 
      card.querySelector('#prof-img').src = URL.createObjectURL(file);
  };

  card.querySelector('#save').onclick = async () => {
  const fd = new FormData();
  const file = card.querySelector('#avatar-file').files[0];
  if (file)  
    fd.append('avatar', file);
  fd.append('theme', card.querySelector('#theme').value);

  const resp = await fetch('/api/user', {
    method:'PUT',
    headers:{ Authorization:'Bearer '+getToken() },
    body: fd
  }).then(r=>r.json());

  localStorage.setItem('avatar', resp.avatar);
  localStorage.setItem('uname',  resp.name);
  document.getElementById('avatar-img').src = resp.avatar;
  toast('Profile saved');
};

}
