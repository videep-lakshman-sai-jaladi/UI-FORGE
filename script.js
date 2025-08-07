const quotes = [
  {
    id: 1,
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    id: 2,
    text: "Life is what happens to you while you're busy making other plans.",
    author: "John Lennon",
  },
  {
    id: 3,
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
  },
  {
    id: 4,
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
  },
  {
    id: 5,
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    id: 6,
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
  },
  {
    id: 7,
    text: "In the end, we will remember not the words of our enemies, but the silence of our friends.",
    author: "Martin Luther King Jr.",
  },
  {
    id: 8,
    text: "Happiness is not something ready made. It comes from your own actions.",
    author: "Dalai Lama",

  },
  {
    id: 9,
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
  },
  {
    id: 10,
    text: "Don't let yesterday take up too much of today.",
    author: "Will Rogers",
  },
  {
    id: 11,
    text: "You learn more from failure than from success. Don't let it stop you. Failure builds character.",
    author: "Unknown",

  },
  {
    id: 12,
    text: "It's not whether you get knocked down, it's whether you get up.",
    author: "Vince Lombardi",

  },
  {
    id: 13,
    text: "If you are working on something that you really care about, you don't have to be pushed. The vision pulls you.",
    author: "Steve Jobs",

  },
  {
    id: 14,
    text: "People who are crazy enough to think they can change the world, are the ones who do.",
    author: "Rob Siltanen",

  },
  {
    id: 15,
    text: "We don't make mistakes, just happy little accidents.",
    author: "Bob Ross",
  }
];

let currentQuote = null;
let favorites = JSON.parse(localStorage.getItem('favoriteQuotes') || '[]');



const quoteElement = document.getElementById('quote');
const authorElement = document.getElementById('author');
const newQuoteBtn = document.getElementById('new-quote');
const saveQuoteBtn = document.getElementById('save-quote');
const favoritesPanel = document.getElementById('favorites-panel');
const favoritesCount = document.querySelector('.favorites-count');
const favoritesList = document.getElementById('favorites-list');


document.addEventListener('DOMContentLoaded', function() {
  generateQuote();
  updateFavoritesCount();
  updateFavoritesList();
});


function generateQuote() {
  // Add loading state
  const quoteBox = document.getElementById('quote-box');
  quoteBox.classList.add('loading');
  
  setTimeout(() => {
    let filteredQuotes = quotes;
    
    // Get random quote (avoid repeating the same quote)
    let randomQuote;
    do {
      randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    } while (randomQuote === currentQuote && filteredQuotes.length > 1);
    
    currentQuote = randomQuote;
    

    quoteElement.textContent = currentQuote.text;
    authorElement.textContent = `— ${currentQuote.author}`;
    

    updateSaveButtonState();
    

    quoteBox.classList.remove('loading');
    

    quoteBox.style.transform = 'translateY(10px)';
    quoteBox.style.opacity = '0';
    setTimeout(() => {
      quoteBox.style.transform = 'translateY(0)';
      quoteBox.style.opacity = '1';
    }, 100);
  }, 500);
}


function toggleSaveQuote() {
  if (!currentQuote) return;
  
  const isCurrentlySaved = favorites.some(fav => fav.id === currentQuote.id);
  
  if (isCurrentlySaved) {

    favorites = favorites.filter(fav => fav.id !== currentQuote.id);
    showNotification('Quote removed from favorites!', 'info');
  } else {

    favorites.push(currentQuote);
    showNotification('Quote saved to favorites!', 'success');
  }
  

  localStorage.setItem('favoriteQuotes', JSON.stringify(favorites));
  

  updateSaveButtonState();
  updateFavoritesCount();
  updateFavoritesList();
}

function updateSaveButtonState() {
  if (!currentQuote) return;
  
  const isCurrentlySaved = favorites.some(fav => fav.id === currentQuote.id);
  const saveBtn = document.getElementById('save-quote');
  
  if (isCurrentlySaved) {
    saveBtn.classList.add('saved');
  } else {
    saveBtn.classList.remove('saved');
  }
}


function toggleFavorites() {
  const panel = document.getElementById('favorites-panel');
  panel.classList.toggle('open');
 
  if (panel.classList.contains('open')) {
    updateFavoritesList();
  }
}


function updateFavoritesCount() {
  const countElement = document.querySelector('.favorites-count');
  countElement.textContent = favorites.length;
}


function updateFavoritesList() {
  const listElement = document.getElementById('favorites-list');
  
  if (favorites.length === 0) {
    listElement.innerHTML = '<p class="empty-favorites">No favorite quotes yet. Save some quotes to see them here!</p>';
    return;
  }
  
  listElement.innerHTML = favorites.map(quote => `
    <div class="favorite-quote" data-id="${quote.id}">
      <div class="favorite-quote-text">"${quote.text}"</div>
      <div class="favorite-quote-author">— ${quote.author}</div>
      <button class="remove-favorite" onclick="removeFavorite(${quote.id})" title="Remove from favorites">×</button>
    </div>
  `).join('');
}


function removeFavorite(quoteId) {
  favorites = favorites.filter(fav => fav.id !== quoteId);
  localStorage.setItem('favoriteQuotes', JSON.stringify(favorites));
  
  updateFavoritesList();
  updateFavoritesCount();
  updateSaveButtonState();
  
  showNotification('Quote removed from favorites!', 'info');
}



function shareQuote() {
  if (!currentQuote) return;
  
  const shareText = `"${currentQuote.text}" — ${currentQuote.author}`;
  
  if (navigator.share) {
    navigator.share({
      title: 'Daily Dose of Wisdom',
      text: shareText,
      url: window.location.href
    });
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(shareText).then(() => {
      showNotification('Quote copied to clipboard!', 'success');
    });
  } else {

    const textArea = document.createElement('textarea');
    textArea.value = shareText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showNotification('Quote copied to clipboard!', 'success');
  }
}


function showNotification(message, type = 'info') {
  
  const existing = document.querySelector('.notification');
  if (existing) {
    existing.remove();
  }
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  

  Object.assign(notification.style, {
    position: 'fixed',
    top: '100px',
    right: '20px',
    padding: '1rem 1.5rem',
    backgroundColor: type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6',
    color: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    zIndex: '1000',
    transform: 'translateX(100%)',
    transition: 'transform 0.3s ease',
    fontSize: '0.875rem',
    fontWeight: '500'
  });
  
  document.body.appendChild(notification);
  

  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  

  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}


function showAbout() {
  const aboutContent = `
    <div style="text-align: center; max-width: 500px;">
      <h2 style="margin-bottom: 1rem; color: var(--gray-800);">About Daily Dose of Wisdom</h2>
      <p style="margin-bottom: 1rem; color: var(--gray-600); line-height: 1.6;">
        Discover daily inspiration through carefully curated quotes from history's greatest thinkers, 
        leaders, and visionaries. Save your favorites and let wisdom guide your journey.
      </p>
      <p style="color: var(--gray-500); font-size: 0.875rem;">
        Built to inspire minds one quote at a time.
      </p>
    </div>
  `;
  showModal(aboutContent);
}


function showContact() {
  const contactContent = `
    <div style="text-align: center; max-width: 500px;">
      <h2 style="margin-bottom: 1rem; color: var(--gray-800);">Contact Us</h2>
      <p style="margin-bottom: 1rem; color: var(--gray-600); line-height: 1.6;">
        Have a favorite quote you'd like to share? Found a bug? We'd love to hear from you!
      </p>
      <div style="margin: 1.5rem 0;">
        <p style="color: var(--gray-600); margin-bottom: 0.5rem;">
          <strong>Email:</strong> wisdom@dailyquotes.com
        </p>
        <p style="color: var(--gray-600);">
          <strong>Twitter:</strong> @DailyWisdomApp
        </p>
      </div>
    </div>
  `;
  showModal(contactContent);
}


function showModal(content) {

  const existingModal = document.querySelector('.modal-overlay');
  if (existingModal) {
    existingModal.remove();
  }
  
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.innerHTML = `
    <div class="modal-content">
      ${content}
      <button class="modal-close" onclick="closeModal()">Close</button>
    </div>
  `;
  

  const styles = `
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
      backdrop-filter: blur(4px);
    }
    
    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      max-width: 90vw;
      max-height: 90vh;
      overflow-y: auto;
      animation: modalSlideIn 0.3s ease;
    }
    
    .modal-close {
      background: var(--primary-color);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 500;
      margin-top: 1.5rem;
      transition: all 0.3s ease;
    }
    
    .modal-close:hover {
      background: #2563EB;
      transform: translateY(-1px);
    }
    
    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
  `;

  if (!document.querySelector('#modal-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'modal-styles';
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }
  
  document.body.appendChild(modalOverlay);
  
  // Close on overlay click
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });
  

  const escapeHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', escapeHandler);
    }
  };
  document.addEventListener('keydown', escapeHandler);
}


function closeModal() {
  const modal = document.querySelector('.modal-overlay');
  if (modal) {
    modal.remove();
  }
}


document.addEventListener('keydown', (e) => {

  if (e.code === 'Space' || e.code === 'Enter') {
    e.preventDefault();
    generateQuote();
  }

  if (e.key.toLowerCase() === 's' && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
    toggleSaveQuote();
  }
  

  if (e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
    toggleFavorites();
  }

  if (e.key.toLowerCase() === 'c' && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
    shareQuote();
  }
});

let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 100;
  const difference = touchStartX - touchEndX;
  
  if (Math.abs(difference) > swipeThreshold) {
    if (difference > 0) {

      generateQuote();
    } else {
      toggleFavorites();
    }
  }

}
