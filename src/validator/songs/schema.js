const Joi = require('joi');

const SongSchemaValidator = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  performer: Joi.string().required(),
  genre: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string().allow(null).default(null),
});

module.exports = {
  SongSchemaValidator,
};
