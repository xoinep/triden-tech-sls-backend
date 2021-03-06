/**
 * Route: DELETE /api/v1/user
 */
const mongoose = require("mongoose");
const User = require("../../models/User");
const util = require("../../utils");
const { clearHash } = require("../../services/cache");
const { connectDB } = require("../../../../config/db");

("use strict");

module.exports.handler = async (event) => {
  try {
    const userId = decodeURIComponent(event.pathParameters.userId);

    const response = await connectDB().then(async () => {
      const user = await User.findByIdAndRemove({ _id: userId });

      console.log(`Successfully deleted user in db: ${userId}`);

      return {
        statusCode: 204,
        headers: util.getResponseHeaders(),
      };
    });

    clearHash(userId);
    mongoose.connection.close();

    return response;
  } catch (err) {
    console.log("Encountered an error:", err);

    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      headers: util.getResponseHeaders(),
      body: JSON.stringify({
        error: err.name ? err.name : "Exception",
        message: err.message ? err.message : "Unknown error",
      }),
    };
  }
};
