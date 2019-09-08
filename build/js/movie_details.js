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
	const image_baseurl = 'https://image.tmdb.org/t/p/';
	const poster_size = 'w342';
	const credits = movie.credits.cast;

	document.title = `${movie.title} | The Movie Island `;
	movie_details.style.backgroundImage = `url('${image_baseurl}original${movie.backdrop_path}')`;

	credits.splice(5, 43);

	const actors_html = credits
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

	const release_dates = movie.release_dates.results;
	const dateInfo = getReleaseDates(release_dates);
	console.log('dataInfo:', dateInfo);
	const rating = getRating(dateInfo);
	console.log('rating:', rating);

	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	});

	const budget = formatter.format(movie.budget);
	const revenue = formatter.format(movie.revenue);

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
				<h4>Revenue</h4>
				<span>${revenue}</span>

      </div>
      <div class='movie_actors'>
        ${actors_html}
      </div>
    </div>`;
	movie_details.innerHTML = html;
}

function getReleaseDates(release_dates) {
	const release_date = release_dates.filter(iso => {
		if (iso.iso_3166_1 === 'US') {
			console.log('iso:', iso);
			return iso.release_dates;
		}
	});
	console.log('returned:', release_date);

	const dates = release_date.map(item => {
		return item.release_dates;
	});
	return dates[0];
	console.log('dates:', dates);
}

function getRating(dateInfo) {
	let rating = dateInfo.map(rate => {
		if (rate.certification != '') {
			return rate.certification;
		}
	});

	console.log(rating);
	if (rating.length > 1) {
		console.log('Your Mom');
		rating = rating.filter(element => {
			return element !== undefined;
		});
		rating.splice(1, rating.length);
	}

	// var uniq = [...new Set(rating)];
	//

	console.log(rating.length);
	console.log('func-rating:', rating);
	return rating;
}

function goBack() {
	window.location.href = './index.html';
}

movieDetails(movieID)
	.then(movie => {
		console.log(movie);
		return buildDetail(movie);
	})
	.catch(err => console.log(err));
