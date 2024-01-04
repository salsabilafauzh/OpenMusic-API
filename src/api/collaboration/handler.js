const autoBind = require('auto-bind');

class CollaborationsHandler {
  constructor(playlistsService, collaborationsService, validator) {
    this._playlistsService = playlistsService;
    this._collaborationsService = collaborationsService;
    this._validator = validator;

    autoBind(this);
  }

  async addCollaborationHandler(req, h) {
    await this._validator.validatePayloadCollaboration(req.payload);
    const { playlistId, userId } = req.payload;
    await this._playlistsService.verifyPlaylistOwner(playlistId, userId);
    const id = await this._collaborationsService.addCollaboration(playlistId, userId);

    const response = h.response({
      status: 'success',
      data: {
        collaborationId: id,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationHandler(req) {
    await this._validator.validatePayloadCollaboration(req.payload);
    const { playlistId, userId } = req.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, userId);
    await this._collaborationsService.deleteCollaboration(playlistId, userId);

    return {
      status: 'success',
      message: 'collaboration has been deleted',
    };
  }
}

module.exports = CollaborationsHandler;
