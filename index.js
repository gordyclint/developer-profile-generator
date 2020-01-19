const inquirer = require('inquirer');
const fs = require('fs');
const util = require('util');
const axios = require('axios');
var pdf = require('html-pdf');

const fsWriteAsync = util.promisify(fs.writeFile);
const fsReadAsync = util.promisify(fs.readFile);

let name;

// Header for Github
const githubHeader = {
    headers: {
        Accept: "application/vnd.github.v3+json"
    }
}

// Questions for users on terminal
async function promptUser() {
    try {

        return inquirer.prompt([
            {
                type: "input",
                name: "name",
                message: "What is your name?"
            },
            {
                type: "input",
                name: "color",
                message: "What's your favorite color?"
            },
            {
                type: "input",
                name: "github",
                message: "What is your Github username?"
            }
        ])
    } catch (error) {

        console.log(error);

    }
}


// Javascript to generate HTML stuffs
function generateHTML(answers) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
        <title>Document</title>
        <link href="https://fonts.googleapis.com/css?family=Gelasio&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="./index.css">
    </head>
    
    <body>
        <div class="back jumbotron jumbotron-fluid">
    
        </div>
        <div class="forefront d-flex jumbotron justify-content-center">
            <div class="group d-flex flex-column align-items-center">
                <h1 class="display-4 mb-3">Hi!</h1>
                <h1 class="mb-5">My name is ${answers.name}</h1>
                <p class="lead text-center mb-5">I am from ${answers.location}.</p>
                <div>
                  <a href="https://www.google.com/maps/search/?api=1&query=${answers.location}"><span class="mr-3"><img src="https://img.icons8.com/windows/32/000000/worldwide-location.png">  ${answers.location}</span></a>
                  <a href=${answers.html_url}><span class="mr-3"><img src="https://img.icons8.com/windows/32/000000/github.png">  GitHub</span></a>
                  <a href=${answers.blog}><span><img src="https://img.icons8.com/windows/32/000000/blogger.png">  Blog</span></a>
                </div>
            </div>
        </div>
        <div class="spacer d-flex flex-column">
            <p class="text-center h2 text-dark">${answers.bio}</p>
            <div class="d-flex flex-row justify-content-around">
                <div class="info px-5 py-2 border border-dark text-center my-3">
                    <p>Public Repositories</p>
                    <p>${answers.public_repos}</p>
                </div>
                <div class="info px-5 py-2 border border-dark text-center my-3">
                    <p>Followers</p>
                    <p>${answers.followers}</p>
                </div>
            </div>
            <div class="d-flex flex-row justify-content-around">
                <div class="info px-5 py-2 border border-dark text-center my-3">
                    <p>GitHub Stars</p>
                    <p>${answers.starred_url.length}</p>
                </div>
                <div class="info px-5 py-2 border border-dark text-center my-3">
                    <p>Following</p>
                    <p>${answers.following}</p>
                </div>
            </div>
        </div>
        <img class="avatar" src=${answers.avatar_url} alt="github_avatar">
        <footer class="block">
    
        </footer>
    </body>
    
    </html>`;
}

async function init() {
    try {

        const { name, color, github } = await promptUser();

        // AJAX call to github
        const { data } = await axios.get(`https://api.github.com/users/${github}`, githubHeader)

        const htmlResults = generateHTML(data);

        const html = await fsWriteAsync(`${name}'s_github_profile.html`, htmlResults)
            .then(() => console.log("Success!"));

        const readHTML = await fsReadAsync(`${name}'s_github_profile.html`, 'utf8');

        var save = {
            'orientation': 'portrait',
            "type": "pdf",
            "quality": "75",
            "base": "file://C:/UNCBootcamp_Class/developer-profile-generator/index.css"
        };

        pdf.create(readHTML, save).toFile(`./pdfs/${name}'s_github_profile.pdf`, function (err, res) {
            if (err) return console.log(err);
            console.log(res);
        });

    } catch (error) {
        console.log('message: ' + err);
    }
}

init();