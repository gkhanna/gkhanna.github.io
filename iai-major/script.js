(() => {
  'use strict';
  const menu = document.querySelector('.menu-toggle');
  const navigation = document.getElementById('navigation');
  function closeMenu() { menu.setAttribute('aria-expanded', 'false'); navigation.dataset.open = 'false'; }
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); navigation.dataset.open = String(open); });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
  const data = {
    business: { kicker: 'Business & innovation', title: 'Turn better insights\ninto better decisions.', description: 'Explore how AI can help organizations understand customers, improve operations, and bring new ideas to life.', examples: ['Find patterns in customer and market data', 'Build more useful products and services', 'Communicate evidence that guides decisions'], label: 'From information to insight', visual: '<g stroke="currentColor" opacity=".16"><path d="M40 60H410M40 120H410M40 180H410M40 240H410M100 30V270M180 30V270M260 30V270M340 30V270"/></g><g fill="currentColor"><rect x="75" y="173" width="43" height="67" rx="4" opacity=".3"/><rect x="148" y="137" width="43" height="103" rx="4" opacity=".45"/><rect x="221" y="98" width="43" height="142" rx="4" opacity=".65"/><rect x="294" y="59" width="43" height="181" rx="4" opacity=".9"/></g><path d="M67 161L162 110L235 137L350 48" fill="none" stroke="#d0a627" stroke-width="4"/><circle cx="350" cy="48" r="7" fill="#d0a627"/>' },
    people: { kicker: 'People & creativity', title: 'Put human questions\nat the heart of AI.', description: 'Explore the intersection of technology, communication, design, and society. Ask what AI makes possible—and what people need from it.', examples: ['Create and evaluate new forms of digital storytelling', 'Explore how people interact with intelligent tools', 'Study fairness, trust, and responsible use'], label: 'Human perspective. New possibilities.', visual: '<g fill="none" stroke="currentColor" stroke-width="2"><circle cx="225" cy="140" r="85" opacity=".3"/><circle cx="225" cy="140" r="115" opacity=".14"/><path d="M95 190L225 70L355 190L95 190" opacity=".45"/><path d="M95 190L225 140L355 190M225 70V140" opacity=".5"/></g><g fill="currentColor"><circle cx="95" cy="190" r="22" opacity=".55"/><circle cx="355" cy="190" r="22" opacity=".7"/><circle cx="225" cy="70" r="22"/></g><circle cx="225" cy="140" r="17" fill="#d0a627"/>' },
    planet: { kicker: 'Planet & discovery', title: 'Bring new tools\nto our biggest challenges.', description: 'Explore how AI can reveal patterns in complex scientific and environmental data, from living systems to the changing planet.', examples: ['Interpret environmental and climate observations', 'Explore applications in life and ocean sciences', 'Evaluate evidence and communicate uncertainty'], label: 'Curiosity at a planetary scale', visual: '<g fill="none" stroke="currentColor" stroke-width="2"><circle cx="225" cy="140" r="100" opacity=".65"/><ellipse cx="225" cy="140" rx="55" ry="100" opacity=".4"/><ellipse cx="225" cy="140" rx="100" ry="35" opacity=".4"/><path d="M125 140H325M225 40V240" opacity=".35"/><ellipse cx="225" cy="140" rx="157" ry="50" transform="rotate(-25 225 140)" opacity=".4"/></g><circle cx="349" cy="74" r="8" fill="#d0a627"/><circle cx="150" cy="122" r="5" fill="currentColor"/><circle cx="263" cy="178" r="5" fill="currentColor"/>' }
  };
  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  const panel = document.getElementById('interest-panel');
  function selectTab(tab) {
    const selected = data[tab.dataset.interest];
    tabs.forEach(item => { const active = item === tab; item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1; });
    panel.setAttribute('aria-labelledby', tab.id);
    document.getElementById('interest-kicker').textContent = selected.kicker;
    const title = document.getElementById('interest-title'); title.replaceChildren();
    selected.title.split('\n').forEach((part, i) => { if (i) title.append(document.createElement('br')); title.append(document.createTextNode(part)); });
    document.getElementById('interest-description').textContent = selected.description;
    const examples = document.getElementById('interest-examples'); examples.replaceChildren(...selected.examples.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
    document.getElementById('interest-visual-label').textContent = selected.label.toUpperCase();
    document.querySelector('.interest-visual svg').innerHTML = selected.visual;
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); selectTab(tabs[next]); tabs[next].focus(); }
    });
  });
})();
