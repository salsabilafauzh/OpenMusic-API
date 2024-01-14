const autoBind = require('auto-bind');

class LikesAlbumHandler {
  constructor(LikesAlbumService, AlbumsService) {
    this._likesAlbumService = LikesAlbumService;
    this._albumsService = AlbumsService;
    autoBind(this);
  }

  async postLikesAlbum(req, h) {
    const { id: idAlbum } = req.params;
    const { id: idUser } = req.auth.credentials;
    await this._albumsService.verifyIfExistAlbum(idAlbum);
    await this._likesAlbumService.verifyLikes(idAlbum, idUser);
    await this._likesAlbumService.postLikesAlbum(idAlbum, idUser);

    const response = h.response({
      status: 'success',
      message: 'album berhasil disukai',
    });
    response.code(201);
    return response;
  }

  async getCountLikesAlbum(req) {
    const { id: idAlbum } = req.params;
    const { count } = await this._likesAlbumService.getCountLikesAlbum(idAlbum);
    const likes = parseInt(count);

    return {
      status: 'success',
      data: {
        likes: likes,
      },
    };
  }

  async deleteLikesAlbum(req) {
    const { id: idAlbum } = req.params;
    const { id: idUser } = req.auth.credentials;
    await this._likesAlbumService.deleteLikesAlbum(idAlbum, idUser);

    return {
      status: 'success',
      message: 'album batal disukai',
    };
  }
}

module.exports = LikesAlbumHandler;
