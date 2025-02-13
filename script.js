const apiKey = 'AIzaSyDORu-fU-Vt3lgBZNrY9yFzao-g_wV1eik';
const BATCH_SIZE = 12; // Number of books to load per batch

class BookLibrary {
    constructor() {
        this.searchForm = document.getElementById('searchForm');
        this.searchInput = document.getElementById('searchInput');
        this.resultsContainer = document.getElementById('resultsContainer');
        this.loadingElement = document.getElementById('loading');
        this.currentSearch = '';
        this.startIndex = 0;
        this.isLoading = false;

        this.init();
    }

    init() {
        this.searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSearch();
        });

        // Infinite scroll
        window.addEventListener('scroll', () => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1000) {
                this.loadMoreBooks();
            }
        });
    }

    async handleSearch() {
        const searchTerm = this.searchInput.value.trim();
        if (!searchTerm) return;

        this.currentSearch = searchTerm;
        this.startIndex = 0;
        this.resultsContainer.innerHTML = '';
        await this.fetchBooks();
    }

    async loadMoreBooks() {
        if (!this.isLoading && this.currentSearch) {
            this.startIndex += BATCH_SIZE;
            await this.fetchBooks();
        }
    }

    async fetchBooks() {
        if (this.isLoading) return;

        this.isLoading = true;
        this.loadingElement.classList.remove('hidden');

        try {
            const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(this.currentSearch)}&startIndex=${this.startIndex}&maxResults=${BATCH_SIZE}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.items) {
                this.displayResults(data.items);
            }
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            this.isLoading = false;
            this.loadingElement.classList.add('hidden');
        }
    }

    displayResults(books) {
        books.forEach(book => {
            const { title, authors = ['Unknown Author'], imageLinks = {}, previewLink } = book.volumeInfo;
            
            const bookCard = document.createElement('article');
            bookCard.className = 'bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105';
            
            bookCard.innerHTML = `
                <div class="aspect-w-2 aspect-h-3 bg-gray-200">
                    <img 
                        src="${imageLinks.thumbnail || '/placeholder-book.png'}"
                        alt="${title}"
                        class="object-cover w-full h-full"
                        loading="lazy"
                    >
                </div>
                <div class="p-4">
                    <h2 class="text-lg font-semibold line-clamp-2 mb-2">${title}</h2>
                    <p class="text-gray-600 text-sm mb-4">${authors.join(', ')}</p>
                    <a 
                        href="${previewLink}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                    >
                        View Details
                    </a>
                </div>
            `;

            this.resultsContainer.appendChild(bookCard);
        });
    }
}

// Initialize the library
new BookLibrary();