const axios = require('axios');
const moment = require('moment');

// require('dotenv').config();

const movie_details = document.querySelector('.movie_details');
const movieID = localStorage.getItem('id');
const image_baseurl = 'https://image.tmdb.org/t/p/';

document.addEventListener('click', e => {
  if (e.target && e.target.id === 'goback') {
    window.location.href = './index.html';
  }
});

async function movieDetails(ID) {
  const api = process.env.API_KEY;
  const id = parseInt(ID);
  const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${api}&language=en-US&append_to_response=release_dates,credits`;
  const { data } = await axios.get(url);
  return data;
}

function buildDetail(movie) {
  movie_details.style.backgroundImage = `url('${image_baseurl}original${movie.backdrop_path}')`;
  const poster_size = 'w342';

  const actors_html = getActors(movie);
  const dateInfo = getReleaseDateInfo(movie);
  const rating = getRating(dateInfo);
  const runtime = getRuntime(movie);
  const budget = getCurrency(movie.budget);
  const revenue = getCurrency(movie.revenue);
  const genre = getGenres(movie);
  const releaseInfo = getReleaseInfo(dateInfo);

  const html = `
    <div class="big_card">
      <div id='goback' class='goback'>&#x2190; Go Back</div>
      <div class="movie_poster">
        <img src="${image_baseurl}${poster_size}${movie.poster_path}" alt="">
      </div>
      <div class="detailed_info">
        <!-- movie information goes here -->
        <h2>${movie.title}</h2>
				<p>${movie.overview}</p>
				<div class='ratetime'>
				<h4>Rated:</h4>
				<span>${rating}</span>
				<h4>Runtime:</h4>
				<span>${runtime}</span>
				</div>
				<div class='cash'>
				<h4>Budget:</h4>
				<span>${budget}</span>
				<h4>Revenue:</h4>
				<span>${revenue}</span>
				</div>
				<div class='genre'>
				<h4>Genres:</h4>
				<ul>${genre}</ul>
				</div>
				<div class='dates' >
				<h4>Release Dates:</h4>
				${releaseInfo}
				</div>
			</div>
      <div class='movie_actors'>
        ${actors_html}
      </div>
    </div>`;
  movie_details.innerHTML = html;
}

function getActors(movie) {
  const credits = movie.credits.cast;
  credits.splice(5, credits.length);
  // <img src="${url}" alt="${actor.name}" />
  const html = credits
    .map(actor => {
      const url = `${image_baseurl}w185${actor.profile_path}`;
      const htmlString = `
			<div class="actor">
				<div class='actorImage' style="background-image: url('${url}')"></div>
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
    maximumFractionDigits: 0,
  });
  return formatter.format(currency);
}

function getReleaseDateInfo(movie) {
  const { results } = movie.release_dates;
  const release_dates = results
    .filter(iso => iso.iso_3166_1 === 'US')
    .map(item => item.release_dates);

  return release_dates[0];
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

      const htmlString = `<span>${type}</span><span>${date}</span>`;
      return htmlString;
    })
    .join('');
  return html;
}

function getRating(dateInfo) {
  let rating = dateInfo.map(rate => {
    if (rate.certification !== '') {
      return rate.certification;
    }
  });

  if (rating.length > 1) {
    rating = rating.filter(element => element !== undefined);
    rating.splice(1, rating.length);
  }

  return rating;
}

function getRuntime(movie) {
  const time = movie.runtime;
  const hours = Math.floor(time / 60);
  const mins = time % 60;
  const timeStr = hours > 1 ? 'hours' : 'hour';
  const html = `${hours} ${timeStr} ${mins} minutes`;
  return html;
}

function getGenres(movie) {
  const genres = movie.genres
    .map(item => {
      const html = `<li>${item.name}</li>`;
      return html;
    })
    .join('');

  return genres;
}

movieDetails(movieID)
  .then(movie => {
    document.title = `${movie.title} | The Movie Island `;
    return buildDetail(movie);
  })
  .catch(err => console.log(err));
