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
- [Events](#events)
  1. [List Index](#get-eventlist-)
  2. [Add Event](#post-eventadd-)
  3. [Edit Event](#post-eventedit-)
  4. [Close Event](#post-eventclose-)
- [Invoices](#invoices)
  1. [Add Invoice](#post-invoicenew-)
  2. [Get Invoice File](#get-invoicefileid-)

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

## Events

### `GET` /event/list 🔒
Returns a list of all the events in the database.

#### Permissions

| Role | Permissions |
|------|-------------|
| EC   | ✅           |
| CC   | ✅           |
| JC   | ✅           |

#### Query Parameters:

None

#### Response Body:

| Field        | Type    | Description                    |
|--------------|---------|--------------------------------|
| `id`         | String  | The ID of the event            |
| `name`       | String  | The name of the event          |
| `desription` | String  | The description of the event   |
| `date`       | String  | The date of the event          |
| `budget`     | Number  | The budget of the event        |
| `image`      | String  | The image of the event         |
| `createdAt`  | String  | The date the event was created |
| `closed`     | Boolean | Whether the event is closed    |

<br>

### `POST` /event/add 🔒
Add a new event to the database.

#### Permissions

| Role | Permissions |
|------|-------------|
| EC   | ✅           |
| CC   | ❌           |
| JC   | ❌           |

#### Request Body:

| Field         | Type   | Description                  |
|---------------|--------|------------------------------|
| `name`        | String | The name of the event        |
| `description` | String | The description of the event |
| `date`        | String | The date of the event        |
| `budget`      | Number | The budget of the event      |
| `image`       | String | The image of the event       |

#### Response Body:

None
<br>

### `POST` /event/edit 🔒
Edit an event in the database.

#### Permissions

| Role | Permissions |
|------|-------------|
| EC   | ✅           |
| CC   | ❌           |
| JC   | ❌           |

#### Request Body:

| Field         | Type   | Description                  |
|---------------|--------|------------------------------|
| `id`          | String | The ID of the event          |
| `name`        | String | The name of the event        |
| `description` | String | The description of the event |
| `date`        | String | The date of the event        |
| `budget`      | Number | The budget of the event      |

#### Response Body:

None


### `POST` /event/close 🔒
Closes an event in the database. After closing the event, no more invoices can be added to the event.

#### Permissions

| Role | Permissions |
|------|-------------|
| EC   | ✅           |
| CC   | ❌           |
| JC   | ❌           |

#### Request Body:

| Field | Type   | Description         |
|-------|--------|---------------------|
| `id`  | String | The ID of the event |

#### Response Body:

None

## Invoices

### `POST` /invoice/new 🔒
Add a new invoice to the database.

#### Permissions

| Role | Permissions |
|------|-------------|
| EC   | ✅           |
| CC   | ✅           |
| JC   | ✅           |

#### Request Body:

`amount` and `eventId` should be included in query parameters.\
A file object should be uploaded as `multipart/form-data`.

Sample Code:

HTML:

```html
<html lang="en">
</head>
<body>
    <h1>File test upload</h1>
    <br>
    <input type="file" id="file" name="invoice">
    <button id="upload">Upload</button>
</body>
</html>
```
Javascript:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('upload');
  const file = document.getElementById('file');
  btn.addEventListener('click', () => {
    const formData = new FormData();
    formData.encType = 'multipart/form-data';
    formData.append('file', file.files[0]);
    fetch('http://localhost:3000/invoice/new?amount=<amount>&eventId=<eventId>', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': 'Bearer <token>'
      }
    }).then(response => {
      console.log(response);
    }).catch(error => {
      console.error(error);
    });
  });
});
```


#### Response Body:

None


### `GET` /invoice/file/:id 🔒
Returns the file of the invoice with the given ID.

#### Permissions

| Role | Permissions |
|------|-------------|
| EC   | ✅           |
| CC   | ✅           |
| JC   | ✅           |


#### Request Parameters:

| Field | Type   | Description         |
|-------|--------|---------------------|
| `id`  | String | The ID of the invoice |

The `eventId` should be added in the query parameters.

#### Response Body:

The file of the invoice.

<br>
