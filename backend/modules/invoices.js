import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';
import pool from '../utils/database.js';
import fs from 'fs';

const router = Router();

router.post('/new', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({success: false, message: 'Unauthorized'});
    }

    // get the file from body
    const {amount, eventId} = req.query;
    if (!amount || !eventId) {
      return res.status(400).json({success: false, message: 'Amount and eventId are required'});
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(401).json({success: false, message: 'No file uploaded.'})
    }
    const file = req.files.file;
    const name = `${req.user.id}-${uuidv4()}-${file.name}`;
    await file.mv(`invoices/${name}`);

    const id = uuidv4();
    await pool.query('INSERT INTO "public"."invoices" (id, "fileUrl", amount, "createdAt", "createdBy", accepted, "acceptedBy", "acceptedAt", "eventId") ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [id, name, amount, new Date(), req.user.id, false, null, null, eventId]);

    res.status(201).json({
      success: true,
      message: 'Invoice created!',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false, message: 'Internal Server Error'});
  }
});

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
    res.status(500).json({success: false, message: 'Internal Server Error'});
  }
});

export default router;
