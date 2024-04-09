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

import pool from "../utils/database.js";
import {v4 as uuidv4} from "uuid";
import { Router } from 'express';
const router = Router();

router.post('/login', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    return res.status(200).json({ success: true, message: 'Login successful', data: req.user });
});

router.post('/add', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // If the user is a JC they cannot add
    if (req.user.role === 'JC') {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { name, pfp, role } = req.body;
    if (!name || !pfp || !role) {
        return res.status(400).json({ success: false, message: 'Name, pfp and role are required' });
    }

    // If the user is a CC they cannot add another CC or EC.
    // So we should check that they are adding only a JC.
    if (req.user.role === 'CC' && role !== 'JC') {
        return res.status(403).json({ success: false, message: 'Insufficient Permissions' });
    }

    // get latest created user's userId
    const data = await pool.query('SELECT "id" FROM "users" ORDER BY "createdAt" DESC LIMIT 1');
    const userId = (data.rows.length === 0 ? 1000 : parseInt(data.rows[0].id)) + 1;

    const generatedToken = uuidv4();
    await pool.query('INSERT INTO "users" ("id", "name", "pfp", "enabled", "role", "createdAt", "createdBy", "lastActive", "token")' +
        'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [userId, name, pfp, true, role, new Date(), req.user.id, null, generatedToken]);
    console.log('User created')

    return res.status(201).json({
        success: true,
        message: 'User created',
        data: {
            id: userId,
            name: name,
            role: role,
            token: generatedToken,
        },
    });
});

router.get('/token', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Check if user is an EC
    if (req.user.role !== 'EC') {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    name = req.query.name;
    if (!name) {
        return res.status(400).json({ success: false, message: 'Name is required' });
    }

    // Get the token from the database
    const data = await pool.query('SELECT "id", "role", "token", "enabled" FROM "users" WHERE "name" = $1', [name]);
    if (data.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
        success: true,
        data: {
            id: data.rows[0].id,
            role: data.rows[0].role,
            token: data.rows[0].token,
            enabled: data.rows[0].enabled,
        },
    });
});

async function checkSufficientPermissions(req, res) {
    if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return false;
    }

    // If the user is a JC they cannot disable
    if (req.user.role === 'JC') {
        res.status(403).json({ success: false, message: 'Unauthorized' });
        return false;
    }

    // If the user is a CC they cannot disable another CC or EC.
    // So we should check that they are disabling only a JC.
    const { id } = req.body;
    const data = await pool.query('SELECT "id", "role" FROM "users" WHERE "id" = $1', [id]);
    if (data.rowCount === 0) {
        res.status(404).json({ success: false, message: 'User not found' });
        return false;
    }

    const user = data.rows[0];
    if (req.user.role === 'CC' && user.role !== 'JC') {
        res.status(403).json({ success: false, message: 'Insufficient Permissions' });
        return false;
    }

    return true;
}

router.post('/disable', async (req, res) => {
    const success = await checkSufficientPermissions(req, res);
    if (!success) {
        return;
    }
    const { id } = req.body;
    await pool.query('UPDATE "users" SET "enabled" = false WHERE "id" = $1', [id]);

    return res.status(201).json({ success: true, message: 'User disabled' });
});

router.post('/enable', async (req, res) => {
    const success = await checkSufficientPermissions(req, res);
    if (!success) {
        return;
    }
    const { id } = req.body;
    await pool.query('UPDATE "users" SET "enabled" = true WHERE "id" = $1', [id]);

    return res.status(201).json({ success: true, message: 'User enabled' });
});

export default router;