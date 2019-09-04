const year = '2019';
const container = document.querySelector('.container');
const movieYear = document.querySelector('.movie_year');

async function getMovies(year) {
	let movies = [];
	const api = '9460c3936e9e9f9d5fd2b7f0b50f733b';

	for (i = 1; i < 4; i++) {
		let url = `https://api.themoviedb.org/3/discover/movie?api_key=${api}b&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page= ${i} &primary_release_year= ${year}`;
		const response = await axios.get(url);
		const { data } = response;
		const results = data.results;
		results.forEach(item => {
			movies.push(item);
		});
	}
	movies.splice(50, 10);
	return movies;
}

function buildContent(movies) {
	image_baseurl = 'https://image.tmdb.org/t/p/';
	poster_size = 'w154';
	const html = movies
		.map(movie => {
			let date = moment(movie.release_date, 'YYYY/MM/DD').format('LL');
			const htmlString = `
				<div class="card">
					<div class="movie__info">
						<img src="${image_baseurl}${poster_size}${movie.poster_path}" alt="${movie.original_title}">
						<ul>
							<li>${date}</li>
							<li><a href="#">More Info</a></li>
						</ul>
					</div>
					<div class="movie__description">
						<p>${movie.overview}</p>
					</div>
				</div>`;
			return htmlString;
		})
		.join('');
	container.innerHTML = html;
}

function init(year) {
	getMovies(year)
		.then(movies => {
			return buildContent(movies);
		})
		.catch(err => console.log(err));
}

document.addEventListener('DOMContentLoaded', init(year));

movieYear.addEventListener('click', e => {
	const target = e.target;
	if (target.tagName === 'LI') {
		const activeElement = movieYear.querySelector('.active');
		if (activeElement) {
			activeElement.classList.remove('active');
		}
		if (activeElement !== target) {
			target.classList.add('active');
			const targetYear = target.innerHTML;
			init(targetYear);
		}
	}
});
