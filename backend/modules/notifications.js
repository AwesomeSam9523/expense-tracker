import { Router } from 'express';
import pool from '../utils/database.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({success: false, message: 'Unauthorized'});
    }

    const offset = req.query.offset || 0;
    const data = await pool.query('SELECT "id", "data", "type", "read" FROM "public"."notifications" WHERE "userId" = $1 ORDER BY "createdAt" DESC LIMIT 20 OFFSET $2', [req.user.id, offset]);

    res.status(200).json({success: true, data: data.rows});
  } catch (e) {
    console.error(e);
    res.status(500).json({success: false, message: 'Internal Server Error'});
  }
});

router.post('/read', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({success: false, message: 'Unauthorized'});
    }

    const {id} = req.body;
    if (!id) {
      return res.status(400).json({success: false, message: 'Notification ID is required'});
    }

    await pool.query('UPDATE "public"."notifications" SET "read" = $3 AND "readAt" = NOW() WHERE "id" = $1 AND "userId" = $2', [id, req.user.id, true]);
    res.status(200).json({success: true, message: 'Notification read!'});
  } catch (e) {
    console.error(e);
    res.status(500).json({success: false, message: 'Internal Server Error'});
  }
});

export default router;
