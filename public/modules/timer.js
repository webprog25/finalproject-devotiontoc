export function startRest(sec=60, cb=()=>{}) {

  let remaining=sec;

  const int=setInterval(()=>{
    remaining--;
    if(remaining<=0){ 
      clearInterval(int); cb(); 
    }
  },1000);
  return { stop: ()=>clearInterval(int) };

}
