const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// In-memory stores (replace with DB in future)
let pets = [];
let medicines = [];
let schedules = [];

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));

// Pets
app.get('/api/pets', (req, res) => res.json(pets));
app.post('/api/pets', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const pet = { id: Date.now().toString(), name };
  pets.push(pet);
  res.status(201).json(pet);
});

// Medicines
app.get('/api/medicines', (req, res) => res.json(medicines));
app.post('/api/medicines', (req, res) => {
  const { name, dose } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const med = { id: Date.now().toString(), name, dose };
  medicines.push(med);
  res.status(201).json(med);
});

// Schedules
app.get('/api/schedules', (req, res) => res.json(schedules));
app.post('/api/schedules', (req, res) => {
  const { petId, medicineId, time, note } = req.body;
  if (!petId || !medicineId || !time) return res.status(400).json({ error: 'petId, medicineId, and time required' });
  const schedule = { id: Date.now().toString(), petId, medicineId, time, note: note || '', createdAt: new Date().toISOString() };
  schedules.push(schedule);
  res.status(201).json(schedule);
});

// Health
app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
