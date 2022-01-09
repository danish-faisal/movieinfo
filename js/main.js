const API_KEY = 'api_key=47a84f440bdcd3fa959394724a74ef78';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const CURR_POPS = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const searchURL = BASE_URL + '/search/movie?' + API_KEY;

const searchForm = document.querySelector('#searchForm');
const tagsEl = document.getElementById('tags');
const prev = document.getElementById('prev');
const curr = document.getElementById('current');
const next = document.getElementById('next');
const overlayContent = document.getElementById('overlay-content');
const leftArrow = document.getElementById('left-arrow');
const rightArrow = document.getElementById('right-arrow');

let prevPage = 0;
let currentPage = 0;
let nextPage = 0;
let totalPages = 0;
let lastPage = 500; // limit by TMDB API
let lastUrl = '';
let activeSlide = 0;
let totalVideos = 0;

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
const selectedGenres = {};

searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let searchText = document.querySelector('#searchText').value;

    if (searchText) {
        let url = searchURL + '&query=' + searchText;
        for (var id in selectedGenres) delete selectedGenres[id];
        setGenres();
        getMovies(url);
    }
});


function getMovies(url) {
    lastUrl = url;
    // 'https://api.themoviedb.org/3/search/movie?api_key=47a84f440bdcd3fa959394724a74ef78&query=' + searchText

    fetch(url)
        .then(response => response.json())
        .then((response) => {
            const moviesContainer = document.querySelector('#movies');
            totalPages = response.total_pages;
            currentPage = response.page;
            nextPage = currentPage + 1;
            prevPage = currentPage - 1;

            curr.innerText = currentPage;

            if (currentPage <= 1) {
                prev.classList.add('disabled');
                next.classList.remove('disabled');
            } else if (currentPage >= lastPage) {
                prev.classList.remove('disabled');
                next.classList.add('disabled');
            } else {
                prev.classList.remove('disabled');
                next.classList.remove('disabled');
            }

            searchForm.scrollIntoView({ behavior: 'smooth' });

            let movies = response.results;
            let output = '';
            // <a onclick="movieSelected('${movie.id}')" class="btn btn-primary" href="#">Movie Details</a>
            if (movies.length == 0) {
                output += '<h1 class="no-results">No Results Found</h1>';
                moviesContainer.classList.add('no-results');
            } else {
                moviesContainer.classList.remove('no-results');
                movies.forEach((movie) => {
                    output += `
                    <div class="col-md-3">
                        <div onclick="checkVideos('${movie.id}', '${movie.title}')" class="well movie-card" title="Check Videos">
                            <img src="${movie.poster_path ? IMG_URL + movie.poster_path : "https://via.placeholder.com/1080x1580"}"/>
                            <div class="movie-info">
                                <h5>${movie.title}</h5>
                                <span class="${getClassByRate(movie.vote_average)}">${movie.vote_average}</span>
                            </div>
                            <div class="overview">
                                <button onclick="movieSelected('${movie.id}')" class="know-more" title="Know More">Know More</button>
                                <br/>
                                <h6>Overview</h6>
                                ${movie.overview}
                            </div>
                        </div>
                    </div>
                `;
                });
            }
            moviesContainer.innerHTML = output;
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

function setGenres() {
    tagsEl.innerHTML = '';
    genres.forEach(genre => {
        const tag = document.createElement('div');
        tag.id = genre.id;
        tag.innerText = genre.name;
        tag.classList.add('tag');
        tag.addEventListener('click', () => {
            if (selectedGenres[genre.id]) {
                delete selectedGenres[genre.id];
            } else {
                selectedGenres[genre.id] = true;
            }
            getMovies(CURR_POPS + '&with_genres=' + Object.keys(selectedGenres).join(','));
            highlightSelection();
        });
        tagsEl.append(tag);
    })
}

function highlightSelection() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove('highlight');
    });

    clearBtn();

    Object.keys(selectedGenres).forEach(id => {
        const toHighlight = document.getElementById(id);
        toHighlight.classList.add('highlight');
    });
}

function clearBtn() {
    let clearBtn = document.getElementById('clear');
    if (clearBtn) {
        clearBtn.classList.add('highlight');
        if (Object.keys(selectedGenres).length == 0) {
            clearBtn.remove();
        }
    } else {
        let clear = document.createElement('div');
        clear.classList.add('tag', 'highlight');
        clear.id = 'clear';
        clear.innerText = 'Clear x';
        clear.addEventListener('click', () => {
            for (var id in selectedGenres) delete selectedGenres[id];
            setGenres();
            getMovies(CURR_POPS);
        });
        tagsEl.append(clear);
    }
}

prev.addEventListener('click', () => {
    if (prevPage > 0) {
        pageCall(prevPage);
    }
});

next.addEventListener('click', () => {
    if (nextPage <= totalPages) {
        pageCall(nextPage);
    }
});

function pageCall(pageNo) {
    let url = '';
    if (!lastUrl.includes('page=')) {
        url += lastUrl + '&page=' + pageNo;
    } else {
        let currPage = `page=${currentPage}`;
        url += lastUrl.replace(currPage, 'page=' + pageNo);
    }
    getMovies(url);
}

function checkVideos(movie_id, movie_name) {
    console.log(movie_id, movie_name);
    openNav(movie_id, movie_name);
}

/* Open when someone clicks on the span element */
function openNav(movie_id, movie_name) {
    fetch(BASE_URL + `/movie/${movie_id}/videos?` + API_KEY)
        .then(res => res.json())
        .then(videoData => {
            console.log(videoData);
            if (videoData && videoData.results.length > 0) {
                let embed = [];
                let dots = [];
                videoData.results.forEach((video, idx) => {
                    let { name, key, site } = video;
                    if (site == 'YouTube') {
                        embed.push(`
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hideVid"
                        frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen></iframe>
                        `);

                        dots.push(`<span class="dot">${idx + 1}</span>`)
                    }
                });
                let content = '';
                if (embed.length > 0) {
                    content += `
                    <h1 class="no-results">${movie_name}</h1>
                    <br/>
                    ${embed.join('')}
                    <br/>
                    <div class="dots">${dots.join('')}</div>
                `;
                } else {
                    content += '<h1 class="no-results">No Results Found</h1>';
                }
                overlayContent.innerHTML = content;
                activeSlide = 0;
                showVideos();
            } else {
                overlayContent.innerHTML = '<h1 class="no-results">No Results Found</h1>';
            }
        });

    document.getElementById('myNav').style.width = '100%';
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
    document.getElementById('myNav').style.width = '0%';
}

function showVideos() {
    let embedClasses = document.querySelectorAll('.embed');
    let dots = document.querySelectorAll('.dot');
    totalVideos = embedClasses.length;
    embedClasses.forEach((embedTag, idx) => {
        if (idx == activeSlide) {
            embedTag.classList.add('showVid');
            embedTag.classList.remove('hideVid');
            dots[idx].classList.add('highlightDot');
        } else {
            embedTag.classList.remove('showVid');
            embedTag.classList.add('hideVid');
            dots[idx].classList.remove('highlightDot');
        }
    });
}

leftArrow.addEventListener('click', () => {
    if (activeSlide > 0) {
        activeSlide--;
    } else {
        activeSlide = totalVideos - 1;
    }
    showVideos();
});

rightArrow.addEventListener('click', () => {
    if (activeSlide < totalVideos - 1) {
        activeSlide++;
    } else {
        activeSlide = 0;
    }
    showVideos();
});