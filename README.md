# Booking Seats System
This is a personal project in which it is implemented a REST API service, written in Javascript for Node.js, Express.js framework, MongoDB and Docker containers in order to make seats reservations.

## Contents
* [Installation](#installation)
* [How to run](#how-to-run)
* [Example](#example)
	* [User Registration](#registration)
	* [User Login](#login)
	* [Sessions Schema](#schema)


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
    "email": "email@email.com",
    "password": "your-password"
}
```
The API in this case will repond with the same answer as we saw in the [**registration**](#registration) but with a different success message:

```json
{
    "message": "Login successful",
    "token": "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGM4ZmQ0YmVhZGRhZDAwMjA2ZDcwMTciLCJ1c2VybmFtZSI6InRoZW9sb2dvdSIsImVtYWlsIjoidGhlb2xvZ291QGdtYWlsLmNvbSIsInJvbGUiOiJNZW1iZXIiLCJpYXQiOjE2MjM3OTI0NzcsImV4cCI6MTY1NTMyODQ3N30.XKbNU2DgOjyiqh67gsWPVciPWFh2kfcfXlAoP_DkQYI",
    "user": {
        "_id": "60c8fd4beaddad00206d7017",
        "username": "your-username",
        "email": "email@email.com",
        "role": "Member"
    }
}
```

<a name="schema"></a>
### Sessions Schema
This is a reservation-based schema where the user can pick their own seats in a  day session, and the seats are reserved until the user either checks out the cart or the cart expires. 

| Schema Attribute | Description |
|-----------------|:-------------|
| name            | Name of the shop |
| price           | The reservation price |
| seatsAvailable  | The number of seats left for that day session |
| seats           | The 2d array seat map, showing which seats have been booked |
| reservations    | Any current reservations for this session that are in a cart |

The most interesting field is the **seats** field, which contains the map of the shop/restaurant. It’s worth noticing that although we have picked a completely uniform seat layout, this schema would allow us to create any layout we wish.

Making a **GET** request in the endpoint *localhost:4001/sessions* we can get the history of all sessions and the API respose will be:

```json
{
    "_id": "60c91ec72c1cfa0020df364a",
    "name": "Shop-Restaurant",
    "price": 9,
    "seatsAvailable": 113,
    "seats": [
        [ 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    "reservations": [],
    "createdAt": "2021-06-15T21:42:31.171Z",
    "updatedAt": "2021-06-15T21:42:31.171Z",
    "__v": 0
}
```

We can also fetch sessions by date and Id:
* Date -> localhost:4001/sessions?date=2020-07-19
* Id   -> localhost:4002/sessions/5f22cfbf5f8e9f0f761699bc

Notice that the **seats** field mirrors the seating layout. In a session, it’s used to keep track of what seats have been reserved. The reservations array is an array of current reservations for these sessions before the carts have been checked out.