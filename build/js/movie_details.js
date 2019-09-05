const movie_details = document.querySelector('.movie_details');
const movieID = (movie_details.innerHTML = localStorage.getItem('id'));

async function movieDetails(movieID) {
	const api = '9460c3936e9e9f9d5fd2b7f0b50f733b';
	const id = parseInt(movieID);
	let url = `https://api.themoviedb.org/3/movie/${id}?api_key=${api}&language=en-US&append_to_response=release_dates`;
	const response = await axios.get(url);
	const { data } = response;
	// const results = data.results;
	console.log(data);
	return data;
}

function buildDetail(movie) {
	image_baseurl = 'https://image.tmdb.org/t/p/';
	poster_size = 'w342';
	document.title = `${movie.title} | The Movie Island `;
	const html = `
    <div class="big_card">
      <div class="movie_poster">
        <img src="${image_baseurl}${poster_size}${movie.poster_path}" alt="">
      </div>
      <div class="detailed_info">
        <!-- movie information goes here -->
        <h3>${movie.title}</h3>
        <p>${movie.overview}</p>
      </div>
    </div>`;
	movie_details.innerHTML = html;
}

movieDetails(movieID)
	.then(movie => {
		console.log(movie);
		return buildDetail(movie);
	})
	.catch(err => console.log(err));
