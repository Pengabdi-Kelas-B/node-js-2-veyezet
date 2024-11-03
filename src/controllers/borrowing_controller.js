const mongoose = require('mongoose');
const DB = require('../models');
const ResponseHelper = require('../utils/response');

class BorrowingController  {
  static async getAll(req, res) {
    try {
      const filter = {};
      if (req.query.status) {
        filter.status = req.query.status;
      }
      const items = await DB.Borrowing.find(filter)
        .populate('bookId', 'title description')
        .populate('borrowerId', 'membershipId name');
      return ResponseHelper.success(res, items, "Borrowings retrieved successfully", 200);
    } catch (error) {
      return ResponseHelper.error(res, error.message, 500);
    }
  }

  static async getById(req, res) {
    try {
      const item = await DB.Borrowing.findById(req.params.id);
      if (!item) {
        return ResponseHelper.error(res, "Borrowing not found", 404);
      }
      return ResponseHelper.success(res, item, "Borrowing retrieved successfully", 200);
    } catch (error) {
      return ResponseHelper.error(res, error.message, 500);
    }
  }

  static async create(req, res) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const book = await DB.Book.findById(req.body.bookId);
      const borrower = await DB.Borrower.findById(req.body.borrowerId);

      if (!book || !borrower) {
        await session.abortTransaction();
        return ResponseHelper.error(res, 'Book or Borrower not found', 404);
      }

      const createdBorrowingData = await DB.Borrowing.create(req.body);
      borrower.borrowHistory.push(createdBorrowingData._id);
      await borrower.save();

      await session.commitTransaction();
      return ResponseHelper.success(res, createdBorrowingData, "Borrowing created successfully", 201);
    } catch (error) {
      await session.abortTransaction();
      return ResponseHelper.error(res, error.message, 500);
    } finally {
      await session.endSession();
    }
  }

  static async update(req, res) {
    try {
      if (!req.params.id) {
        return ResponseHelper.error(res, 'ID not provided!', 400);
      }

      const item = await DB.Borrowing.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      if (!item) {
        return ResponseHelper.error(res, "Borrowing not found", 404);
      }
      return ResponseHelper.success(res, item, "Borrowing updated successfully", 200);
    } catch (error) {
      return ResponseHelper.error(res, error.message, 500);
    }
  }

  static async delete(req, res) {
    try {
      if (!req.params.id) {
        return ResponseHelper.error(res, 'ID not provided!', 400);
      }

      const item = await DB.Borrowing.findByIdAndDelete(req.params.id);
      if (!item) {
        return ResponseHelper.error(res, "Borrowing not found", 404);
      }
      return ResponseHelper.success(res, { message: "Borrowing deleted successfully" }, undefined, 200);
    } catch (error) {
      return ResponseHelper.error(res, error.message, 500);
    }
  }
}

module.exports = BorrowingController;
