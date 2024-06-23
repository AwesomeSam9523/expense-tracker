# Expense Tracker 💵
This app is tailored for IEEE CS internal budget management.

1. [App Flow](#app-flow)
   1. [Login](#1-login)
   2. [Allocating budget](#2-allocating-budget)
   3. [Submitting an invoice](#3-submitting-an-invoice)
   4. [Verifying an invoice](#4-verifying-an-invoice)
   5. [Getting a summary](#5-getting-a-summary)
2. [Features](#features)
   1. [ECs](#ecs-are-allowed-to)
   2. [CCs and JCs](#ccs-and-jcs-are-allowed-to)
3. [Stack used](#stack-used)
   1. [Frontend](#frontend)
   2. [Backend](#backend)


## App flow

### 1. Login
Login page will have 3 buttons- `EC`, `CC` and `JC`. 
The user will select their level, enter the password and login.

### 2. Allocating budget
The ECs can create a new event and allocate a particular budget. This budget will be available
for the CCs and JCs to use. 

### 3. Submitting an invoice
Any CC or JC can submit an invoice. Submitting is as simple as uploading a picture of the bill
and entering the amount. The invoice will go into a pending state which must first be verified
by a CC or EC.

### 4. Verifying an invoice
Once a CC or EC verifies an invoice the amount gets deducted from the allocated budget.

### 5. Getting a summary
The ECs can get a total summary on all the expenses. Stats regarding money spent on each category
and by whom are easily available.


## Features

### CCs and JCs are allowed to:
- Check stats
- Add invoices
- View their own invoices
- Change their password
- Update their profile picture
- View all events
- View notifications

### ECs are allowed to:

Everything that CC and JC can do, plus:
- Create/edit/delete events
- Allocate budget
- Approve/reject invoices
- Create/delete new CC or JC user
- Enable/disable a CC or JC token



## Stack used

### Frontend
- React Native
- NativeWind

### Backend
- NodeJS (Express)
- PostgreSQL

\
Made with ❤️ by IEEECS
