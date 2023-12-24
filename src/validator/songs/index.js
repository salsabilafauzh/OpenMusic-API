const ClientError = require('../../exceptions/ClientError');
const { SongSchemaValidator } = require('./schema');
const songValidation = {
  validatePayloadSong: (payload) => {
    const validationResult = SongSchemaValidator.validate(payload);

    if (validationResult.error) {
      throw new ClientError(validationResult.error.message);
    } else {
      payload.albumId = 'null';
    }
  },
};

module.exports = songValidation;
