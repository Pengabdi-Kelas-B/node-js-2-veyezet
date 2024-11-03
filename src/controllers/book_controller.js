const DB = require('../models');
const ResponseHelper = require('../utils/response');

class BookController {

  static async getAll(req, res) {
    try {
      const items = await DB.Book.find()
        .populate('categoryId', 'name description')
        .populate('authorId', 'name bio');
      return ResponseHelper.success(res, items, "Books retrieved successfully", 200);
    } catch (error) {
      return ResponseHelper.error(res, error.message, 500);
    }
  }

  static async getById(req, res) {
    try {
      const items = await DB.Book.findById(req.params.id)
        .populate('categoryId', 'name description')
        .populate('authorId', 'name bio');
      if (!items) {
        return ResponseHelper.error(res, "Book not found", 404);
      }
      return ResponseHelper.success(res, items, "Book retrieved successfully", 200);
    } catch (error) {
      return ResponseHelper.error(res, error.message, 500);
    }
  }

  static async create(req, res) {
    try {
      const items = await DB.Book.create(req.body);
      return ResponseHelper.success(res, items, "Book created successfully", 201);
    } catch (error) {
      return ResponseHelper.error(res, error.message, 500);
    }
  }

  static async update(req, res) {
    try {
      if (!req.params.id) {
        return ResponseHelper.error(res, 'ID not provided!', 400);
      }

      const items = await DB.Book.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      if (!items) {
        return ResponseHelper.error(res, "Book not found", 404);
      }
      return ResponseHelper.success(res, items, "Book updated successfully", 200);
    } catch (error) {
      return ResponseHelper.error(res, error.message, 500);
    }
  }

  static async delete(req, res) {
    try {
      if (!req.params.id) {
        return ResponseHelper.error(res, 'ID not provided!', 400);
      }

      const items = await DB.Book.findByIdAndDelete(req.params.id);
      if (!items) {
        return ResponseHelper.error(res, "Book not found", 404);
      }
      return ResponseHelper.success(res, { message: "Book deleted successfully" }, undefined, 200);
    } catch (error) {
      return ResponseHelper.error(res, error.message, 500);
    }
  }

  static async uploadImage(req, res) {
    try {
      if (!req.body.id) {
        return ResponseHelper.error(res, 'ID not provided!', 400);
      }

      const item = await DB.Book.findById(req.body.id);
      if (!item) {
        return ResponseHelper.error(res, "Book not found", 404);
      }

      item.coverUrl = req.body.coverUrl;
      await item.save();

      return ResponseHelper.success(res, item, "Image uploaded successfully", 200);
    } catch (error) {
      return ResponseHelper.error(res, error.message, 500);
    }
  }
}

module.exports = BookController;