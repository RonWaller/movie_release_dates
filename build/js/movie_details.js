const movie_details = document.querySelector('.movie_details');
const movieID = (movie_details.innerHTML = localStorage.getItem('id'));
const image_baseurl = 'https://image.tmdb.org/t/p/';

async function movieDetails(movieID) {
	const api = '9460c3936e9e9f9d5fd2b7f0b50f733b';
	const id = parseInt(movieID);
	let url = `https://api.themoviedb.org/3/movie/${id}?api_key=${api}&language=en-US&append_to_response=release_dates,credits`;
	const { data } = await axios.get(url);
	return data;
}

function buildDetail(movie) {
	movie_details.style.backgroundImage = `url('${image_baseurl}original${movie.backdrop_path}')`;
	const poster_size = 'w342';

	const actors_html = getActors(movie);
	const dateInfo = getReleaseDateInfo(movie);
	const rating = getRating(dateInfo);
	const budget = getCurrency(movie.budget);
	const revenue = getCurrency(movie.revenue);
	const releaseInfo = getReleaseInfo(dateInfo);

	const html = `
    <div class="big_card">
      <div onclick='goBack()' class='goback'>&#x2190; Go Back</div>
      <div class="movie_poster">
        <img src="${image_baseurl}${poster_size}${movie.poster_path}" alt="">
      </div>
      <div class="detailed_info">
        <!-- movie information goes here -->
        <h2>${movie.title}</h2>
				<p>${movie.overview}</p>
				<h4>Budget:</h4>
				<span>${budget}</span>
				<h4>Revenue:</h4>
				<span>${revenue}</span>
				<h4>Rated:</h4>
				<span>${rating}</span>
				<h4>Release Dates:</h4>
				${releaseInfo}
			</div>
      <div class='movie_actors'>
        ${actors_html}
      </div>
    </div>`;
	movie_details.innerHTML = html;
}

function getActors(movie) {
	const credits = movie.credits.cast;
	credits.splice(5, 43);
	const html = credits
		.map(actor => {
			const url = `${image_baseurl}w92${actor.profile_path}`;
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
	return html;
}

function getCurrency(currency) {
	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	});
	return formatter.format(currency);
}

function getReleaseDateInfo(movie) {
	const release_dates = movie.release_dates.results;
	const release_date = release_dates.filter(iso => {
		if (iso.iso_3166_1 === 'US') {
			return iso.release_dates;
		}
	});

	const dates = release_date.map(item => {
		return item.release_dates;
	});

	return dates[0];
}

function getReleaseInfo(dateInfo) {
	const html = dateInfo
		.map(item => {
			const date = moment(item.release_date, 'YYYY/MM/DD').format('LL');
			const type =
				item.type === 1
					? 'Premiere'
					: item.type === 2
					? 'Theatrical (limited)'
					: item.type === 3
					? 'Theatrical'
					: item.type === 4
					? 'Digital'
					: item.type === 5
					? 'Physical'
					: 'TV';

			const htmlString = `<span>${type}</span><span>${date}</span>
		
		`;
			return htmlString;
		})
		.join('');
	return html;
}

function getRating(dateInfo) {
	let rating = dateInfo.map(rate => {
		if (rate.certification != '') {
			return rate.certification;
		}
	});

	if (rating.length > 1) {
		rating = rating.filter(element => {
			return element !== undefined;
		});
		rating.splice(1, rating.length);
	}

	return rating;
}

function goBack() {
	window.location.href = './index.html';
}

movieDetails(movieID)
	.then(movie => {
		console.log(movie);
		document.title = `${movie.title} | The Movie Island `;
		return buildDetail(movie);
	})
	.catch(err => console.log(err));
