document.addEventListener('DOMContentLoaded', () => {
  for (let i = 0; i < 150; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = 1.5 + Math.random() * 1.3;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.top = Math.random() * window.innerHeight + 'px';
    star.style.left = Math.random() * window.innerWidth + 'px';
    star.style.animationDelay = Math.random() * 6 + 's';
    star.style.animationDuration = 3 + Math.random() * 4 + 's';
    document.body.appendChild(star);
  }

  function createShootingStar() {
    const container = document.createElement('div');
    container.className = 'shooting-star-container';

    const tail = document.createElement('div');
    tail.className = 'shooting-star-tail';

    const head = document.createElement('div');
    head.className = 'shooting-star-head';

    const headSize = 1.5 + Math.random() * 1.3;
    head.style.width = headSize + 'px';
    head.style.height = headSize + 'px';
    head.style.left = '0px';
    head.style.top = (-headSize / 2 + 0.75) + 'px';

    container.appendChild(tail);
    container.appendChild(head);

    const angleRad = Math.random() * 2 * Math.PI;
    const distance = 300 + Math.random() * 300;
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;

    container.style.left = `${startX}px`;
    container.style.top = `${startY}px`;
    container.style.transform = `rotate(${angleRad * 180 / Math.PI}deg)`;

    document.body.appendChild(container);

    let t = 0;
    const duration = 1000 + Math.random() * 700;
    function animate() {
      t += 16;
      const progress = Math.min(1, t / duration);
      container.style.transform =
        `translate(${Math.cos(angleRad) * distance * progress}px,${Math.sin(angleRad) * distance * progress}px) rotate(${angleRad * 180 / Math.PI}deg)`;
      container.style.opacity = (1 - progress).toString();
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        container.remove();
      }
    }
    requestAnimationFrame(animate);
  }

  setInterval(() => {
    if (Math.random() < 0.95) createShootingStar();
  }, 1500 + Math.random() * 2500);
});
