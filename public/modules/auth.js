let token = localStorage.getItem('token') || '';
let avatar = localStorage.getItem('avatar') || '/placeholder.png'; //TODO: fix placeholder png
let uname  = localStorage.getItem('uname')  || 'Guest';
let gId    = '';
const listeners = [];

export function onAuth(cb){ listeners.push(cb); }
export function getToken() { return token; }
export function getAvatar() { return avatar; }
export function getUname()  { return uname;  }

export async function initAuth() {
  gId = sessionStorage.getItem('gId') || '';
  if (!gId) {
    gId = (await fetch('/api/config').then(r=>r.json())).googleClientId;
    sessionStorage.setItem('gId', gId);
  }
  return new Promise((resolve) => {
    if (token) return resolve(); 

    window.onloadCallback = (response) => {
      const profile = response.credential ?
        JSON.parse(atob(response.credential.split('.')[1])) : null;
      if (!profile) return;

      fetch('/api/auth/google', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          googleId: profile.sub,
          name: profile.name,
          email: profile.email,
          avatar: profile.picture
        })
      }).then(r=>r.json()).then(data=>{
        token = data.token;
        localStorage.setItem('token', token);
        localStorage.setItem('avatar', profile.picture);
        localStorage.setItem('uname',  profile.name);
        avatar = profile.picture;
        uname  = profile.name;
        resolve();
        window.location.reload(); 
      });
    };

    window.onload = () => {
      google.accounts.id.initialize({
        client_id: gId,
        callback: window.onloadCallback
      });
      google.accounts.id.renderButton(
        document.body,
        { theme: "outline", size: "large" }
      );
    };
  });
}

export function logout(){
  token=''; 
  localStorage.clear();
  window.location.reload();
}
