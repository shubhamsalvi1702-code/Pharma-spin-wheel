import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Persistent data directory
const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const PARTICIPANTS_FILE = path.join(DATA_DIR, 'participants.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

// Default Campaign Configuration
const DEFAULT_PRIZES = [
  {
    id: 'kettle',
    name: 'KETTLE',
    shortLabel: 'KETTLE',
    probability: 10,
    color: '#0d9488', // Teal 600
    textColor: '#ffffff',
    accentColor: '#14b8a6',
    icon: 'kettle',
    isWin: true,
    congratsHeader: 'CONGRATULATIONS! 🎉',
    instruction: 'Please show this screen to your MR to claim your reward.',
  },
  {
    id: 'umbrella',
    name: 'UMBRELLA',
    shortLabel: 'UMBRELLA',
    probability: 15,
    color: '#0284c7', // Sky 600
    textColor: '#ffffff',
    accentColor: '#38bdf8',
    icon: 'umbrella',
    isWin: true,
    congratsHeader: 'CONGRATULATIONS! 🎉',
    instruction: 'Please show this screen to your MR to claim your reward.',
  },
  {
    id: 'scissor',
    name: 'SCISSOR',
    shortLabel: 'SCISSOR',
    probability: 15,
    color: '#059669', // Emerald 600
    textColor: '#ffffff',
    accentColor: '#34d399',
    icon: 'scissors',
    isWin: true,
    congratsHeader: 'CONGRATULATIONS! 🎉',
    instruction: 'Please show this screen to your MR to claim your reward.',
  },
  {
    id: 'mystery_gift',
    name: 'MYSTERY GIFT',
    shortLabel: 'MYSTERY GIFT',
    probability: 15,
    color: '#6366f1', // Indigo 500
    textColor: '#ffffff',
    accentColor: '#818cf8',
    icon: 'gift',
    isWin: true,
    congratsHeader: 'CONGRATULATIONS! 🎁',
    instruction: 'Please show this screen to your MR to claim your reward.',
  },
  {
    id: 'product',
    name: 'PRODUCT',
    shortLabel: 'PRODUCT',
    probability: 25,
    color: '#0891b2', // Cyan 600
    textColor: '#ffffff',
    accentColor: '#22d3ee',
    icon: 'package',
    isWin: true,
    congratsHeader: 'CONGRATULATIONS! 🎉',
    instruction: 'Please show this screen to your MR to claim your reward.',
  },
  {
    id: 'blank',
    name: 'BLANK',
    shortLabel: 'BLANK',
    probability: 20,
    color: '#64748b', // Slate 500
    textColor: '#ffffff',
    accentColor: '#94a3b8',
    icon: 'sparkles',
    isWin: false,
    congratsHeader: 'BETTER LUCK NEXT TIME!',
    instruction: 'Thank you for participating.',
  },
];

const DEFAULT_CONFIG = {
  campaignTitle: 'SPIN & WIN',
  campaignSubtitle: 'Your chance to win exciting rewards!',
  supportingLine: 'Enter your details and spin the wheel to discover your reward.',
  ctaText: 'START SPINNING',
  spinInstruction: 'Tap SPIN NOW and see what you win!',
  prizes: DEFAULT_PRIZES,
  adminPassword: 'meyer@123',
};

// In-memory data store with file backing
function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading config file:', err);
  }
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(DEFAULT_CONFIG, null, 2));
  return DEFAULT_CONFIG;
}

function saveConfig(cfg: typeof DEFAULT_CONFIG) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2));
}

function loadParticipants(): any[] {
  try {
    if (fs.existsSync(PARTICIPANTS_FILE)) {
      const data = fs.readFileSync(PARTICIPANTS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading participants file:', err);
  }
  
  // Seed with realistic initial data if file is newly created
  const initialData = [
    {
      id: 'P-1001',
      name: 'Rajesh Sharma',
      phone: '9820123456',
      pharmacyName: 'Apollo Pharmacy Bandra',
      city: 'Mumbai',
      prizeId: 'kettle',
      prizeName: 'KETTLE',
      prizeSliceIndex: 0,
      isWin: true,
      timestamp: Date.now() - 3600000 * 4,
      date: new Date(Date.now() - 3600000 * 4).toISOString().split('T')[0],
      time: new Date(Date.now() - 3600000 * 4).toLocaleTimeString('en-IN', { hour12: false }),
      claimCode: 'CLM-7841',
    },
    {
      id: 'P-1002',
      name: 'Priya Sundaram',
      phone: '9845112233',
      pharmacyName: 'MedPlus Chemist',
      city: 'Bengaluru',
      prizeId: 'umbrella',
      prizeName: 'UMBRELLA',
      prizeSliceIndex: 1,
      isWin: true,
      timestamp: Date.now() - 3600000 * 3,
      date: new Date(Date.now() - 3600000 * 3).toISOString().split('T')[0],
      time: new Date(Date.now() - 3600000 * 3).toLocaleTimeString('en-IN', { hour12: false }),
      claimCode: 'CLM-9124',
    },
    {
      id: 'P-1003',
      name: 'Amit Patel',
      phone: '9909234567',
      pharmacyName: 'Sanjivani Medicos',
      city: 'Ahmedabad',
      prizeId: 'product',
      prizeName: 'PRODUCT',
      prizeSliceIndex: 4,
      isWin: true,
      timestamp: Date.now() - 3600000 * 2,
      date: new Date(Date.now() - 3600000 * 2).toISOString().split('T')[0],
      time: new Date(Date.now() - 3600000 * 2).toLocaleTimeString('en-IN', { hour12: false }),
      claimCode: 'CLM-3312',
    },
    {
      id: 'P-1004',
      name: 'Sunil Verma',
      phone: '9811098765',
      pharmacyName: 'Wellness Forever',
      city: 'Delhi',
      prizeId: 'mystery_gift',
      prizeName: 'MYSTERY GIFT',
      prizeSliceIndex: 3,
      isWin: true,
      timestamp: Date.now() - 3600000 * 1,
      date: new Date(Date.now() - 3600000 * 1).toISOString().split('T')[0],
      time: new Date(Date.now() - 3600000 * 1).toLocaleTimeString('en-IN', { hour12: false }),
      claimCode: 'CLM-5520',
    },
    {
      id: 'P-1005',
      name: 'Anjali Deshmukh',
      phone: '9764512345',
      pharmacyName: 'Shree Sai Chemist',
      city: 'Pune',
      prizeId: 'blank',
      prizeName: 'BLANK',
      prizeSliceIndex: 5,
      isWin: false,
      timestamp: Date.now() - 1800000,
      date: new Date(Date.now() - 1800000).toISOString().split('T')[0],
      time: new Date(Date.now() - 1800000).toLocaleTimeString('en-IN', { hour12: false }),
      claimCode: 'CLM-0000',
    },
  ];

  fs.writeFileSync(PARTICIPANTS_FILE, JSON.stringify(initialData, null, 2));
  return initialData;
}

function saveParticipants(participants: any[]) {
  fs.writeFileSync(PARTICIPANTS_FILE, JSON.stringify(participants, null, 2));
}

let activeConfig = loadConfig();
let participants = loadParticipants();

// Concurrency lock for mobile numbers during in-flight spin requests
const inFlightSpins = new Set<string>();

// Helper: Secure weighted random selection
function pickPrize(prizes: any[]): { prize: any; sliceIndex: number } {
  const totalWeight = prizes.reduce((sum, p) => sum + (Number(p.probability) || 0), 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < prizes.length; i++) {
    const p = prizes[i];
    const weight = Number(p.probability) || 0;
    if (random < weight) {
      return { prize: p, sliceIndex: i };
    }
    random -= weight;
  }
  // Fallback to first
  return { prize: prizes[0], sliceIndex: 0 };
}

// ---------------- API ROUTES ----------------

// 1. Public Campaign Config (sanitized, probabilities hidden)
app.get('/api/config', (req, res) => {
  const publicPrizes = activeConfig.prizes.map((p: any) => ({
    id: p.id,
    name: p.name,
    shortLabel: p.shortLabel,
    color: p.color,
    textColor: p.textColor,
    accentColor: p.accentColor,
    icon: p.icon,
    isWin: p.isWin,
    congratsHeader: p.congratsHeader,
    instruction: p.instruction,
  }));

  res.json({
    campaignTitle: activeConfig.campaignTitle,
    campaignSubtitle: activeConfig.campaignSubtitle,
    supportingLine: activeConfig.supportingLine,
    ctaText: activeConfig.ctaText,
    spinInstruction: activeConfig.spinInstruction,
    prizes: publicPrizes,
  });
});

// 2. Check if mobile number has already participated
app.post('/api/check-phone', (req, res) => {
  const { phone } = req.body;
  if (!phone || !String(phone).trim()) {
    return res.status(400).json({ error: 'Mobile phone number is required.' });
  }

  const cleanPhone = String(phone).trim();
  const digitsOnly = cleanPhone.replace(/\D/g, '');

  const existing = participants.find((p) => {
    const existingClean = String(p.phone).trim();
    const existingDigits = existingClean.replace(/\D/g, '');
    if (digitsOnly && existingDigits) {
      return existingDigits === digitsOnly;
    }
    return existingClean.toLowerCase() === cleanPhone.toLowerCase();
  });

  if (existing) {
    return res.status(200).json({
      alreadyParticipated: true,
      participant: existing,
      message: 'You have already participated in this campaign.',
    });
  }

  res.json({ alreadyParticipated: false });
});

// 3. Spin the wheel (Server-side prize selection & atomic registration)
app.post('/api/spin', (req, res) => {
  const { name, phone, pharmacyName, city } = req.body;

  // Validation
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Please complete all required fields to continue. Pharmacist Name is required.' });
  }
  if (!phone || !String(phone).trim()) {
    return res.status(400).json({ error: 'Please complete all required fields to continue. Mobile Number is required.' });
  }
  if (!pharmacyName || !pharmacyName.trim()) {
    return res.status(400).json({ error: 'Please complete all required fields to continue. Pharmacy Name is required.' });
  }
  if (!city || !city.trim()) {
    return res.status(400).json({ error: 'Please complete all required fields to continue. City is required.' });
  }

  const cleanPhone = String(phone).trim();
  const digitsOnly = cleanPhone.replace(/\D/g, '');

  // Prevent duplicate concurrent requests
  if (inFlightSpins.has(cleanPhone)) {
    return res.status(429).json({ error: 'A spin request is already being processed for this mobile number.' });
  }

  // Check database for existing participation
  const existing = participants.find((p) => {
    const existingClean = String(p.phone).trim();
    const existingDigits = existingClean.replace(/\D/g, '');
    if (digitsOnly && existingDigits) {
      return existingDigits === digitsOnly;
    }
    return existingClean.toLowerCase() === cleanPhone.toLowerCase();
  });

  if (existing) {
    return res.status(409).json({
      error: 'You have already participated in this campaign.',
      alreadyParticipated: true,
      participant: existing,
    });
  }

  inFlightSpins.add(cleanPhone);

  try {
    // Determine prize using backend logic
    const { prize, sliceIndex } = pickPrize(activeConfig.prizes);

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('en-IN', { hour12: false });
    const claimCode = prize.isWin
      ? `CLM-${Math.floor(1000 + Math.random() * 9000)}`
      : 'CLM-0000';

    const newParticipant = {
      id: `P-${1000 + participants.length + 1}`,
      name: name.trim(),
      phone: cleanPhone,
      pharmacyName: pharmacyName.trim(),
      city: city.trim(),
      prizeId: prize.id,
      prizeName: prize.name,
      prizeSliceIndex: sliceIndex,
      isWin: prize.isWin,
      timestamp: Date.now(),
      date: dateStr,
      time: timeStr,
      claimCode,
    };

    // Save to persistent database
    participants.unshift(newParticipant);
    saveParticipants(participants);

    return res.json({
      success: true,
      sliceIndex,
      prize: {
        id: prize.id,
        name: prize.name,
        shortLabel: prize.shortLabel,
        color: prize.color,
        textColor: prize.textColor,
        accentColor: prize.accentColor,
        icon: prize.icon,
        isWin: prize.isWin,
        congratsHeader: prize.congratsHeader,
        instruction: prize.instruction,
      },
      participant: newParticipant,
    });
  } catch (err: any) {
    console.error('Spin error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  } finally {
    inFlightSpins.delete(cleanPhone);
  }
});

// 4. Admin Auth
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === (activeConfig.adminPassword || 'admin')) {
    const token = `adm_${Buffer.from(String(Date.now())).toString('base64')}`;
    return res.json({ success: true, token });
  }
  return res.status(401).json({ error: 'Invalid admin credentials' });
});

// Admin Middleware for protected routes
function verifyAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer adm_')) {
    return res.status(401).json({ error: 'Unauthorized access to admin dashboard.' });
  }
  next();
}

// 5. Admin: Get all participants with search, filter, pagination
app.get('/api/admin/participants', verifyAdmin, (req, res) => {
  const search = String(req.query.search || '').toLowerCase().trim();
  const prize = String(req.query.prize || '').toLowerCase().trim();
  const city = String(req.query.city || '').toLowerCase().trim();
  const date = String(req.query.date || '').trim();

  let filtered = [...participants];

  if (search) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.phone.includes(search) ||
        p.pharmacyName.toLowerCase().includes(search) ||
        p.city.toLowerCase().includes(search) ||
        p.claimCode.toLowerCase().includes(search)
    );
  }

  if (prize && prize !== 'all') {
    filtered = filtered.filter((p) => p.prizeId.toLowerCase() === prize);
  }

  if (city && city !== 'all') {
    filtered = filtered.filter((p) => p.city.toLowerCase() === city);
  }

  if (date) {
    filtered = filtered.filter((p) => p.date === date);
  }

  // Summary counts
  const prizeCounts: Record<string, number> = {};
  const cityCounts: Record<string, number> = {};
  let totalPrizesIssued = 0;

  activeConfig.prizes.forEach((p: any) => {
    prizeCounts[p.name] = 0;
  });

  participants.forEach((p) => {
    prizeCounts[p.prizeName] = (prizeCounts[p.prizeName] || 0) + 1;
    cityCounts[p.city] = (cityCounts[p.city] || 0) + 1;
    if (p.isWin) {
      totalPrizesIssued++;
    }
  });

  const uniqueCities = Array.from(new Set(participants.map((p) => p.city))).filter(Boolean);

  res.json({
    totalParticipants: participants.length,
    totalPrizesIssued,
    prizeCounts,
    cityCounts,
    uniqueCities,
    filteredCount: filtered.length,
    participants: filtered,
  });
});

// 6. Admin: Export CSV
app.get('/api/admin/export', verifyAdmin, (req, res) => {
  const headers = ['ID', 'Date', 'Time', 'Pharmacist Name', 'Mobile Number', 'Pharmacy Name', 'City', 'Prize Won', 'Win Status', 'Claim Code'];
  const rows = participants.map((p) => [
    `"${p.id}"`,
    `"${p.date}"`,
    `"${p.time}"`,
    `"${(p.name || '').replace(/"/g, '""')}"`,
    `"${p.phone}"`,
    `"${(p.pharmacyName || '').replace(/"/g, '""')}"`,
    `"${(p.city || '').replace(/"/g, '""')}"`,
    `"${p.prizeName}"`,
    `"${p.isWin ? 'WON' : 'BLANK'}"`,
    `"${p.claimCode}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="pharmacist_campaign_export_${Date.now()}.csv"`);
  res.send(csvContent);
});

// 7. Admin: Get full config with probabilities
app.get('/api/admin/config', verifyAdmin, (req, res) => {
  res.json(activeConfig);
});

// 8. Admin: Update config and probabilities
app.post('/api/admin/config', verifyAdmin, (req, res) => {
  const { campaignTitle, campaignSubtitle, supportingLine, prizes, adminPassword } = req.body;

  if (prizes && Array.isArray(prizes)) {
    activeConfig.prizes = prizes;
  }
  if (campaignTitle) activeConfig.campaignTitle = campaignTitle;
  if (campaignSubtitle) activeConfig.campaignSubtitle = campaignSubtitle;
  if (supportingLine) activeConfig.supportingLine = supportingLine;
  if (adminPassword) activeConfig.adminPassword = adminPassword;

  saveConfig(activeConfig);
  res.json({ success: true, config: activeConfig });
});

// 9. Admin: Clear or reset participants
app.post('/api/admin/reset-participants', verifyAdmin, (req, res) => {
  participants = [];
  saveParticipants(participants);
  res.json({ success: true, message: 'All participants data reset successfully.' });
});

// ---------------- VITE MIDDLEWARE & STATIC SERVING ----------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Pharmacist Spin & Win server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
