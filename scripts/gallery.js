document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) {
    return;
  }

  const galleryItems = Array.from(
    document.querySelectorAll('.product-gallery-item')
  );
  if (galleryItems.length === 0) {
    return;
  }

  const lightboxImage = lightbox.querySelector('.lightbox-image');
  const prevButton = lightbox.querySelector('.lightbox-nav.prev');
  const nextButton = lightbox.querySelector('.lightbox-nav.next');
  const closeButton = lightbox.querySelector('.lightbox-close');
  let currentIndex = 0;

  const images = galleryItems.map((item) => {
    const image = item.querySelector('img');
    return {
      src: image.getAttribute('src'),
      alt: image.getAttribute('alt') || 'Galeriebild',
    };
  });

  const openLightbox = (index) => {
    currentIndex = index;
    const { src, alt } = images[currentIndex];
    lightboxImage.src = src;
    lightboxImage.alt = alt;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
  };

  const showNext = () => {
    currentIndex = (currentIndex + 1) % images.length;
    openLightbox(currentIndex);
  };

  const showPrev = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    openLightbox(currentIndex);
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  nextButton.addEventListener('click', (event) => {
    event.stopPropagation();
    showNext();
  });

  prevButton.addEventListener('click', (event) => {
    event.stopPropagation();
    showPrev();
  });

  closeButton.addEventListener('click', (event) => {
    event.stopPropagation();
    closeLightbox();
  });

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('is-open')) {
      return;
    }

    if (event.key === 'Escape') {
      closeLightbox();
    }

    if (event.key === 'ArrowRight') {
      showNext();
    }

    if (event.key === 'ArrowLeft') {
      showPrev();
    }
  });
});
