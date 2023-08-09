"use strict";

const { application, json } = require("express");
// use this package to generate unique ids: https://www.npmjs.com/package/uuid
// const { v4: uuidv4 } = require("uuid");

const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const { MONGO_URI } = process.env;

const request = require("request-promise");
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const express = require("express");
const app = express();
const { restart } = require("nodemon");


const addUser = async (req,res) => {
    try {
        const {username, password } = req.body;

        // const hashedPassword = await 
    }
}

module.exports = {};