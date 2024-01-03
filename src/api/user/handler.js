const autoBind = require('auto-bind');

class UserHandler {
  constructor(usersService, validator) {
    this._usersService = usersService;
    this._validator = validator;

    autoBind(this);
  }

  async addUserHandler(req, h) {
    await this._validator.validateUserPayload(req.payload);
    const { username, password, fullname } = req.payload;

    const userId = await this._usersService.addUser({ username, password, fullname });

    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UserHandler;
