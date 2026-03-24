import Tesseract from 'tesseract.js';

/**
 * Extract text from an image using Tesseract OCR
 * @param {string} imageSrc - Data URL or image source
 * @returns {Promise<string>} - Extracted text from the image
 */
export const extractTextFromImage = async (imageSrc) => {
  try {
    const result = await Tesseract.recognize(imageSrc, 'eng', {
      logger: (m) => {
        // Log progress for debugging
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });

    const text = result.data.text;
    return text;
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to extract text from image');
  }
};

/**
 * Extract PAN number from text using regex
 * @param {string} text - Text to search in
 * @returns {string|null} - PAN number if found
 */
export const extractPAN = (text) => {
  // PAN format: ABCDE1234F (5 letters, 4 digits, 1 letter)
  const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]/g;
  const matches = text.match(panRegex);
  return matches ? matches[0] : null;
};

/**
 * Extract Aadhar number from text using regex
 * @param {string} text - Text to search in
 * @returns {string|null} - Aadhar number if found
 */
export const extractAadhar = (text) => {
  // Aadhar format: 12 digits, possibly with spaces or hyphens
  const aadharRegex = /(\d{4}[\s-]?\d{4}[\s-]?\d{4})/g;
  const matches = text.match(aadharRegex);
  if (matches) {
    // Clean up the matched string
    return matches[0].replace(/[\s-]/g, '');
  }
  return null;
};

/**
 * Extract name from text using regex
 * @param {string} text - Text to search in
 * @returns {string|null} - Name if found
 */
export const extractName = (text) => {
  // Try to find "name:" or "नाम:" followed by text
  const nameRegex = /(?:name|नाम|नाम्:\s*|Name:?\s*)([A-Za-z\s]+)/i;
  const match = text.match(nameRegex);
  return match ? match[1].trim().toUpperCase() : null;
};

/**
 * Extract date from text using regex
 * @param {string} text - Text to search in
 * @returns {string|null} - Date in YYYY-MM-DD format if found
 */
export const extractDate = (text) => {
  // Look for dates in various formats
  const dateRegex = /(\d{1,2}[-\/]\d{1,2}[-\/]\d{4}|\d{4}[-\/]\d{1,2}[-\/]\d{1,2})/;
  const match = text.match(dateRegex);
  
  if (match) {
    const dateParts = match[0].split(/[-\/]/);
    // Try to parse the date
    try {
      let day, month, year;
      
      if (dateParts.length === 3) {
        if (dateParts[2].length === 4) {
          // Format: DD-MM-YYYY or MM-DD-YYYY
          day = parseInt(dateParts[0]);
          month = parseInt(dateParts[1]);
          year = parseInt(dateParts[2]);
        } else {
          // Format: YYYY-MM-DD
          year = parseInt(dateParts[0]);
          month = parseInt(dateParts[1]);
          day = parseInt(dateParts[2]);
        }

        // Validate date
        if (day > 0 && day <= 31 && month > 0 && month <= 12 && year > 1900) {
          // Format as YYYY-MM-DD
          const monthStr = month.toString().padStart(2, '0');
          const dayStr = day.toString().padStart(2, '0');
          return `${year}-${monthStr}-${dayStr}`;
        }
      }
    } catch (e) {
      console.error('Date parsing error:', e);
    }
  }

  return null;
};

/**
 * Parse all extractable data from image text
 * @param {string} text - OCR extracted text
 * @returns {Object} - Parsed data with PAN, Aadhar, name, date
 */
export const parseDocumentText = (text) => {
  return {
    pan: extractPAN(text),
    aadhar: extractAadhar(text),
    name: extractName(text),
    dob: extractDate(text),
  };
};

/**
 * Validate PAN format
 * @param {string} pan - PAN number to validate
 * @returns {boolean} - True if valid PAN format
 */
export const isValidPAN = (pan) => {
  return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan);
};

/**
 * Validate Aadhar format (12 digits)
 * @param {string} aadhar - Aadhar number to validate
 * @returns {boolean} - True if valid Aadhar format
 */
export const isValidAadhar = (aadhar) => {
  const cleaned = aadhar.replace(/[\s-]/g, '');
  return /^\d{12}$/.test(cleaned);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone format
 */
export const isValidPhone = (phone) => {
  const cleaned = phone.replace(/[\s-+]/g, '');
  return /^\d{10,}$/.test(cleaned);
};

