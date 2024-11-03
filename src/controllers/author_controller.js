const DB = require("../models");
const ResponseHelper = require("../utils/response");

class AuthorController {
  static async getAll(req, res) {
    try {
      const authors = await DB.Author.find();
      ResponseHelper.success(res, authors, "Sukses mengambil data penulis", 200);
    } catch (error) {
      ResponseHelper.error(res, error.message, 500); 
    }
  }

  static async getById(req, res) {
    try {
      const author = await DB.Author.findById(req.params.id);
      if (!author) {
        return ResponseHelper.error(res, 'Author not found', 404); 
      }
      ResponseHelper.success(res, author, undefined, 200); 
    } catch (error) {
      ResponseHelper.error(res, error.message, 500); 
    }
  }

  static async create(req, res) {
    const { name, bio, birthDate } = req.body;
    if (!name || !bio || !birthDate) {
      return ResponseHelper.error(res, "Missing required fields: name, bio, or birth date.", 400);
    }
    try {
      const newAuthor = await DB.Author.create({ name, bio, birthDate });
      ResponseHelper.success(res, newAuthor, "Author created successfully", 201); 
    } catch (error) {
      ResponseHelper.error(res, error.message, 500); 
    }
  }

  static async update(req, res) {
    if (!req.params.id) {
      return ResponseHelper.error(res, "ID not provided!", 400); 
    }
    if (Object.keys(req.body).length === 0) {
      return ResponseHelper.error(res, "No data provided for update.", 400); 
    }
    try {
      const updatedAuthor = await DB.Author.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!updatedAuthor) {
        return ResponseHelper.error(res, 'Author not found', 404); 
      }
      ResponseHelper.success(res, updatedAuthor, "Author updated successfully", 200); 
    } catch (error) {
      ResponseHelper.error(res, error.message, 500); 
    }
  }

  static async delete(req, res) {
    if (!req.params.id) {
      return ResponseHelper.error(res, 'ID not provided!', 400); 
    }
    try {
      const deletedAuthor = await DB.Author.findByIdAndDelete(req.params.id);
      if (!deletedAuthor) {
        return ResponseHelper.error(res, 'Author not found', 404); 
      }
      ResponseHelper.success(res, { message: "Author deleted successfully" }, undefined, 200); 
    } catch (error) {
      ResponseHelper.error(res, error.message, 500); 
    }
  }

  static async uploadImage(req, res) {
    try {
        if (!req.body.id) {
            return ResponseHelper.error(res, 'ID not provided!', 400); 
        }

        if (!req.body.photoUrl) {
            return ResponseHelper.error(res, 'Photo URL not provided!', 400); 
        }

        const author = await DB.Author.findById(req.body.id);

        if (!author) {
            return ResponseHelper.error(res, 'Author not found', 404); 
        }

        author.photoUrl = req.body.photoUrl;
        await author.save();
        ResponseHelper.success(res, author, "Image uploaded successfully", 200); 
    } catch (error) {
        ResponseHelper.error(res, error.message, 500); 
    }
  }

}

module.exports = AuthorController;