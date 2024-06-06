// File: cosineSimilarity.js

// Implement the function to calculate cosine similarity
function calculateCosineSimilarity(vectorA, vectorB) {
  // Calculate the dot product of the two vectors
  let dotProduct = 0;
  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
  }

  // Calculate the magnitude of vectorA
  let magnitudeA = 0;
  for (let i = 0; i < vectorA.length; i++) {
    magnitudeA += Math.pow(vectorA[i], 2);
  }
  magnitudeA = Math.sqrt(magnitudeA);

  // Calculate the magnitude of vectorB
  let magnitudeB = 0;
  for (let i = 0; i < vectorB.length; i++) {
    magnitudeB += Math.pow(vectorB[i], 2);
  }
  magnitudeB = Math.sqrt(magnitudeB);

  // Calculate the cosine similarity
  let cosineSimilarity = dotProduct / (magnitudeA * magnitudeB);
  return cosineSimilarity;
}

// Export the calculateCosineSimilarity function to be used in interactivity.js
module.exports = calculateCosineSimilarity;