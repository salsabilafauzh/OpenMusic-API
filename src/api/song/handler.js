const autoBind = require('auto-bind');
const { mapSearchSongs } = require('../../utils');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async addSongHandler(req, h) {
    const { title, year, performer, genre, duration = null, albumId = null } = req.payload;
    await this._validator.validatePayloadSong({ title, year, performer, genre, duration, albumId });

    const id = await this._service.addSong({ title, year, genre, performer, duration, albumId });
    const response = h.response({
      status: 'success',
      message: 'Song berhasil ditambahkan',
      data: {
        songId: id,
      },
    });

    response.code(201);
    return response;
  }

  async getSongsHandler(req, h) {
    const { title = '', performer = '' } = req.query;
    await this._validator.validateQuerySearch({ title, performer });

    const data = await this._service.getSongsByQuery({ title, performer });
    const newData = await data.map(mapSearchSongs);
    const response = h.response({
      status: 'success',
      data: {
        songs: newData,
      },
    });

    response.code(200);
    return response;
  }

  async getSongByIdHandler(req, h) {
    const { id } = req.params;

    const data = await this._service.getSongById(id);
    const response = h.response({
      status: 'success',
      data: {
        song: data,
      },
    });

    response.code(200);
    return response;
  }

  async updateSongByIdHandler(req, h) {
    const { title, year, performer, genre, duration = null, albumId = null } = req.payload;
    const { id } = req.params;
    await this._validator.validatePayloadSong({ title, year, performer, genre, duration, albumId });

    await this._service.updateSongById(id, { title, year, performer, genre, duration, albumId });
    const response = h.response({
      status: 'success',
      message: 'Song berhasil di perbaharui',
    });
    response.code(200);
    return response;
  }

  async deleteSongByIdHandler(req, h) {
    const { id } = req.params;

    await this._service.deleteSongById(id);
    const response = h.response({
      status: 'success',
      message: 'Song berhasil di hapus',
    });
    response.code(200);
    return response;
  }
}

module.exports = SongsHandler;
