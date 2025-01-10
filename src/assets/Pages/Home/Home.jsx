import { useState, useEffect } from "react";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { TfiServer } from "react-icons/tfi";
import { AiOutlineProduct } from "react-icons/ai";
import itemsData from "../../data/items.json";
import "./home.css";
import Navbar from "../../components/Navbar/Navbar";

const Home = () => {
  const [item, setItem] = useState(""); // L'élément recherché
  const [orders, setOrders] = useState([]); // Les ordres
  const [isSellingChecked, setIsSellingChecked] = useState(false); // Etat pour la case "Vendre"
  const [isBuyingChecked, setIsBuyingChecked] = useState(false); // Etat pour la case "Acheter"
  const [urlName, setUrlName] = useState(""); // Etat pour l'url_name à utiliser dans l'URL
  const [filteredItems, setFilteredItems] = useState([]); // Etat pour afficher les items filtrés
  const [showSuggestions, setShowSuggestions] = useState(false); // Pour afficher/masquer les suggestions
  const [itemPreview, setItemPreview] = useState(null); // Etat pour l'aperçu de l'item sélectionné

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setItem(searchTerm);

    if (searchTerm === "") {
      setFilteredItems([]);
      setShowSuggestions(false);
    } else {
      const filtered = itemsData.payload.items.filter((item) =>
        item.item_name.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
      const limitedResults = filtered.slice(0, 6);
      setFilteredItems(limitedResults);
      setShowSuggestions(limitedResults.length > 0);
    }
  };

  const handleItemClick = (itemName, urlName, thumb) => {
    setItem(itemName);
    setUrlName(urlName);
    setFilteredItems([]);
    setShowSuggestions(false);
    setItemPreview({
      name: itemName,
      thumb: `https://warframe.market/static/assets/${thumb}`,
    });

    handleSubmit(urlName);
  };

  const handleSubmit = async (urlName) => {
    if (!urlName) {
      alert("Veuillez entrer un nom d'élément valide.");
      return;
    }

    // Utiliser le proxy local
    const url = `/api/v1/items/${urlName}/orders?include=item`;

    try {
      const response = await fetch(url);

      // Vérifiez si la réponse est correcte
      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Erreur API: ${response.status} ${response.statusText}`,
          errorText
        );
        throw new Error(`Erreur: ${response.statusText}`);
      }

      const data = await response.json();
      setOrders(data.payload.orders);
    } catch (err) {
      console.error(err.message);
    }
  };
  const filteredOrders = orders.filter((order) => {
    if (order.user.status !== "online" && order.user.status !== "ingame")
      return false;
    if (isSellingChecked && order.order_type !== "sell") return false;
    if (isBuyingChecked && order.order_type !== "buy") return false;
    return true;
  });

  const sortedOrders = filteredOrders.sort((a, b) => {
    if (isSellingChecked) {
      return a.platinum - b.platinum;
    } else {
      return b.platinum - a.platinum;
    }
  });

  const priceToDisplay = sortedOrders.length > 0 ? sortedOrders[0].platinum : 0;
  const totalPlatinum = filteredOrders.reduce(
    (sum, order) => sum + order.platinum,
    0
  );
  const averagePlatinum =
    filteredOrders.length > 0 ? totalPlatinum / filteredOrders.length : 0;

  const [showMessage, setShowMessage] = useState({});

  const handleButtonClick = (index) => {
    setShowMessage((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        alert("Texte copié ✅");
      },
      (err) => {
        console.error("Erreur lors de la copie :", err);
      }
    );
  };

  return (
    <>
      <div className="home-container">
        <div className="search-section">
          <form className="form_style">
            <input
              type="text"
              name="Nom"
              placeholder="Nom"
              value={item}
              onChange={handleSearch}
              autoComplete="off"
            />

            <div className="checkbox">
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
            </div>
          </form>

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

          <div className="item_preview">
            {itemPreview && (
              <>
                <div className="preview-content">
                  <img
                    src={itemPreview.thumb}
                    alt={itemPreview.name}
                    className="item-thumb"
                  />
                  <h2>{itemPreview.name}</h2>
                </div>
                <div className="average">
                  <h3>Statistiques</h3>

                  <div className="averaged">
                    <p>Prix moyen:</p>

                    <p>
                      <span
                        style={{
                          color: "orange",
                          display: "flex",
                          textAlign: "center",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        {averagePlatinum.toFixed(0)} <TfiServer />
                      </span>
                    </p>
                  </div>
                  <div className="price">
                    <p>
                      {isSellingChecked ? "Prix minimum" : "Prix maximum"} :{" "}
                    </p>
                    <p>
                      <span
                        style={{
                          color: "#B74590",
                          display: "flex",
                          textAlign: "center",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        {priceToDisplay.toFixed(0)} <TfiServer />
                      </span>
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="results-section">
          {filteredOrders.length > 0 ? (
            <>
              {sortedOrders.map((order, index) => (
                <div
                  key={index}
                  className="player_data"
                  style={{
                    backgroundColor: index % 2 === 0 ? "#171E21" : "#101619",
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
                        color:
                          order.user.reputation > 10 ? "#039862" : "#fffff",
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
                  {order.mod_rank && <p>Rank : {order.mod_rank}</p>}

                  <button
                    className="action-btn"
                    onClick={() => {
                      handleButtonClick(index);
                      const message = isSellingChecked
                        ? `/w ${order.user.ingame_name} Hi, want to buy ${item} for ${order.platinum} Platinum (Warframe Market)`
                        : `/w ${order.user.ingame_name} Hi, want to sell ${item} for ${order.platinum} Platinum (Warframe Market)`;
                      copyToClipboard(message); // Copie le message dans le presse-papiers
                    }}
                  >
                    {isSellingChecked ? "Acheter" : "Vendre"}
                  </button>

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
            <p>No orders found</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
