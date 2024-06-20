/*
This file has the following routes:

/user/login
    POST
    Checks if the user's token is successful

/user/add
    POST
    Requires: name, pfp, role
    Adds a new user to the database. The user is created with the following properties:
        id: The next available id in the database
        name: The name of the user
        pfp: The profile picture of the user
        enabled: true
        role: The role of the user
        createdAt: The current date and time
        createdBy: The id of the user who created this user
        lastActive: null
        token: A randomly generated token
    If the user is a JC, they cannot add a user.
    If the user is a CC, they cannot add a user with a role other than JC.

/user/token
    GET
    Requires: name
    Returns the token of the user with the given name.
    If the user is not an EC, they cannot get a token.

/user/disable
    POST
    Requires: id
    Disables the user with the given id.
    If the user is a JC, they cannot disable a user.
    If the user is a CC, they cannot disable a user with a role other than JC.

/user/enable
    POST
    Requires: id
    Enables the user with the given id.
    If the user is a JC, they cannot enable a user.
    If the user is a CC, they cannot enable a user with a role other than JC.
 */

import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';
import pool from '../utils/database.js';
import hashPassword from "../utils/tools.js";

const router = Router();

router.post('/login', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({success: false, message: 'No token provided'});
    }

    res.status(200).json({success: true, message: 'Login successful', data: req.user});
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false, message: 'Internal Server Error'});
  }
});

router.post('/add', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({success: false, message: 'Unauthorized'});
    }

    // If the user is a JC they cannot add
    if (req.user.role === 'JC') {
      return res.status(403).json({success: false, message: 'Insufficient Permissions'});
    }

    const {name, post, role, username} = req.body;
    if (!name || !post || !role || !username) {
      return res.status(400).json({success: false, message: 'Name, post, role and username are required'});
    }

    // If the user is a CC they cannot add another CC or EC.
    // So we should check that they are adding only a JC.
    if (req.user.role === 'CC' && role !== 'JC') {
      return res.status(403).json({success: false, message: 'Insufficient Permissions'});
    }

    // get latest created user's userId
    const data = await pool.query('SELECT "id" FROM "public"."users" ORDER BY "createdAt" DESC LIMIT 1');
    const userId = (data.rows.length === 0 ? 1000 : parseInt(data.rows[0].id, 10)) + 1;

    const generatedToken = uuidv4();
    const password = hashPassword(username);

    await pool.query(
      'INSERT INTO "public"."users" ("id", "name", "post", "enabled", "role", "createdAt", "createdBy", "lastActive", "token", "username", "password")'
      + 'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ORDER BY "createdAt" ASC', [userId, name, post, true, role, new Date(), req.user.id, null, generatedToken, username, password]
    );

    res.status(201).json({
      success: true,
      message: 'User created',
      data: {
        id: userId,
        name,
        role,
        token: generatedToken,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({success: false, message: 'Internal Server Error'});
  }
});

async function checkSufficientPermissions(req, res) {
  try {
    if (!req.user) {
      res.status(401).json({success: false, message: 'Unauthorized'});
      return false;
    }

    // If the user is a JC they cannot disable
    if (req.user.role === 'JC') {
      res.status(403).json({success: false, message: 'Unauthorized'});
      return false;
    }

    // If the user is a CC they cannot disable another CC or EC.
    // So we should check that they are disabling only a JC.
    const {id} = req.body;
    const data = await pool.query('SELECT "id", "role" FROM "public"."users" WHERE "id" = $1', [id]);
    if (data.rowCount === 0) {
      res.status(404).json({success: false, message: 'User not found'});
      return false;
    }

    const user = data.rows[0];
    if (req.user.role === 'CC' && user.role !== 'JC') {
      res.status(403).json({success: false, message: 'Insufficient Permissions'});
      return false;
    }

    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

router.post('/disable', async (req, res) => {
  try {
    const success = await checkSufficientPermissions(req, res);
    if (!success) {
      return;
    }
    const {id} = req.body;
    await pool.query('UPDATE "public"."users" SET "enabled" = false WHERE "id" = $1', [id]);

    res.status(201).json({success: true, message: 'User disabled'});
  } catch (e) {
    console.error(e);
    res.status(500).json({success: false, message: 'Internal Server Error'});
  }
});

router.post('/enable', async (req, res) => {
  try {
    const success = await checkSufficientPermissions(req, res);
    if (!success) {
      return;
    }
    const {id} = req.body;
    await pool.query('UPDATE "public"."users" SET "enabled" = true WHERE "id" = $1', [id]);

    res.status(201).json({success: true, message: 'User enabled'});
  } catch (e) {
    console.error(e);
    res.status(500).json({success: false, message: 'Internal Server Error'});
  }
});

router.get('/all', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({success: false, message: 'Unauthorized'});
    }

    if (req.user.role !== 'EC') {
      return res.status(403).json({success: false, message: 'Insufficient Permissions'});
    }

    const search = req.query.search || '';

    const data = await pool.query('SELECT "id", "name", "pfp", "enabled", "role", "post", "username" FROM "public"."users" WHERE "username" ILIKE $1', [`%${search}%`]);
    res.status(200).json({success: true, data: data.rows});
  } catch (e) {
    console.error(e);
    res.status(500).json({success: false, message: 'Internal Server Error'});
  }
});

export default router;
