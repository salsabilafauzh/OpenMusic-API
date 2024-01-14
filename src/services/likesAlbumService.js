const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class LikesAlbumService {
  constructor(CacheService) {
    this._pool = new Pool();
    this._cacheService = CacheService;
  }

  async postLikesAlbum(albumId, userId) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1,$2,$3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('data gagal ditambahkan');
    }

    await this._cacheService.delete(`likes:${albumId}`);
    return result.rows[0].id;
  }

  async getCountLikesAlbum(albumId) {
    try {
      const result = await this._cacheService.get(`likes:${albumId}`);
      return result.rows[0];
    } catch (error) {
      const query = {
        text: 'SELECT COUNT(*) FROM user_album_likes WHERE "albumId"= $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);
      if (!result.rows[0].count === 0) {
        throw new NotFoundError('data tidak ditemukan');
      }
      await this._cacheService.set(`likes:${albumId}`, JSON.stringify(result));

      return result.rows[0];
    }
  }

  async deleteLikesAlbum(albumId, userId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE "userId" = $1 AND "albumId" = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('data gagal di hapus, tidak ditemukan');
    }
    await this._cacheService.delete(`likes:${albumId}`);
  }

  async verifyLikes(albumId, userId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE "userId" = $1 AND "albumId" = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);
    if (result.rowCount) {
      throw new InvariantError('album sudah disukai');
    }
  }
}

module.exports = LikesAlbumService;
