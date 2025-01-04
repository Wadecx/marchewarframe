import { useState, useEffect } from "react";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { TfiServer } from "react-icons/tfi";
import { AiOutlineProduct } from "react-icons/ai";
import itemsData from "../../data/items.json";
import "./home.css";

const Home = () => {
  const [item, setItem] = useState(""); // L'élément recherché
  const [orders, setOrders] = useState([]); // Les ordres
  const [isSellingChecked, setIsSellingChecked] = useState(false); // Etat pour la case "Vendre"
  const [isBuyingChecked, setIsBuyingChecked] = useState(false); // Etat pour la case "Acheter"
  const [urlName, setUrlName] = useState(""); // Etat pour l'url_name à utiliser dans l'URL
  const [filteredItems, setFilteredItems] = useState([]); // Etat pour afficher les items filtrés
  const [showSuggestions, setShowSuggestions] = useState(false); // Pour afficher/masquer les suggestions
  const [itemPreview, setItemPreview] = useState(null); // Etat pour l'aperçu de l'item sélectionné

  // Fonction pour gérer la recherche d'un item par item_name et mettre à jour l'url_name
  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setItem(searchTerm);

    // Si la recherche est vide, masquer les suggestions
    if (searchTerm === "") {
      setFilteredItems([]);
      setShowSuggestions(false);
    } else {
      // Filtrer les éléments qui commencent par le texte de recherche
      const filtered = itemsData.payload.items.filter((item) =>
        item.item_name.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
      // Limiter à 6 résultats maximum
      const limitedResults = filtered.slice(0, 6);
      setFilteredItems(limitedResults);
      setShowSuggestions(limitedResults.length > 0);
    }
  };

  // Lorsque l'on clique sur une suggestion, on met à jour le champ et lance la recherche
  const handleItemClick = (itemName, urlName, thumb) => {
    setItem(itemName);
    setUrlName(urlName); // Mise à jour du urlName
    setFilteredItems([]); // Masquer les suggestions après sélection
    setShowSuggestions(false); // Masquer les suggestions
    setItemPreview({
      name: itemName,
      thumb: `https://warframe.market/static/assets/${thumb}`,
    });

    // Appeler directement handleSubmit pour lancer la recherche
    handleSubmit(urlName);
  };

  const handleSubmit = async (urlName) => {
    // Vérifier que urlName est bien défini
    if (!urlName) {
      alert("Veuillez entrer un nom d'élément valide.");
      return;
    }

    const url = `api/v1/items/${urlName}/orders?include=item`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erreur: ${response.statusText}`);
      }
      const data = await response.json();
      setOrders(data.payload.orders); // Stocker la liste des commandes
    } catch (err) {
      console.error(err.message);
    }
  };

  // Filtrer les résultats en fonction des cases à cocher et du statut "online"
  const filteredOrders = orders.filter((order) => {
    if (order.user.status !== "online") return false;
    if (isSellingChecked && order.order_type !== "sell") return false;
    if (isBuyingChecked && order.order_type !== "buy") return false;
    return true;
  });

  // Trier les ordres par prix (platinum) selon la case "Vendre"
  const sortedOrders = filteredOrders.sort((a, b) => {
    if (isSellingChecked) {
      return a.platinum - b.platinum; // Prix le plus bas en premier si "Vendre" est coché
    } else {
      return b.platinum - a.platinum; // Prix le plus élevé en premier si "Vendre" est décoché
    }
  });

  // Récupérer le prix le plus bas ou le plus élevé en fonction de la case "Vendre"
  const priceToDisplay = sortedOrders.length > 0 ? sortedOrders[0].platinum : 0;

  // Calcul de la moyenne du prix en platinum
  const totalPlatinum = filteredOrders.reduce(
    (sum, order) => sum + order.platinum,
    0
  );
  const averagePlatinum =
    filteredOrders.length > 0 ? totalPlatinum / filteredOrders.length : 0;

  // Créer un état pour gérer le message pour chaque joueur
  const [showMessage, setShowMessage] = useState({});

  const handleButtonClick = (index) => {
    setShowMessage((prevState) => ({
      ...prevState,
      [index]: !prevState[index], // Inverse l'état du message pour ce joueur spécifique
    }));
  };

  return (
    <div className="home">
      <form className="form_style">
        <input
          type="text"
          name="Nom"
          placeholder="Nom"
          value={item} // Lier la barre de recherche à l'état item
          onChange={handleSearch} // Appeler handleSearch lors de la saisie
          autocomplete="off"
        />
        {/* Le bouton de soumission est maintenant inutile car handleSubmit est appelé directement */}
        <label>
          <input
            type="checkbox"
            checked={isSellingChecked}
            onChange={() => setIsSellingChecked(!isSellingChecked)}
          />
          Vendre
        </label>

        <label>
          <input
            type="checkbox"
            checked={isBuyingChecked}
            onChange={() => setIsBuyingChecked(!isBuyingChecked)}
          />
          Acheter
        </label>
      </form>

      {/* Affichage des suggestions de recherche */}
      {showSuggestions && (
        <div className="suggestions-list">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="suggestion-item"
              onClick={() =>
                handleItemClick(item.item_name, item.url_name, item.thumb)
              }
            >
              {item.item_name}
            </div>
          ))}
        </div>
      )}

      {/* Affichage de l'aperçu de l'item sélectionné */}
      <div className="item_preview">
        {itemPreview && (
          <div className="preview-content">
            <img
              src={itemPreview.thumb}
              alt={itemPreview.name}
              className="item-thumb"
            />
            <h2>{itemPreview.name}</h2>
          </div>
        )}
      </div>

      <div>
        {filteredOrders.length > 0 ? (
          <>
            <div className="average">
              <h2>
                Moyenne du prix : {averagePlatinum.toFixed(2)}
                <img
                  src="/img/pl.webp"
                  alt="Image de votre choix"
                  className="votre-classe-image"
                />
              </h2>
              <h2>
                {isSellingChecked ? "Prix le plus bas" : "Prix le plus élevé"} :{" "}
                {priceToDisplay}
                <img
                  src="/img/pl.webp"
                  alt="Image de votre choix"
                  className="votre-classe-image"
                />
              </h2>
            </div>

            <div className="details">
              <h3>User</h3>
              <h3>Status</h3>
              <h3>Reputation</h3>
              <h3>Platinum</h3>
              <h3>Quantity</h3>
            </div>

            {sortedOrders.map((order, index) => (
              <div
                key={index}
                className="player_data"
                style={{
                  backgroundColor: index % 2 === 0 ? "#171E21" : "#101619", // Alternance des couleurs
                }}
              >
                <a href="">
                  {order.user.avatar ? (
                    <img
                      src={`https://warframe.market/static/assets/${order.user.avatar}`}
                      alt={`Avatar de ${order.user.ingame_name}`}
                      className="player-avatar"
                    />
                  ) : (
                    <img
                      src={`https://warframe.market/static/assets/user/default-avatar.png`}
                      alt="Avatar par défaut"
                      className="player-avatar"
                    />
                  )}
                  {order.user.ingame_name}
                </a>
                <p>
                  {" "}
                  <span
                    style={{
                      color: "#6C56A1",
                      textTransform: "uppercase",
                    }}
                  >
                    {order.user.status}
                  </span>
                </p>
                <p>
                  <span
                    style={{
                      color: order.user.reputation > 10 ? "#039862" : "#fffff", // Si la réputation > 10, la couleur devient verte
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {order.user.reputation} <HiOutlineEmojiHappy />
                  </span>
                </p>
                <p>
                  <span
                    style={{
                      color: "#b74590",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {order.platinum} <TfiServer />
                  </span>
                </p>
                <p>
                  {order.quantity} <AiOutlineProduct />
                </p>

                {/* Bouton avec texte conditionnel */}
                <button
                  className="action-btn"
                  onClick={() => handleButtonClick(index)}
                >
                  {isSellingChecked ? "Acheter" : "Vendre"}
                </button>

                {/* Affichage du message uniquement pour ce joueur */}
                {showMessage[index] && (
                  <div className="message">
                    <input
                      type="text"
                      value={
                        isSellingChecked
                          ? `/w ${order.user.ingame_name} Hi, want to buy ${item} for ${order.platinum} Platinum (Warframe Market)`
                          : `/w ${order.user.ingame_name} Hi, want to sell ${item} for ${order.platinum} Platinum (Warframe Market)`
                      }
                      readOnly
                    />
                  </div>
                )}
              </div>
            ))}
          </>
        ) : (
          <img src="" />
        )}
      </div>
    </div>
  );
};

export default Home;
