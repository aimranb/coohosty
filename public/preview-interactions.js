(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.site-header');
  const progress = document.createElement('div');
  progress.className = 'reading-progress'; progress.setAttribute('aria-hidden', 'true');
  document.body.prepend(progress);
  let frame = 0;
  const update = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const height = document.documentElement.scrollHeight - innerHeight;
      progress.style.transform = `scaleX(${height > 0 ? Math.min(1, scrollY / height) : 0})`;
      header?.classList.toggle('compact', scrollY > 30);
    });
  };
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update, { passive: true }); update();
  document.querySelector('#preview-language')?.addEventListener('change', event => {
    location.href = event.target.value + location.hash;
  });
  const toggle = document.querySelector('#preview-menu-toggle');
  const menu = document.querySelector('#preview-mobile-menu');
  const closeMenu = () => { if (menu) menu.hidden = true; toggle?.setAttribute('aria-expanded', 'false'); };
  toggle?.addEventListener('click', () => {
    if (!menu) return;
    menu.hidden = !menu.hidden;
    toggle.setAttribute('aria-expanded', String(!menu.hidden));
  });
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  addEventListener('keydown', event => {
    if (!menu || menu.hidden) return;
    if (event.key === 'Escape') { closeMenu(); toggle?.focus(); }
    if (event.key === 'Tab') {
      const links = menu.querySelectorAll('a');
      if (!links.length) return;
      if (!event.shiftKey && document.activeElement === links[links.length - 1]) { event.preventDefault(); toggle.focus(); }
      else if (event.shiftKey && document.activeElement === toggle) { event.preventDefault(); links[links.length - 1].focus(); }
      else if (!event.shiftKey && document.activeElement === toggle) { event.preventDefault(); links[0].focus(); }
    }
  });
  addEventListener('resize', () => { if (innerWidth > 760) closeMenu(); }, { passive: true });
  const targets = document.querySelectorAll('.section-heading, .service-card, .workflow-steps li, .revenue-feature, .package-reveal, .audit-shell, .audit-intro, .footer-main, .destination-card, .destination-heading, .showcase-heading, .device-stage, .showcase-benefits, .faq-intro');
  let observer;
  const configureMotion = () => {
    observer?.disconnect();
    document.documentElement.classList.toggle('motion-enabled', !reduced.matches);
    if (reduced.matches || !('IntersectionObserver' in window)) {
      targets.forEach(target => target.classList.add('is-visible')); return;
    }
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
    }, { threshold: 0.12 });
    targets.forEach(target => {
      target.classList.add('scroll-reveal');
      const siblings = [...target.parentElement.children];
      target.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(target), 3) * 70}ms`);
      observer.observe(target);
    });
  };
  configureMotion(); reduced.addEventListener('change', configureMotion);
  let pointerFrame = 0;
  addEventListener('pointermove', event => {
    if (reduced.matches || event.pointerType !== 'mouse') return;
    cancelAnimationFrame(pointerFrame);
    pointerFrame = requestAnimationFrame(() => {
      document.querySelectorAll('.hero-note .pupil').forEach(pupil => {
        const box = pupil.closest('svg').getBoundingClientRect();
        if (pupil.closest('.logo') && Math.hypot(event.clientX - box.left - box.width / 2, event.clientY - box.top - box.height / 2) > 220) { pupil.style.transform = ''; return; }
        const x = Math.max(-2.5, Math.min(2.5, (event.clientX - box.left - box.width / 2) / 160));
        const y = Math.max(-2, Math.min(2, (event.clientY - box.top - box.height / 2) / 160));
        pupil.style.transform = `translate(${x}px, ${y}px)`;
      });
    });
  }, { passive: true });
  reduced.addEventListener('change', () => {
    if (reduced.matches) document.querySelectorAll('.pupil').forEach(pupil => { pupil.style.transform = ''; });
  });
  document.querySelectorAll('.plan-card .button, .service-card > a').forEach(link => {
    link.addEventListener('click', () => {
      const card = link.closest('.plan-card, .service-card');
      const plan = card?.querySelector('h3')?.textContent?.trim();
      const select = document.querySelector('#plan');
      const index = ['AUDIT', 'OPTIMIZE', 'COHOST'].indexOf(plan);
      if (select && index >= 0) select.selectedIndex = index + 1;
    });
  });
  document.querySelectorAll('[data-city-motion-toggle]').forEach(button => button.addEventListener('click', () => { const paused = button.getAttribute('aria-pressed') !== 'true'; button.setAttribute('aria-pressed', String(paused)); button.closest('section').dataset.motionPaused = String(paused); button.textContent = paused ? button.dataset.play : button.dataset.pause; }));
  const carousel = document.querySelector('.city-carousel');
  const gallery = document.querySelector('.property-gallery');
  if (gallery) {
    const photos = JSON.parse(gallery.dataset.galleryPhotos);
    let selected = 0;
    const selectPhoto = index => {
      selected = (index + photos.length) % photos.length;
      const photo = photos[selected];
      gallery.querySelectorAll('.gallery-device-photo img').forEach(image => {
        image.src = photo.src;
        if (!image.closest('[aria-hidden="true"]')) image.alt = photo.alt;
      });
      gallery.querySelectorAll('[data-editor-offset]').forEach(image => { const index = (selected + Number(image.dataset.editorOffset) + photos.length) % photos.length; image.src = photos[index].src; });
      gallery.querySelector('.gallery-count').textContent = `${String(selected + 1).padStart(2, '0')} / ${photos.length}`;
      gallery.querySelector('.gallery-controls p').textContent = photo.alt;
      gallery.querySelectorAll('.property-listing-info').forEach(info => {
        info.querySelector('h3').textContent = selected === 0 || selected === 7 ? info.dataset.villaTitle : info.dataset.apartmentTitle;
      });
    };
    gallery.querySelector('[data-gallery-prev]').addEventListener('click', () => selectPhoto(selected - 1));
    gallery.querySelector('[data-gallery-next]').addEventListener('click', () => selectPhoto(selected + 1));
  }
  if (carousel) {
    const slides = [...carousel.querySelectorAll('.city-slide')];
    const buttons = [...carousel.querySelectorAll('.city-selectors button')];
    const pause = carousel.querySelector('.city-pause');
    let active = 0, paused = false, hovering = false, visible = true, timer;
    const show = index => {
      active = index;
      slides.forEach((slide, i) => { slide.classList.toggle('is-active', i === index); slide.setAttribute('aria-hidden', String(i !== index)); });
      buttons.forEach((button, i) => { button.classList.toggle('is-active', i === index); button.setAttribute('aria-pressed', String(i === index)); });
      carousel.querySelectorAll('.city-caption').forEach((caption, i) => { caption.classList.toggle('is-active', i === index); caption.setAttribute('aria-hidden', String(i !== index)); });
      carousel.querySelector('.city-count').textContent = `0${index + 1} / 0${slides.length}`;
    };
    const sync = () => {
      clearInterval(timer);
      carousel.dataset.motionPaused = String(paused || !visible || document.hidden || reduced.matches);
      carousel.dataset.paused = String(paused || hovering || !visible || document.hidden || reduced.matches);
      pause.setAttribute('aria-pressed', String(paused));
      pause.setAttribute('aria-label', paused ? pause.dataset.play : pause.dataset.pause);
      pause.textContent = paused ? '▷' : 'Ⅱ';
      if (!paused && !hovering && visible && !document.hidden && !reduced.matches) timer = setInterval(() => show((active + 1) % slides.length), 3000);
    };
    buttons.forEach((button,index) => button.addEventListener('click', () => { show(index); sync(); }));
    pause.addEventListener('click', () => { paused = !paused; sync(); });
    carousel.addEventListener('mouseenter', () => { hovering = true; sync(); });
    carousel.addEventListener('mouseleave', () => { hovering = carousel.contains(document.activeElement); sync(); });
    carousel.addEventListener('focusin', () => { hovering = true; sync(); });
    carousel.addEventListener('focusout', event => { hovering = carousel.matches(':hover') || carousel.contains(event.relatedTarget); sync(); });
    document.addEventListener('visibilitychange', sync); reduced.addEventListener('change', sync);
    if ('IntersectionObserver' in window) new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: .15 }).observe(carousel);
    addEventListener('blur', () => document.querySelectorAll('.pupil').forEach(pupil => { pupil.style.transform = ''; }));
    sync();
  }
})();
