// api/proxy.js

import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { method, query, body } = req;
  
  // L'URL de l'API distante que vous voulez proxyfier
  const apiUrl = 'https://api.warframe.market';
  
  // Créer l'URL de l'API cible en fonction de la requête entrante
  const targetUrl = `${apiUrl}${req.url.replace('/api', '')}`;

  try {
    const response = await fetch(targetUrl, {
      method: method, // Vous pouvez rediriger n'importe quelle méthode (GET, POST, etc.)
      headers: {
        'Content-Type': 'application/json',
        // Vous pouvez ajouter d'autres headers ici si nécessaire
      },
      body: method === 'POST' || method === 'PUT' ? JSON.stringify(body) : null, // Pour les méthodes POST/PUT
    });

    const data = await response.json(); // Parse la réponse JSON
    res.status(response.status).json(data); // Retourne la réponse au client
  } catch (error) {
    console.error('Erreur du proxy:', error);
    res.status(500).json({ error: 'Erreur lors de la connexion à l\'API distante' });
  }
}