# Expense Tracker backend
This is the backend for the Expense Tracker app. It is built using Node.js and Express.js.

## Setup
1. Clone the repository
2. Run `npm install` to install the dependencies

## Running the server
Run `npm start` to start the server. The server will run on port 3000 by default.\
In a development environment, you can use `nodemon` to automatically restart the server when changes are made. To do this, run `npm run dev`.

## API Endpoints

- [Users](#users)
  1. [Add User](#post-useradd-)
  2. [Get Token](#get-usertoken-)
  3. [Disable User](#post-userdisable-)
  4. [Enable User](#post-userenable-)

The following endpoints are available:\
All the endpoints use `Authorization: Bearer <token>` in headers as the authentication method.\
All the endpoints will also return a base JSON object with the following fields:

| Field     | Type              | Description                        |
|-----------|-------------------|------------------------------------|
| `success` | Boolean           | Whether the request was successful |
| `message` | String (Optional) | A message describing the result    |
| `data`    | Object (Optional) | The data returned by the request   |

All the returns specified in the below requests are now assumed to be in `data` field.

## Users

### `Post` /user/login 🔒
Verifies the token and returns back the user's data

#### Permissions

| Role | Permissions |
|------|-------------|
| EC   | ✅           |
| CC   | ✅           |
| JC   | ✅           |

#### Request Body:
None

#### Response Body:

| Field  | Type     | Description                     |
|--------|----------|---------------------------------|
| `id`   | String   | The ID of the user              |
| `name` | String   | The name of the user            |
| `role` | String   | The role of the user            |
| `pfp`  | String   | The profile picture of the user |

<br>

### `POST` /user/add 🔒
Add a new user to the database.

#### Permissions

| Role | Permissions |
|------|-------------|
| EC   | ✅           |
| CC   | ✅           |
| JC   | ❌           |

#### Request Body:

| Field    | Type     | Description                       |
|----------|----------|-----------------------------------|
| `name`   | String   | The name of the user              |
| `pfp`    | String   | The profile picture of the user   |
| `role`   | String   | The role of the user              |

#### Response Body:

| Field    | Type     | Description                      |
|----------|----------|----------------------------------|
| `id`     | String   | The ID of the user               |
| `name`   | String   | The name of the user             |
| `role`   | String   | The role of the user             |
| `token`  | String   | The token for the user           |

<br>

### `GET` /user/token 🔒

#### Permissions

| Role | Permissions |
|------|-------------|
| EC   | ✅           |
| CC   | ❌           |
| JC   | ❌           |

#### Query Parameters:

| Field  | Type     | Description          |
|--------|----------|----------------------|
| `name` | String   | The name of the user |

#### Response Body:

| Field     | Type    | Description                 |
|-----------|---------|-----------------------------|
| `id`      | String  | The ID of the user          |
| `token`   | String  | The token of the user       |
| `role`    | String  | The role of the user        |
| `enabled` | Boolean | Whether the user is enabled |

<br>

### `POST` /user/disable 🔒
Disables a token in the database. After disabling the user can no longer view or add invoices.

#### Permissions

| Role | Permissions |
|------|-------------|
| EC   | ✅           |
| CC   | ✅           |
| JC   | ❌           |

#### Request Body:

| Field | Type   | Description        |
|-------|--------|--------------------|
| `id`  | String | The ID of the user |

#### Response Body:

None

<br>

### `POST` /user/enable 🔒
Enabled a token in the database.

#### Permissions

| Role | Permissions |
|------|-------------|
| EC   | ✅           |
| CC   | ✅           |
| JC   | ❌           |

#### Request Body:

| Field | Type   | Description        |
|-------|--------|--------------------|
| `id`  | String | The ID of the user |

#### Response Body:

None
