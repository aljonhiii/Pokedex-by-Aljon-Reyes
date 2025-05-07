const pokedex = document.getElementById("pokedex");
const searchInput = document.getElementById("search");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const modalName = document.getElementById("modal-name");
const modalStats = document.getElementById("modal-stats");
const closeModal = document.querySelector(".close");

const typeColors = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#F0B6BC"
};

const statColors = {
  beauty: "#ff5e57",     // Red
  kindness: "#ffb703",   // Yellow
  sweetness: "#38b000",  // Green
  cuteness: "#ffcb05",   // Orange
  love: "#e63946"        // Dark Red
};

const fetchPokemon = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const res = await fetch(url);
  const data = await res.json();
  createPokemonCard(data);
};

const createPokemonCard = (pokemon) => {
  const card = document.createElement("div");
  card.classList.add("pokemon");

  const sprite = pokemon.sprites.other["official-artwork"].front_default;
  const name = pokemon.name;
  const id = pokemon.id.toString().padStart(3, '0');

  const type = pokemon.types[0].type.name;
  card.classList.add(`type-${type}`);

  const typeColor = typeColors[type] || "#A8A878";
  card.style.borderColor = typeColor;

  card.innerHTML = `
    <img src="${sprite}" alt="${name}" />
    <h3>#${id} ${name}</h3>
  `;

  card.addEventListener("click", () => {
    showModal(pokemon);
  });

  pokedex.appendChild(card);
};

const showModal = (pokemon) => {
  modalName.textContent = `#${pokemon.id} ${pokemon.name}`;

  if (pokemon.id === 152) {
    modalImg.src = "cindy-removebg-preview.png";

    // Custom stats for My Baby
    const statsHtml = `
      <div class="stat">
        <span class="stat-name">Beauty</span>
        <div class="stat-bar">
          <div class="stat-fill" style="width: 100%; background-color: ${statColors.beauty};"></div>
        </div>
        <span class="stat-value">100</span>
      </div>
      <div class="stat">
        <span class="stat-name">Kindness</span>
        <div class="stat-bar">
          <div class="stat-fill" style="width: 100%; background-color: ${statColors.kindness};"></div>
        </div>
        <span class="stat-value">100</span>
      </div>
      <div class="stat">
        <span class="stat-name">Sweetness</span>
        <div class="stat-bar">
          <div class="stat-fill" style="width: 100%; background-color: ${statColors.sweetness};"></div>
        </div>
        <span class="stat-value">100</span>
      </div>
      <div class="stat">
        <span class="stat-name">Cuteness</span>
        <div class="stat-bar">
          <div class="stat-fill" style="width: 100%; background-color: ${statColors.cuteness};"></div>
        </div>
        <span class="stat-value">100</span>
      </div>
      <div class="stat">
        <span class="stat-name">Love</span>
        <div class="stat-bar">
          <div class="stat-fill" style="width: 9999%; background-color: ${statColors.love};"></div>
        </div>
        <span class="stat-value">∞</span>
      </div>
    `;
    modalStats.innerHTML = statsHtml;
  } else {
    modalImg.src = pokemon.sprites.other["official-artwork"].front_default;

    const statsHtml = pokemon.stats.map(stat => {
      const labelMap = {
        hp: 'HP',
        attack: 'Attack',
        defense: 'Defense',
        'special-attack': 'Sp. Atk',
        'special-defense': 'Sp. Def',
        speed: 'Speed'
      };
      const className = stat.stat.name.replace('-', '');
      let statColor = '';

      // Assign colors to different stats
      switch (stat.stat.name) {
        case 'hp':
          statColor = '#ff4d4d'; // Red for HP
          break;
        case 'attack':
          statColor = '#ff9800'; // Orange for Attack
          break;
        case 'defense':
          statColor = '#2196f3'; // Blue for Defense
          break;
        case 'special-attack':
          statColor = '#9c27b0'; // Purple for Sp. Atk
          break;
        case 'special-defense':
          statColor = '#8bc34a'; // Green for Sp. Def
          break;
        case 'speed':
          statColor = '#00bcd4'; // Cyan for Speed
          break;
        default:
          statColor = '#9e9e9e'; // Gray for unknown stats
          break;
      }

      return `
        <div class="stat">
          <span class="stat-name">${labelMap[stat.stat.name]}</span>
          <div class="stat-bar">
            <div class="stat-fill ${className}" style="width: ${Math.min(stat.base_stat, 100)}%; background-color: ${statColor};"></div>
          </div>
          <span class="stat-value">${stat.base_stat}</span>
        </div>
      `;
    }).join("");

    modalStats.innerHTML = statsHtml;
  }

  modal.classList.remove("hidden");
};

const loadPokemon = async () => {
  for (let i = 1; i <= 151; i++) {
    await fetchPokemon(i);
  }

  const customPokemon = {
    name: "My Baby",
    id: 152,
    sprites: {
      other: {
        "official-artwork": {
          front_default: "cindy-removebg-preview.png"
        }
      }
    },
    types: [{ type: { name: "fairy" } }],
    stats: []
  };

  const card = document.createElement("div");
  card.classList.add("pokemon", "type-fairy");
  card.style.borderColor = typeColors["fairy"];

  card.innerHTML = `
    <img src="cindy-removebg-preview.png" alt="My Baby" />
    <h3>#152 My Baby</h3>
  `;

  card.addEventListener("click", () => showModal(customPokemon));
  pokedex.appendChild(card);
};

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const pokemonCards = Array.from(pokedex.children);

  pokemonCards.forEach(card => {
    const name = card.querySelector("h3").textContent.toLowerCase();
    card.style.display = name.includes(query) ? "block" : "none";
  });
});

loadPokemon();
