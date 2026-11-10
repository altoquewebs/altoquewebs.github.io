if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('anim');
  setTimeout(function(){ document.documentElement.classList.remove('anim'); }, 2000);
}
