document.addEventListener("DOMContentLoaded", () => {
  var viewportHeight = window.innerHeight;
  console.log(viewportHeight);
  container = document.getElementById("container");
  container.style.height = viewportHeight + "px";
  const POKEMON_ID = new URLSearchParams(window.location.search).get("id");
  const TYRADEX_API = "https://tyradex.tech/api/v1/";
  const POKE_IMG = "https://assets.pokemon.com/assets/cms2/img/pokedex/full/";
  const TYPE_TO_COLOR = {

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
