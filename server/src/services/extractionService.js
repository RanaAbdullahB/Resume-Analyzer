const fs = require('fs');
const path = require('path');

// Use the lib path to avoid pdf-parse test file issue
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extract raw text from a PDF file.
 * @param {string} filePath - Absolute path to the PDF
 * @returns {Promise<string>} Extracted text
 */
const extractFromPDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer, {
    // Limit pages to avoid processing huge documents
    max: 10,
  });

  return data.text;
};

/**
 * Extract raw text from a DOCX file.
 * @param {string} filePath - Absolute path to the DOCX
 * @returns {Promise<string>} Extracted text
 */
const extractFromDOCX = async (filePath) => {
  const result = await mammoth.extractRawText({ path: filePath });

  if (result.messages && result.messages.length > 0) {
    const warnings = result.messages
      .filter((m) => m.type === 'warning')
      .map((m) => m.message);
    if (warnings.length > 0) {
      console.warn('DOCX extraction warnings:', warnings);
    }
  }

  return result.value;
};

/**
 * Normalize extracted text — remove excessive whitespace.
 * @param {string} text
 * @returns {string}
 */
const normalizeText = (text) => {
  return text
    .replace(/\r\n/g, '\n')       // Normalize line endings
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')   // Collapse triple+ newlines
    .replace(/[ \t]{2,}/g, ' ')   // Collapse multiple spaces/tabs
    .trim();
};

/**
 * Main extraction entry point.
 * @param {string} filePath - Absolute path to the file
 * @param {string} fileType - 'pdf' | 'docx'
 * @returns {Promise<string>} Normalized extracted text
 */
const extractText = async (filePath, fileType) => {
  if (!fs.existsSync(filePath)) {
    throw new Error('File not found on disk.');
  }

  let rawText = '';

  if (fileType === 'pdf') {
    rawText = await extractFromPDF(filePath);
  } else if (fileType === 'docx' || fileType === 'doc') {
    rawText = await extractFromDOCX(filePath);
  } else {
    throw new Error(`Unsupported file type: ${fileType}`);
  }

  const text = normalizeText(rawText);

  // Minimum quality check
  if (!text || text.length < 100) {
    throw new Error(
      'The resume appears to be empty or contains very little text. ' +
      'Please ensure the file is not a scanned image or corrupted.'
    );
  }

  return text;
};

/**
 * Safely delete a file from disk.
 * @param {string} filePath
 */
const deleteFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error(`Failed to delete file ${filePath}:`, error.message);
  }
};

module.exports = { extractText, deleteFile };