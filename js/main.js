document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#searchForm').addEventListener('submit', function (e) {
        e.preventDefault();
        let searchText = document.querySelector('#searchText').value;
        getMovies(searchText);
    })
});

function getMovies(searchText) {
    fetch('https://api.themoviedb.org/3/search/movie?api_key=47a84f440bdcd3fa959394724a74ef78&query=' + searchText)
        .then(response => response.json())
        .then((response) => {
            let movies = response.results;
            let output = '';
            movies.forEach((movie, index) => {
                output += `
                    <div class="col-md-3">
                        <div class="well text-center">
                            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}"/>
                            <h5>${movie.title}</h5>
                            <a onclick="movieSelected('${movie.id}')" class="btn btn-primary" href="#">Movie Details</a>
                        </div>
                    </div>
                `;
            });

            document.querySelector('#movies').innerHTML = output;
        })
        .catch((err) => {
            console.log(err);
        });
}

function movieSelected(id) {
    sessionStorage.setItem('movieId', id);
    window.location = 'movie.html';
    return false;
}

function getMovie() {
    movieId = sessionStorage.getItem('movieId');

    fetch('https://api.themoviedb.org/3/movie/' + movieId + '?api_key=47a84f440bdcd3fa959394724a74ef78')
        .then(response => response.json())
        .then((movie) => {
            let output = `
                <div class="row">
                    <div class="col-md-4">
                        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="thumbnail"/>
                    </div>
                    <div class="col-md-8">
                        <h2>${movie.title}</h2>
                        <ul class="list-group">
                            <li class="list-group-item"><strong>Genre: </strong>${movie.genres[0].name}, ${movie.genres[1].name}</li>
                            <li class="list-group-item"><strong>Released: </strong>${movie.release_date}</li>
                            <li class="list-group-item"><strong>Rated: </strong>${movie.vote_average}</li>
                            <li class="list-group-item"><strong>Runtime: </strong>${movie.runtime} min.</li>
                            <li class="list-group-item"><strong>Revenue: </strong>${convertToInternationalCurrencySystem(movie.revenue)}</li>
                        </ul>
                    </div>
                </div>
                <div class="row">
                    <div class="well">
                        <h3>Plot</h3>
                        ${movie.overview}
                        <hr>
                        <a href="https://www.imdb.com/title/${movie.imdb_id}" target="_blank" class="btn btn-primary">View IMDB</a>
                        <a href="index.html" class="btn btn-secondary">Go Back to Search</a>
                    </div>
                </div>
            `;

            document.querySelector('#movie').innerHTML = output;
        })
        .catch((err) => {
            console.log(err);
        });
}

function convertToInternationalCurrencySystem(labelValue) {
    // Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e+9
        ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + " B"
        // Six Zeroes for Millions 
        : Math.abs(Number(labelValue)) >= 1.0e+6
            ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + " M"
            // Three Zeroes for Thousands
            : Math.abs(Number(labelValue)) >= 1.0e+3
                ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + " K"
                : Math.abs(Number(labelValue));

}