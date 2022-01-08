const API_KEY = 'api_key=47a84f440bdcd3fa959394724a74ef78';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const CURR_POPS = '/discover/movie?sort_by=popularity.desc&';

// obtained from /genre/movie/list api call - tmdb api
const genres = [
    {
        "id": 28,
        "name": "Action"
    },
    {
        "id": 12,
        "name": "Adventure"
    },
    {
        "id": 16,
        "name": "Animation"
    },
    {
        "id": 35,
        "name": "Comedy"
    },
    {
        "id": 80,
        "name": "Crime"
    },
    {
        "id": 99,
        "name": "Documentary"
    },
    {
        "id": 18,
        "name": "Drama"
    },
    {
        "id": 10751,
        "name": "Family"
    },
    {
        "id": 14,
        "name": "Fantasy"
    },
    {
        "id": 36,
        "name": "History"
    },
    {
        "id": 27,
        "name": "Horror"
    },
    {
        "id": 10402,
        "name": "Music"
    },
    {
        "id": 9648,
        "name": "Mystery"
    },
    {
        "id": 10749,
        "name": "Romance"
    },
    {
        "id": 878,
        "name": "Science Fiction"
    },
    {
        "id": 10770,
        "name": "TV Movie"
    },
    {
        "id": 53,
        "name": "Thriller"
    },
    {
        "id": 10752,
        "name": "War"
    },
    {
        "id": 37,
        "name": "Western"
    }
];

document.querySelector('#searchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    let searchText = document.querySelector('#searchText').value;

    if (searchText) {
        getMovies(searchText);
    }
});


function getMovies(searchText) {
    let url = BASE_URL;

    if (searchText) {
        url += '/search/movie?' + API_KEY + '&query=' + searchText;
    } else {
        url += CURR_POPS + API_KEY;
    }

    // 'https://api.themoviedb.org/3/search/movie?api_key=47a84f440bdcd3fa959394724a74ef78&query=' + searchText

    fetch(url)
        .then(response => response.json())
        .then((response) => {
            let movies = response.results;
            let output = '';
            // <a onclick="movieSelected('${movie.id}')" class="btn btn-primary" href="#">Movie Details</a>
            movies.forEach((movie, index) => {
                output += `
                    <div class="col-md-3">
                        <div onclick="movieSelected('${movie.id}')" class="well movie-card">
                            <img src="${IMG_URL + movie.poster_path}"/>
                            <div class="movie-info">
                                <h5>${movie.title}</h5>
                                <span class="${getClassByRate(movie.vote_average)}">${movie.vote_average}</span>
                            </div>
                            <div class="overview">
                                <h6>Overview</h6>
                                ${movie.overview}
                            </div>
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

    let url = BASE_URL + '/movie/' + movieId + '?' + API_KEY;

    // 'https://api.themoviedb.org/3/movie/' + movieId + '?api_key=47a84f440bdcd3fa959394724a74ef78'

    fetch(url)
        .then(response => response.json())
        .then((movie) => {
            let output = `
                <div class="row">
                    <div class="col-md-4">
                        <img src="${IMG_URL + movie.poster_path}" class="thumbnail"/>
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
                        <a href="index.html" class="btn btn-default">Go Back to Search</a>
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
        ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + ' B'
        // Six Zeroes for Millions 
        : Math.abs(Number(labelValue)) >= 1.0e+6
            ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + ' M'
            // Three Zeroes for Thousands
            : Math.abs(Number(labelValue)) >= 1.0e+3
                ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + ' K'
                : Math.abs(Number(labelValue));

}

function getClassByRate(vote) {
    if (vote >= 8) {
        return 'lightgreen';
    } else if (vote >= 5) {
        return 'orange';
    } else {
        return 'red';
    }
}