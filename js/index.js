"use strict"

let backgroundLegendary = "https://besthqwallpapers.com/Uploads/25-2-2019/81742/thumb2-4k-golden-silk-fabric-texture-silk-golden-background.jpg";
let backgroundMythical = "https://images.pexels.com/photos/6498990/pexels-photo-6498990.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";
let backgroundNormal = "https://3.bp.blogspot.com/-H8cw4oVE78c/V4j3TBTL0SI/AAAAAAAABZI/QhZx30p-B2Inc5YDlyiekL8AdKS_IxkgACLcB/s1600/poke.png";
let themeSongAudio = new Audio("https://mp3.fastupload.co/data/1618687702/pokemon-theme-music.mp3");
let audioFlipCard = new Audio("https://freesound.org/data/previews/536/536782_1415754-lq.mp3");
let forward = document.getElementById("forward");
let pokemonPlayer, pokemonComputer;
let optionsOpened = true;
let playThemeSong = false;
let battleNumber = 0;
let amountCards = 0;
let pokemonId = 0;
let computerHp = 0;
let playerHp = 0;
let totalHp = 0;
let computerDeck = "";
let playerDeck = "";
let types = {};

themeSongAudio.volume = 0.5;
themeSongAudio.loop = true;

if (window.location.href.includes("github")) { forward.remove(); }

function createCardHTML(challenger) {
  let pokemonBackgroundCard = "https://jbrogan17.files.wordpress.com/2010/12/jared-pokemon-card-backside1.jpg?w=731";

  let tagDivCards = document.querySelector("#cards");

  let tagDivHealth = createHealthHTML(challenger);

  let tagDivFlipCard = document.createElement("div");

  let tagDivFlipCardInner = document.createElement("div");

  let tagDivFlipCardBackBackground = document.createElement("div");
  let tagImgCardBackBackground = document.createElement("img");

  let tagDivFlipCardFront = document.createElement("div");
  let tagImgPokemonBackground = document.createElement("img");
  let tagDivPokemonData = document.createElement("div");
  let tagH2PokemonName = document.createElement("h2");
  let tagImgPokemon = document.createElement("img");
  let tagDivTypes = document.createElement("div");
  let tagSpanType1 = document.createElement("span");
  let tagSpanType2 = document.createElement("span");
  let tagDivButtonAttack = document.createElement("div");
  let tagButtonPokemonAttack = document.createElement("button");
  let tagDivButtonDefense = document.createElement("div");
  let tagButtonPokemonDefense = document.createElement("button");
  let tagDivButtonSpeed = document.createElement("div");
  let tagButtonPokemonSpeed = document.createElement("button");

  tagDivTypes.appendChild(tagSpanType1);
  tagDivTypes.appendChild(tagSpanType2);

  tagDivButtonAttack.appendChild(tagButtonPokemonAttack);
  tagDivButtonDefense.appendChild(tagButtonPokemonDefense);
  tagDivButtonSpeed.appendChild(tagButtonPokemonSpeed);

  tagDivPokemonData.appendChild(tagH2PokemonName);
  tagDivPokemonData.appendChild(tagImgPokemon);
  tagDivPokemonData.appendChild(tagDivTypes);
  tagDivPokemonData.appendChild(tagDivButtonAttack);
  tagDivPokemonData.appendChild(tagDivButtonDefense);
  tagDivPokemonData.appendChild(tagDivButtonSpeed);

  tagDivFlipCardFront.appendChild(tagImgPokemonBackground);
  tagDivFlipCardFront.appendChild(tagDivPokemonData);

  tagDivFlipCardBackBackground.appendChild(tagImgCardBackBackground);

  tagDivFlipCardInner.appendChild(tagDivFlipCardFront);
  tagDivFlipCardInner.appendChild(tagDivFlipCardBackBackground);

  tagDivFlipCard.appendChild(tagDivFlipCardInner);

  tagDivCards.appendChild(tagDivFlipCard);

  (challenger == "player") ? tagDivCards.prepend(tagDivHealth) : tagDivCards.appendChild(tagDivHealth);

  tagDivFlipCard.classList.add("flip-card");

  tagDivFlipCardInner.classList.add("flip-card-inner");

  tagDivFlipCardBackBackground.classList.add("card-back");
  tagImgCardBackBackground.classList.add("img-card-back-background");

  tagDivFlipCardFront.classList.add("card-front");
  tagImgPokemonBackground.classList.add("img-pokemon-background")
  tagDivPokemonData.classList.add("container-pokemon-data");
  tagH2PokemonName.classList.add("pokemon-name", "pokemon-font-color-inverse", "center");
  tagImgPokemon.classList.add("img-pokemon");
  tagDivTypes.classList.add("types", "center");
  tagSpanType1.classList.add("type");
  tagSpanType2.classList.add("type");

  tagDivFlipCard.id = challenger + "-flip-card";
  tagDivFlipCardInner.id = challenger + "-flip-card-inner";
  tagImgPokemonBackground.id = challenger + "-img-pokemon-background";
  tagH2PokemonName.id = challenger + "-name";
  tagImgPokemon.id = challenger + "-image";
  tagSpanType1.id = challenger + "-type1";
  tagSpanType2.id = challenger + "-type2";

  tagDivButtonAttack.classList.add("container-attribute");
  tagDivButtonDefense.classList.add("container-attribute");
  tagDivButtonSpeed.classList.add("container-attribute");

  tagButtonPokemonAttack.id = challenger + "-attack";
  tagButtonPokemonAttack.classList.add("attributes", "center", "pokemon-font-color");
  tagButtonPokemonAttack.setAttribute("onclick", "playerAttributeChoice('attack')")

  tagButtonPokemonDefense.id = challenger + "-defense";
  tagButtonPokemonDefense.classList.add("attributes", "center", "pokemon-font-color");
  tagButtonPokemonDefense.setAttribute("onclick", "playerAttributeChoice('defense')")

  tagButtonPokemonSpeed.id = challenger + "-speed";
  tagButtonPokemonSpeed.classList.add("attributes", "center", "pokemon-font-color");
  tagButtonPokemonSpeed.setAttribute("onclick", "playerAttributeChoice('speed')")

  tagImgCardBackBackground.src = pokemonBackgroundCard;
  tagImgPokemonBackground.src = backgroundNormal;

  createCounterHTML(challenger);
}

function createCounterHTML(challenger) {
  let counterBackground = "https://starpng.com/public/uploads/preview/price-tag-png-image-101576954353w7gcfjcg07.png";
  let card = document.getElementById(challenger + "-flip-card");
  let tagDivCounter = document.createElement("div");
  let tagImgCounter = document.createElement("img");
  let tagLabelCounter = document.createElement("label");

  tagDivCounter.appendChild(tagLabelCounter);
  tagDivCounter.appendChild(tagImgCounter);

  card.appendChild(tagDivCounter);

  tagDivCounter.classList.add("container-card-counter");

  tagImgCounter.classList.add("img-card-counter");

  tagLabelCounter.classList.add("label-card-counter", "center");

  tagImgCounter.id = challenger + "-img-card-counter";
  tagLabelCounter.id = challenger + "-label-card-counter";

  tagImgCounter.src = counterBackground;
}

function createHealthHTML(challenger) {
  let tagDivHealth = document.createElement("div");
  let tagDivHealthBar = document.createElement("div");
  let tagSpanHealth = document.createElement("span");

  tagDivHealth.appendChild(tagSpanHealth);
  tagDivHealth.appendChild(tagDivHealthBar);

  tagDivHealth.classList.add("container-health");

  tagDivHealthBar.id = ("container-health-bar-" + challenger);
  tagDivHealthBar.classList.add("container-health-bar");

  tagSpanHealth.id = ("health-counter-" + challenger);
  tagSpanHealth.classList.add("health-counter", "center", "pokemon-font-color");
  tagSpanHealth.innerHTML = "HP " + ("0" + totalHp).slice(-4);

  return tagDivHealth;
}

function createTypeIcon(type) {
  let tagSpanType = document.createElement("span");

  tagSpanType.classList.add("type");

  tagSpanType.innerHTML = translate(type);
  tagSpanType.style.backgroundColor = paint(type, "background");
  tagSpanType.style.borderColor = paint(type, "border");

  return tagSpanType;
}

function createTypesComparisonsHTML(tagSpanType1, tagSpanType2, result, messageDelay) {
  setTimeout(() => {
    let tagBody = document.getElementById("body");
    let tagDivModal = document.getElementById("types-comparisons-modal");
    let tagDivComparisons = document.createElement("div");
    let tagIStatus = document.createElement("i");

    if (!tagDivModal) {
      tagDivModal = document.createElement("div");

      tagDivModal.id = "types-comparisons-modal";
      tagDivModal.classList.add("types-comparisons-modal", "center");

      tagBody.appendChild(tagDivModal);
    }

    tagDivModal.appendChild(tagDivComparisons);
    tagDivComparisons.appendChild(tagSpanType1);
    tagDivComparisons.appendChild(tagIStatus);
    tagDivComparisons.appendChild(tagSpanType2);

    tagIStatus.classList.add("fas", result);

    tagDivComparisons.classList.add("types-comparisons", "center", "animate__animated", "animate__bounceInDown");
    // Esta animação tem 1 segundo de duração
    tagDivComparisons.addEventListener("animationend", () => {
      // Esta animação tem 4 segundos de delay e mais 1 segundo de duração
      tagDivComparisons.classList.add("animate__bounceOutDown", "animate__delay-4s");
    });

    setTimeout(() => {
      tagDivComparisons.remove();
      if (!document.getElementsByClassName("types-comparisons").length) {
        tagDivModal.remove();
      }
    }, 6000);
  }, messageDelay);
}

function newGame() {
  if (document.getElementById("forward") != null) { forward.remove(); }

  if (atLeastOneChecked()) {
    resetVariables();
    createCardHTML("player");
    createCardHTML("computer");
    showOptions();
    setTimeout(() => {
      buildDeck();
      refreshCardCounter();
      startRound();
    }, 1000);
  } else {
    printsError();
  }
}

function atLeastOneChecked() {
  return document.getElementById("fieldset-generations").querySelectorAll(".generations:checked").length;
}

function resetVariables() {
  let tagDivHealth = document.getElementsByClassName("container-health");
  let tagDivFlipCard = document.getElementsByClassName("flip-card");
  let tagLabel = document.getElementById("page-title");

  amountCards = document.getElementById("amount-cards").value;
  totalHp = parseInt(document.getElementById("total-health").value);
  computerHp = totalHp;
  playerHp = totalHp;
  battleNumber = 0;

  tagLabel.innerHTML = "Super Trunfo - Pokémon";
  computerDeck = "";
  playerDeck = "";

  for (let x = 0; x < tagDivFlipCard.length; x) {
    tagDivFlipCard[x].remove();
    tagDivHealth[x].remove();
  }
}

function showOptions() {
  let cards = document.getElementById("player-flip-card");
  let options = document.getElementById("options");
  let game = document.getElementById("game");

  optionsOpened = !optionsOpened;

  if (optionsOpened) {
    if (cards != null) {
      game.classList.remove("show-game");
      setTimeout(() => {
        options.classList.add("ativo");
      }, 1000);
    } else {
      options.classList.add("ativo");
    }
  } else {
    options.classList.remove("ativo");
    if (cards != null) {
      setTimeout(() => {
        game.classList.add("show-game");
      }, 1000);
    }
  }
}

function buildDeck() {
  let pokemonGenerationsChecked = getGenerationsChecked();

  playerDeck = assembleDeck(pokemonGenerationsChecked);
  computerDeck = assembleDeck(pokemonGenerationsChecked);
}

function refreshCardCounter() {
  document.getElementById("player-label-card-counter").innerHTML = playerDeck.length;
  document.getElementById("computer-label-card-counter").innerHTML = computerDeck.length;
}

async function startRound() {
  battleNumber++

  if (battleNumber % 2) {
    changeDisabledAttributeButtons(false);
    showPokemonPlayer();
  } else {
    await showPokemonComputer();
    let computerAttribute = computerAttributeChoice();
    await showPokemonPlayer();
    checkAttribute(computerAttribute);
  }
}

function printsError() {
  let tagBody = document.getElementById("body");
  let tagDiv = document.createElement("div");
  let tagSpan = document.createElement("span");

  tagDiv.appendChild(tagSpan);
  tagBody.appendChild(tagDiv);

  tagDiv.classList.add("error-modal", "center");

  tagSpan.classList.add("animate__animated", "animate__tada", "center");
  tagSpan.innerHTML = "Selecione pelo menos uma geração";

  setTimeout(() => {
    tagDiv.remove();
  }, 2500);
}

function endRound() {
  document.getElementById("player-flip-card").classList.remove("scaled");
  document.getElementById("computer-flip-card").classList.remove("scaled");
  document.getElementById("player-flip-card-inner").classList.remove("rotate-card");
  document.getElementById("computer-flip-card-inner").classList.remove("rotate-card");

  audioFlipCard.play();
  clearAttributeButtons();

  setTimeout(() => {
    if (playerDeck.length && computerDeck.length && playerHp > 0 && computerHp > 0) {
      startRound();
    } else {
      endGame();
    }
  }, 1000);
}

async function showPokemonPlayer() {
  pokemonId = playerDeck[0];
  pokemonPlayer = await getPokemon();

  changeBackground(pokemonPlayer, "player");
  buildPokemonCard(pokemonPlayer, "player", 0);

  document.getElementById("player-flip-card-inner").classList.add("rotate-card");
  audioFlipCard.play();
}

async function showPokemonComputer() {
  pokemonId = computerDeck[0];
  pokemonComputer = await getPokemon();

  changeBackground(pokemonComputer, "computer");
  buildPokemonCard(pokemonComputer, "computer", 0);

  document.getElementById("computer-flip-card-inner").classList.add("rotate-card");
  audioFlipCard.play();
}

function assembleDeck(pokemonGenerationsChecked) {
  let amountCardsDeck = amountCards;
  let cardNumber = 0;
  let deck = [];

  while (amountCardsDeck) {
    cardNumber = pokemonGenerationsChecked[Math.floor(Math.random() * pokemonGenerationsChecked.length)]

    if (deck.indexOf(cardNumber) == -1) {
      deck.push(cardNumber);
      amountCardsDeck--;
    }
  }

  return deck;
}

function buildPokemonCard(currentPokemon, challenger, multiplyAttack) {
  let computerName = document.getElementById(challenger + "-name");
  let computerImage = document.getElementById(challenger + "-image");
  let computerAttack = document.getElementById(challenger + "-attack");
  let computerDefense = document.getElementById(challenger + "-defense");
  let computerSpeed = document.getElementById(challenger + "-speed");
  let type1 = document.getElementById(challenger + "-type1");
  let type2 = document.getElementById(challenger + "-type2");

  computerName.innerHTML = currentPokemon.name;
  computerImage.src = currentPokemon.image;

  type1.innerHTML = translate(currentPokemon.types[0]);
  type1.style.backgroundColor = paint(currentPokemon.types[0], "background");
  type1.style.borderColor = paint(currentPokemon.types[0], "border");

  if (currentPokemon.types.length > 1) {
    type2.hidden = false;
    type2.innerHTML = translate(currentPokemon.types[1]);
    type2.style.backgroundColor = paint(currentPokemon.types[1], "background");
    type2.style.borderColor = paint(currentPokemon.types[1], "border");
  } else {
    type2.hidden = true;
  }

  computerAttack.innerHTML = "Ataque: " + currentPokemon.attack;
  computerDefense.innerHTML = "Defesa: " + currentPokemon.defense;
  computerSpeed.innerHTML = "Velocidade: " + currentPokemon.speed;

  if (multiplyAttack) {
    computerAttack.innerHTML += (multiplyAttack > 0 ? " + " : " - ") + parseInt(Math.abs(currentPokemon.attack * multiplyAttack));
    computerDefense.innerHTML += (multiplyAttack > 0 ? " + " : " - ") + parseInt(Math.abs(currentPokemon.defense * multiplyAttack));
    computerSpeed.innerHTML += (multiplyAttack > 0 ? " + " : " - ") + parseInt(Math.abs(currentPokemon.speed * multiplyAttack));
  }
}

async function getPokemon() {
  let pokemonData = {};

  await fetch("https://pokeapi.co/api/v2/pokemon/" + pokemonId)
    .then(response => response.json())
    .then(poke => {
      pokemonData.id = poke.id;
      pokemonData.name = poke.name;
      pokemonData.attack = poke.stats.filter(stats => stats.stat.name == "attack").map(stats => { return stats.base_stat; })[0];
      pokemonData.defense = poke.stats.filter(stats => stats.stat.name == "defense").map(stats => { return stats.base_stat; })[0];
      pokemonData.speed = poke.stats.filter(stats => stats.stat.name == "speed").map(stats => { return stats.base_stat; })[0];
      pokemonData.types = poke.types.map(types => { return types.type.name; });
      pokemonData.image = "https://assets.pokemon.com/assets/cms2/img/pokedex/full/" + ("00" + pokemonId).slice(-3) + ".png";
    })
    .catch(() => {
      console.log("Error request pokémon. Id: " + pokemonId);
      if (pokemonId == playerDeck[0]) {
        playerDeck[0] = ++pokemonId;
        showPokemonPlayer();
      } else {
        computerDeck[0] = --pokemonId;
        showPokemonComputer();
      }
    });

  await fetch("https://pokeapi.co/api/v2/pokemon-species/" + pokemonId)
    .then(response => response.json())
    .then(poke => {
      pokemonData.legendary = poke.is_legendary;
      pokemonData.mythical = poke.is_mythical;
      pokemonData.generation = poke.generation.name;
    })
    .catch(() => {
      console.log("Error request species. Id: " + pokemonId);
    })

  return pokemonData;
}

function endGame() {
  let label = document.getElementById("page-title");

  if (playerDeck.length && playerHp > 0) {
    label.innerHTML = "VOCÊ VENCEU!";
    label.classList.add("animate__tada", "animate__repeat-2");
    label.addEventListener('animationend', () => {
      label.classList.remove("animate__tada", "animate__repeat-2");
    });
  } else {
    label.innerHTML = "VOCÊ PERDEU!";
    label.classList.add("animate__hinge");
    label.addEventListener('animationend', () => {
      label.classList.remove("animate__hinge");
      label.classList.add("animate__zoomInUp", "animate__delay-1s");
      label.addEventListener('animationend', () => {
        label.classList.remove("animate__zoomInUp", "animate__delay-1s");
      });
    });
  }
}

async function playerAttributeChoice(playerAttribute) {
  changeDisabledAttributeButtons(true);
  await showPokemonComputer();
  checkAttribute(playerAttribute);
}

function computerAttributeChoice() {
  let bestAttribute = "attack";
  let valueBestAttribute = pokemonComputer.attack;

  if (pokemonComputer.defense > valueBestAttribute) {
    bestAttribute = "defense";
    valueBestAttribute = pokemonComputer.defense;
  }
  if (pokemonComputer.speed > valueBestAttribute) {
    bestAttribute = "speed";
  }

  return bestAttribute;
}

function changeDisabledAttributeButtons(status) {
  let attributeButtons = document.getElementsByClassName("attributes");

  for (let button of attributeButtons) {
    button.disabled = status;
  }
}

function clearAttributeButtons() {
  let attributeButtons = document.getElementsByClassName("attributes");

  for (let button of attributeButtons) {
    button.classList.remove("attributes-not-chosen");
  }
}

function checkAttribute(attribute) {
  let playerCard = document.getElementById("player-flip-card");
  let computerCard = document.getElementById("computer-flip-card");
  let buttons = document.getElementsByClassName("attributes");
  let multiplyAttack = checkType();

  // Adiciona sombra nos atributos não escolhidos
  for (let button of buttons) {
    if (!button.id.includes(attribute)) {
      button.classList.add("attributes-not-chosen");
    }
  }

  if (multiplyAttack) {
    let challenger = battleNumber % 2 ? "player" : "computer";

    if (challenger == "player") {
      buildPokemonCard(pokemonPlayer, challenger, multiplyAttack)
      pokemonPlayer[attribute] += parseInt(pokemonPlayer[attribute] * multiplyAttack);
    } else {
      buildPokemonCard(pokemonComputer, challenger, multiplyAttack)
      pokemonComputer[attribute] += parseInt(pokemonComputer[attribute] * multiplyAttack);
    }
  }

  setTimeout(() => {
    if (pokemonPlayer[attribute] > pokemonComputer[attribute]) {
      playerCard.classList.add("scaled");
      playerDeck.push(playerDeck.shift());
      playerDeck.push(computerDeck.shift());
    } else if (pokemonPlayer[attribute] == pokemonComputer[attribute]) {
      playerCard.classList.add("scaled");
      computerCard.classList.add("scaled");
      playerDeck.push(playerDeck.shift());
      computerDeck.push(computerDeck.shift());
    } else {
      computerCard.classList.add("scaled");
      computerDeck.push(computerDeck.shift());
      computerDeck.push(playerDeck.shift());
    }

    updateHealthBar(pokemonPlayer[attribute] - pokemonComputer[attribute])
  }, 1000)

  setTimeout(() => {
    refreshCardCounter();
    endRound();
  }, 5000);
}

function updateHealthBar(damage) {
  let tagDivHealthBar;
  let tagSpanHealth;
  let initialHP = 0;
  let finalHP = 0;

  if (damage < 0) {
    tagDivHealthBar = document.getElementById("container-health-bar-player");
    tagSpanHealth = document.getElementById("health-counter-player");
    initialHP = playerHp;
    playerHp -= Math.abs(damage);
    finalHP = playerHp;
  } else {
    tagDivHealthBar = document.getElementById("container-health-bar-computer");
    tagSpanHealth = document.getElementById("health-counter-computer");
    initialHP = computerHp;
    computerHp -= Math.abs(damage);
    finalHP = computerHp;
  }

  damage = (Math.abs(damage) > initialHP ? initialHP : Math.abs(damage));

  let timePerPoint = (3000 - (5 * damage)) / damage;
  let currentHp = (finalHP * 100 / totalHp).toFixed(2);

  tagDivHealthBar.style.setProperty("--progress", (currentHp > 0 ? currentHp : 0));

  refreshHealthCounter(timePerPoint, tagSpanHealth, initialHP, finalHP);
}

function refreshHealthCounter(timePerPoint, tagSpanHealth, initialHP, finalHP) {
  tagSpanHealth.innerHTML = "HP " + ("000" + initialHP).slice(-4);

  if (initialHP > finalHP && initialHP > 0) {
    setTimeout(() => {
      initialHP--;
      refreshHealthCounter(timePerPoint, tagSpanHealth, initialHP, finalHP);
    }, timePerPoint);
  }
}

function getGenerationsChecked() {
  let generationsData = setGenerationsData();
  let arrayGenerationsChecked = [];

  for (let gen of generationsData) {
    if (gen.checked) {
      for (let x = gen.first; x <= gen.last; x++) {
        arrayGenerationsChecked.push(x);
      }
    }
  }

  return arrayGenerationsChecked;
}

function setGenerationsData() {
  let checkGenerations = document.getElementById("fieldset-generations").getElementsByClassName("generations");
  let first = [1, 152, 252, 387, 494, 650, 722, 810];
  let last = [151, 251, 386, 493, 649, 721, 809, 898];
  let generationsData = [];

  for (let x = 0; x < 8; x++) {
    generationsData.push({
      number: x + 1,
      checked: checkGenerations[x].checked,
      first: first[x],
      last: last[x]
    });
  }

  return generationsData;
}

function changeBackground(pokemon, challenger) {
  let tagImg = document.getElementById(challenger + "-img-pokemon-background");

  tagImg.classList.remove("legendary");
  tagImg.classList.remove("mythical");

  if (pokemon.legendary) {
    tagImg.src = backgroundLegendary;
    tagImg.classList.add("legendary");
  } else if (pokemon.mythical) {
    tagImg.src = backgroundMythical;
    tagImg.classList.add("mythical");
  } else {
    tagImg.src = backgroundNormal;
  }
}

function musicControl(command) {
  let icon = document.getElementById("theme-song-play");

  switch (command) {
    case "play": {
      if (playThemeSong) {
        themeSongAudio.pause();
        icon.classList.remove("fa-pause");
        icon.classList.add("fa-play");
      } else {
        themeSongAudio.play();
        icon.classList.remove("fa-play");
        icon.classList.add("fa-pause");
      }
      playThemeSong = !playThemeSong;
      break;
    }
    case "up": {
      if (themeSongAudio.volume < 1) themeSongAudio.volume = Math.round((themeSongAudio.volume + 0.05) * 100) / 100;
      break;
    }
    case "down": {
      if (themeSongAudio.volume > 0) themeSongAudio.volume = Math.round((themeSongAudio.volume - 0.05) * 100) / 100;
      break;
    }
  }

  document.getElementById("volume").innerHTML = Math.trunc(themeSongAudio.volume * 100) + "%";
}

function checkType() {
  let attackerTypes = battleNumber % 2 ? pokemonPlayer.types : pokemonComputer.types;
  let defenderTypes = battleNumber % 2 ? pokemonComputer.types : pokemonPlayer.types;
  let multiplyAttack = 0;
  let setDelay = 250;
  let times = 0;

  for (let attackerType of attackerTypes) {
    for (let defenderType of defenderTypes) {
      if (types[attackerType].strong.indexOf(defenderType) >= 0) {
        createTypesComparisonsHTML(createTypeIcon(attackerType), createTypeIcon(defenderType), "fa-greater-than", setDelay * times++);
        multiplyAttack += 0.2;
      }
      if (types[attackerType].weak.indexOf(defenderType) >= 0) {
        createTypesComparisonsHTML(createTypeIcon(attackerType), createTypeIcon(defenderType), "fa-less-than", setDelay * times++);
        multiplyAttack += -0.2;
      }
      if (types[defenderType].immune.indexOf(attackerType) >= 0) {
        createTypesComparisonsHTML(createTypeIcon(defenderType), createTypeIcon(attackerType), "fa-minus-circle", setDelay * times++);
        multiplyAttack += -1;
      }
    }
  }

  return multiplyAttack < -1 ? -1 : multiplyAttack;
}

function translate(text) {
  let sentence = {
    bug: "Inseto",
    dark: "Noturno",
    dragon: "Dragão",
    electric: "Elétrico",
    fairy: "Fada",
    fighting: "Lutador",
    fire: "Fogo",
    flying: "Voador",
    ghost: "Fantasma",
    grass: "Planta",
    ground: "Terrestre",
    ice: "Gelo",
    normal: "normal",
    poison: "Venenoso",
    psychic: "Psíquico",
    rock: "Pedra",
    steel: "Aço",
    water: "Água"
  }

  return sentence[text];
}

function paint(object, style) {
  let element = {
    bug: {
      background: "#3c9950",
      border: "#1c4b27"
    },
    dark: {
      background: "#595978",
      border: "#040707"
    },
    dragon: {
      background: "#62cad9",
      border: "#448a95"
    },
    electric: {
      background: "#fafa72",
      border: "#e2e32b"
    },
    fairy: {
      background: "#e91368",
      border: "#961a45"
    },
    fighting: {
      background: "#ef6239",
      border: "#994025"
    },
    fire: {
      background: "#fd4b5a",
      border: "#ab1f24"
    },
    flying: {
      background: "#94b2c7",
      border: "#4a677d"
    },
    ghost: {
      background: "#906791",
      border: "#33336b"
    },
    grass: {
      background: "#27cb50",
      border: "#147b3d"
    },
    ground: {
      background: "#6e491f",
      border: "#a8702d"
    },
    ice: {
      background: "#d8f0fa",
      border: "#86d2f5"
    },
    normal: {
      background: "#ca98a6",
      border: "#75525c"
    },
    poison: {
      background: "#9b69da",
      border: "#5e2d89"
    },
    psychic: {
      background: "#f71d92",
      border: "#a52a6c"
    },
    rock: {
      background: "#8b3e22",
      border: "#48190b"
    },
    steel: {
      background: "#43bd94",
      border: "#60756e"
    },
    water: {
      background: "#85a8fb",
      border: "#1552e1"
    }
  }

  return element[object][style];
}

(function buildTypes() {
  class PokemonType {
    constructor(strong, weak, immune) {
      this.strong = strong;
      this.weak = weak;
      this.immune = immune;
    }
  }

  types["bug"] = new PokemonType(["dark", "grass", "psychic"], ["fire", "flying", "rock"], []);
  types["dark"] = new PokemonType(["ghost", "psychic"], ["bug", "fairy", "fighting"], ["psychic"]);
  types["dragon"] = new PokemonType(["dragon"], ["dragon", "fairy", "ice"], []);
  types["electric"] = new PokemonType(["water", "flying"], ["ground"], []);
  types["fairy"] = new PokemonType(["dark", "dragon", "fighting"], ["steel", "poison"], ["dragon"]);
  types["fighting"] = new PokemonType(["dark", "ice", "normal", "rock", "steel"], ["fairy", "flying", "psychic"], []);
  types["fire"] = new PokemonType(["bug", "grass", "ice", "steel"], ["rock", "ground", "water"], []);
  types["flying"] = new PokemonType(["bug", "fighting", "grass"], ["electric", "ice", "rock"], ["ground"]);
  types["ghost"] = new PokemonType(["ghost", "psychic"], ["dark", "ghost"], ["normal", "fighting"]);
  types["grass"] = new PokemonType(["ground", "rock", "water"], ["bug", "fire", "flying", "ice", "poison"], []);
  types["ground"] = new PokemonType(["electric", "fire", "poison", "rock", "steel"], ["ice", "grass", "water"], ["electric"]);
  types["ice"] = new PokemonType(["dragon", "flying", "grass", "ground"], ["fighting", "fire", "rock", "steel"], []);
  types["normal"] = new PokemonType(["normal"], ["fighting"], ["ghost"]);
  types["poison"] = new PokemonType(["fairy", "grass"], ["ground", "psychic"], []);
  types["psychic"] = new PokemonType(["fighting", "poison"], ["bug", "dark", "ghost"], []);
  types["rock"] = new PokemonType(["bug", "fire", "flying", "ice"], ["fighting", "grass", "ground", "steel", "water"], []);
  types["steel"] = new PokemonType(["fairy", "ice", "rock"], ["fighting", "fire", "ground"], ["poison"]);
  types["water"] = new PokemonType(["fire", "ground", "rock"], ["electric", "grass"], []);
})();