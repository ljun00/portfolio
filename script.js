// Sections of this file: 1) photo picker  2) scroll effects  3) section reveal  4) nav highlight  5) project switcher  6) hero typing.
// Lines marked EDIT are the ones you may want to change.
(function(){
  // Read the visitor's motion preference and cache frequently used page elements.
  var rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var root=document.documentElement, tt=document.getElementById('tt');
  var secs=[].slice.call(document.querySelectorAll('section'));
  var links=[].slice.call(document.querySelectorAll('.links a'));
  var pars=[].slice.call(document.querySelectorAll('[data-par]'));

  // Profile photo picker: shows the chosen image and remembers it in YOUR browser only (visitors will not see it).
  // For visitors, add a real image with src in index.html instead.
  var pick=document.getElementById('pick'), pimg=document.getElementById('pimg'), slot=document.querySelector('.slot');
  function showPhoto(u){pimg.src=u;pimg.hidden=false;slot.classList.add('has');}
  try{var sv=localStorage.getItem('photo');if(sv&&pimg&&slot)showPhoto(sv);}catch(e){}
  if(pick)pick.addEventListener('change',function(){
    var f=pick.files[0];if(!f)return;
    var fr=new FileReader();
    fr.onload=function(){
      var img=new Image();
      img.onload=function(){
        var s=Math.min(1,720/Math.max(img.width,img.height)), c=document.createElement('canvas');
        c.width=Math.round(img.width*s);c.height=Math.round(img.height*s);
        c.getContext('2d').drawImage(img,0,0,c.width,c.height);
        var d=c.toDataURL('image/jpeg',.85);showPhoto(d);
        try{localStorage.setItem('photo',d);}catch(e){}
      };
      img.src=fr.result;
    };
    fr.readAsDataURL(f);
  });

  // Scroll effects: page progress, back-to-top visibility, and subtle background-word parallax.
  function frame(){
    var max=root.scrollHeight-innerHeight, p=max>0?Math.min(1,Math.max(0,scrollY/max)):0;
    root.style.setProperty('--p',p.toFixed(4));
    document.body.classList.toggle('scrolled',scrollY>80); // EDIT: pixels scrolled before the scroll cue fades out
    tt.classList.toggle('show',scrollY>500); // EDIT: pixels scrolled before the back-to-top button appears
    if(!rm){pars.forEach(function(el){
      var r=el.parentNode.getBoundingClientRect(), c=r.top+r.height/2-innerHeight/2;
      el.style.transform='translateY('+(c*parseFloat(el.dataset.par)).toFixed(1)+'px)';
    });}
  }
  var tick=false;
  addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(function(){frame();tick=false;});}},{passive:true});
  addEventListener('resize',frame);
  frame();

  // Reveal each section when it enters view, then stop observing it.
  var seen=new IntersectionObserver(function(es){es.forEach(function(e){
    if(e.isIntersecting){e.target.classList.add('in');seen.unobserve(e.target);}
  });},{threshold:.25});
  secs.forEach(function(s){seen.observe(s);});

  // Highlight the navigation link for the section currently near the viewport center.
  var act=new IntersectionObserver(function(es){es.forEach(function(e){
    if(e.isIntersecting){links.forEach(function(a){a.classList.toggle('on',a.dataset.s===e.target.id);});}
  });},{rootMargin:'-45% 0px -45% 0px'});
  secs.forEach(function(s){act.observe(s);});

  // Project switcher: button data-t values select project cards by their ID.
  var pbtn=[].slice.call(document.querySelectorAll('.all button')), projs=[].slice.call(document.querySelectorAll('.proj'));
  pbtn.forEach(function(b){b.addEventListener('click',function(){
    pbtn.forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',String(x===b));});
    projs.forEach(function(p){p.classList.toggle('on',p.id===b.dataset.t);});
  });});

  // Hero typing effect. EDIT: put your own role line inside phrases.
  var phrases=['Your role or field, in one line'];
  var out=document.getElementById('type');
  function sleep(ms){return new Promise(function(r){setTimeout(r,ms);});}
  async function loop(){
    var i=0;
    while(true){
      var t=phrases[i%phrases.length];
      for(var k=1;k<=t.length;k++){out.textContent=t.slice(0,k);await sleep(48);} // EDIT: 48 = typing speed in milliseconds per letter (higher = slower)
      return;
    }
  }
  setTimeout(function(){document.body.classList.add('booted');},rm?0:900); // EDIT: 900 = delay in ms before the hero text fades in
  if(rm){out.textContent=phrases[0];}else{setTimeout(loop,1000);}
})();
