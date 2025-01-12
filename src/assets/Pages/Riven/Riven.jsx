import { useState, useEffect } from "react";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { TfiServer } from "react-icons/tfi";
import { AiOutlineProduct } from "react-icons/ai";
import itemsData from "../../data/rivens.json";
import "./riven.css";

const Riven = () => {
  const [item, setItem] = useState(""); // Élément recherché
  const [auctions, setAuctions] = useState([]); // Enchères récupérées
  const [isSellingChecked, setIsSellingChecked] = useState(false); // Filtre "Vendre"
  const [isBuyingChecked, setIsBuyingChecked] = useState(false); // Filtre "Acheter"
  const [urlName, setUrlName] = useState(""); // URL de l'élément
  const [filteredItems, setFilteredItems] = useState([]); // Suggestions d'items
  const [showSuggestions, setShowSuggestions] = useState(false); // Affichage des suggestions
  const [itemPreview, setItemPreview] = useState(null); // Aperçu de l'élément sélectionné
  const [showMessage, setShowMessage] = useState({}); // Messages interactifs pour chaque enchère

  // Gestion de la recherche
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

  // Gestion de la sélection d'un élément dans les suggestions
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

  // Soumettre la requête pour récupérer les enchères
  const handleSubmit = async (urlName) => {
    if (!urlName) {
      alert("Veuillez entrer un nom d'élément valide.");
      return;
    }

    const url = `api/v1/auctions/search?type=riven&buyout_policy=direct&weapon_url_name=${urlName}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erreur: ${response.statusText}`);
      }
      const data = await response.json();
      setAuctions(data.payload.auctions);
    } catch (err) {
      console.error(err.message);
    }
  };

  // Filtrer les enchères visibles
  const filteredAuctions = auctions.filter((auction) => {
    const { owner, buyout_price } = auction;
    if (owner.status !== "online" && owner.status !== "ingame") return false;
    if (isSellingChecked && buyout_price === null) return false; // Vérifie les prix
    return true;
  });

  // Trier les enchères par prix
  const sortedAuctions = filteredAuctions.sort((a, b) => {
    const priceA = a.buyout_price || 0;
    const priceB = b.buyout_price || 0;
    return isSellingChecked ? priceA - priceB : priceB - priceA;
  });

  // Calculer les statistiques des prix
  const priceToDisplay = sortedAuctions.length > 0 ? sortedAuctions[0].buyout_price || 0 : 0;
  const totalPlatinum = filteredAuctions.reduce(
    (sum, auction) => sum + (auction.buyout_price || 0),
    0
  );
  const averagePlatinum =
    filteredAuctions.length > 0 ? totalPlatinum / filteredAuctions.length : 0;

  // Gestion des boutons interactifs
  const handleButtonClick = (index) => {
    setShowMessage((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <>
      <div className="home-container">
        {/* Section de recherche */}
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

          {/* Suggestions */}
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

          {/* Aperçu de l'élément */}
          {itemPreview && (
            <div className="item_preview">
              <div className="preview-content">
                <img
                  src={itemPreview.thumb}
                  alt={itemPreview.name}
                  className="item-thumb"
                />
                <h2>{itemPreview.name}</h2>
              </div>
              <div className="average">
                <h3>Statistique</h3>
                <p>
                  Prix moyen: {averagePlatinum.toFixed(2)}
                  <img
                    src="/img/pl.webp"
                    alt="Image de votre choix"
                    className="votre-classe-image"
                  />
                </p>
                <p>
                  {isSellingChecked ? "Prix minimum" : "Prix maximum"} :{" "}
                  {priceToDisplay}
                  <img
                    src="/img/pl.webp"
                    alt="Image de votre choix"
                    className="votre-classe-image"
                  />
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Section des résultats */}
        <div className="results-section">
          {filteredAuctions.length > 0 ? (
            <>
              {sortedAuctions.map((auction, index) => {
                const {
                  item: { name, mod_rank, attributes, itemName },
                  buyout_price,
                  owner,
                  re_rolls,
                } = auction;

                return (
                  <div
                    key={index}
                    className="auction-data"
                    style={{
                      backgroundColor: index % 2 === 0 ? "#171E21" : "#101619",
                    }}
                  >
                    <div>
                      <h3>{itemName} {name}</h3>
                      <p>
                        <strong>Rank:</strong> {mod_rank}
                      </p>
                      <p>
                        <strong>Rerolls:</strong> {re_rolls}
                      </p>
                      <h4>Attributes:</h4>
                      <ul>
                        {attributes.map((attr, i) => (
                          <li
                            key={i}
                            style={{
                              color: attr.positive ? "#19A187" : "#FF0000",
                              backgroundColor: attr.positive ? "#162526" : "#201D1F",
                              border: `0.5px solid ${attr.positive ? "#19A187" : "#FF0000"}`
                            }}
                          >
                            {attr.url_name.replace("_", " ")}: {attr.value} %
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p>
                      <strong>Prix:</strong> {buyout_price || "Négociable"}{" "}
                      <TfiServer />
                    </p>
                    <p>
                      <strong>Utilisateur:</strong> {owner.ingame_name}{" "}
                      <HiOutlineEmojiHappy />
                    </p>

                    <button
                      className="action-btn"
                      onClick={() => handleButtonClick(index)}
                    >
                      {isSellingChecked ? "Acheter" : "Vendre"}
                    </button>

                    {showMessage[index] && (
                      <div className="message">
                        <input
                          type="text"
                          value={
                            isSellingChecked
                              ? `/w ${owner.ingame_name} Hi, want to buy ${itemName} for ${buyout_price} Platinum (Warframe Market)`
                              : `/w ${owner.ingame_name} Hi, want to sell ${itemName} for ${buyout_price} Platinum (Warframe Market)`
                          }
                          readOnly
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          ) : (
            <p>No auctions found</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Riven;
