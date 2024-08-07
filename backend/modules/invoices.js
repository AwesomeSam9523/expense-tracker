import {v4 as uuidv4} from 'uuid';
import {Router} from 'express';
import pool from '../utils/database.js';
import {uploadImage} from "../utils/tools.js";

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

    const event = await pool.query('SELECT id, budget, closed FROM "public"."events" WHERE id = $1', [eventId]);
    if (event.rowCount === 0) {
      return res.status(404).json({success: false, message: 'Event not found'});
    }

    if (event.rows[0].closed) {
      return res.status(400).json({success: false, message: 'Event is closed'});
    }

    if (amount > event.rows[0].budget) {
      return res.status(400).json({success: false, message: 'Amount exceeds event budget'});
    }

    const fileExtension = mimeType.split('/')[1];
    const id = uuidv4();
    try {
      await uploadImage(id, image, mimeType);
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
      SELECT invoices."id", invoices."amount", e."name" as "eventName", u."name", u."username", "fileUrl", "eventId", u."pfp", u."role", invoices."createdBy"
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
    SELECT "invoices"."id", "shortId", "accepted", e."name" as "eventName", "amount", e."id" as "eventId" FROM "public"."invoices" 
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
    await pool.query('UPDATE "public"."events" SET "expenditure" = "expenditure" + $1 WHERE id = $2', [invoice.amount, invoice.eventId]);
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
      query = `
      SELECT invoices."id", "fileUrl", amount, invoices."createdAt", invoices."createdBy", accepted, "actionedBy", 
             "actionedAt", "eventId", u."name", u."pfp", u."role"
      FROM "public"."invoices" 
      INNER JOIN public.users u on u.id = invoices."createdBy"
      WHERE "eventId" = $1`;
      queryParams = [eventId];
    } else {
      query = `
        SELECT invoices."id", "fileUrl", amount, invoices."createdAt", invoices."createdBy", accepted, "actionedBy",
               "actionedAt", "eventId", u."name", u."pfp", u."role"
        FROM "public"."invoices"
        INNER JOIN public.users u on u.id = invoices."createdBy"
        WHERE "eventId" = $1 AND invoices."createdBy" = $2`;
      queryParams = [eventId, req.user.id];
    }

    const data = await pool.query(query, queryParams);
    res.status(200).json({success: true, data: data.rows});
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false, message: 'Internal Server Error'});
  }
});

router.get('/mine', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({success: false, message: 'Unauthorized'});
    }

    const data = await pool.query(
      `SELECT i."id", i."fileUrl", i.amount, i."createdAt", i."createdBy", i.accepted, i."actionedBy", i."actionedAt", e.name, e.image as "pfp" FROM "public"."invoices" i
      INNER JOIN "public"."events" e on e."id" = i."eventId" WHERE i."createdBy" = $1 ORDER BY "createdAt" DESC`,
      [req.user.id]
    );

    res.status(200).json({success: true, data: data.rows});
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false, message: 'Internal Server Error'});
  }
});

// Use the router
export default router;
