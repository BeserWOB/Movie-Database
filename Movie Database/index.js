const contentContainer = document.getElementById('content-container');
const startThumbnail = document.getElementById('start-thumbnail');
const errorMessage = document.getElementById('message');
const contents = document.querySelectorAll('.content');
let typeSelector = document.getElementById('type-selector');
let latestMovieIDs = [];
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

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
        <button class="watchlist-btn" id="${data.imdbID}" data-watchlistBtn="${data.imdbID}"><i class="fas fa-plus-circle"></i> Watchlist</button>
        <p class="movie-year">${data.Year}</p>
      </div>

      <p class="movie-description">${data.Plot}<p class="movie-description">${data.Plot}</p></p>
    </div>
  `;
}
////////////////////////////////////* EVENT LISTENER  *///////////////////////////////////////////////////
document.addEventListener('click', (e)=>{
  ///////////////////////////////POSTER TO OPEN NEW TAB ON IMDB/////////////////////////////////////////////
        const moviePosterImdbLink = e.target.dataset.poster; 
          if(moviePosterImdbLink){
            window.open(`https://www.imdb.com/title/${moviePosterImdbLink}/`, '_blank');
          }
/////////////////////////////////BUTTON ADDS ITEMS TO WATCHLIST///////////////////////////////////////////
    if(e.target.dataset.watchlistbtn){
            let btnId = e.target.id;
            let movieId = e.target.dataset.watchlistbtn;
            if(btnId === movieId){
                document.getElementById(btnId).innerHTML = `<p class="on-the-list">On the list.</p>`
            }
            addToWatchlist(movieId);
        }
    })
    function addToWatchlist(movieId){
        let watchlistMovieId = movieId;
        if(!watchlist.includes(movieId)){
            watchlist.unshift(watchlistMovieId)
        }
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////

function getMoviesArray(IDs) {
    contentContainer.innerHTML = '';
    Promise.all(
        IDs.map(ID => fetch(`https://www.omdbapi.com/?apikey=74e682a0&i=${ID}&plot=short`)
                .then(response => response.json())))
                .then(movies => {
                    movies.forEach(movie => renderMovies(movie));
        })
    }
function getMovieIDs(event) {
  event.preventDefault();
  latestMovieIDs = [];
  const searchText = document.getElementById("search-text").value;
  fetch(`https://www.omdbapi.com/?apikey=74e682a0&s=${searchText}&plot=short&type=${typeSelector.value}`)
    .then(response => response.json())
    .then(data => {
          if (data.Response === "False") {
                contentContainer.innerHTML = '';
                startThumbnail.style.display = 'none';
                errorMessage.style.display = 'block';
    
          } else {
            latestMovieIDs = data.Search.map(movie => movie.imdbID);
                getMoviesArray(latestMovieIDs);
                startThumbnail.style.display = 'none';
                errorMessage.style.display = 'none';
          }
        })
}
document.getElementById("search-form").addEventListener("submit", getMovieIDs);