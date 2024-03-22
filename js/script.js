document.addEventListener("DOMContentLoaded", () => {
  const API = "https://tyradex.tech/api/v1/gen/1";
  const pokemonsListElement = document.getElementById("pokemon");

  function getPokemons() {
    fetch(API)
      .then((response) => response.json())
      .then((data) => {
        data.forEach((pokemon) => {
          const li = document.createElement("li");
          li.textContent = pokemon.name.fr;
          li.style.cursor = "pointer";
          // li.addEventListener("click", () => getPokemonDetails(pokemon.url));
          pokemonsListElement.appendChild(li);
        });
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des pokémons :", error)
      );
  }
  getPokemons();
});
