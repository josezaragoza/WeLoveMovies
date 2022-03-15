const res = require("express/lib/response");
const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res, next) {
  if (req.query.is_showing === "true") {
    res.json({ data: await moviesService.listMoviesThatAreCurrentlyShowing() });
  } else {
    const data = await moviesService.list();
    res.json({ data });
  }
}

async function read(req, res, next) {
  res.json({ data: await moviesService.read(req.params.movieId) });
}

function movieExists(req, res, next) {
  moviesService
    .read(req.params.movieId)
    .then((movie) => {
      if (movie) {
        res.locals.movie = movie;
        return next();
      }
      next({ status: 404, message: `Movie cannot be found.` });
    })
    .catch(next);
}

async function listTheatersForMovie(req, res, next) {
  res.json({
    data: await moviesService.listTheatersForMovie(req.params.movieId),
  });
}

async function listReviewsForMovie(req, res, next) {
  res.json({
    data: await moviesService.listReviewsForMovie(req.params.movieId),
  });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [movieExists, asyncErrorBoundary(read)],
  listTheatersForMovie: [movieExists, asyncErrorBoundary(listTheatersForMovie)],
  listReviewsForMovie: [movieExists, asyncErrorBoundary(listReviewsForMovie)],
};
