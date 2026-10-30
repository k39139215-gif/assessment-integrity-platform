import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { calculateIntegrityScore } from './riskEngine';
import path from 'path';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// POST /api/assessments/:id/events
app.post('/api/assessments/:id/events', async (req, res) => {
  try {
    const assessmentId = req.params.id;
    const { studentId, events } = req.body;

    if (!studentId || !Array.isArray(events)) {
      return res.status(400).json({ error: "studentId and events array are required" });
    }

    // Ensure session exists
    let session = await prisma.assessmentSession.findUnique({
      where: { id: assessmentId }
    });

    if (!session) {
      session = await prisma.assessmentSession.create({
        data: {
          id: assessmentId,
          studentId: studentId
        }
      });
    }

    // Create telemetry events
    const createdEvents = await Promise.all(
      events.map(event => prisma.telemetryEvent.create({
        data: {
          assessmentSessionId: assessmentId,
          clientTimestamp: event.iso,
          eventType: event.type,
          metadata: JSON.stringify(event.details)
        }
      }))
    );

    res.status(201).json({ success: true, count: createdEvents.length });
  } catch (error) {
    console.error("Error storing events:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/assessments/:id/integrity
app.get('/api/assessments/:id/integrity', async (req, res) => {
  try {
    const assessmentId = req.params.id;

    const events = await prisma.telemetryEvent.findMany({
      where: { assessmentSessionId: assessmentId },
      orderBy: { timestamp: 'asc' }
    });

    const parsedEvents = events.map(e => ({
      eventType: e.eventType,
      metadata: e.metadata
    }));

    const result = calculateIntegrityScore(parsedEvents);
    res.json(result);
  } catch (error) {
    console.error("Error calculating integrity score:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Assessment Integrity API running on http://localhost:${PORT}`);
});
