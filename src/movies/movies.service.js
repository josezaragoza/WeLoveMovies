const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

const reduceCritic = reduceProperties("review_id", {
  critic_created_at: ["critic", "created_at"],
  critic_updated_at: ["critic", "updated_at"],
  preferred_name: ["critic", "preferred_name"],
  surname: ["critic", "surname"],
  organization_name: ["critic", "organization_name"],
  critic_critic_id: ["critic", "critic_id"],
});

function list() {
  return knex("movies").select("*");
}

function read(movieId) {
  return knex("movies").select("*").where({ movie_id: movieId }).first();
}

function listMoviesThatAreCurrentlyShowing() {
  return knex("movies")
    .join("movies_theaters", "movies.movie_id", "movies_theaters.movie_id")
    .select("movies.title")
    .where({ is_showing: true })
    .groupBy("title");
}

function listTheatersForMovie(movieId) {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .join("theaters as t", "t.theater_id", "mt.theater_id")
    .select("t.*", "mt.is_showing", "m.movie_id")
    .where({ "m.movie_id": movieId });
}

function listReviewsForMovie(movieId) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select(
      "*",
      "c.created_at as critic_created_at",
      "c.updated_at as critic_updated_at",
      "c.critic_id as critic_critic_id"
    )
    .where({ "r.movie_id": movieId })
    .then(reduceCritic);
}

module.exports = {
  list,
  read,
  listMoviesThatAreCurrentlyShowing,
  listTheatersForMovie,
  listReviewsForMovie,
};
