// ==========================================================================
// CineBunny Forum - JavaScript Logic
// ==========================================================================

// Initial Soft Sample Data
const initialPosts = [
  {
    id: 1,
    type: "Pelicula",
    title: "El Viaje de Chihiro",
    creator: "Hayao Miyazaki",
    author: "BunnyFan",
    cover: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
    rating: 5,
    comment: "Una experiencia mágica e inolvidable. La animación y los detalles pastel de Studio Ghibli son arte puro.",
    likes: 12,
    date: "2026-03-18"
  },
  {
    id: 2,
    type: "Libro",
    title: "Orgullo y Prejuicio",
    creator: "Jane Austen",
    author: "LectoraSoft",
    cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    rating: 5,
    comment: "Un clásico reconfortante que nunca pasa de moda. La evolución de los personajes está escrita con maestría.",
    likes: 8,
    date: "2026-03-19"
  },
  {
    id: 3,
    type: "Novela",
    title: "Your Name (Kimi no Na wa)",
    creator: "Makoto Shinkai",
    author: "CinefiloMATE",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
    rating: 4,
    comment: "Banda sonora espectacular e iluminación visual asombrosa. Una historia emocionante y dulce.",
    likes: 15,
    date: "2026-03-21"
  }
];

// State
let posts = JSON.parse(localStorage.getItem('cinebunny_soft_posts')) || initialPosts;
let currentImageBase64 = null;
let currentImageTab = 'file';
let currentCategoryFilter = 'all';

// DOM Elements
const reviewForm = document.getElementById('review-form');
const starsPicker = document.getElementById('stars-picker');
const ratingVal = document.getElementById('rating-val');
const postsContainer = document.getElementById('posts-container');
const countAll = document.getElementById('count-all');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const coverFile = document.getElementById('cover-file');
const coverUrl = document.getElementById('cover-url');
const previewBox = document.getElementById('preview-box');
const previewImg = document.getElementById('preview-img');
const btnDownloadZip = document.getElementById('btn-download-zip');

// Default placeholder cover
const defaultPlaceholder = "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80";

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  renderPosts();
  setupStarPicker();
  setupImageHandlers();
  setupEventListeners();
});

function saveToLocalStorage() {
  localStorage.setItem('cinebunny_soft_posts', JSON.stringify(posts));
}

// --- Star Rating Handler ---
function setupStarPicker() {
  const stars = starsPicker.querySelectorAll('.star-btn');
  
  function updateStars(val) {
    stars.forEach(star => {
      const starVal = parseInt(star.getAttribute('data-value'));
      if (starVal <= val) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    });
  }

  updateStars(parseInt(ratingVal.value));

  stars.forEach(star => {
    star.addEventListener('click', () => {
      const val = parseInt(star.getAttribute('data-value'));
      ratingVal.value = val;
      updateStars(val);
    });

    star.addEventListener('mouseover', () => {
      const val = parseInt(star.getAttribute('data-value'));
      updateStars(val);
    });
  });

  starsPicker.addEventListener('mouseleave', () => {
    updateStars(parseInt(ratingVal.value));
  });
}

// --- Image Tab & Preview Handler ---
window.switchImageTab = function(tab) {
  currentImageTab = tab;
  document.getElementById('tab-file-btn').classList.toggle('active', tab === 'file');
  document.getElementById('tab-url-btn').classList.toggle('active', tab === 'url');
  
  document.getElementById('file-tab-content').classList.toggle('active', tab === 'file');
  document.getElementById('url-tab-content').classList.toggle('active', tab === 'url');

  updatePreview();
};

function setupImageHandlers() {
  coverFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        currentImageBase64 = evt.target.result;
        previewImg.src = currentImageBase64;
        previewBox.classList.remove('hidden');
      };
      reader.readAsDataURL(file);
    }
  });

  coverUrl.addEventListener('input', updatePreview);
}

function updatePreview() {
  if (currentImageTab === 'url' && coverUrl.value.trim() !== '') {
    previewImg.src = coverUrl.value.trim();
    previewBox.classList.remove('hidden');
  } else if (currentImageTab === 'file' && currentImageBase64) {
    previewImg.src = currentImageBase64;
    previewBox.classList.remove('hidden');
  } else {
    previewBox.classList.add('hidden');
  }
}

// --- Submit Post ---
reviewForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const type = document.getElementById('media-type').value;
  const title = document.getElementById('title').value.trim();
  const creator = document.getElementById('creator').value.trim();
  const author = document.getElementById('author').value.trim();
  const rating = parseInt(ratingVal.value);
  const comment = document.getElementById('comment').value.trim();

  let cover = defaultPlaceholder;
  if (currentImageTab === 'file' && currentImageBase64) {
    cover = currentImageBase64;
  } else if (currentImageTab === 'url' && coverUrl.value.trim() !== '') {
    cover = coverUrl.value.trim();
  }

  const newPost = {
    id: Date.now(),
    type,
    title,
    creator,
    author,
    cover,
    rating,
    comment,
    likes: 0,
    date: new Date().toISOString().split('T')[0]
  };

  posts.unshift(newPost);
  saveToLocalStorage();
  renderPosts();

  // Reset Form
  reviewForm.reset();
  currentImageBase64 = null;
  previewBox.classList.add('hidden');
  ratingVal.value = 5;
  setupStarPicker();
  switchImageTab('file');
});

// --- Category Filter ---
window.setCategoryFilter = function(category) {
  currentCategoryFilter = category;
  document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  renderPosts();
};

// --- Render Stars Helper ---
function renderStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += i <= rating ? '★' : '☆';
  }
  return stars;
}

// --- Render Posts Stream ---
function renderPosts() {
  const query = searchInput.value.toLowerCase().trim();
  const sortBy = sortSelect.value;

  countAll.textContent = posts.length;

  let filtered = posts.filter(post => {
    const matchesCat = currentCategoryFilter === 'all' || post.type === currentCategoryFilter;
    const matchesQuery = post.title.toLowerCase().includes(query) ||
                         post.creator.toLowerCase().includes(query) ||
                         post.comment.toLowerCase().includes(query);
    return matchesCat && matchesQuery;
  });

  // Sorting
  if (sortBy === 'rating-desc') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'rating-asc') {
    filtered.sort((a, b) => a.rating - b.rating);
  } else if (sortBy === 'likes') {
    filtered.sort((a, b) => b.likes - a.likes);
  } else {
    filtered.sort((a, b) => b.id - a.id);
  }

  if (filtered.length === 0) {
    postsContainer.innerHTML = `
      <div class="empty-box">
        <span>🐰</span>
        <h3>No hay publicaciones aquí</h3>
        <p>Sé el primero en compartir una reseña en esta sección.</p>
      </div>
    `;
    return;
  }

  postsContainer.innerHTML = filtered.map(post => `
    <article class="post-card">
      <div class="post-cover">
        <span class="badge-category">${getCategoryIcon(post.type)} ${post.type}</span>
        <img src="${post.cover}" alt="Portada de ${escapeHTML(post.title)}" onerror="this.src='${defaultPlaceholder}'">
      </div>
      <div class="post-content">
        <h3 class="post-title">${escapeHTML(post.title)}</h3>
        <p class="post-creator">Por ${escapeHTML(post.creator)}</p>
        
        <div class="post-stars">
          <span>${renderStars(post.rating)}</span>
          <span class="rating-num">(${post.rating}/5)</span>
        </div>

        <p class="post-text">"${escapeHTML(post.comment)}"</p>

        <div class="post-footer">
          <span>Por: <strong>${escapeHTML(post.author)}</strong></span>
          <div class="post-actions">
            <button class="btn-like" onclick="likePost(${post.id})">
              ❤️ <span>${post.likes}</span>
            </button>
            <button class="btn-delete" onclick="deletePost(${post.id})" title="Borrar comentario">
              🗑️
            </button>
          </div>
        </div>
      </div>
    </article>
  `).join('');
}

function getCategoryIcon(type) {
  if (type === 'Pelicula') return '🎬';
  if (type === 'Libro') return '📖';
  return '🌌';
}

// --- Like Action ---
window.likePost = function(id) {
  const post = posts.find(p => p.id === id);
  if (post) {
    post.likes += 1;
    saveToLocalStorage();
    renderPosts();
  }
};

// --- Delete Post Action ---
window.deletePost = function(id) {
  if (confirm("¿Estás seguro de que deseas eliminar este comentario?")) {
    posts = posts.filter(p => p.id !== id);
    saveToLocalStorage();
    renderPosts();
  }
};

// --- Helpers ---
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

function setupEventListeners() {
  searchInput.addEventListener('input', renderPosts);
  sortSelect.addEventListener('change', renderPosts);
}
