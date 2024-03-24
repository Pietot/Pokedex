document.addEventListener("DOMContentLoaded", () => {
  var viewportHeight = window.innerHeight;
  console.log(viewportHeight);
  container = document.getElementById("container");
  container.style.height = viewportHeight + "px";
  const POKEMON_ID = new URLSearchParams(window.location.search).get("id");
  const TYRADEX_API = "https://tyradex.tech/api/v1/";
  const POKE_IMG = "https://assets.pokemon.com/assets/cms2/img/pokedex/full/";
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

  async function setPokemonDetails(pokemonId) {
    try {
      const POKE_JSON = await getJson(
        TYRADEX_API + "pokemon/" + pokemonId.toString()
      );
      setTitle(POKE_JSON);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails du pokémon :",
        error
      );
    }
  }

  function setTitle(POKE_JSON) {
    console.log(POKE_JSON);
    const NAME = POKE_JSON.name.fr;
    document.title = NAME;
  }

  setPokemonDetails(POKEMON_ID);
});
