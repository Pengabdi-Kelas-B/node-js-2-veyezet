const DB = require("../models");
const ResponseHelper = require("../utils/response");

class CategoryController {
  static async getAll(req, res) {
    try {
      const items = await DB.Category.find();
      return ResponseHelper.success(
        res,
        items,
        "sukses mengambil data kategori",
        200 
      );
    } catch (error) {
      return ResponseHelper.error(res, error.message, 500); 
    }
  }

  static async getById(req, res) {
    try {
      const items = await DB.Category.findById(req.params.id);
      if (!items) {
        return ResponseHelper.error(res, "Category not found", 404); 
      }
      return ResponseHelper.success(res, items, "Category retrieved successfully", 200); 
    } catch (error) {
      return ResponseHelper.error(res, error.message, 500); 
    }
  }

  static async create(req, res) {
    try {
      const items = await DB.Category.create(req.body);
      return ResponseHelper.success(res, items, "Category created successfully", 201); 
    } catch (error) {
      return ResponseHelper.error(res, error.message, 500); 
    }
  }

  static async update(req, res) {
    try {
      if (!req.params.id) {
        return ResponseHelper.error(res, "ID not provided!", 400); 
      }

      const items = await DB.Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      if (!items) {
        return ResponseHelper.error(res, "Category not found", 404);
      }
      return ResponseHelper.success(res, items, "Category updated successfully", 200); 
    } catch (error) {
      return ResponseHelper.error(res, error.message, 500); 
    }
  }

  static async delete(req, res) {
    try {
      if (!req.params.id) {
        return ResponseHelper.error(res, "ID not provided!", 400); 
      }

      const items = await DB.Category.findByIdAndDelete(req.params.id);
      if (!items) {
        return ResponseHelper.error(res, "Category not found", 404); 
      }
      return ResponseHelper.success(res, { message: "Category deleted successfully" }, undefined, 200); 
    } catch (error) {
      return ResponseHelper.error(res, error.message, 500); 
    }
  }
}

module.exports = CategoryController;