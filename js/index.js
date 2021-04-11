"use strict"

let audioFlipCard = new Audio("https://freesound.org/data/previews/536/536782_1415754-lq.mp3");
let themeSongAudio = new Audio("https://mp3.fastupload.co/data/1617853628/yt1s.com-01-Pokemon-Theme-PortugueseBR.mp3");
let forward = document.getElementById("forward");
let pokemonPlayer, pokemonComputer;
let optionsOpened = true;
let playThemeSong = false;
let battleNumber = 0;
let amountCards = 0;
let pokemonId = 0;
let computerDeck = "";
let playerDeck = "";
let types = {};

themeSongAudio.volume = 0.25;
themeSongAudio.loop = true;

if (window.location.href.includes("github")) { forward.remove(); }

createOptionsHTML();

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
  let generations = document.getElementsByClassName("generations");
  let atLeastOne = false;

  for (let gen of generations) {
    if (gen.checked) {
      atLeastOne = true;
      break;
    }
  }

  return atLeastOne;
}

function printsError() {
  let tagBody = document.getElementById("body");
  let tagDiv = document.createElement("div");
  let tagSpan = document.createElement("span");

  tagDiv.appendChild(tagSpan);
  tagBody.appendChild(tagDiv);

  tagDiv.classList.add("error-modal");
  tagDiv.classList.add("center")

  tagSpan.classList.add("animate__animated");
  tagSpan.classList.add("animate__tada");
  tagSpan.classList.add("center");
  tagSpan.innerHTML = "Selecione pelo menos uma geração";

  setTimeout(() => {
    tagDiv.remove();
  }, 2500);
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

function resetVariables() {
  let tagDivFlipCard = document.getElementsByClassName("flip-card");
  let label = document.getElementById("attribute-choice-label");
  amountCards = document.getElementById("amount-cards").value;

  label.innerHTML = "Escolha o seu atributo";
  battleNumber = 0;
  playerDeck = "";
  computerDeck = "";

  for (let x = 0; x < tagDivFlipCard.length; x) {
    tagDivFlipCard[x].remove();
  }
}

function buildDeck() {
  playerDeck = assembleDeck();
  computerDeck = assembleDeck();
}

function refreshCardCounter() {
  let labelPlayer = document.getElementById("player-label-card-counter");
  let labelComputer = document.getElementById("computer-label-card-counter");

  labelPlayer.innerHTML = playerDeck.length;
  labelComputer.innerHTML = computerDeck.length;
}

async function startRound() {
  let computerAttribute = "";
  battleNumber++

  if (battleNumber % 2 > 0) {
    changeDisabledAttributeButtons(false);
    showPokemonPlayer();
  } else {
    await showPokemonComputer();
    computerAttribute = computerAttributeChoice();
    await showPokemonPlayer();
    checkAttribute(computerAttribute);
  }
}

function endRound() {
  let playerCard = document.getElementById("player-flip-card");
  let computerCard = document.getElementById("computer-flip-card");
  let frontPlayerCard = document.getElementById("player-flip-card-inner");
  let frontComputerCard = document.getElementById("computer-flip-card-inner");

  playerCard.classList.remove("scaled");
  computerCard.classList.remove("scaled");
  frontPlayerCard.classList.remove("rotate-card");
  frontComputerCard.classList.remove("rotate-card");
  audioFlipCard.play();
  clearAttributeButtons();

  if (playerDeck.length > 0 && computerDeck.length > 0) {
    setTimeout(() => {
      startRound();
    }, 1250);
  } else {
    endGame();
  }
}

async function showPokemonPlayer() {
  let flipCardInner = document.getElementById("player-flip-card-inner");

  pokemonId = playerDeck[0];
  pokemonPlayer = await addPokemonData("player");

  changeBackground(pokemonPlayer, "player");
  flipCardInner.classList.add("rotate-card");
  audioFlipCard.play();
}

async function showPokemonComputer() {
  let flipCardInner = document.getElementById("computer-flip-card-inner");

  pokemonId = computerDeck[0];
  pokemonComputer = await addPokemonData("computer");

  changeBackground(pokemonComputer, "computer");
  flipCardInner.classList.add("rotate-card");
  audioFlipCard.play();
}

function assembleDeck() {
  let amountCardsDeck = amountCards;
  let cardNumber = 0;
  let deck = [];
  let pokemonGenerationsChecked = getGenerationsChecked();

  while (amountCardsDeck) {
    cardNumber = pokemonGenerationsChecked[Math.floor(Math.random() * pokemonGenerationsChecked.length)]

    if (deck.indexOf(cardNumber) == -1) {
      deck.push(cardNumber);
      amountCardsDeck--;
    }
  }

  return deck;
}

async function addPokemonData(challenger) {
  let currentPlayer = await buildPokemon();

  let computerImage = document.getElementById(challenger + "-image");
  let computerName = document.getElementById(challenger + "-name");
  let computerAttack = document.getElementById(challenger + "-attack");
  let computerDefense = document.getElementById(challenger + "-defense");
  let computerSpeed = document.getElementById(challenger + "-speed");

  computerImage.src = currentPlayer.image;
  computerName.innerHTML = currentPlayer.name;
  computerAttack.innerHTML = "Ataque: " + currentPlayer.attack;
  computerDefense.innerHTML = "Defesa: " + currentPlayer.defense;
  computerSpeed.innerHTML = "Velocidade: " + currentPlayer.speed;

  return currentPlayer;
}

async function buildPokemon() {
  let data = await getPokemon();

  return {
    id: data.id,
    name: data.name,
    image: data.image,
    attack: data.attack,
    defense: data.defense,
    speed: data.speed,
    legendary: data.legendary,
    mythical: data.mythical,
    generation: data.generation
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
      console.log("Error request pokémon.");
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
      console.log("Error request species.");
    })

  return pokemonData;
}

function endGame() {
  let label = document.getElementById("attribute-choice-label");

  if (playerDeck.length > 0) {
    label.innerHTML = "VOCÊ VENCEU!";
  } else {
    label.innerHTML = "VOCÊ PERDEU PARA O BOT!";
  }

  showOptions();
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

async function checkAttribute(attribute) {
  let playerCard = document.getElementById("player-flip-card");
  let computerCard = document.getElementById("computer-flip-card");
  let buttons = document.getElementsByClassName("attributes");

  // Adiciona sombra nos atributos não escolhidos
  for (let button of buttons) {
    if (!button.id.includes(attribute)) {
      button.classList.add("attributes-not-chosen");
    }
  }

  console.log(playerDeck);
  console.log(computerDeck);

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
  }, 1000)

  setTimeout(() => {
    refreshCardCounter();
    endRound();
  }, 5000);
}

function createOptionsHTML() {
  let tagDivOptions = document.getElementById("options");
  let tagFieldsetOptions = document.createElement("fieldset");
  let tagLegendOptions = document.createElement("legend");
  let tagFieldsetGenerations = createFieldsetHTML();
  let tagDivRightOption = document.createElement("div");
  let tagLabelAmountCards = document.createElement("label");
  let tagSelectAmountCards = document.createElement("select");
  let tagOptionAmountCards03 = document.createElement("option");
  let tagOptionAmountCards05 = document.createElement("option");
  let tagOptionAmountCards10 = document.createElement("option");
  let tagButtonNewGame = document.createElement("button");

  tagSelectAmountCards.appendChild(tagOptionAmountCards03);
  tagSelectAmountCards.appendChild(tagOptionAmountCards05);
  tagSelectAmountCards.appendChild(tagOptionAmountCards10);

  tagDivRightOption.appendChild(tagLabelAmountCards);
  tagDivRightOption.appendChild(tagSelectAmountCards);
  tagDivRightOption.appendChild(tagButtonNewGame);

  tagFieldsetOptions.appendChild(tagLegendOptions);
  tagFieldsetOptions.appendChild(tagFieldsetGenerations);
  tagFieldsetOptions.appendChild(tagDivRightOption);

  tagDivOptions.appendChild(tagFieldsetOptions);

  tagFieldsetOptions.setAttribute("class", "fieldset-options");

  tagDivRightOption.setAttribute("class", "right-options");

  tagLabelAmountCards.setAttribute("for", "amount-cards");

  tagSelectAmountCards.setAttribute("id", "amount-cards");
  tagSelectAmountCards.setAttribute("class", "game-options");

  tagButtonNewGame.setAttribute("id", "button-new-game");
  tagButtonNewGame.setAttribute("class", "game-options");

  tagLegendOptions.innerHTML = "Opções";

  tagLabelAmountCards.innerHTML = "Deck com: ";

  tagOptionAmountCards03.value = "3";
  tagOptionAmountCards03.text = "03 cartas";
  tagOptionAmountCards05.value = "5";
  tagOptionAmountCards05.text = "05 cartas";
  tagOptionAmountCards10.value = "10";
  tagOptionAmountCards10.text = "10 cartas";

  tagButtonNewGame.addEventListener("click", newGame);
  tagButtonNewGame.innerHTML = "Novo Jogo";
}

function createCardHTML(challenger) {
  let pokemonBacktroundCard = "https://jbrogan17.files.wordpress.com/2010/12/jared-pokemon-card-backside1.jpg?w=731";
  let pokemonBackground = "https://3.bp.blogspot.com/-H8cw4oVE78c/V4j3TBTL0SI/AAAAAAAABZI/QhZx30p-B2Inc5YDlyiekL8AdKS_IxkgACLcB/s1600/poke.png";

  let tagDivCards = document.querySelector("#cards");

  let tagDivFlipCard = document.createElement("div");

  let tagDivFlipCardInner = document.createElement("div");

  let tagDivFlipCardBackBackground = document.createElement("div");
  let tagImgCardBackBackground = document.createElement("img");

  let tagDivFlipCardFront = document.createElement("div");
  let tagImgPokemonBackground = document.createElement("img");
  let tagDivPokemonData = document.createElement("div");
  let tagImgPokemon = document.createElement("img");
  let tagH2PokemonName = document.createElement("h2");
  let tagDivButtonAttack = document.createElement("div");
  let tagButtonPokemonAttack = document.createElement("button");
  let tagDivButtonDefense = document.createElement("div");
  let tagButtonPokemonDefense = document.createElement("button");
  let tagDivButtonSpeed = document.createElement("div");
  let tagButtonPokemonSpeed = document.createElement("button");

  tagDivPokemonData.appendChild(tagImgPokemon);
  tagDivPokemonData.appendChild(tagH2PokemonName);

  tagDivButtonAttack.appendChild(tagButtonPokemonAttack);
  tagDivButtonDefense.appendChild(tagButtonPokemonDefense);
  tagDivButtonSpeed.appendChild(tagButtonPokemonSpeed);

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

  tagDivFlipCard.classList.add("flip-card");

  tagDivFlipCardInner.classList.add("flip-card-inner");

  tagDivFlipCardBackBackground.classList.add("card-back");
  tagImgCardBackBackground.classList.add("img-card-back-background");

  tagDivFlipCardFront.classList.add("card-front");
  tagImgPokemonBackground.classList.add("img-pokemon-background")
  tagDivPokemonData.classList.add("container-pokemon-data");
  tagImgPokemon.classList.add("img-pokemon");
  tagH2PokemonName.classList.add("pokemon-name", "pokemon-font-color-inverse", "center");

  tagDivFlipCard.id = challenger + "-flip-card";
  tagDivFlipCardInner.id = challenger + "-flip-card-inner";
  tagImgPokemonBackground.id = challenger + "-img-pokemon-background";
  tagImgPokemon.id = challenger + "-image";
  tagH2PokemonName.id = challenger + "-name";

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

  tagImgCardBackBackground.src = pokemonBacktroundCard;
  tagImgPokemonBackground.src = pokemonBackground;

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

function createFieldsetHTML() {
  let tagFieldsetGenerations = document.createElement("fieldset");
  let tagLegendGenerations = document.createElement("legend");

  tagFieldsetGenerations.appendChild(tagLegendGenerations);

  tagFieldsetGenerations.setAttribute("id", "fieldset-generations");
  tagFieldsetGenerations.setAttribute("class", "fieldset-generations");

  tagLegendGenerations.innerHTML = "Gerações";

  for (let x = 1; x <= 8; x++) {
    let tagDivGenerations = document.createElement("div");
    let tagInputGenerations = document.createElement("input");
    let tagLabelGenerations = document.createElement("label");

    tagDivGenerations.appendChild(tagInputGenerations);
    tagDivGenerations.appendChild(tagLabelGenerations);

    tagFieldsetGenerations.appendChild(tagDivGenerations);

    tagInputGenerations.setAttribute("id", "generation-" + x);
    tagInputGenerations.setAttribute("class", "generations");
    tagInputGenerations.setAttribute("type", "checkbox");
    // tagInputGenerations.setAttribute("checked", "");

    tagLabelGenerations.setAttribute("for", "generation-" + x);
    tagLabelGenerations.setAttribute("class", "label-generations");

    tagLabelGenerations.innerHTML = " " + x + "ª geração";
  }

  return tagFieldsetGenerations;
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
  let checkGenerations = document.getElementsByClassName("generations");
  let first = [1, 152, 252, 387, 494, 650, 722, 810];
  let last = [151, 251, 386, 493, 649, 721, 809, 898];
  let generationsData = [];

  for (let x = 0; x < 8; x++) {
    generationsData.push({
      number: x + 1,
      checked: checkGenerations[x].checked ? true : false,
      first: first[x],
      last: last[x]
    })
  }

  return generationsData;
}

function changeBackground(pokemon, challenger) {
  let backgroundLegendary = "https://besthqwallpapers.com/Uploads/25-2-2019/81742/thumb2-4k-golden-silk-fabric-texture-silk-golden-background.jpg";
  let backgroundMythical = "https://images.pexels.com/photos/6498990/pexels-photo-6498990.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";
  let backgroundNormal = "https://3.bp.blogspot.com/-H8cw4oVE78c/V4j3TBTL0SI/AAAAAAAABZI/QhZx30p-B2Inc5YDlyiekL8AdKS_IxkgACLcB/s1600/poke.png";
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

function themeSong() {
  let icon = document.getElementById("theme-song");

  if (playThemeSong) {
    icon.innerHTML = "🔇";
  } else {
    icon.innerHTML = "🔊";
    themeSongAudio.play();
  }

  themeSongAudio.muted = playThemeSong;
  playThemeSong = !playThemeSong;
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
  types["normal"] = new PokemonType(["norma"], ["fighting"], ["ghost"]);
  types["poison"] = new PokemonType(["fairy", "grass"], ["ground", "psychic"], []);
  types["psychic"] = new PokemonType(["fighting", "poison"], ["bug", "dark", "ghost"], []);
  types["rock"] = new PokemonType(["bug", "fire", "flying", "ice"], ["fighting", "grass", "ground", "steel", "water"], []);
  types["steel"] = new PokemonType(["fairy", "ice", "rock"], ["fighting", "fire", "ground"], ["poison"]);
  types["water"] = new PokemonType(["fire", "ground", "rock"], ["electric", "grass"], []);
})()