const autoBind = require('auto-bind');

class ExportHandler {
  constructor(ExportService, validator) {
    this._exportService = ExportService;
    this._validator = validator;

    autoBind(this);
  }

  async postExportHandler(req, h) {
    await this._validator.validateExportPayload(req.payload);
    const { playlistId } = req.params;
    const message = {
      playlistId: playlistId,
      targetEmail: req.payload.targetEmail,
    };

    await this._exportService.sendMessage('exports:playlist', JSON.stringify(message));
    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);

    return response;
  }
}

module.exports = ExportHandler;
