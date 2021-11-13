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
        })
}