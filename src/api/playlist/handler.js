const autoBind = require('auto-bind');
const { mapAlbumSongs } = require('../../utils/index');

class PlaylistHandler {
  constructor(playlistsService, songsService, activitiesService, validator) {
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._activitiesService = activitiesService;
    this._validator = validator;

    autoBind(this);
  }

  async addPlaylistHandler(req, h) {
    await this._validator.validatePayloadPlaylist(req.payload);
    const { name } = req.payload;
    const { id: credentialId } = req.auth.credentials;
    const id = await this._playlistsService.addPlaylist(name, credentialId);

    const response = h.response({
      status: 'success',
      data: {
        playlistId: id,
      },
    });
    response.code(201);
    return response;
  }

  async addSongToPlaylistHandler(req, h) {
    await this._validator.validatePayloadSongToPlaylist(req.payload);
    const { id: credentialId } = req.auth.credentials;
    const { id: playlistId } = req.params;
    const { songId } = req.payload;
    await this._songsService.verifySong(songId);
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._playlistsService.addSongToPlaylist(playlistId, songId);
    const dataActivity = await this._activitiesService.addNewActivities(playlistId, songId, credentialId, 'add');
    console.log(`was added by ${credentialId},songs:${songId} in playlist ${playlistId}, data:${dataActivity}`);
    const response = h.response({
      status: 'success',
      message: 'song has been added to the album',
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(req) {
    const { id: credentialId } = req.auth.credentials;
    const playlist = await this._playlistsService.getPlaylists(credentialId);
    console.log(playlist);
    return {
      status: 'success',
      data: {
        playlists: playlist,
      },
    };
  }

  async getPlaylistWithSongsHandler(req) {
    const { id: playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    const data = await this._playlistsService.getPlaylistWithSongs(playlistId);
    const newDataSongs = data[0].song_id !== null ? await data.map(mapAlbumSongs) : [];
    return {
      status: 'success',
      data: {
        playlist: {
          id: data[0].playlist_id,
          name: data[0].playlist_name,
          username: data[0].username,
          songs: newDataSongs,
        },
      },
    };
  }

  async deletePlaylistHandler(req) {
    const { id: playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._playlistsService.deletePlaylist(playlistId);

    return {
      status: 'success',
      message: 'playlist has been deleted',
    };
  }

  async deleteSongFromPlaylistHandler(req) {
    const { id: playlistId } = req.params;
    const { id: credentialId } = req.auth.credentials;
    await this._validator.validatePayloadSongToPlaylist(req.payload);
    const { songId } = req.payload;
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    await this._playlistsService.deleteSongFromPlaylist(playlistId, songId);
    const dataActivity = await this._activitiesService.addNewActivities(playlistId, songId, credentialId, 'delete');
    console.log(`was deleted by ${credentialId},songs:${songId} in playlist ${playlistId}, data:${dataActivity}`);
    return {
      status: 'success',
      message: 'song has been deleted from playlist',
    };
  }
}

module.exports = PlaylistHandler;
