(() => {
  const body=document.body, cursor=document.getElementById("cursor"), picker=document.getElementById("cursor-mode"), nav=document.getElementById("nav"), menu=document.getElementById("menu");
  const fine=matchMedia("(hover:hover) and (pointer:fine)").matches, reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  function setMode(mode){body.classList.remove("cursor-dot","cursor-ring","cursor-glow","cursor-trail","cursor-system");body.classList.add("cursor-"+mode);picker.value=mode;try{localStorage.setItem("sabbir-cursor-mode",mode)}catch(e){}}
  let initial="ring";try{initial=localStorage.getItem("sabbir-cursor-mode")||"ring"}catch(e){}setMode(fine?initial:"system");
  picker.addEventListener("change",e=>setMode(e.target.value));
  if(fine&&!reduced){
    let tx=innerWidth/2,ty=innerHeight/2,x=tx,y=ty,visible=false;
    const trails=Array.from({length:3},(_,i)=>{const el=document.createElement("span");el.className="cursor-trail-dot trail-"+i;cursor.appendChild(el);return{el,x:tx,y:ty}});
    addEventListener("pointermove",e=>{tx=e.clientX;ty=e.clientY;if(!visible){visible=true;cursor.classList.add("visible");x=tx;y=ty;}},{passive:true});
    addEventListener("pointerleave",()=>{visible=false;cursor.classList.remove("visible","is-hovering","is-pressed")});
    document.querySelectorAll("a,button,select,input,textarea,[role='button']").forEach(el=>{
      el.addEventListener("pointerenter",()=>{cursor.classList.add("is-hovering");cursor.querySelector(".cursor-label").textContent=el.dataset.cursor||(el.matches("a")?"OPEN":"CLICK")});
      el.addEventListener("pointerleave",()=>{cursor.classList.remove("is-hovering");cursor.querySelector(".cursor-label").textContent=""});
    });
    addEventListener("pointerdown",()=>cursor.classList.add("is-pressed"));addEventListener("pointerup",()=>cursor.classList.remove("is-pressed"));
    function frame(){x+=(tx-x)*.16;y+=(ty-y)*.16;cursor.style.left=x+"px";cursor.style.top=y+"px";let fx=tx,fy=ty;trails.forEach((t,i)=>{t.x+=(fx-t.x)*(.24-i*.055);t.y+=(fy-t.y)*(.24-i*.055);t.el.style.left=(t.x-x)+"px";t.el.style.top=(t.y-y)+"px";fx=t.x;fy=t.y});requestAnimationFrame(frame)}requestAnimationFrame(frame);
  }
  menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open))});
  nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
  document.getElementById("year").textContent=new Date().getFullYear();
  if("IntersectionObserver"in window&&!reduced){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll(".reveal").forEach(el=>io.observe(el))}else document.querySelectorAll(".reveal").forEach(el=>el.classList.add("visible"));
})();