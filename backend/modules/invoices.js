import {v4 as uuidv4} from 'uuid';
import {Router} from 'express';
import pool from '../utils/database.js';
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

    const data = await pool.query('SELECT "shortId" FROM "public"."invoices" ORDER BY "createdAt" DESC LIMIT 1');
    const invoiceShortId = (data.rows.length === 0 ? 1000 : parseInt(data.rows[0].shortId, 10)) + 1;

    const imageUrl = `https://awesomesam.dev/api/ieee/${id}.${fileExtension}`;
    await pool.query('INSERT INTO "public"."invoices" (id, "fileUrl", amount, "createdAt", "createdBy", accepted, "actionedBy", "actionedAt", "eventId", "shortId") ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [id, imageUrl, amount, new Date(), req.user.id, null, null, null, eventId, invoiceShortId]);

    res.status(201).json({
      success: true,
      message: 'Invoice created!',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false, message: 'Internal Server Error'});
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

async function getInvoice(req, res) {
  if (!req.user) {
    res.status(401).json({success: false, message: 'Unauthorized'});
    return null;
  }

  if (req.user.role !== 'EC') {
    res.status(403).json({success: false, message: 'Insufficient Permissions'});
    return null;
  }

  const {id} = req.body;
  if (!id) {
    res.status(400).json({success: false, message: 'Invoice ID is required'});
    return null;
  }

  const data = await pool.query(`
    SELECT "invoices"."id", "shortId", "accepted", e."name" as "eventName", "amount" FROM "public"."invoices" 
    INNER JOIN public.events e on e.id = invoices."eventId"
    WHERE "invoices"."id" = $1
  `, [id]);
  if (data.rowCount === 0) {
    res.status(404).json({success: false, message: 'Invoice not found'});
    return null;
  }

  const invoice = data.rows[0];

  if (invoice.accepted !== null) {
    res.status(400).json({success: false, message: 'Invoice already actioned at'});
    return null;
  }

  return invoice;
}

async function createNotification(userId, message, type) {
  await pool.query('INSERT INTO "public"."notifications" ("id", "userId", "data", "createdAt", "type") VALUES ($1, $2, $3, NOW(), $4)',
    [uuidv4(), userId, message, type]);
}

router.post('/accept', async (req, res) => {
  try {
    const invoice = await getInvoice(req, res);
    if (!invoice) {
      return;
    }

    await pool.query('UPDATE "public"."invoices" SET accepted = true, "actionedBy" = $1, "actionedAt" = $2 WHERE id = $3', [req.user.id, new Date(), invoice.id]);
    await createNotification(
      req.user.id,
      `Your invoice #${invoice.shortId} for ${invoice.eventName} of amount Rs. ${invoice.amount} has been accepted!`,
      'success'
    );
    res.status(200).json({success: true, message: 'Invoice accepted!'});
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false, message: 'Internal Server Error'});
  }
});


router.post('/reject', async (req, res) => {
  try {
    const invoice = await getInvoice(req, res);
    if (!invoice) {
      return;
    }

    await pool.query('UPDATE "public"."invoices" SET accepted = false, "actionedBy" = $1, "actionedAt" = $2 WHERE id = $3', [req.user.id, new Date(), invoice.id]);
    await createNotification(
      req.user.id,
      `Your invoice #${invoice.shortId} for ${invoice.eventName} of amount Rs. ${invoice.amount} has been rejected!`,
      'failure'
    );
    res.status(200).json({success: true, message: 'Invoice rejected!'});
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false, message: 'Internal Server Error'});
  }
});

// Route to get all invoices by eventId
router.get('/event/:eventId', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({success: false, message: 'Unauthorized'});
    }

    const { eventId } = req.params;
    let query;
    let queryParams;

    if (req.user.role === 'EC') {
      // EC can access all invoices for the entered eventid
      query = 'SELECT id, "fileUrl", amount, "createdAt", "createdBy", accepted, "actionedBy", "actionedAt", "eventId" FROM "public"."invoices" WHERE "eventId" = $1';
      queryParams = [eventId];
    } else if (req.user.role === 'JC' || req.user.role === 'CC') {
      // JC or CC can access only their invoices for the entered eventid
      query = 'SELECT id, "fileUrl", amount, "createdAt", "createdBy", accepted, "actionedBy", "actionedAt", "eventId" FROM "public"."invoices" WHERE "eventId" = $1 AND "createdBy" = $2';
      queryParams = [eventId, req.user.id];
    } else {
      return res.status(403).json({success: false, message: 'Insufficient Permissions'});
    }

    const rows = await pool.query(query, queryParams);

    if (rows.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'No invoices found for this eventId',
      });
    }

    res.status(200).json({success: true, data: rows.rows});
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false, message: 'Internal Server Error'});
  }
});

// Use the router
export default router;
