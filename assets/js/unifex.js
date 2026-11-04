/* ══════════════════════════════════════════════════════════════════════
   UNIFEX INTERACTION SYSTEM — EXACT MATCH TO LAPTOP PORTFOLIO
   ══════════════════════════════════════════════════════════════════════ */

(function initUnifexInteractions() {
  // 1. Floating Hover Image Preview for Experience / Awards Table
  const expRows = document.querySelectorAll('.uf-exp-row');
  let previewCard = document.querySelector('.uf-hover-preview-card');
  
  if (!previewCard && expRows.length > 0) {
    previewCard = document.createElement('div');
    previewCard.className = 'uf-hover-preview-card';
    previewCard.innerHTML = '<img src="" alt="Campaign Preview">';
    document.body.appendChild(previewCard);
  }

  if (previewCard && expRows.length > 0) {
    const previewImg = previewCard.querySelector('img');
    let targetX = -500, targetY = -500;
    let currentX = -500, currentY = -500;
    let isHovering = false;

    expRows.forEach(row => {
      row.addEventListener('mouseenter', (e) => {
        const imgSrc = row.getAttribute('data-preview');
        if (imgSrc && previewImg) {
          previewImg.src = imgSrc;
          previewCard.classList.add('visible');
          isHovering = true;
        }
      });

      row.addEventListener('mousemove', (e) => {
        targetX = e.clientX + 30;
        targetY = e.clientY - 40;
      });

      row.addEventListener('mouseleave', () => {
        previewCard.classList.remove('visible');
        isHovering = false;
      });
    });

    function renderPreview() {
      if (isHovering) {
        currentX += (targetX - currentX) * 0.15;
        currentY += (targetY - currentY) * 0.15;
        previewCard.style.left = `${currentX.toFixed(1)}px`;
        previewCard.style.top = `${currentY.toFixed(1)}px`;
      }
      requestAnimationFrame(renderPreview);
    }
    renderPreview();
  }

  // 2. Floating Action Button (Scroll to top / Contact)
  const floatBtn = document.querySelector('.uf-float-action');
  if (floatBtn) {
    floatBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 3. Smooth Anchor Scrolling for Unifex Navbar links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        window.scrollTo({
          top: targetEl.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // 4. Parallax scroll effect on Kinetic Typography
  const kineticWorks = document.querySelector('.uf-works-giant-text');
  const kineticHero = document.querySelector('.uf-hero-kinetic-text');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (kineticWorks) {
      kineticWorks.style.transform = `translateY(${scrollY * 0.08}px)`;
    }
    if (kineticHero) {
      kineticHero.style.transform = `translateX(-50%) translateY(${scrollY * 0.14}px)`;
    }
  }, { passive: true });

  // 5. Connect Proof Modal for Unifex items with data-proof-src
  document.querySelectorAll('.uf-work-card, .uf-hero-metric-card, .uf-exp-row').forEach(card => {
    card.addEventListener('click', (e) => {
      const proofSrc = card.getAttribute('data-proof-src');
      const proofTitle = card.getAttribute('data-proof-title') || 'Verified Campaign Evidence';
      if (proofSrc) {
        const modal = document.getElementById('proofModal');
        const modalImg = document.getElementById('pmImg');
        const modalCap = document.getElementById('pmCaption');
        if (modal && modalImg) {
          modalImg.src = proofSrc;
          if (modalCap) modalCap.textContent = proofTitle;
          modal.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      }
    });
  });
})();
