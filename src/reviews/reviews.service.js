const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");
const reduceProperties = require("../utils/reduce-properties");

const addCritic = mapProperties({
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

const reduceCritic = reduceProperties("review_id", {
  critic_created_at: ["critic", "created_at"],
  critic_updated_at: ["critic", "updated_at"],
  preferred_name: ["critic", "preferred_name"],
  surname: ["critic", "surname"],
  organization_name: ["critic", "organization_name"],
  critic_critic_id: ["critic", "critic_id"],
});

function read(review_id) {
  return knex("reviews").select("*").where({ review_id }).first();
}

function destroy(review_id) {
  return knex("reviews").where({ review_id }).del();
}

function update(updatedReview) {
  return knex("reviews")
    .select("*")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*");
}

function readReviewWithCritic(review_id) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("*")
    .where({ "r.review_id": review_id })
    .first()
    .then(addCritic);
}

function readReviewsByMovie(movieId) {
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
  read,
  delete: destroy,
  update,
  readReviewWithCritic,
  readReviewsByMovie,
};
