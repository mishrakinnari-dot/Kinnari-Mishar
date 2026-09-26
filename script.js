/* ===================================================================
   SITE SCRIPT — loader, nav, theme, canvas, counters, reveal, lightbox
   =================================================================== */
document.addEventListener('DOMContentLoaded', function(){

  /* ---- 1. Loading screen ---- */
  window.addEventListener('load', function(){
    setTimeout(function(){ document.getElementById('loader').classList.add('hide'); }, 500);
  });

  /* ---- 2. Scroll progress bar ---- */
  var progress = document.getElementById('scroll-progress');
  function updateProgress(){
    var h = document.documentElement;
    var scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progress.style.width = scrolled + '%';
  }
  document.addEventListener('scroll', updateProgress, {passive:true});

  /* ---- 3. Sticky nav hide-on-scroll + active link highlight ---- */
  var nav = document.getElementById('site-nav');
  var lastY = window.scrollY;
  document.addEventListener('scroll', function(){
    var y = window.scrollY;
    if(y > lastY && y > 140){ nav.classList.add('nav-hidden'); } else { nav.classList.remove('nav-hidden'); }
    lastY = y;

    // fab visibility
    document.getElementById('fab-top').classList.toggle('show', y > 500);
  }, {passive:true});

  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');
  function highlightNav(){
    var pos = window.scrollY + 120;
    sections.forEach(function(sec){
      if(pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight){
        navLinks.forEach(function(l){ l.classList.remove('active'); });
        var active = document.querySelector('.nav-link[href="#' + sec.id + '"]');
        if(active) active.classList.add('active');
      }
    });
  }
  document.addEventListener('scroll', highlightNav, {passive:true});

  /* ---- 4. Mobile menu ---- */
  var hamburger = document.getElementById('hamburger');
  var primaryNav = document.getElementById('primary-nav');
  hamburger.addEventListener('click', function(){ primaryNav.classList.toggle('open'); });
  navLinks.forEach(function(l){ l.addEventListener('click', function(){ primaryNav.classList.remove('open'); }); });

  /* ---- 5. Theme toggle (light/dark) ---- */
  var themeBtn = document.getElementById('theme-toggle');
  var root = document.documentElement;
  var saved = null;
  try{ saved = localStorage.getItem('km-theme'); }catch(e){}
  if(saved){ root.setAttribute('data-theme', saved); }
  updateThemeIcon();
  themeBtn.addEventListener('click', function(){
    var cur = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', cur);
    try{ localStorage.setItem('km-theme', cur); }catch(e){}
    updateThemeIcon();
  });
  function updateThemeIcon(){
    var isDark = root.getAttribute('data-theme') === 'dark';
    themeBtn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  }

  /* ---- 6. Typing animation in hero ---- */
  var roles = ['Assistant Professor', 'AI & Data Mining Researcher', 'ICT Cell Manager', 'Author of 3 Books', 'Mentor to Student Innovators'];
  var typedEl = document.getElementById('typed-role');
  var ri = 0, ci = 0, deleting = false;
  function typeLoop(){
    var word = roles[ri];
    if(!deleting){
      ci++;
      typedEl.textContent = word.substring(0, ci);
      if(ci === word.length){ deleting = true; setTimeout(typeLoop, 1400); return; }
    } else {
      ci--;
      typedEl.textContent = word.substring(0, ci);
      if(ci === 0){ deleting = false; ri = (ri+1) % roles.length; }
    }
    setTimeout(typeLoop, deleting ? 40 : 80);
  }
  typeLoop();

  /* ---- 7. Animated counters ---- */
  var counters = document.querySelectorAll('.counter');
  var counterObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-target'), 10);
        var cur = 0;
        var step = Math.max(1, Math.round(target / 40));
        var iv = setInterval(function(){
          cur += step;
          if(cur >= target){ cur = target; clearInterval(iv); }
          el.textContent = cur;
        }, 30);
        counterObserver.unobserve(el);
      }
    });
  }, {threshold:0.5});
  counters.forEach(function(c){ counterObserver.observe(c); });

  /* ---- 8. Scroll-triggered reveal animations ---- */
  var revealEls = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){ entry.target.classList.add('in'); revealObserver.unobserve(entry.target); }
    });
  }, {threshold:0.12});
  revealEls.forEach(function(el){ revealObserver.observe(el); });

  /* ---- 9. Back to top ---- */
  document.getElementById('fab-top').addEventListener('click', function(){
    window.scrollTo({top:0, behavior:'smooth'});
  });

  /* ---- 10. Gallery lightbox ---- */
  var lightbox = document.getElementById('lightbox');
  var lightboxTitle = document.getElementById('lightbox-title');
  document.querySelectorAll('.gallery-item').forEach(function(item){
    item.addEventListener('click', function(){
      lightboxTitle.textContent = item.getAttribute('data-title') || 'Add a photo';
      lightbox.classList.add('open');
    });
  });
  document.getElementById('lightbox-close').addEventListener('click', function(){ lightbox.classList.remove('open'); });
  lightbox.addEventListener('click', function(e){ if(e.target === lightbox) lightbox.classList.remove('open'); });

  /* ---- 11. Ripple effect on buttons ---- */
  document.querySelectorAll('.btn').forEach(function(btn){
    btn.addEventListener('click', function(e){
      var circle = document.createElement('span');
      var d = Math.max(btn.clientWidth, btn.clientHeight);
      circle.style.width = circle.style.height = d + 'px';
      var rect = btn.getBoundingClientRect();
      circle.style.left = (e.clientX - rect.left - d/2) + 'px';
      circle.style.top = (e.clientY - rect.top - d/2) + 'px';
      circle.classList.add('ripple');
      btn.appendChild(circle);
      setTimeout(function(){ circle.remove(); }, 650);
    });
  });

  /* ---- 12. Footer year ---- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---- 13. Hero canvas — subtle animated network (nodes & connections) ---- */
  var canvas = document.getElementById('hero-canvas');
  var ctx = canvas.getContext('2d');
  var W, H, nodes = [];
  function resize(){
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  function initNodes(){
    nodes = [];
    var count = Math.min(46, Math.round((W*H)/26000));
    for(var i=0;i<count;i++){
      nodes.push({
        x: Math.random()*W, y: Math.random()*H,
        vx:(Math.random()-0.5)*0.25, vy:(Math.random()-0.5)*0.25
      });
    }
  }
  function getColors(){
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    return { line: dark ? 'rgba(111,187,168,0.35)' : 'rgba(47,111,99,0.28)', dot: dark ? 'rgba(217,174,91,0.7)' : 'rgba(185,139,54,0.55)' };
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    var colors = getColors();
    nodes.forEach(function(n){
      n.x += n.vx; n.y += n.vy;
      if(n.x < 0 || n.x > W) n.vx *= -1;
      if(n.y < 0 || n.y > H) n.vy *= -1;
    });
    for(var i=0;i<nodes.length;i++){
      for(var j=i+1;j<nodes.length;j++){
        var dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        var dist = Math.sqrt(dx*dx+dy*dy);
        if(dist < 150){
          ctx.strokeStyle = colors.line;
          ctx.globalAlpha = 1 - dist/150;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    nodes.forEach(function(n){
      ctx.fillStyle = colors.dot;
      ctx.beginPath(); ctx.arc(n.x, n.y, 2, 0, Math.PI*2); ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  if(canvas){
    resize(); initNodes();
    window.addEventListener('resize', function(){ resize(); initNodes(); });
    requestAnimationFrame(draw);
  }

});
