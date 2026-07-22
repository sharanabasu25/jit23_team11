const axios = require('axios');
const fs = require('fs');
const path = require('path');

/**
 * Service to handle communications with the FastAPI AI server.
 */

/**
 * Sends an image file to the FastAPI detect endpoint.
 * Accepts the absolute filepath, reads it, wraps it in a FormData object,
 * and posts it to the FastAPI server.
 * 
 * If FastAPI is down, it fails gracefully by returning a safe fallback.
 * 
 * @param {string} filePath - Absolute path to the image on the server.
 * @returns {Promise<object>} The classification response parameters.
 */
const detectGrievance = async (filePath) => {
  try {
    const fastapiUrl = process.env.FASTAPI_URL || 'http://localhost:8000';

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found at path: ${filePath}`);
    }

    // Read file buffer and filename
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    // Create a Blob from the file buffer (Native in modern Node.js)
    const fileBlob = new Blob([fileBuffer], { type: 'image/jpeg' });

    // Append to standard native FormData
    const formData = new FormData();
    formData.append('image', fileBlob, fileName);

    console.log(`[AI Service] Sending request to FastAPI at ${fastapiUrl}/detect...`);

    // Perform HTTP POST to FastAPI
    const response = await axios.post(`${fastapiUrl}/detect`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log(`[AI Service] Response received:`, response.data);
    return {
      success: true,
      class_name: response.data.class_name,
      confidence: response.data.confidence,
      routing_action: response.data.routing_action,
      department: response.data.department,
      model_version: response.data.model_version,
      message: response.data.message
    };
  } catch (error) {
    console.error(`[AI Service] Communication failure: ${error.message}`);
    
    // Graceful fallback values in case the FastAPI service is down/offline
    return {
      success: false,
      class_name: 'Unknown',
      confidence: 0.0,
      routing_action: 'HUMAN_REVIEW',
      department: 'Road Department', // safe fallback
      model_version: 'N/A',
      message: `AI service unavailable: ${error.message}`
    };
  }
};

module.exports = {
  detectGrievance
};
