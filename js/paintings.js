function getPaintingsForYear(year) {
  switch (year) {
    case '2024-2025':
      return ['owl-2025.jpeg', 'owl2-2025.JPG', 'bowie-2025.jpeg', 'rockylizard.jpeg'];
    case '2023':
      return ['owl-2023.jpeg', 'abstract.jpeg'];
    case '2022':
      return ['cloth-2022.jpeg', 'incar-2022.jpeg', 'me-2022.jpeg', 'reflections-2022.jpeg'];
    case '2021':
      return ['cardrawing-2021.jpeg', 'fox-2021.jpg', 'lenly-2021.JPG', 'lenlydrawing-2019.jpg', 'collage-2021.jpeg'];
    case '2020':
      return ['flowers-2020.jpeg', 'me-2020.jpeg', 'tim-2020.jpeg', 'lana-2020.jpg', 'billie-2020.jpeg'];
    case '2019':
      return [
        'birds-2019.jpeg', 'cat-2019.jpeg', 'lemons-2019.jpeg', 'me2-2019.jpeg', 'textile-2019.jpeg', 'cats-2019.jpeg',
        'me-2019.jpeg', 'owl-2019.jpeg', 'parrots-2019.jpeg', 'toucan-2019.jpeg', 'gator-2019.jpeg', 'tea-2019.jpeg'
      ];
    case '2018':
      return ['me-2018.JPG', 'sunset-2018.jpeg', 'cara-2018.jpeg'];
    case '2012':
        return ['werewolf.jpeg'];
    default:
      return [];
  }
}

function buildGallery() {
  const galleryContainer = document.getElementById('gallery-container');
  const years = ['2024-2025', '2023', '2022', '2021', '2020', '2019', '2018', '2012'];
  let allLinks = [];

  years.forEach(year => {
    const paintings = getPaintingsForYear(year);
    if (paintings.length === 0) return;

    const section = document.createElement('section');
    section.classList.add('year-section');

    const title = document.createElement('h2');
    title.classList.add('year-title');
    title.textContent = year;
    section.appendChild(title);

    const grid = document.createElement('div');
    grid.classList.add('painting-grid');

    paintings.forEach(fileName => {
      const imgPath = `images/paintings/${year}/${fileName}`;
      const link = document.createElement('a');
      link.href = imgPath;
      link.dataset.caption = fileName;
      link.dataset.year = year;

      const img = document.createElement('img');
      img.src = imgPath;
      img.alt = fileName;

      link.appendChild(img);
      grid.appendChild(link);
      allLinks.push(link);
    });

    section.appendChild(grid);
    galleryContainer.appendChild(section);
  });

  return allLinks;
}

function initLightbox(allLinks) {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-image');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  let currentIndex = -1;

function openLightbox(index) {
    const link = allLinks[index];
    if (!link) return;
    currentIndex = index;
    modalImg.src = link.href;
    modal.classList.add('show');

    modalImg.onload = () => {
        const vw = window.innerWidth;
  const vh = window.innerHeight;

  modalImg.style.width = '';
  modalImg.style.height = '';

  const imgW = modalImg.naturalWidth;
  const imgH = modalImg.naturalHeight;

  if (imgW < vw * 0.5 && imgH < vh * 0.5) {
    const scaleFactor = Math.min((vw * 0.8) / imgW, (vh * 0.8) / imgH);
    modalImg.style.width = `${imgW * scaleFactor}px`;
    modalImg.style.height = 'auto';
  }
    };
}

  function closeLightbox() {
    modal.classList.remove('show');
    modalImg.src = '';
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % allLinks.length;
    openLightbox(currentIndex);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + allLinks.length) % allLinks.length;
    openLightbox(currentIndex);
  }

  document.body.addEventListener('click', e => {
    const target = e.target.closest('.painting-grid a');
    if (!target) return;
    e.preventDefault();
    openLightbox(allLinks.indexOf(target));
  });

  closeBtn.addEventListener('click', closeLightbox);
  modal.addEventListener('click', e => {
    if (e.target === modal) closeLightbox();
  });

  nextBtn.addEventListener('click', e => { e.stopPropagation(); showNext(); });
  prevBtn.addEventListener('click', e => { e.stopPropagation(); showPrev(); });

  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('show')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const allLinks = buildGallery();
  initLightbox(allLinks);
});