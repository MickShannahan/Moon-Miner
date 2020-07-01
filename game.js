// GLOBAL Variables
let totalCheese = 0;
let currentCheese = 1000;
let isCheeseIntervalRunning = false;
let second = 1000
let showCheeseConsole = false;
// Object To store Cheese Generating Methods
let mineMethod = {}
mineMethod = {
  pointer: {
    name: `Pointer`,
    genValue: 1,
    upPrice: 25,
    quantity: 1,
    upIncrement: 1.8,
    unlocked: true,
    asset: '',
    upgradePath: 'nothing',
  },
  astronaut: {
    name: 'Astronaut',
    genValue: 1,
    upPrice: 75,
    quantity: 0,
    upIncrement: 1.2,
    unlocked: true,
    asset: './assets/moons/miners/astronaut.gif',
    upgradePath: 'cheeseDrill',
  },
  cheeseDrill: {
    name: 'Cheese Drill',
    genValue: 10,
    upPrice: 250,
    quantity: 0,
    upIncrement: 1.4,
    unlocked: false,
    asset: './assets/moons/miners/cheese-drill.gif',
    upgradePath: 'cheeseDrill',
  },
}


// Function to toggle the Shop 
function shopToggle() {
  let shopElem = document.getElementById('upgrade-shop')
  shopElem.classList.remove = 'align-self-end'
  shopElem.classList.add = 'align-self-start'
  shopElem.style.height = '100%'
}

// Function To purchase upgrades
function purchaseUpgrade(input) {
  let upgradeChoice = mineMethod[input]
  if (upgradeChoice.upPrice <= currentCheese) {
    upgradeChoice.quantity += 1;
    currentCheese -= upgradeChoice.upPrice
    upgradeChoice.upPrice *= upgradeChoice.upIncrement;
    console.log(`purchased 1 ${input}/t- ${upgradeChoice.quantity}`)
  } else {
    window.alert(`Could not buy, need more cheese (${upgradeChoice.upPrice - currentCheese})`)
  }
  drawMiners(input)
  drawUpdate()
}

// function ran by clicking moon, increments cheese based on click modifiers
function clickCheese(input) {
  currentCheese += (mineMethod[input].genValue) * (mineMethod[input].quantity)
  totalCheese += (mineMethod[input].genValue) * (mineMethod[input].quantity)
  if (showCheeseConsole == true) {
    console.log(`Current Cheese: ${currentCheese}`)
    console.log(`${input}`)
  }
  drawUpdate()
}

// Function to track automatic cheese generation
function autoGetCheese() {
  for (let key in mineMethod) {
    if (key !== 'pointer') {
      clickCheese(key)
    }
  }
}

// Function to increment Time and add to Cheese count based on modifiers
function cheeseInterval() {
  if (isCheeseIntervalRunning == false) {
    setInterval(autoGetCheese, second)
    setInterval(saveToLocal, second * 10)
    console.log('Cheese interval counter has started')
  } else {
    console.log('Cheese interval counter is already running')
  }
}

// Draw the Miners on the Moon
function drawMiners(input) {
  let moonCircle = document.getElementById(`moon`)
  let ammount = (mineMethod[input].quantity)
  if (input == 'loadMiners') {
    for (let key in mineMethod) {
      if (mineMethod[key].quantity > 0) {
        for (let i = 0; i <= ammount; i++) {
          moonCircle.innerHTML += `<img id="miner" style="transform: rotate(${i * 8}deg) translate(0px,-455%)" class="miner" src="${mineMethod[key].asset}">`
        }
      }
    }
  } else if (mineMethod[input] !== 'pointer') {
    // moonCircle.innerHTML += `<img id="miner" class="miner r${ammount}d" src="${mineMethod[input].asset}">`
    moonCircle.innerHTML += `<img id="miner" style="transform: rotate(${ammount * 8}deg) translate(0px,-455%)" class="miner" src="${mineMethod[input].asset}">`
    // Working HTML
    // <img id="miner" class=" miner" style="transform: roatate(0deg) translate(0px,-455%);"
    //     src="./assets/moons/miners/astronaut.gif"></img>
  }
}


// Function to draw the Shop Choices
function drawShop() {
  let shopPanel = document.getElementById('upgrade-shop-panel')
  shopPanel.innerHTML = ``
  for (let key in mineMethod) {
    if (mineMethod[key].unlocked == true) {
      shopPanel.innerHTML += `<button id="${mineMethod[key].name}" class="col-5 btn btn-outline-warning p-2 my-2 ml-2" onclick="purchaseUpgrade('${key}')">${mineMethod[key].name + Math.ceil(mineMethod[key].upPrice)
        }</button > `
      mineMethod[key].shopDrawn = true;
    }
    if (mineMethod[key].quantity >= 10) {
      mineMethod[mineMethod[key].upgradePath].unlocked = true;
    }
  }
}

// Function to draw the Stats Page
function drawStats() {
  let statPanel = document.getElementById('stats-panel')
  statPanel.innerHTML = ''
  for (let key in mineMethod) {
    if (mineMethod[key].quantity > 0 && key !== 'pointer') {
      statPanel.innerHTML += `<div id = "${mineMethod[key].name}" class="col-4 text-warning px-3 py-1" onclick = "purchaseUpgrade('${key}')" > ${mineMethod[key].name} - ${mineMethod[key].quantity}: ${(mineMethod[key].genValue) * (mineMethod[key].quantity)} cps</div> `
    }
  }

}


// function to update all Draw Events gets onscreen counts
function drawUpdate() {
  let cheeseCountElem = document.getElementById('cheese-count')
  let cheesePerMinElem = document.getElementById('cheese-per-minute-count')
  drawShop()
  drawStats()
  cheeseCountElem.innerHTML = `Cheese: ${Math.floor(currentCheese)} `
  cheesePerMinElem.innerHTML = `CPM: `
}

// Save to local Storage
function saveToLocal() {
  window.localStorage.setItem("current-cheese", JSON.stringify(currentCheese))
  window.localStorage.setItem("total-cheese", JSON.stringify(totalCheese))
  window.localStorage.setItem("mineMethod", JSON.stringify(mineMethod))
  console.log('game-saved')
}

// Load from Local Storage
function loadFromSave() {
  let savedCheese = JSON.parse(window.localStorage.getItem("current-cheese"))
  let savedStats = JSON.parse(window.localStorage.getItem("total-cheese"))
  let savedMiners = JSON.parse(window.localStorage.getItem("mineMethod"))

  if (savedCheese) {
    currentCheese = savedCheese;
  }
  if (savedStats) {
    totalCheese = savedStats;
  }
  if (savedStats) {
    mineMethod = savedMiners;
  }
  drawMiners('loadMiners')
}


drawUpdate()
cheeseInterval()
// loadFromSave()


