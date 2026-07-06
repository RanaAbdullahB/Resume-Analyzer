const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ── Ensure uploads directory exists ──────────────────────────────────────────
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ── Storage Configuration ─────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `resume-${timestamp}-${random}${ext}`);
  },
});

// ── File Type Validation ──────────────────────────────────────────────────────
const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword', // .doc (older Word)
]);

const ALLOWED_EXTENSIONS = new Set(['.pdf', '.docx', '.doc']);

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isMimeAllowed = ALLOWED_MIME_TYPES.has(file.mimetype);
  const isExtAllowed = ALLOWED_EXTENSIONS.has(ext);

  if (isMimeAllowed && isExtAllowed) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type. Only PDF and DOCX files are accepted. ` +
        `Received: ${file.originalname}`
      ),
      false
    );
  }
};

// ── Multer Instance ───────────────────────────────────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    files: 1,                  // One file per request
  },
});

module.exports = upload;