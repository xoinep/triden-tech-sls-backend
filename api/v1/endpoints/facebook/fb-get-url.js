/**
 * Get a downloadable video link from a facebook url.
 */
const util = require("../../utils");
const cheerio = require("cheerio");
const fetch = require("axios");
const fs = require("fs");
("use strict");

module.exports.handler = async (event) => {
  try {
    const { fbLink } = JSON.parse(event.body);
    console.log(fbLink);
    const json = await fetch.get(fbLink);
    const source = json.data;

    fs.writeFileSync("debug.txt", source);
    const result = source.match(
      '"playable_url_quality_hd":"(.*?)","spherical_video_fallback_urls"'
    );
    console.log(result);
    return {
      statusCode: 201,
      headers: util.getResponseHeaders(),
      body: JSON.stringify(fbLink),
    };
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
