# Url-Shortener

 A CRUD Task manager app api with authorization, authentication and validation, and also sends email to users after creating an account.
 
#Link to postman documentation: 
https://documenter.getpostman.com/view/16044663/2s83mdKPxN

#Link to Api
https://url-shortener-bc.herokuapp.com

### How to run
- Clone the repo and open the folder using vscode or any other ide of choice
- Run npm install in your terminal to install packages in package.json
- Create a config.env file and fill in values for the following variables:
MONGO_URI,
NODE_ENV,
PORT,
JWT_SECRET,
JWT_EXPIRES_IN
-Finally run npm start in your terminal

### Endpoints
The following endpoints are available on this server:
- `/api/v1/users/sigup`: registers a new user.
- `/api/v1/users/login`: logs in a user.
- `/api/v1/users/logout`: logs out a user(protected route).
- `/api/v1/url/shorten`: to create a short Url.
- `/:code`: to redirect a user to thre Long Url page.
- `/api/v1/url/`: to get a list of all the shortened Url created by a user(protected route)
