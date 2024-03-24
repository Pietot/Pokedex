document.addEventListener("DOMContentLoaded", () => {
  const TYRADEX_API = "https://tyradex.tech/api/v1/gen/1";
  const POKE_IMG = "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/";
  const pokemonsListElement = document.getElementById("poke-cards");
  const TYPE_TO_COLOR = {
    Normal: "#A8A77A",
    Feu: "#EE8130",
    Eau: "#6390F0",
    Plante: "#7AC74C",
    Électrik: "#F7D02C",
    Glace: "#96D9D6",
    Combat: "#C22E28",
    Poison: "#A33EA1",
    Sol: "#E2BF65",
    Vol: "#A98FF3",
    Psy: "#F95587",
    Insecte: "#A6B91A",
    Roche: "#B6A136",
    Spectre: "#735797",
    Dragon: "#6F35FC",
    Fée: "#D685AD",
  };

  async function getJson(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      return error;
    }
  }

  async function setPokeCards() {
    try {
      const POKE_JSON = await getJson(TYRADEX_API);
      for (let pokemonId = 1; pokemonId <= POKE_JSON.length; pokemonId++) {
        let pokeTypes = POKE_JSON[pokemonId - 1].types;
        let divItems = createPokeCard(pokemonId, pokeTypes);
        formattedId = setPokeImage(pokemonId);
        setIdex(formattedId, divItems);
        setName(POKE_JSON, divItems, pokemonId);
        setTypes(divItems, pokeTypes);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des pokémons :", error);
    }
  }

  function setPokeImage(pokemonId) {
    const formattedId = pokemonId.toString().padStart(3, "0");
    const SPRITE = POKE_IMG + formattedId + ".png";
    const pokeCardElement = document.getElementById(
      "poke-card-" + pokemonId.toString()
    );
    addPokeImage(SPRITE, pokeCardElement);
    return formattedId;
  }

  function createPokeCard(pokemonId, pokeTypes) {
    const newDiv = document.createElement("div");
    newDiv.className = "col-xs-6 col-sm-5 col-md-3 poke-card";
    newDiv.style = "margin-bottom: 20px;";
    const newA = document.createElement("a");
    newA.href = "pokemon.html?id=" + pokemonId.toString();
    newA.className = "link";
    const divItems = document.createElement("div");
    divItems.className = "items";
    divItems.id = "poke-card-" + pokemonId.toString();
    if (pokeTypes.length == 1) {
      divItems.style.borderColor = TYPE_TO_COLOR[pokeTypes[0].name];
    } else {
      divItems.style.borderImage =
        "linear-gradient(120deg, " +
        TYPE_TO_COLOR[pokeTypes[0].name] +
        ", " +
        TYPE_TO_COLOR[pokeTypes[1].name] +
        ") 1";
      divItems.style.borderImageSlice = "1";
    }
    newA.appendChild(divItems);
    newDiv.appendChild(newA);
    pokemonsListElement.appendChild(newDiv);
    return divItems;
  }

  function addPokeImage(SPRITE, pokeCardElement) {
    const pokeCardImgDiv = document.createElement("div");
    pokeCardImgDiv.className = "poke-card-img";
    const pokeCardImg = document.createElement("img");
    pokeCardImg.src = SPRITE;
    pokeCardImgDiv.appendChild(pokeCardImg);
    pokeCardElement.appendChild(pokeCardImgDiv);
  }

  function setIdex(pokemonId, divItems) {
    const idElement = document.createElement("div");
    idElement.className = "poke-card-id";
    const pElement = document.createElement("p");
    pElement.textContent = "N°" + pokemonId;
    idElement.appendChild(pElement);
    divItems.appendChild(idElement);
  }

  function setName(POKE_JSON, divItems, pokemonId) {
    const nameElement = document.createElement("div");
    nameElement.className = "poke-card-name";
    const pElement = document.createElement("p");
    pElement.textContent = POKE_JSON[pokemonId - 1].name.fr;
    nameElement.appendChild(pElement);
    divItems.appendChild(nameElement);
  }

  function setTypes(divItems, pokeTypes) {
    const typesElement = document.createElement("div");
    typesElement.className = "poke-card-types";
    if (pokeTypes.length == 1) {
      const typeElement = document.createElement("div");
      typeElement.className = "type";
      typeElement.style =
        "background-color: " + TYPE_TO_COLOR[pokeTypes[0].name];
      const pElement = document.createElement("p");
      pElement.textContent = pokeTypes[0].name;
      typeElement.appendChild(pElement);
      typesElement.appendChild(typeElement);
      divItems.appendChild(typesElement);
    } else {
      for (let i = 0; i < 2; i++) {
        let typeElement = document.createElement("div");
        typeElement.className = "type";
        typeElement.style =
          "background-color: " + TYPE_TO_COLOR[pokeTypes[i].name];
        let pElement = document.createElement("p");
        pElement.textContent = pokeTypes[i].name;
        typeElement.appendChild(pElement);
        typesElement.appendChild(typeElement);
      }
      divItems.appendChild(typesElement);
    }
  }
  setPokeCards();
});
