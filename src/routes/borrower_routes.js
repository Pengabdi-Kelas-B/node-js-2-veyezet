const express = require("express");
const BorrowerController = require("../controllers/borrower_controller");

const borrowingRouter = express.Router();

borrowingRouter.post("/borrow/book", BorrowerController.addBorrow);
borrowingRouter.get("/borrow/book/list", BorrowerController.listActiveBorrows);
borrowingRouter.post("/borrow/book/return", BorrowerController.returnBook);

module.exports = borrowingRouter;
