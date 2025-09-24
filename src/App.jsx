import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const menuData = {
  Plats: [
    { id: 3, nom: "Boeuf bourguignon/duo purée", prix: 0 },
    { id: 4, nom: "Cigares panés au crevettes", prix: 0 },
    { id: 5, nom: "Samoussas épinard fromages", prix: 0 },
    { id: 6, nom: "Samoussas haché boeuf", prix: 0 },
    { id: 7, nom: "Tartare de saumon/avocat/mangue", prix: 0 },
    { id: 8, nom: "Mille feuille revisité (décembr/noë)", prix: 0 },
  ],
  Desserts: [
    { id: 9, nom: "Tiramisu spéculoos", prix: 0 },
    { id: 10, nom: "Basboussa", prix: 0 },
    { id: 11, nom: "Crumble pommes", prix: 2,50€ },
    { id: 12, nom: "Crumble fruits rouges", prix: 2,50€ },
  ],
};

export default function App() {
  const [panier, setPanier] = useState([]);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [telephone, setTelephone] = useState("");

  const ajouterAuPanier = (item) => {
    setPanier([...panier, item]);
  };

  const retirerDuPanier = (index) => {
    const nouveauPanier = [...panier];
    nouveauPanier.splice(index, 1);
    setPanier(nouveauPanier);
  };

  const total = panier.reduce((acc, item) => acc + item.prix, 0);

  const validerCommande = () => {
    if (!nom || !prenom || !telephone) {
      alert("Merci de remplir votre nom, prénom et numéro de téléphone.");
      return;
    }

    // Construire le contenu de la commande
    const commandeDetails = panier
      .map((item) => `- ${item.nom} (${item.prix}€)`)
      .join("\n");

    const templateParams = {
      nom,
      prenom,
      telephone,
      livraison: "La livraison sera faite la semaine prochaine (si aucun probleme)",
      total,
      details: commandeDetails,
    };

    // ⚠️ Remplacer service_xxx, template_xxx et publicKey_xxx par tes infos EmailJS
    emailjs
      .send("service_5rbzmm5", "template_wpuqb5g", templateParams, "zGb_Al_NzDbmkXTBK")
      .then(
        () => {
          alert("Commande envoyée avec succès 🎉");
          setPanier([]);
          setNom("");
          setPrenom("");
          setTelephone("");
        },
        (error) => {
          alert("Erreur lors de l'envoi de la commande ❌");
          console.error(error);
        }
      );
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>🍽️ Restaurant en ligne</h1>

      <h2>Menu</h2>
      {Object.entries(menuData).map(([categorie, items]) => (
        <div key={categorie}>
          <h3>{categorie}</h3>
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                {item.nom} - {item.prix}€
                <button
                  onClick={() => ajouterAuPanier(item)}
                  style={{ marginLeft: "10px" }}
                >
                  Ajouter
                </button>
              </li>
            ))}
          </ul>
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
            type="tel"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            style={{ marginLeft: "10px" }}
          />
        </label>
      </div>

      <p style={{ marginTop: "20px", fontWeight: "bold" }}>
        📦 La livraison sera faite la semaine prochaine (si aucun probleme)
      </p>

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
