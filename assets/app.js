/* Saffron & Steam — interactie op de landingspagina */
(function () {
  var SMAKEN = {
    ochtend: { naam: 'Green Tea & Lemongrass', moment: 'Voor de ochtend', foto: 'assets/groene-thee.jpg', icoon: 'citroengras',
               zin: 'Jij begint de dag graag rustig, met iets lekkers op tafel.' },
    middag:  { naam: 'Ginger & Turmeric', moment: 'Voor je middagpauze', foto: 'assets/gember.jpg', icoon: 'gember',
               zin: 'Jij neemt graag even pauze tussen twee taken door.' },
    zondag:  { naam: 'Rooibos & Forest Berries', moment: 'Voor een grijze zondag', foto: 'assets/rooibos.jpg', icoon: 'bosvruchten',
               zin: 'Jij houdt van trage dagen binnen, met regen tegen het raam.' },
    avond:   { naam: 'Chamomile & Honey', moment: 'Voor het einde van de dag', foto: 'assets/kamille.jpg', icoon: 'kamille',
               zin: 'Jij sluit de dag graag af met een boek en een leeslamp.' }
  };
  var VOLGORDE = ['ochtend', 'middag', 'zondag', 'avond'];
  var minderBeweging = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Smakenverkenner (tabs) ---------- */
  var tabs = [].slice.call(document.querySelectorAll('.tab'));
  var stippen = [].slice.call(document.querySelectorAll('.stippen i'));
  var huidig = 0;
  function toon(i, focus) {
    huidig = (i + 4) % 4;
    tabs.forEach(function (t, n) {
      var aan = n === huidig;
      t.setAttribute('aria-selected', aan);
      t.tabIndex = aan ? 0 : -1;
      var p = document.getElementById(t.getAttribute('aria-controls'));
      p.hidden = !aan;
      p.classList.remove('in');
      if (aan) { void p.offsetWidth; p.classList.add('in'); }
      if (stippen[n]) stippen[n].classList.toggle('aan', aan);
    });
    if (focus) tabs[huidig].focus();
  }
  tabs.forEach(function (t, n) {
    t.addEventListener('click', function () { toon(n); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { toon(huidig + 1, true); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { toon(huidig - 1, true); e.preventDefault(); }
    });
  });
  document.getElementById('vorige').addEventListener('click', function () { toon(huidig - 1); });
  document.getElementById('volgende').addEventListener('click', function () { toon(huidig + 1); });
  // vegen op telefoon
  var startX = null;
  document.querySelectorAll('.visual').forEach(function (v) {
    v.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    v.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) toon(huidig + (dx < 0 ? 1 : -1));
      startX = null;
    });
  });
  function gaNaarSmaak(key) {
    toon(VOLGORDE.indexOf(key));
    document.getElementById('smaken').scrollIntoView({ behavior: minderBeweging ? 'auto' : 'smooth' });
  }

  /* ---------- 2. "Nu"-badge: welk moment is het nu? ---------- */
  function momentNu(d) {
    var u = d.getHours(), dag = d.getDay();
    if (u >= 22 || u < 5) return 'avond';
    if (u < 11) return 'ochtend';
    if (u < 18) return (dag === 0 || dag === 6) ? 'zondag' : 'middag';
    return 'avond';
  }
  var badge = document.getElementById('nu-badge');
  var DAGEN = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
  function zetBadge() {
    var d = new Date(), key = momentNu(d), s = SMAKEN[key];
    var tijd = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
    badge.dataset.smaak = key;
    document.getElementById('nu-tijd').textContent = 'Het is ' + DAGEN[d.getDay()] + ' ' + tijd + '.';
    document.getElementById('nu-tekst').textContent = 'Tijd voor ' + s.naam;
    badge.setAttribute('aria-label', 'Het is ' + DAGEN[d.getDay()] + ' ' + tijd + '. Tijd voor ' + s.naam + '. Bekijk deze smaak.');
    return key;
  }
  var nuKey = zetBadge();
  setInterval(zetBadge, 30000);
  badge.addEventListener('click', function (e) { e.preventDefault(); gaNaarSmaak(badge.dataset.smaak); });
  toon(VOLGORDE.indexOf(nuKey)); // open de smaak van dit moment

  /* ---------- 3. Video pauzeren ---------- */
  var video = document.querySelector('.hero-video video');
  var vknop = document.getElementById('video-knop');
  if (minderBeweging) { video.removeAttribute('autoplay'); video.pause(); }
  function zetVknop() { var p = video.paused; vknop.textContent = p ? 'Speel video af' : 'Pauzeer video'; vknop.setAttribute('aria-pressed', p); }
  vknop.addEventListener('click', function () { if (video.paused) video.play(); else video.pause(); });
  video.addEventListener('play', zetVknop); video.addEventListener('pause', zetVknop); zetVknop();

  /* ---------- 4. Quiz: welk moment ben jij? ---------- */
  var VRAGEN = [
    { v: 'Wanneer zet jij het liefst water op?', a: [
      ['ochtend', 'Meteen na het opstaan'], ['middag', 'Tussen twee taken door'],
      ['zondag', 'Als het buiten giet'], ['avond', 'Als het huis stil wordt']] },
    { v: 'Wat ligt er naast je kop?', a: [
      ['ochtend', 'Een croissant en een eitje'], ['middag', 'Je laptop of je agenda'],
      ['zondag', 'Een plaid en de zondagskrant'], ['avond', 'Een boek met een ezelsoor']] },
    { v: 'Wat haal je het liefst uit de keuken?', a: [
      ['ochtend', 'Iets fris met citroen'], ['middag', 'Verse gember en specerijen'],
      ['zondag', 'Een bakje bosvruchten'], ['avond', 'Een pot honing']] }
  ];
  var kaart = document.getElementById('quiz-kaart');
  var antwoorden = [];
  function esc(t) { return t.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function icoon(n) { return '<svg aria-hidden="true"><use href="#i-' + n + '"/></svg>'; }
  function animeer() { kaart.classList.remove('stap'); void kaart.offsetWidth; kaart.classList.add('stap'); }
  function vraag(i) {
    var q = VRAGEN[i];
    var html = '<div class="voortgang" aria-hidden="true">' + VRAGEN.map(function (_, n) { return '<i class="' + (n <= i ? 'aan' : '') + '"></i>'; }).join('') + '</div>' +
      '<div class="label">Vraag ' + (i + 1) + ' van ' + VRAGEN.length + '</div><h3 tabindex="-1">' + esc(q.v) + '</h3><div class="opties">';
    // volgorde van de antwoorden husselen, zodat het niet altijd ochtend-middag-zondag-avond is
    q.a.slice().sort(function () { return Math.random() - .5; }).forEach(function (a) {
      html += '<button class="optie" type="button" data-smaak="' + a[0] + '">' + icoon(SMAKEN[a[0]].icoon) + '<span>' + esc(a[1]) + '</span></button>';
    });
    kaart.innerHTML = html + '</div>';
    animeer();
    kaart.querySelector('h3').focus({ preventScroll: true });
    kaart.querySelectorAll('.optie').forEach(function (b) {
      b.addEventListener('click', function () {
        antwoorden.push(b.dataset.smaak);
        if (i + 1 < VRAGEN.length) vraag(i + 1); else uitslag();
      });
    });
  }
  function uitslag() {
    var tel = {}; var best = antwoorden[antwoorden.length - 1];
    antwoorden.forEach(function (k) { tel[k] = (tel[k] || 0) + 1; if (tel[k] > (tel[best] || 0)) best = k; });
    var s = SMAKEN[best];
    kaart.innerHTML = '<div class="uitslag" data-smaak="' + best + '"><img src="' + s.foto + '" alt="' + esc(s.naam) + '">' +
      '<div><div class="label">Jouw moment</div><span class="moment">' + esc(s.moment) + '</span>' +
      '<h3 tabindex="-1">' + esc(s.naam) + '</h3><p>' + esc(s.zin) + '</p>' +
      '<div class="acties"><a class="knop k1" href="#smaken" id="quiz-smaak">Bekijk deze smaak</a><a class="knop k5" href="#nieuwsbrief">Schrijf je in</a></div>' +
      '<button class="opnieuw" type="button" id="quiz-opnieuw">Doe de quiz opnieuw</button></div></div>';
    animeer();
    kaart.querySelector('h3').focus({ preventScroll: true });
    document.getElementById('quiz-smaak').addEventListener('click', function (e) { e.preventDefault(); gaNaarSmaak(best); });
    document.getElementById('quiz-opnieuw').addEventListener('click', function () { antwoorden = []; vraag(0); });
  }
  document.getElementById('quiz-begin').addEventListener('click', function () { antwoorden = []; vraag(0); });

  /* ---------- 5. Privacy openklappen via de link in het formulier ---------- */
  var privacy = document.getElementById('privacy');
  document.querySelectorAll('a[href="#privacy"]').forEach(function (a) {
    a.addEventListener('click', function () { privacy.open = true; });
  });
  if (location.hash === '#privacy') privacy.open = true;

  /* ---------- 6. Elementen laten verschijnen bij scrollen ---------- */
  var rev = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || minderBeweging) {
    rev.forEach(function (el) { el.classList.add('zichtbaar'); });
  } else {
    var io = new IntersectionObserver(function (items) {
      items.forEach(function (it) { if (it.isIntersecting) { it.target.classList.add('zichtbaar'); io.unobserve(it.target); } });
    }, { threshold: 0.12 });
    rev.forEach(function (el) { io.observe(el); });
  }
})();
