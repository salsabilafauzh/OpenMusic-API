const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const dotenv = require('dotenv');
const SongsService = require('./services/SongsService');
const AlbumsService = require('./services/AlbumsService');
const AuthService = require('./services/authService');
const UsersService = require('./services/usersService');
const PlaylistService = require('./services/playlistsService');
const ClientError = require('./exceptions/ClientError');
const registerSong = require('./api/song');
const registerAlbum = require('./api/album');
const registerUser = require('./api/user');
const registerAuth = require('./api/authentications');
const registerPlaylist = require('./api/playlist');
const songValidation = require('./validator/songs');
const albumValidation = require('./validator/albums');
const userValidation = require('./validator/users');
const authValidation = require('./validator/authentications');
const playlistValidation = require('./validator/playlists');
const tokenManager = require('./tokenize/TokenManager');

dotenv.config();

const init = async () => {
  const songsService = new SongsService();
  const albumService = new AlbumsService();
  const authService = new AuthService();
  const usersService = new UsersService();
  const playlistsService = new PlaylistService();

  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: registerSong,
      options: {
        service: songsService,
        validator: songValidation,
      },
    },
    {
      plugin: registerAlbum,
      options: {
        service: albumService,
        validator: albumValidation,
      },
    },
    {
      plugin: registerUser,
      options: {
        usersService: usersService,
        validator: userValidation,
      },
    },
    {
      plugin: registerAuth,
      options: {
        authService: authService,
        userService: usersService,
        tokenManager: tokenManager,
        validator: authValidation,
      },
    },
    {
      plugin: registerPlaylist,
      options: {
        playlistsService: playlistsService,
        songsService: songsService,
        validator: playlistValidation,
      },
    },
  ]);

  server.ext('onPreResponse', (req, h) => {
    const { response } = req;
    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
