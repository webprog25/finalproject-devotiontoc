export function wrapSelect(sel) {
  if (!sel) return null;

  if (sel.parentElement && sel.parentElement.classList.contains('select'))
    return sel.parentElement;

  const wrapper = document.createElement('div');
  wrapper.className = 'select';

  if (sel.parentElement) {
    sel.parentElement.insertBefore(wrapper, sel);
    wrapper.append(sel);
  } else {
    wrapper.append(sel);
  }
  return wrapper;     
     
}
