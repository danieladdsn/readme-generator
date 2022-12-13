// External packages
import inquirer from "inquirer";
import { writeFile } from "fs";
import { promisify } from "util";

// Internal modules
import  getUser  from "./utils/api.js";
import generateMarkdown from "./utils/generateMarkdown.js";

// Inquirer prompts for userResponses
const questions = [
  {
    type: "input",
    message: "What is your GitHub username? (No @ needed)",
    name: "username",
    default: "danieladdsn",
    validate: function (answer) {
      if (answer.length < 1) {
        return console.log("A valid GitHub username is required.");
      }
      return true;
    },
  },
  {
    type: "input",
    message: "What is the name of your GitHub repo?",
    name: "repo",
    default: "readme-generator",
    validate: function (answer) {
      if (answer.length < 1) {
        return console.log("A valid GitHub repo is required for a badge.");
      }
      return true;
    },
  },
  {
    type: "input",
    message: "What is the title of your project?",
    name: "title",
    default: "Project Title",
    validate: function (answer) {
      if (answer.length < 1) {
        return console.log("A valid project title is required.");
      }
      return true;
    },
  },
  {
    type: "input",
    message: "Write a description of your project.",
    name: "description",
    default: "Project Description",
    validate: function (answer) {
      if (answer.length < 1) {
        return console.log("A valid project description is required.");
      }
      return true;
    },
  },
  {
    type: "input",
    message:
      "If applicable, describe the steps required to install your project for the Installation section.",
    name: "installation",
  },
  {
    type: "input",
    message:
      "Provide instructions and examples of your project in use for the Usage section.",
    name: "usage",
  },
  {
    type: "input",
    message:
      "If applicable, provide guidelines on how other developers can contribute to your project.",
    name: "contributing",
  },
  {
    type: "input",
    message:
      "If applicable, provide any tests written for your application and provide examples on how to run them.",
    name: "tests",
  },
  {
    type: "list",
    message: "Choose a license for your project.",
    choices: [
      "GNU AGPLv3",
      "GNU GPLv3",
      "GNU LGPLv3",
      "Mozilla Public License 2.0",
      "Apache License 2.0",
      "MIT License",
      "Boost Software License 1.0",
      "The Unlicense",
    ],
    name: "license",
  },
];

function writeToFile(fileName, data) {
  writeFile(fileName, data, (err) => {
    if (err) {
      return console.log(err);
    }

    console.log("Success! Your README.md file has been generated");
  });
}

const writeFileAsync = promisify(writeToFile);

// Main function
async function init() {
  try {
    // Prompt Inquirer questions
    const userResponses = await inquirer.prompt(questions);
    console.log("Your responses: ", userResponses);
    console.log(
      "Thank you for your responses! Fetching your GitHub data next..."
    );

    // Call GitHub api for user info
    const userInfo = await getUser(userResponses);
    console.log("Your GitHub user info: ", userInfo);

    // Pass Inquirer userResponses and GitHub userInfo to generateMarkdown
    console.log("Generating your README next...");
    const markdown = generateMarkdown(userResponses, userInfo);
    console.log(markdown);

    // Write markdown to file
    await writeFileAsync("ExampleREADME.md", markdown);
  } catch (error) {
    console.log(error);
  }
}

async function getUserInfo(username) {
  try {
    // Call the GitHub API to retrieve the user's information
    const response = await fetch(`https://api.github.com/users/${username}`);

    // If the API call is successful, return the user's information
    if (response.ok) {
      return await response.json();
    }

    // If the API call is not successful, throw an error
    throw new Error(`Failed to fetch user information for ${username}`);
  } catch (err) {
    // Handle the error by logging it to the console
    console.error(err);

    // Return an empty object to indicate that the user's information could not be retrieved
    return {};
  }
}

init();
