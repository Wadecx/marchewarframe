// api/proxy.js

export default async function handler(req, res) {
  // Récupérer le paramètre `urlName` de la requête
  const { urlName } = req.query;

  if (!urlName) {
    return res.status(400).json({ error: "urlName is required" }); // Si urlName est absent
  }

  const apiUrl = `https://api.warframe.market/v1/items/${urlName}/orders?include=item`; // L'URL externe de l'API

  try {
    // Faire une requête vers l'API externe
    const response = await fetch(apiUrl);

    if (!response.ok) {
      return res.status(response.status).json({ error: response.statusText });
    }

    const data = await response.json();
    res.status(200).json(data); // Renvoie les données à votre front-end
  } catch (error) {
    console.error("Erreur de requête API:", error);
    res
      .status(500)
      .json({ error: "Erreur interne du serveur", details: error.message });
  }
}
