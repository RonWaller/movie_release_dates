const axios = require('axios');
const moment = require('moment');

// require('dotenv').config();

const year = '2019';
let movieID = '';
const container = document.querySelector('.container');
const movieYear = document.querySelector('.movie_year');

function init(year) {
  getMovies(year)
    .then(movies => buildContent(movies))
    .catch(err => console.log(err));
}

async function getMovies(year) {
  const movies = [];
  const api = process.env.API_KEY;

  for (let i = 1; i < 4; i++) {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${api}&language=en-US&region=US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${i}&primary_release_year=${year}`;
    const response = await axios.get(url);
    const { data } = response;
    const { results } = data;
    results.forEach(item => {
      movies.push(item);
    });
  }
  movies.splice(50, 10);
  return movies;
}

function buildContent(movies) {
  const image_baseurl = 'https://image.tmdb.org/t/p/';
  const poster_size = 'w154';
  const html = movies
    .map(movie => {
      const date = moment(movie.release_date, 'YYYY/MM/DD').format('LL');
      const htmlString = `
				<div class="card">
					<div class="movie__info">
						<img src="${image_baseurl}${poster_size}${movie.poster_path}" alt="${movie.original_title}">
						<ul id='info'>
							<li>${date}</li>
							<li id='moreInfo' data-movie-id="${movie.id}">More Info</li>
						</ul>
					</div>
					<div class="movie__description">
						<h5>${movie.title}</h5>
						<p>${movie.overview}</p>
					</div>
				</div>`;
      return htmlString;
    })
    .join('');
  container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', init(year));
// const moreInfo = document.getElementById('moreInfo');

document.addEventListener('click', e => {
  console.log(e.target);
  if (e.target && e.target.id === 'moreInfo') {
    movieID = e.target.getAttribute('data-movie-id');
    console.log('id:', movieID);
    localStorage.setItem('id', movieID);
    window.location.href = './movie_details.html';
  }
});

// function setMovieID(e) {

// }

movieYear.addEventListener('click', e => {
  const { target } = e;
  if (target.tagName === 'LI') {
    const activeElement = movieYear.querySelector('.active');
    if (activeElement) {
      activeElement.classList.remove('active');
    }
    if (activeElement !== target) {
      target.classList.add('active');
      const targetYear = target.innerHTML;
      console.log(targetYear);
      init(targetYear);
    }
  }
});
