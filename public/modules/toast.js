export function toast(msg, ms=2200) {

  const div = document.createElement('div');
  div.className = 'toast'; div.textContent = msg;
  document.body.append(div);

  requestAnimationFrame(()=>div.classList.add('show'));
  setTimeout(()=>div.classList.remove('show'), ms);
  setTimeout(()=>div.remove(), ms+350);
  
}