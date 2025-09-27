import React, { useState } from "react";

const menuData = {
  Plats: [
    { id: 3, nom: "Boeuf bourguignon/duo purée", prix: 0, image: "https://i.imgur.com/goUaz5u.jpeg" },
    { id: 4, nom: "Cigares panés au crevettes", prix: 0, image: "https://i.imgur.com/eyYq3rt.jpeg" },
    { id: 5, nom: "Samoussas épinard fromages", prix: 0, image: "https://i.imgur.com/M921s16.jpeg" },
    { id: 6, nom: "Samoussas haché boeuf", prix: 0, image: "https://i.imgur.com/1NMGmBa.png" },
    { id: 7, nom: "Tartare de saumon/avocat/mangue", prix: 0, image: "https://i.imgur.com/qpwDBET.jpeg" },
    { id: 8, nom: "Mille feuille revisité (décembre/noël)", prix: 0, image: "https://i.imgur.com/aTsCJBF.jpeg" },
  ],
  Desserts: [
    { id: 9, nom: "Tiramisu spéculoos", prix: 0, image: "https://i.imgur.com/1NMGmBa.png" },
    { id: 10, nom: "Basboussa", prix: 0, image: "https://i.imgur.com/iP2h3Kf.jpeg" },
    { id: 11, nom: "Crumble pommes", prix: 2.5, image: "https://i.imgur.com/1NMGmBa.png" },
    { id: 12, nom: "Crumble fruits rouges", prix: 2.5, image: "https://i.imgur.com/1NMGmBa.png" },
  ],
};

export default function App() {
  const [panier, setPanier] = useState([]);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [openCategorie, setOpenCategorie] = useState(null);

  const ajouterAuPanier = (item) => {
    setPanier([...panier, item]);
  };

  const retirerDuPanier = (index) => {
    const nouveauPanier = [...panier];
    nouveauPanier.splice(index, 1);
    setPanier(nouveauPanier);
  };

  const total = panier.reduce((acc, item) => acc + item.prix, 0);

  const validerCommande = async () => {
    if (!nom || !prenom || !telephone) {
      alert("Merci de remplir votre nom, prénom et numéro de téléphone.");
      return;
    }

    // Construire le texte des articles du panier
    const commandeDetails = panier
      .map((item) => `- ${item.nom} (${item.prix}€)`)
      .join("\n");

    const data = {
      nom,
      prenom,
      telephone,
      livraison: "La livraison sera faite début de semaine",
      total,
      details: commandeDetails,
    };

    try {
      // ⚠️ Mets ici ton URL Apps Script
      await fetch(
        "https://script.google.com/macros/s/AKfycbzk68YKTGZNSSDvA3lm4G7yQXZLouYSS5R8sHyJaW34j2V3zpySzPVjoDmlIaFpgtF3/exec",
        {
          method: "POST",
          mode: "no-cors", // important pour éviter les erreurs CORS
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      alert("✅ Commande envoyée avec succès !");
      setPanier([]);
      setNom("");
      setPrenom("");
      setTelephone("");
    } catch (error) {
      console.error("Erreur fetch :", error);
      alert("❌ Erreur lors de l'envoi : " + error);
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>🍽️ Restaurant en ligne</h1>

      <h2>Menu</h2>
      {Object.entries(menuData).map(([categorie, items]) => (
        <div key={categorie} style={{ marginBottom: "10px" }}>
          <button
            onClick={() =>
              setOpenCategorie(openCategorie === categorie ? null : categorie)
            }
            style={{
              width: "100%",
              padding: "10px",
              textAlign: "left",
              backgroundColor: "#eee",
              border: "1px solid #ccc",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {categorie} {openCategorie === categorie ? "▲" : "▼"}
          </button>

          {openCategorie === categorie && (
            <div style={{ border: "1px solid #ccc", padding: "10px" }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.nom}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      marginRight: "10px",
                      borderRadius: "8px",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0", fontWeight: "bold" }}>{item.nom}</p>
                    <p style={{ margin: "0" }}>{item.prix} €</p>
                  </div>
                  <button onClick={() => ajouterAuPanier(item)}>Ajouter</button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <h2>🛒 Panier</h2>
      {panier.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <ul>
          {panier.map((item, index) => (
            <li key={index}>
              {item.nom} - {item.prix}€
              <button
                onClick={() => retirerDuPanier(index)}
                style={{ marginLeft: "10px" }}
              >
                Retirer
              </button>
            </li>
          ))}
        </ul>
      )}

      <h3>Total : {total}€</h3>

      <div style={{ marginTop: "20px" }}>
        <label>
          Nom :
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            style={{ marginLeft: "10px" }}
          />
        </label>
      </div>

      <div style={{ marginTop: "10px" }}>
        <label>
          Prénom :
          <input
            type="text"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            style={{ marginLeft: "10px" }}
          />
        </label>
      </div>

      <div style={{ marginTop: "10px" }}>
        <label>
          Téléphone :
          <input
            type="text"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            style={{ marginLeft: "10px" }}
          />
        </label>
      </div>

      <div style={{ marginTop: "10px" }}>
        <p>
          <strong>Livraison prévue :</strong> début de semaine (si aucun problème)
        </p>
      </div>

      <button
        onClick={validerCommande}
        disabled={panier.length === 0}
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "green",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Valider la commande
      </button>
    </div>
  );
}
