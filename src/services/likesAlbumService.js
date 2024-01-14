const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class LikesAlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async postLikesAlbum(idAlbum, idUser) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1,$2,$3) RETURNING id ',
      values: [id, idUser, idAlbum],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('data gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getCountLikesAlbum(idAlbum) {
    const query = {
      text: 'SELECT COUNT(*) FROM user_album_likes WHERE "albumId"= $1',
      values: [idAlbum],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].count === 0) {
      throw new NotFoundError('data tidak ditemukan');
    }

    return result.rows[0];
  }

  async deleteLikesAlbum(idAlbum, idUser) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE "userId" = $1 AND "albumId" = $2',
      values: [idUser, idAlbum],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('data gagal di hapus, tidak ditemukan');
    }
  }

  async verifyLikes(idAlbum, idUser) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE "userId" = $1 AND "albumId" = $2',
      values: [idUser, idAlbum],
    };

    const result = await this._pool.query(query);
    if (result.rowCount) {
      throw new InvariantError('album sudah disukai');
    }
  }
}

module.exports = LikesAlbumService;
