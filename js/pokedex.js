document.addEventListener("DOMContentLoaded", () => {
  var viewportHeight = window.innerHeight;
  container = document.getElementById("container");
  container.style.height = viewportHeight + "px";
  const POKEMON_ID =
    parseInt(new URLSearchParams(window.location.search).get("id")) || 1;
  const TYRADEX_API = "https://tyradex.tech/api/v1/";
  const POKE_IMG = "https://assets.pokemon.com/assets/cms2/img/pokedex/full/";
  const TYPE_TO_COLOR = {
    Normal: "#abacac",
    Feu: "#ff662e",
    Eau: "#2b99ff",
    Plante: "#45c826",
    Électrik: "#ffdf00",
    Glace: "#44dfff",
    Combat: "#ffa702",
    Poison: "#9e4fd6",
    Sol: "#b17d3b",
    Vol: "#9cd3ff",
    Psy: "#ff6885",
    Insecte: "#a8ae26",
    Roche: "#c0bc8c",
    Spectre: "#734876",
    Dragon: "#5867e1",
    Ténèbres: "#534b4b",
    Acier: "#6fb7dd",
    Fée: "#ffb5ff",
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

  async function setPokedex(pokemonId) {
    try {
      const POKE_JSON = await getJson(TYRADEX_API + "pokemon");
      setTitle(pokemonId, POKE_JSON);
      setLeftTrigger(pokemonId, POKE_JSON);
      setRightTrigger(pokemonId, POKE_JSON);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails du pokémon :",
        error
      );
    }
  }

  function setTitle(pokemonId, POKE_JSON) {
    const NAME = POKE_JSON[pokemonId].name.fr;
    document.title = NAME;
  }

  async function setLeftTrigger(pokemonId, POKE_JSON) {
    const LEFT_TRIGER_A = document.getElementById("left-trigger-a");
    const LEFT_TD = document.getElementById("left-td");
    const LEFT_ICON = document.getElementById("left-td-icon");
    const LEFT_ID = document.getElementById("left-td-id");
    const LEFT_NAME = document.getElementById("left-td-name");
    const PREVIOUS_POKEMON_ID =
      pokemonId === 1 ? POKE_JSON.length - 1 : pokemonId - 1;
    const PREVIOUS_POKEMON_NAME = (
      await getJson(TYRADEX_API + "pokemon/" + PREVIOUS_POKEMON_ID)
    ).name.fr;
    LEFT_TRIGER_A.href = "pokedex.html?id=" + PREVIOUS_POKEMON_ID;
    const ARROW = document.createElement("img");
    ARROW.src = "img/arrow.png";
    ARROW.alt = "Left Arrow";
    LEFT_ICON.appendChild(ARROW);
    LEFT_ID.textContent =
      "N° " + PREVIOUS_POKEMON_ID.toString().padStart(4, "0");
    LEFT_NAME.textContent = PREVIOUS_POKEMON_NAME;
    LEFT_TD.appendChild(LEFT_ICON);
    LEFT_TD.appendChild(LEFT_ID);
    LEFT_TD.appendChild(LEFT_NAME);
  }

  async function setRightTrigger(pokemonId, POKE_JSON) {
    const RIGHT_TRIGER_A = document.getElementById("right-trigger-a");
    const RIGHT_TD = document.getElementById("right-td");
    const RIGHT_ICON = document.getElementById("right-td-icon");
    const RIGHT_ID = document.getElementById("right-td-id");
    const RIGHT_NAME = document.getElementById("right-td-name");
    const NEXT_POKEMON_ID =
      pokemonId === POKE_JSON.length - 1 ? 1 : pokemonId + 1;
    const NEXT_POKEMON_NAME = (
      await getJson(TYRADEX_API + "pokemon/" + NEXT_POKEMON_ID)
    ).name.fr;
    RIGHT_TRIGER_A.href = "pokedex.html?id=" + NEXT_POKEMON_ID;
    const ARROW = document.createElement("img");
    ARROW.src = "img/arrow.png";
    ARROW.alt = "Left Arrow";
    RIGHT_ICON.appendChild(ARROW);
    RIGHT_ID.textContent = "N° " + NEXT_POKEMON_ID.toString().padStart(4, "0");
    RIGHT_NAME.textContent = NEXT_POKEMON_NAME;
    RIGHT_TD.appendChild(RIGHT_ICON);
    RIGHT_TD.appendChild(RIGHT_ID);
    RIGHT_TD.appendChild(RIGHT_NAME);
  }

  setPokedex(POKEMON_ID);
});
