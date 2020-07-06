// GLOBAL Variables
let totalCheese = 0;
let currentCheese = 1000;
let cheesePerMin = 0;
let globalCheeseRefine = 1;
let prestigeMulti = 1;
let isCheeseIntervalRunning = false;
let second = 1000
let showCheeseConsole = false;
// Object To store Cheese Generating Methods
let mineMethod = {}
mineMethod = {
  pointer: {
    name: `Pointer`,
    genValue: 1,
    refineValue: 0,
    upPrice: 25,
    quantity: 1,
    maxUnitsDrawn: 50,
    upIncrement: 1.8,
    unlocked: true,
    toolTip: 'increase mine power of pointer by 1',
    asset: '',
    sound: 'pointer-up',
    rotate: 0,
    offset: 0,
    upgradePath: 'nothing',
  },
  astronaut: {
    name: 'Astronaut',
    genValue: 1,
    refineValue: 0,
    upPrice: 75,
    quantity: 0,
    maxUnitsDrawn: 50,
    upIncrement: 1.2,
    unlocked: true,
    toolTip: 'Astronauts mine 1 cheese per second',
    asset: './assets/moons/miners/astronaut.gif',
    sound: 'astronaut-spawn',
    rotate: 8,
    offset: 240,
    upgradePath: 'cheeseDrill',
  },
  cheeseDrill: {
    name: 'Cheese Drill',
    genValue: 10,
    refineValue: 0,
    upPrice: 250,
    quantity: 0,
    maxUnitsDrawn: 50,
    upIncrement: 1.4,
    unlocked: false,
    toolTip: 'Drills mine 10 cheese per second',
    asset: './assets/moons/miners/cheese-drill.gif',
    sound: 'drill-spawn',
    rotate: 16,
    offset: 250,
    upgradePath: 'refinementFactory',
  },
  refinementFactory: {
    name: 'Refinement Factory',
    genValue: 0,
    refineValue: 0.05,
    upPrice: 5000,
    quantity: 0,
    maxUnitsDrawn: 50,
    upIncrement: 1.5,
    toolTip: 'Each Refinement factory increases totaly mining production by 5%',
    unlocked: false,
    asset: './assets/moons/miners/cheese-plant.gif',
    sound: 'factory-spawn',
    rotate: 25,
    offset: 250,
    upgradePath: 'refinementFactory',
  },
}


// Function to toggle the Shop 
function shopToggle() {
  let shopElem = document.getElementById('upgrade-shop')
  shopElem.classList.remove = 'align-self-end'
  shopElem.classList.add = 'align-self-start'
  shopElem.style.height = '100%'
}

// function to alert purchase

// Function To purchase upgrades
function purchaseUpgrade(input) {
  let upgradeChoice = mineMethod[input]
  let noBuyAlert = document.getElementById('shop-alert-space')
  if (upgradeChoice.upPrice <= currentCheese) {
    upgradeChoice.quantity += 1;
    currentCheese -= upgradeChoice.upPrice
    upgradeChoice.upPrice *= upgradeChoice.upIncrement;
    console.log(`purchased 1 ${input}/t- ${upgradeChoice.quantity}`)
    playMusic(mineMethod[input].sound)
    drawMiners(input)
    globalCheeseRefine += upgradeChoice.refineValue
  } else {
    noBuyAlert.innerHTML = `<div id='shop-alert' class="col-12 order-first alert alert-danger alert-dismissable fade show" role="alert">
    Could not buy ${upgradeChoice.name}, need ${Math.ceil(upgradeChoice.upPrice - currentCheese)} <i class="fa fa-moon-o"></i>
  </div>`
    function alertTimeout() {
      noBuyAlert.innerHTML = ''
    }
    setTimeout(alertTimeout, 4 * second)
    // window.alert(`Could not buy, need more cheese (${upgradeChoice.upPrice - currentCheese})`)
  }
  drawUpdate()
}


// function ran by clicking moon, increments cheese based on click modifiers
function clickCheese(input) {
  currentCheese += ((mineMethod[input].genValue) * globalCheeseRefine) * (mineMethod[input].quantity)
  totalCheese += ((mineMethod[input].genValue) * globalCheeseRefine) * (mineMethod[input].quantity)
  if (input == 'pointer') {
    document.getElementById('moon-click').play()
  }
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

// determine CPM
function findCPM() {
  let cheeseCounter = 0
  for (let key in mineMethod) {
    if (key !== 'pointer') {
      cheeseCounter += (mineMethod[key].genValue * mineMethod[key].quantity)
    }
  }
  cheesePerMin = Math.round((cheeseCounter / 60) * 100) / 100
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
  if (input == 'loadMiners') {
    for (let key in mineMethod) {
      if (mineMethod[key].quantity <= mineMethod[key].maxUnitsDrawn) {
        for (let i = 0; i <= mineMethod[key].quantity; i++) {
          moonCircle.innerHTML += `<img id="miner" style="transform: rotate(${(i * mineMethod[key].rotate)}deg) translate(0px,-${mineMethod[key].offset}px)" class="miner d-flex" src="${mineMethod[key].asset}">`
        }
      }
    }
  } else if (mineMethod[input] !== 'pointer') {
    let assetRotate = mineMethod[input].rotate
    let assetYOffset = mineMethod[input].offset
    let ammount = (mineMethod[input].quantity)
    // moonCircle.innerHTML += `<img id="miner" class="miner r${ammount}d" src="${mineMethod[input].asset}">`
    moonCircle.innerHTML += `<img id="miner" style="transform: rotate(${ammount * assetRotate}deg) translate(0px,-${assetYOffset}px)" class="miner d-flex" src="${mineMethod[input].asset}">`
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
    if (mineMethod[key].unlocked == true && currentCheese >= mineMethod[key].upPrice) {
      shopPanel.innerHTML += `<button id="${mineMethod[key].name}" class="col-5 btn btn-warning p-3 my-2 ml-2" onclick="purchaseUpgrade('${key}')" data-toggle="tooltip" data-placement="top" title="${mineMethod[key].toolTip}" aria-disabled = 'false'>${mineMethod[key].name}- ${Math.ceil(mineMethod[key].upPrice)
        } <i class="fa fa-moon-o"></i></button > `
      mineMethod[key].shopDrawn = true;
    }
    else if (mineMethod[key].unlocked == true) {
      shopPanel.innerHTML += `<button id="${mineMethod[key].name}" class="col-5 btn btn-outline-warning disabled p-3 my-2 ml-2" onclick="purchaseUpgrade('${key}')" aria-disabled= 'true'>${mineMethod[key].name}- ${Math.ceil(mineMethod[key].upPrice)} <i class="fa fa-moon-o"></i></button > `
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
      statPanel.innerHTML += `<div id = "${mineMethod[key].name}" class="col-12 text-light d-flex justify-text-start px-3 py-1" onclick = "purchaseUpgrade('${key}')" > ${mineMethod[key].name} - ${mineMethod[key].quantity}: ${(mineMethod[key].genValue) * (mineMethod[key].quantity)} cps</div> `
    }
  }

}


// function to update all Draw Events gets onscreen counts
function drawUpdate() {
  let cheeseCountElem = document.getElementById('cheese-count')
  let cheesePerMinElem = document.getElementById('cheese-per-minute-count')
  drawShop()
  drawStats()
  findCPM()
  cheeseCountElem.innerHTML = ` ${Math.floor(currentCheese)}  <i class="fa fa-moon-o"></i>`
  cheesePerMinElem.innerHTML = `${cheesePerMin}   <i class="fa fa-area-chart"></i> `
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

let musicPlaying = false;
function playMusic(input) {
  if (input == 'bg-music') {
    if (musicPlaying == false) {
      document.getElementById(input).play()
      document.getElementById(input).volume = 0.5;

      musicPlaying = true;
    } else {
      document.getElementById(input).pause()
      musicPlaying = false;
    }
  } else {
    document.getElementById(input).play()
  }
}


drawUpdate()
cheeseInterval()
// loadFromSave()


