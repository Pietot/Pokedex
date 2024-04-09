document.addEventListener("DOMContentLoaded", () => {
  // Defining constants used several times in the script.
  const TYRADEX_API = "https://tyradex.tech/api/v1/pokemon";
  const POKE_IMG = "https://assets.pokemon.com/assets/cms2/img/pokedex/full/";
  const pokemonsListElement = document.getElementById("poke-cards");
  const CHECKBOXES = document.querySelectorAll('input[name="selection"]');

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

  // Function to set the filters (search bar, types and generation).
  function setFilters() {
    setTypesBar();
    setTypesFilter();
    setGenerationFilter();
  }

  // Function to set the bar with all types to filter.
  function setTypesBar() {
    const typesFilter = document.getElementById("types");
    for (const TYPE_NAME in TYPE_TO_COLOR) {
      const typeInput = document.createElement("input");
      typeInput.type = "checkbox";
      typeInput.id = TYPE_NAME.toLowerCase();
      const typeLabel = document.createElement("label");
      typeLabel.htmlFor = TYPE_NAME.toLowerCase();
      typeLabel.style.borderColor = TYPE_TO_COLOR[TYPE_NAME];
      const typeImage = document.createElement("img");
      typeImage.src = "img/icons/" + TYPE_NAME.toLowerCase() + ".png";
      typeImage.alt = TYPE_NAME;
      typeLabel.appendChild(typeImage);
      typesFilter.appendChild(typeInput);
      typesFilter.appendChild(typeLabel);
    }
  }

  // Function to set the addEventListener to all types.
  function setTypesFilter() {
    const typesFilter = document.getElementById("types");
    const exactly = document.getElementById("exactly");
    const only = document.getElementById("only");
    // Event listener to filter the pokemons by types when a type is added or deleted.
    typesFilter.addEventListener("change", filter);
    exactly.addEventListener("change", filter);
    only.addEventListener("change", filter);
    // Function to filter the pokemons by types.
    function filter() {
      const checkedTypes = Array.from(
        document.querySelectorAll('.types input[type="checkbox"]:checked')
      );
      const pokeCards = Array.from(
        document.getElementsByClassName("poke-card")
      );
      // If no type is checked, all pokemons are displayed.
      if (checkedTypes.length === 0) {
        pokeCards.forEach((pokeCard) => (pokeCard.style.display = "block"));
        return;
      }
      // If the "exactly" checkbox is checked, only the pokemons with the exact same types are displayed.
      if (exactly.checked) {
        pokeCards.forEach((pokeCard) => {
          // Extracting the types of the pokemon's card.
          const pokeCardTypes = Array.from(
            pokeCard.querySelectorAll(".type-name p")
          ).map((p) => p.textContent.toLowerCase());
          // If the types of the pokemon's card are the same as the checked types, the pokemon is displayed.
          // Using JSON.stringify to compare the arrays because we can't compare arrays in JavaScript (bad language).
          JSON.stringify(pokeCardTypes) ===
          JSON.stringify(checkedTypes.map((type) => type.id))
            ? (pokeCard.style.display = "block")
            : (pokeCard.style.display = "none");
        });
        // If the "only" checkbox is checked, only the pokemons with all their types selected are displayed.
      } else if (only.checked) {
        const pokeCards = document.querySelectorAll(".poke-card");
        pokeCards.forEach((pokeCard) => {
          filterOnly(
            pokeCard,
            checkedTypes.map((type) => type.id)
          )
            ? (pokeCard.style.display = "block")
            : (pokeCard.style.display = "none");
        });
        // If the "exactly" and "only" checkboxes are not checked, the pokemons with at least one of the selected types are displayed.
      } else {
        pokeCards.forEach((pokeCard) => {
          const pokeCardTypes = Array.from(
            pokeCard.querySelectorAll(".type-name p")
          );
          pokeCard.style.display = pokeCardTypes.some((pokeCardType) =>
            checkedTypes.some(
              (checkedType) =>
                pokeCardType.textContent.toLowerCase() ===
                checkedType.id.toLowerCase()
            )
          )
            ? "block"
            : "none";
        });
      }
      // Function to filter the pokemons by types when the "only" checkbox is checked.
      function filterOnly(pokeCard, checkedTypes) {
        const pokeCardTypes = Array.from(
          pokeCard.querySelectorAll(".type-name p")
        ).map((p) => p.textContent.toLowerCase());
        return pokeCardTypes.every((type) => checkedTypes.includes(type));
      }
    }
  }

  // Function to set the generation filter.
  async function setGenerationFilter() {
    try {
      const ALL_POKEMONS = await getJson(TYRADEX_API);
      const LAST_GENERATION = ALL_POKEMONS[ALL_POKEMONS.length - 1].generation;
      const generationFilter = document.getElementById("generations-filter");
      for (let i = 1; i <= LAST_GENERATION; i++) {
        const generationDiv = document.createElement("div");
        generationDiv.className = "generation";
        const generationInput = document.createElement("input");
        generationInput.type = "checkbox";
        generationInput.name = "generation-" + i;
        generationInput.id = "generation-" + i;
        generationInput.value = i;
        generationInput.addEventListener("change", filter);
        const generationLabel = document.createElement("label");
        generationLabel.htmlFor = "generation-" + i;
        generationLabel.textContent = "Génération " + i;
        generationDiv.appendChild(generationInput);
        generationDiv.appendChild(generationLabel);
        generationFilter.appendChild(generationDiv);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des pokémons :", error);
    }
    // Function to filter the pokemons by generation.
    function filter() {
      const checkedGenerations = Array.from(
        document.querySelectorAll('.generation input[type="checkbox"]:checked')
      );
      const pokeCards = Array.from(
        document.getElementsByClassName("poke-card")
      );
      // If no generation is checked, all pokemons are displayed.
      if (checkedGenerations.length === 0) {
        pokeCards.forEach((pokeCard) => (pokeCard.style.display = "block"));
        return;
      }
      // For each pokemon, only the pokemons with their generation checked are displayed.
      pokeCards.forEach((pokeCard) => {
        const pokeCardGeneration = pokeCard
          .querySelector("a")
          .getAttribute("generation");
        pokeCard.style.display = checkedGenerations.some(
          (generation) => generation.value == pokeCardGeneration
        )
          ? "block"
          : "none";
      });
    }
  }

  // Function to set the checkboxes to be exclusive, meaning that if a checkboxe is checked while another one is already checked, the old one is automatically unchecked.
  function setCheckboxes() {
    CHECKBOXES.forEach(function (checkbox) {
      checkbox.addEventListener("change", function () {
        CHECKBOXES.forEach(function (checkbox1) {
          if (checkbox1 !== checkbox) {
            checkbox1.checked = false;
          }
        });
      });
    });
  }

  // Function to get the JSON from an API.
  async function getJson(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      return error;
    }
  }

  // Function to set the pokemons cards.
  async function setPokeCards() {
    try {
      const POKE_JSON = await getJson(TYRADEX_API);
      POKE_JSON.forEach((pokeInfo, pokeJsonIndex) => {
        // If the pokemon is not MissingNo., we create a card for it.
        // We skip MissingNo. because it's not a real pokemon and it cause issues since all his attributes are null.
        if (pokeInfo.name.fr !== "MissingNo.") {
          const pokeId = pokeInfo.pokedex_id;
          const pokeTypes = pokeInfo.types;
          const generation = pokeInfo.generation;
          const divItems = createPokeCard(pokeId, pokeTypes, generation);
          const formattedId = pokeId.toString().padStart(3, "0");
          setPokeImage(pokeId, formattedId);
          setIndex(formattedId, divItems);
          setName(POKE_JSON, divItems, pokeJsonIndex);
          setTypes(divItems, pokeTypes);
        }
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des pokémons :", error);
    }
  }

  // Function to create a pokemon card.
  function createPokeCard(pokemonId, pokeTypes, generation) {
    const newDiv = document.createElement("div");
    newDiv.className = "col-xs-6 col-sm-5 col-md-3 poke-card";
    const newA = document.createElement("a");
    newA.href = "pokedex.html?id=" + pokemonId.toString();
    newA.className = "link";
    // Adding the generation attribute to the card.
    newA.setAttribute("generation", generation);
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
    }
    newA.appendChild(divItems);
    newDiv.appendChild(newA);
    pokemonsListElement.appendChild(newDiv);
    return divItems;
  }

  // Function to set the pokemon image.
  function setPokeImage(pokemonId, formattedId) {
    const SPRITE = POKE_IMG + formattedId + ".png";
    const pokeCardElement = document.getElementById(
      "poke-card-" + pokemonId.toString()
    );
    const pokeCardImgDiv = document.createElement("div");
    pokeCardImgDiv.className = "poke-card-img";
    const pokeCardImg = document.createElement("img");
    pokeCardImg.src = SPRITE;
    pokeCardImgDiv.appendChild(pokeCardImg);
    pokeCardElement.appendChild(pokeCardImgDiv);
  }

  // Function to set the pokemon index.
  function setIndex(pokemonId, divItems) {
    pokemonId = pokemonId.padStart(4, "0");
    const idElement = document.createElement("div");
    idElement.className = "poke-card-id";
    const pElement = document.createElement("p");
    pElement.textContent = "N°" + pokemonId;
    idElement.appendChild(pElement);
    divItems.appendChild(idElement);
  }

  // Function to set the pokemon name.
  function setName(POKE_JSON, divItems, pokemonId) {
    const nameElement = document.createElement("div");
    nameElement.className = "poke-card-name";
    const pElement = document.createElement("p");
    pElement.textContent = POKE_JSON[pokemonId].name.fr;
    nameElement.appendChild(pElement);
    divItems.appendChild(nameElement);
  }

  // Function to set the pokemon types.
  function setTypes(divItems, pokeTypes) {
    const typesElement = document.createElement("div");
    typesElement.className = "poke-card-types";
    for (let i = 0; i < pokeTypes.length; i++) {
      const typeElement = document.createElement("div");
      typeElement.className = "type";
      typeElement.style =
        "background-color: " + TYPE_TO_COLOR[pokeTypes[i].name];
      const divImage = document.createElement("div");
      divImage.className = "type-image";
      const divP = document.createElement("div");
      divP.className = "type-name";
      const typeImage = document.createElement("img");
      typeImage.src = "img/icons/" + pokeTypes[i].name.toLowerCase() + ".png";
      typeImage.alt = pokeTypes[i].name;
      const pElement = document.createElement("p");
      pElement.textContent = pokeTypes[i].name;
      divImage.appendChild(typeImage);
      divP.appendChild(pElement);
      typeElement.appendChild(divImage);
      typeElement.appendChild(divP);
      typesElement.appendChild(typeElement);
    }
    divItems.appendChild(typesElement);
  }

  // Function to set the search bar.
  function setSearchBar() {
    const searchInput = document.getElementById("search-bar");
    searchInput.addEventListener("input", () => {
      // We normalize the search value to avoid accents and case sensitivity.
      const searchValue = searchInput.value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const pokeCards = document.getElementsByClassName("poke-card");
      for (let i = 0; i < pokeCards.length; i++) {
        const pokeCard = pokeCards[i];
        // We normalize the pokemon name to avoid accents and case sensitivity.
        const pokeCardName = pokeCard
          .getElementsByClassName("poke-card-name")[0]
          .getElementsByTagName("p")[0]
          .textContent.toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        const pokeCardId =
          pokeCard.getElementsByClassName("poke-card-id")[0].textContent;
        if (
          pokeCardName.includes(searchValue) ||
          pokeCardId.includes(searchValue)
        ) {
          pokeCard.style.display = "block";
        } else {
          pokeCard.style.display = "none";
        }
      }
    });
  }

  setSearchBar();
  setPokeCards();
  setFilters();
  setCheckboxes();
});
