import axios from "axios";

export default async function getUser(userResponses) {
  try {
    let response = await axios

      // Sample URL: https://api.github.com/users/danieladdsn
      .get(`https://api.github.com/users/${userResponses.username}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

// Path: utils/api.js


