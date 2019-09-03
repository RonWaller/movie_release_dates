const container = document.querySelector('.container');

async function getMovies() {
	let movies = [];
	const api = '9460c3936e9e9f9d5fd2b7f0b50f733b';
	const year = '2019';

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

getMovies()
	.then(movies => {
		console.log('movies:', movies);
		return buildContent(movies);
	})
	.catch(err => console.log(err));

function buildContent(movies) {
	movies.forEach(movie => {
		image_baseurl = 'http://image.tmdb.org/t/p/';
		poster_size = 'w154';
		let date = moment(movie.release_date, 'YYYY/MM/DD').format('LL');
		const card = document.createElement('div');
		card.classList.add('card');
		const movieInfo = document.createElement('div');
		movieInfo.classList.add('movie__info');
		const img = document.createElement('img');
		img.src = `${image_baseurl}${poster_size}${movie.poster_path}`;
		img.alt = `${movie.original_title}`;
		const ul = document.createElement('ul');
		const firstItem = document.createElement('li');
		firstItem.innerHTML = `${date}`;
		const secondItem = document.createElement('li');
		secondItem.innerHTML = `<a href="#">More Info</a>`;
		const movieDescription = document.createElement('div');
		movieDescription.classList.add('movie__description');
		const p = document.createElement('p');
		p.innerHTML = `${movie.overview}`;
		ul.appendChild(firstItem);
		ul.appendChild(secondItem);
		movieInfo.appendChild(img);
		movieInfo.appendChild(ul);
		movieDescription.appendChild(p);
		card.appendChild(movieInfo);
		card.appendChild(movieDescription);
		container.appendChild(card);
	});
}
