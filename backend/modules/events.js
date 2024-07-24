import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';
import pool from '../utils/database.js';
import dotenv from "dotenv";
import {uploadImage} from "../utils/tools.js";

dotenv.config();
const router = Router();

router.post('/new', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({success: false, message: 'Unauthorized'});
    }

    // If the user is not an EC, return
    if (req.user.role !== 'EC') {
      return res.status(403).json({success: false, message: 'Insufficient Permissions'});
    }

    const {name, description, budget, image, mimeType} = req.body;
    if (!name || !description || !budget || !image || !mimeType) {
      return res.status(400).json({success: false, message: 'Name, description, image, mimeType and budget are required'});
    }

    // Check that budget it more than 0
    if (budget <= 0) {
      return res.status(400).json({success: false, message: 'Budget must be greater than 0'});
    }

    const id = uuidv4();
    const fileExtension = mimeType.split('/')[1];
    try {
      await uploadImage(id, image, mimeType);
    } catch (e) {
      console.error(e);
      return res.status(500).json({success: false, message: 'Internal Server Error'});
    }

    const imageUrl = `https://awesomesam.dev/api/ieee/${id}.${fileExtension}`;

    await pool.query('INSERT INTO "public"."events" (id, name, description, budget, image, "createdAt", "createdBy", closed) '
      + 'VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [id, name, description, budget, imageUrl, new Date(), req.user.id, false])

    res.status(201).json({
      success: true,
      message: 'Event created!',
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({success: false, message: 'Internal Server Error'});
  }
});

router.post('/edit', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({success: false, message: 'Unauthorized'});
    }

    if (req.user.role !== 'EC') {
      return res.status(403).json({success: false, message: 'Insufficient Permissions'});
    }

    const {id, name, description, date, budget} = req.body;
    if (!name || !description || !date || !budget) {
      return res.status(400).json({success: false, message: 'ID, name, description, date and budget are required'});
    }

    if (budget <= 0) {
      return res.status(400).json({success: false, message: 'Budget must be greater than 0'});
    }

    // update the table
    await pool.query('UPDATE "public"."events" SET name = $1, description = $2, date = $3, budget = $4 WHERE id = $5', [name, description, date, budget, id]);
    res.status(201).json({
      success: true,
      message: 'Event updated!',
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({success: false, message: 'Internal Server Error'});
  }
});

router.post('/delete', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({success: false, message: 'Unauthorized'});
    }

    if (req.user.role !== 'EC') {
      return res.status(403).json({success: false, message: 'Insufficient Permissions'});
    }

    const { id } = req.body;
    if (!id) {
      return res.status(400).json({success: false, message: 'ID is required'});
    }

    await pool.query('DELETE FROM "public"."events" WHERE id = $1', [id]);
    res.status(201).json({
      success: true,
      message: 'Event deleted!',
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({success: false, message: 'Internal Server Error'});
  }
});

router.post('/close', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({success: false, message: 'Unauthorized'});
    }

    if (req.user.role !== 'EC') {
      return res.status(403).json({success: false, message: 'Insufficient Permissions'});
    }

    const { id, value } = req.body;

    if (!id) {
      return res.status(400).json({success: false, message: 'ID is required'});
    }

    await pool.query('UPDATE "public"."events" SET closed = $2 WHERE id = $1', [id, !!value]);
    res.status(201).json({
      success: true,
      message: `Event ${value ? 'closed' : 'opened'}!`
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({success: false, message: 'Internal Server Error'});
  }
});

router.get('/list', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({success: false, message: 'Unauthorized'});
    }

    let query = (req.user.role === 'EC')
      ? 'SELECT id, name, budget, image, "createdAt", closed FROM "public"."events" WHERE name ILIKE $1'
      : 'SELECT id, name, budget, image, "createdAt", closed FROM "public"."events" WHERE closed = false AND name ILIKE $1';

    const search = req.query.search || '';
    const filter = req.query.filter || 'NewToOld';
    switch (filter) {
      case 'NewToOld':
        query += ' ORDER BY "createdAt" DESC';
        break;
      case 'OldToNew':
        query += ' ORDER BY "createdAt" ASC';
        break;
      case 'EventName':
        query += ' ORDER BY name';
        break;
      case 'HighToLow':
        query += ' ORDER BY budget DESC';
        break;
      case 'LowToHigh':
        query += ' ORDER BY budget ASC';
        break;
    }

    const data = await pool.query(query, [`%${search}%`]);
    res.status(200).json({
      success: true,
      data: data.rows,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({success: false, message: 'Internal Server Error'});
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({success: false, message: 'Unauthorized'});
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({success: false, message: 'ID is required'});
    }

    const data = await pool.query('SELECT id, name, description, date, budget, expenditure, image, "createdAt", closed FROM "public"."events" WHERE id = $1', [id]);
    if (data.rowCount === 0) {
      return res.status(404).json({success: false, message: 'Event not found'});
    }

    res.status(200).json({
      success: true,
      data: data.rows[0],
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({success: false, message: 'Internal Server Error'});
  }
});

export default router;
