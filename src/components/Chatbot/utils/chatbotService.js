import axios from 'axios';

// Determine base URL based on environment variable
const API_BASE_URL = process.env.REACT_APP_USE_LOCAL_API === 'true'
  ? 'http://127.0.0.1:8000'
  : 'https://stockagent.onrender.com';

/**
 * Generate a unique session ID using UUID v4
 */
export const generateSessionId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Send a message to the financial assistant chatbot
 * @param {string} sessionId - Unique session identifier
 * @param {string} message - User's message
 * @returns {Promise} API response
 */
export const sendMessage = async (sessionId, message) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/chat/financial-assistant`, {
      session_id: sessionId,
      message: message
    });
    return response.data;
  } catch (error) {
    console.error('Chatbot API Error:', error);
    throw error;
  }
};

/**
 * Get conversation history for a session
 * @param {string} sessionId - Session identifier
 * @returns {Promise} Conversation history
 */
export const getSessionHistory = async (sessionId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/chat/sessions/${sessionId}/history`);
    return response.data;
  } catch (error) {
    console.error('Error fetching session history:', error);
    throw error;
  }
};

/**
 * Clear session / start new chat
 * @param {string} sessionId - Session identifier
 * @returns {Promise} Delete confirmation
 */
export const clearSession = async (sessionId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/chat/sessions/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error clearing session:', error);
    throw error;
  }
};

/**
 * Get session statistics
 * @returns {Promise} Session stats
 */
export const getSessionStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/chat/sessions/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching session stats:', error);
    throw error;
  }
};
