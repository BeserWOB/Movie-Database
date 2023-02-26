let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
const contentContainer = document.getElementById('content-container');
const emptyMessage = document.getElementById('empty-message')


//////////////////////* ADD EVENT LISTENER DOCUMENT *////////////////////////////////////
document.addEventListener('click', (e)=>{
    const watchlistMovieId = e.target.dataset.watchlistbtn;
    const moviePosterImdbLink = e.target.dataset.poster; 
///////////////////////////////POSTER TO OPEN NEW TAB ON IMDB////////////////////////////
        if(moviePosterImdbLink){
          window.open(`https://www.imdb.com/title/${moviePosterImdbLink}/`, '_blank');
        }
///////////////////////////////REMOVE FROM WATCHLIST BUTTON//////////////////////////////
        if(watchlistMovieId){
        rmvFromWatchlist(watchlistMovieId)
        };
            function rmvFromWatchlist(movieId){
                const index = watchlist.findIndex(item => item === watchlistMovieId);
                if (index !== -1) {
                    watchlist.splice(index, 1);
                    localStorage.setItem('watchlist', JSON.stringify(watchlist));
                    getMoviesArray(watchlist);
                }};
            if(watchlist.length === 0){
                emptyMessage.style.display = 'block'
            }   
})
///////////////////////////////////////////////////////////////////////////////////////////
function renderMovies(data) {
  contentContainer.innerHTML += `
    <div class="content">
      <div class="movie-poster">
        <img src="${data.Poster}" alt="poster" onerror="this.onerror=null; this.src='/img/question-mark.png';" data-poster="${data.imdbID}">
      </div>

      <div class="title-and-rating">
        <a href="https://www.imdb.com/title/${data.imdbID}/" class="movie-title" target=”_blank”>${data.Title}</a>
        <p class="movie-rating">⭐️ ${data.imdbRating}</p>
      </div>
      
      <div class="runtime-genre-btn-year">
        <p class="movie-runtime">${data.Runtime}</p>
        <p class="movie-genre">${data.Genre}</p>
        <button class="watchlist-btn" data-watchlistBtn="${data.imdbID}"><i class="fas fa-minus-circle"></i> Watchlist</button>
        <p class="movie-year">${data.Year}</p>
        </div>

      <p class="movie-description">${data.Plot}</p>
    </div>
  `;
}
function getMoviesArray(IDs, plot) {
    
    contentContainer.innerHTML = ``
    Promise.all(
        IDs.map(ID =>
            fetch(`https://www.omdbapi.com/?apikey=74e682a0&i=${ID}&plot=${plot}`)
                .then(response => response.json())
            )
        )
                .then(movies => {
                    movies.forEach(movie => renderMovies(movie));
        })
    }
    
    
    if(watchlist.length === 0){
            emptyMessage.style.display = "block";   
        } else {
            emptyMessage.style.display = "none";   
        }

    getMoviesArray(watchlist, 'short')