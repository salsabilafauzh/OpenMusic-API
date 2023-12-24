const Hapi = require('@hapi/hapi');
const dotenv = require('dotenv');
const SongsService = require('./services/songsService');
const AlbumsService = require('./services/AlbumsService');
const ClientError = require('./exceptions/ClientError');
const songValidation = require('./validator/songs');
const registerSong = require('./api/song');
const registerAlbum = require('./api/album');
const albumValidation = require('./validator/albums');
dotenv.config();

const init = async () => {
  const songsService = new SongsService();
  const albumService = new AlbumsService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
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
  ]);

  server.ext('onPreResponse', (req, h) => {
    const { response } = req;
    if (response instanceof Error) {
      // penanganan client error secara internal.
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
