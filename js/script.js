document.addEventListener("DOMContentLoaded", () => {
  const TYRADEX_API = "https://tyradex.tech/api/v1/gen/1";
  const POKE_IMG = "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/";
  const pokemonsListElement = document.getElementById("poke-cards");

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
        let divItems = createPokeCard(pokemonId);
        formattedId = setPokeImage(pokemonId);
        setIdex(formattedId, divItems);
        setName(POKE_JSON, divItems, pokemonId);
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

  function createPokeCard(pokemonId) {
    const newDiv = document.createElement("div");
    newDiv.className = "col-xs-6 col-sm-5 col-md-3 poke-card";
    newDiv.style = "margin-bottom: 20px;";
    const newA = document.createElement("a");
    const divItems = document.createElement("div");
    divItems.className = "items";
    divItems.id = "poke-card-" + pokemonId.toString();
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

  setPokeCards();
});
