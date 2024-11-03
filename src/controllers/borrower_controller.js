const mongoose = require('mongoose');
const DB = require('../models');
const ResponseHelper = require('../utils/response');

class BorrowerController  {
  static async addBorrow(req, res) {
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
      return ResponseHelper.success(res, createdBorrowingData, "Borrow record created successfully", 201);
    } catch (error) {
      await session.abortTransaction();
      return ResponseHelper.error(res, error.message, 500);
    } finally {
      await session.endSession();
    }
  }

  static async listActiveBorrows(req, res) {
    try {
      const items = await DB.Borrowing.find({ status: 'ACTIVE' })
        .populate('bookId', 'title description')
        .populate('borrowerId', 'membershipId name');
      return ResponseHelper.success(res, items, "Active borrow records retrieved successfully", 200);
    } catch (error) {
      return ResponseHelper.error(res, error.message, 500);
    }
  }

  static async returnBook(req, res) {
    try {
      if (!req.body.id) {
        return ResponseHelper.error(res, 'ID not provided!', 400);
      }

      const item = await DB.Borrowing.findById(req.body.id);
      if (!item) {
        return ResponseHelper.error(res, 'Borrow record not found', 404);
      }

      item.status = 'RETURNED';
      item.returnDate = new Date();
      await item.save();

      return ResponseHelper.success(res, item, "Book returned successfully", 200);
    } catch (error) {
      return ResponseHelper.error(res, error.message, 500);
    }
  }
}

module.exports = BorrowerController;
