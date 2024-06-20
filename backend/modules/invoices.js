import {v4 as uuidv4} from 'uuid';
import {Router} from 'express';
import pool from '../utils/database.js';
import fs from 'fs';
import axios from "axios";

const router = Router();

// Route to add a new invoice
router.post('/new', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({success: false, message: 'Unauthorized'});
    }

    // Get the file from body
    const {amount, eventId, image, mimeType} = req.body;
    if (!amount || !eventId || !image || !mimeType) {
      return res.status(400).json({success: false, message: 'Amount, eventId, image and mimeType are required'});
    }

    const fileExtension = mimeType.split('/')[1];
    const id = uuidv4();
    try {
      await axios.post('https://awesomesam.dev/api/ieee/upload', {
        id,
        image,
        mimeType,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.IEEE_CS_KEY}`
        }
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({success: false, message: 'Internal Server Error'});
    }

    const imageUrl = `https://awesomesam.dev/api/ieee/${id}.${fileExtension}`;
    await pool.query('INSERT INTO "public"."invoices" (id, "fileUrl", amount, "createdAt", "createdBy", accepted, "actionedBy", "actionedAt", "eventId") ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [id, imageUrl, amount, new Date(), req.user.id, null, null, null, eventId]);

    res.status(201).json({
      success: true,
      message: 'Invoice created!',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false, message: 'Internal Server Error'});
  }
});

// Route to get a file by ID
router.get('/file/:id', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({success: false, message: 'Unauthorized'});
    }

    const {id} = req.params;
    const {eventId} = req.query;

    const data = await pool.query('SELECT * FROM "public"."invoices" WHERE id = $1 AND "eventId" = $2', [id, eventId]);

    if (data.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    const invoice = data.rows[0];
    const file = fs.readFileSync(`invoices/${invoice.fileUrl}`);
    const mimetype = invoice.fileUrl.split('.').pop();
    res.setHeader('Content-Type', `image/${mimetype}`);
    res.send(file);
  } catch (e) {
    console.error(e);
    res.status(500).json({success: false, message: 'Internal Server Error !'});
  }
});


// Endpoint to get all pending invoices
router.get('/pending', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({success: false, message: 'Unauthorized'});
    }

    if (req.user.role !== 'EC') {
      return res.status(403).json({success: false, message: 'Insufficient Permissions'});
    }

    // Query pending invoices from the database
    const data = await pool.query(`
      SELECT invoices."id", invoices."amount", e."name" as "eventName", u."name", u."username", "fileUrl", "eventId", u."pfp", u."role"
      FROM "public"."invoices"
      INNER JOIN public.events e on e.id = invoices."eventId" 
      INNER JOIN public.users u on u.id = invoices."createdBy" 
      WHERE accepted IS NULL ORDER BY invoices."createdAt" DESC`
    );

    res.status(200).json({success: true, data: data.rows});
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false, message: 'Internal Server Error'});
  }
});


router.post('/accept', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({success: false, message: 'Unauthorized'});
    }

    if (req.user.role !== 'EC') {
      return res.status(403).json({success: false, message: 'Insufficient Permissions'});
    }

    const {id} = req.body;
    if (!id) {
      return res.status(400).json({success: false, message: 'Invoice ID is required'});
    }

    const data = await pool.query('SELECT * FROM "public"."invoices" WHERE id = $1', [id]);
    if (data.rowCount === 0) {
      return res.status(404).json({success: false, message: 'Invoice not found'});
    }

    if (data.rows[0].accepted !== null) {
      return res.status(400).json({success: false, message: 'Invoice already actioned at'});
    }

    await pool.query('UPDATE "public"."invoices" SET accepted = true, "actionedBy" = $1, "actionedAt" = $2 WHERE id = $3', [req.user.id, new Date(), id]);

    res.status(200).json({success: true, message: 'Invoice accepted!'});
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false, message: 'Internal Server Error'});
  }
});


router.post('/reject', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({success: false, message: 'Unauthorized'});
    }

    if (req.user.role !== 'EC') {
      return res.status(403).json({success: false, message: 'Insufficient Permissions'});
    }

    const {id} = req.body;
    if (!id) {
      return res.status(400).json({success: false, message: 'Invoice ID is required'});
    }

    const data = await pool.query('SELECT * FROM "public"."invoices" WHERE id = $1', [id]);
    if (data.rowCount === 0) {
      return res.status(404).json({success: false, message: 'Invoice not found'});
    }

    if (data.rows[0].accepted !== null) {
      return res.status(400).json({success: false, message: 'Invoice already actioned at'});
    }

    await pool.query('UPDATE "public"."invoices" SET accepted = false, "actionedBy" = $1, "actionedAt" = $2 WHERE id = $3', [req.user.id, new Date(), id]);

    res.status(200).json({success: true, message: 'Invoice rejected!'});
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false, message: 'Internal Server Error'});
  }
});

// Use the router
export default router;
