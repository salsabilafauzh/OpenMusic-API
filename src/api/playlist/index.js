const PlaylistHandler = require('./handler');
const routes = require('./routes');
const registerPlaylist = {
  name: 'playlist',
  version: '1.0.0',
  register: (server, { playlistsService, songsService, validator }) => {
    const playlistHandler = new PlaylistHandler(playlistsService, songsService, validator);
    server.route(routes(playlistHandler));
  },
};

module.exports = registerPlaylist;
