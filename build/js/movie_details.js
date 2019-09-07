const movie_details = document.querySelector('.movie_details');
const movieID = (movie_details.innerHTML = localStorage.getItem('id'));

async function movieDetails(movieID) {
	const api = '9460c3936e9e9f9d5fd2b7f0b50f733b';
	const id = parseInt(movieID);
	let url = `https://api.themoviedb.org/3/movie/${id}?api_key=${api}&language=en-US&append_to_response=release_dates,credits`;
	const response = await axios.get(url);
	const { data } = response;
	return data;
}

function buildDetail(movie) {
	image_baseurl = 'https://image.tmdb.org/t/p/';
	poster_size = 'w342';
	document.title = `${movie.title} | The Movie Island `;
	movie_details.style.backgroundImage = `url('${image_baseurl}original${movie.backdrop_path}')`;
	const credits = movie.credits.cast;
	credits.splice(5, 43);
	const actors_html = credits
		.map(actor => {
			const url = `${image_baseurl}w154${actor.profile_path}`;
			const htmlString = `
    <div class="actor">
				<img src="${url}" alt="${actor.name}" />
				<h4>${actor.name}</h4>
				<h6>${actor.character}</h6>
		</div>
    `;
			return htmlString;
		})
		.join('');
	console.log(credits);
	const html = `
    <div class="big_card">
      <div class='goback'><-- Go Back</div>
      <div class="movie_poster">
        <img src="${image_baseurl}${poster_size}${movie.poster_path}" alt="">
      </div>
      <div class="detailed_info">
        <!-- movie information goes here -->
        <h2>${movie.title}</h2>
        <p>${movie.overview}</p>
      </div>
      <div class='movie_actors'>
        ${actors_html}
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
