# Url-Shortener

**Url-Shortener** is a simple web application which allows users to shorten their long URLs into shorter, more manageable links. This is particularly useful when sharing links on social media platforms or in situations where character count is limited.

## Features

* User registration and authentication system.
* Shorten any URL with a click of a button.
* Track the number of clicks on each shortened URL.
* Delete shortened URLs.
* Edit user profiles.

## Technologies Used

* [Node.js](https://nodejs.org/)
* [Express.js](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/)
* [Mongoose.js](https://mongoosejs.com/)
* [Bootstrap](https://getbootstrap.com/)


## Prerequisites

* Node.js installed
* MongoDB Atlas account (or local MongoDB instance)
* Git

## Installation

1. Clone this repository using `git clone https://github.com/ozi-dev/Url-Shortener.git`.
2. Change directory to the cloned repository using `cd Url-Shortener`.
3. Run `npm install` to install all dependencies.
4. Create a `.env` file at the root of the application with the following content:

```
MONGO_URI=<your-mongodb-uri>
SECRET=<your-session-secret>
```

5. Start the application using `npm start` command.
6. Open your browser and navigate to `http://localhost:3000`.

## Usage

### Home Page

The home page provides a simple interface for shortening URLs. Simply enter the URL you wish to shorten into the text box and click "Shorten". The shortened URL will appear below it along with a shareable link to copy and paste.

### Dashboard

Once you have registered and logged in, you will be taken to the user dashboard which contains a list of all the URLs you have shortened. From here you can track the number of clicks, edit and delete URLs.

### Profile

The profile page is where users can edit their account information such as email and password.

## Contributing

If you find any bugs or would like to contribute to this project, please feel free to open an issue or submit a pull request.


That's it! I hope you found this README helpful. Don't hesitate to reach out if you have any questions or need further assistance.
