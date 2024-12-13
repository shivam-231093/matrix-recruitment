const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const cors = require('cors');

// Initialize Firebase Admin SDK with your service account key
const serviceAccount = require('./key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://jlug-interview-default-rtdb.firebaseio.com"
  });

const db = admin.firestore();
const app = express();
const port = 5000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Endpoint to accept suggestion form data and store it in Firestore
app.post('/submit-suggestion', async (req, res) => {
  try {
    const { suggestion } = req.body;

    if (!suggestion) {
      return res.status(400).json({ error: 'Suggestion is required' });
    }

    // Store suggestion in the 'suggestions' collection in Firestore
    const docRef = db.collection('suggestions').doc();  // creates a new document with a unique ID
    await docRef.set({
      suggestion,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ message: 'Suggestion submitted successfully' });
  } catch (error) {
    console.error('Error submitting suggestion:', error);
    res.status(500).json({ error: 'Failed to submit suggestion' });
  }
});

// Endpoint to accept recruitment form data and store it in Firestore
app.post('/submit-recruitment', async (req, res) => {
    try {
      const {
        name,
        contact,
        email,
        year,
        branch,
        matrixBranch,
        workExperience,
        qualities,
        right,
        reject,
        teamwork,
        adaptation,
        problem,
        Case1,
        Case2,
      } = req.body;
  
      // Validation: Check if required fields are present
      if (!name || !email || !contact) {
        return res.status(400).json({ error: "Name, email, and contact are required" });
      }
  
      // Set the email as the document ID
      const docRef = db.collection("recruitment").doc(email);
  
      // Store the recruitment data in Firestore
      await docRef.set({
        name,
        contact,
        email,
        year,
        branch,
        matrixBranch,
        workExperience,
        qualities,
        right,
        reject,
        teamwork,
        adaptation,
        problem,
        Case1,
        Case2,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
  
      res.status(200).json({ message: "Recruitment application submitted successfully" });
    } catch (error) {
      console.error("Error submitting recruitment data:", error);
      res.status(500).json({ error: "Failed to submit recruitment data" });
    }
  });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
