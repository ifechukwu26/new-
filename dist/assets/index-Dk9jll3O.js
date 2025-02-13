(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const s of e)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function i(e){const s={};return e.integrity&&(s.integrity=e.integrity),e.referrerPolicy&&(s.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?s.credentials="include":e.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(e){if(e.ep)return;e.ep=!0;const s=i(e);fetch(e.href,s)}})();const a=12;class l{constructor(){this.searchForm=document.getElementById("searchForm"),this.searchInput=document.getElementById("searchInput"),this.resultsContainer=document.getElementById("resultsContainer"),this.loadingElement=document.getElementById("loading"),this.currentSearch="",this.startIndex=0,this.isLoading=!1,this.init()}init(){this.searchForm.addEventListener("submit",t=>{t.preventDefault(),this.handleSearch()}),window.addEventListener("scroll",()=>{window.innerHeight+window.scrollY>=document.body.offsetHeight-1e3&&this.loadMoreBooks()})}async handleSearch(){const t=this.searchInput.value.trim();t&&(this.currentSearch=t,this.startIndex=0,this.resultsContainer.innerHTML="",await this.fetchBooks())}async loadMoreBooks(){!this.isLoading&&this.currentSearch&&(this.startIndex+=a,await this.fetchBooks())}async fetchBooks(){if(!this.isLoading){this.isLoading=!0,this.loadingElement.classList.remove("hidden");try{const t=`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(this.currentSearch)}&startIndex=${this.startIndex}&maxResults=${a}`,r=await(await fetch(t)).json();r.items&&this.displayResults(r.items)}catch(t){console.error("Error fetching books:",t)}finally{this.isLoading=!1,this.loadingElement.classList.add("hidden")}}}displayResults(t){t.forEach(i=>{const{title:r,authors:e=["Unknown Author"],imageLinks:s={},previewLink:o}=i.volumeInfo,n=document.createElement("article");n.className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105",n.innerHTML=`
                <div class="aspect-w-2 aspect-h-3 bg-gray-200">
                    <img 
                        src="${s.thumbnail||"/placeholder-book.png"}"
                        alt="${r}"
                        class="object-cover w-full h-full"
                        loading="lazy"
                    >
                </div>
                <div class="p-4">
                    <h2 class="text-lg font-semibold line-clamp-2 mb-2">${r}</h2>
                    <p class="text-gray-600 text-sm mb-4">${e.join(", ")}</p>
                    <a 
                        href="${o}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                    >
                        View Details
                    </a>
                </div>
            `,this.resultsContainer.appendChild(n)})}}new l;
