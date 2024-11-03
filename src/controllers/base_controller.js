const ResponseHelper = require("../utils/response");

class BaseController {
  constructor(model) {
    this.model = model;
  }

  static async getAll(req, res) {
    try {
      const items = await this.model.find();
      return ResponseHelper.success(res, items, "Items retrieved successfully", 200);
    } catch (error) {
      return ResponseHelper.error(res, error.message, 500);
    }
  }

  static async getById(req, res) {
    try {
      const item = await this.model.findById(req.params.id);
      if (!item) {
        return ResponseHelper.error(res, 'Item not found', 404);
      }
      return ResponseHelper.success(res, item, "Item retrieved successfully", 200);
    } catch (error) {
      return ResponseHelper.error(res, error.message, 500);
    }
  }
}

module.exports = BaseController;