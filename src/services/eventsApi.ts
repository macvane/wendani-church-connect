import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/form'; // Replace with your actual backend URL

export const fetchEventsList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/events/list/`); // Adjust endpoint as needed
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};