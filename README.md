# Booking Seats System
This is a personal project in which it is implemented a REST API service, written in Javascript for Node.js, Express.js framework, MongoDB and Docker containers in order to make seats reservations.

## Contents
* [Installation](#installation)
* [How to run](#how-to-run)
* [Example](#example)
	* [User Registration](#registration)
	* [User Login](#login)

<a name="installation"></a>
## Installation
Firsly, you have to install [**docker**](https://docs.docker.com/engine/install/ubuntu/) and [**docker-compose**](https://docs.docker.com/compose/install/) in your machine.

Next you have to install the dependencies i the project directory by typing:

```npm
sudo npm install
```

<a name="how-to-run"></a>
## How to run
When installation finished, you can run the project through **docker-compose** inside the project directory:

```
sudo docker-compose up --build
```

*You cain always check your docker containers status by typing:*
```
sudo docker ps -a
```

<a name="example"></a>
## Example

<a name="registration"></a>
### User Registration
To complete the user registration your should make a **post** request at the *localhost:4001/auth/register* with body:

```json
{
    "email": "email@email.com",
    "password": "your-password",
    "username": "your-username",
    "profile": {
        "firtName": "firstname",
        "lastName": "lastname"
    }
}
```

The API will respond with the succesful message, a JWT and with the user profile as we can see below:

```json
{
    "message": "User successfully created!",
    "token": "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGM4ZWQxOTg4ZTg3NDAwMzNkMmJlZjciLCJ1c2VybmFtZSI6InhpcnN0b3MiLCJlbWFpbCI6InhyaXN0b3NAZ21haWwuY29tIiwicm9sZSI6Ik1lbWJlciIsImlhdCI6MTYyMzc4MDYzMywiZXhwIjoxNjU1MzE2NjMzfQ.mZ3p5krfTBjrdQ1OT_7PZ51jM25FoH1m_4u8B4sr9F0",
    "user": {
        "_id": "60c8ed1988e8740033d2bef7",
        "username": "your-username",
        "email": "email@email.com",
        "role": "Member"
    }
}
```

<a name="login"></a>
### User Login
To make a user login you should make a **post** request at the *localhost:4001/auth/login* with the body:

```json
{
    "email": "chtheolo@gmail.com",
    "password": "1234"
}
```
The API in this case will repond with the same answer as we saw in the [**registration**](#registration).

