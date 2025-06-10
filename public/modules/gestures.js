export function swipeDelete(el, onDel) {
  let startX = null;
  let dx = 0;

  el.addEventListener('pointerdown', e=>{
    startX = e.clientX;
    el.setPointerCapture(e.pointerId);
    el.style.transition='';
  });

  el.addEventListener('pointermove', e=>{
    if (startX===null) return;
    dx = e.clientX - startX;
    if (dx < 0) return;
    el.style.transform = `translateX(${dx}px)`;
    el.style.opacity = 1 - Math.min(dx/120, .7);
  });

  el.addEventListener('pointerup', e=>{
    el.releasePointerCapture(e.pointerId);
    if (dx > 100) {
      el.style.transition='transform .2s ease-out, opacity .2s ease-out';
      el.style.transform='translateX(100%)';
      el.style.opacity=0;
      setTimeout(onDel,180);
    } 
    else {
      el.style.transition='transform .2s ease-out, opacity .2s ease-out';
      el.style.transform='';
      el.style.opacity='';
    }
    startX = null;
  });
}
