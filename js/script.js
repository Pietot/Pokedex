document.addEventListener("DOMContentLoaded", () => {
  const TYRADEX_API = "https://tyradex.tech/api/v1/";
  const POKE_IMG = "https://assets.pokemon.com/assets/cms2/img/pokedex/full/";
  const pokemonsListElement = document.getElementById("poke-cards");
  const checkboxes = document.querySelectorAll('input[name="selection"]');

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

  function setFilters() {
    setTypesBar();
    setTypesFilter();
  }

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
      typeImage.src = "img/icons/" + TYPE_NAME + ".png";
      typeImage.alt = TYPE_NAME;
      typeLabel.appendChild(typeImage);
      typesFilter.appendChild(typeInput);
      typesFilter.appendChild(typeLabel);
    }
  }

  function setTypesFilter() {
    const typesFilter = document.getElementById("types");
    const exactly = document.getElementById("exactly");
    const only = document.getElementById("only");
    typesFilter.addEventListener("change", filter);
    exactly.addEventListener("change", filter);
    only.addEventListener("change", filter);
    function filter() {
      const checkedTypes = Array.from(
        document.querySelectorAll('.types input[type="checkbox"]:checked')
      );
      const pokeCards = Array.from(
        document.getElementsByClassName("poke-card")
      );
      if (checkedTypes.length === 0) {
        pokeCards.forEach((pokeCard) => (pokeCard.style.display = "block"));
        return;
      }
      if (exactly.checked) {
        pokeCards.forEach((pokeCard) => {
          const pokeCardTypes = Array.from(
            pokeCard.querySelectorAll(".type-name p")
          ).map((p) => p.textContent.toLowerCase());
          JSON.stringify(pokeCardTypes) ===
          JSON.stringify(checkedTypes.map((type) => type.id))
            ? (pokeCard.style.display = "block")
            : (pokeCard.style.display = "none");
        });
      } else if (only.checked) {
        const pokeCards = document.querySelectorAll(".poke-card");
        pokeCards.forEach(function (pokeCard) {});
      }
    }
  }

  function setGenerationFilter() {
    const generationFilter = document.getElementById("generation-filter");
    generationFilter.addEventListener("change", () => {});
  }

  function setCheckboxes() {
    checkboxes.forEach(function (checkbox) {
      checkbox.addEventListener("change", function () {
        checkboxes.forEach(function (checkbox1) {
          if (checkbox1 !== checkbox) {
            checkbox1.checked = false;
          }
        });
      });
    });
  }

  async function getJson(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      return error;
    }
  }

  async function setPokeCards(generation = 0) {
    try {
      const call = generation === 0 ? "pokemon" : `gen/${generation}`;
      const POKE_JSON = await getJson(TYRADEX_API + call);
      POKE_JSON.forEach((pokeInfo, pokeJsonIndex) => {
        if (pokeInfo.name.fr !== "MissingNo.") {
          const pokeId = pokeInfo.pokedex_id;
          const pokeTypes = pokeInfo.types;
          const divItems = createPokeCard(pokeId, pokeTypes);
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

  function createPokeCard(pokemonId, pokeTypes) {
    const newDiv = document.createElement("div");
    newDiv.className = "col-xs-6 col-sm-5 col-md-3 poke-card";
    const newA = document.createElement("a");
    newA.href = "pokedex.html?id=" + pokemonId.toString();
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
    }
    newA.appendChild(divItems);
    newDiv.appendChild(newA);
    pokemonsListElement.appendChild(newDiv);
    return divItems;
  }

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

  function setIndex(pokemonId, divItems) {
    pokemonId = pokemonId.padStart(4, "0");
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
    pElement.textContent = POKE_JSON[pokemonId].name.fr;
    nameElement.appendChild(pElement);
    divItems.appendChild(nameElement);
  }

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
      typeImage.src = "img/icons/" + pokeTypes[i].name + ".png";
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

  function setSearchBar() {
    const searchInput = document.getElementById("search-bar");
    searchInput.addEventListener("input", () => {
      const searchValue = searchInput.value.toLowerCase();
      const pokeCards = document.getElementsByClassName("poke-card");
      for (let i = 0; i < pokeCards.length; i++) {
        const pokeCard = pokeCards[i];
        const pokeCardName = pokeCard
          .getElementsByClassName("poke-card-name")[0]
          .getElementsByTagName("p")[0]
          .textContent.toLowerCase();
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
