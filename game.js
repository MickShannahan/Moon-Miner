// GLOBAL Variables
let totalCheese = 0;
let currentCheese = 0;
let isCheeseIntervalRunning = false;
let second = 1000
// Object To store Cheese Generating Methods
let mineMethod = {
  pointer: {
    name: `Pointer`,
    genValue: 1,
    upPrice: 25,
    quantity: 1,
    upIncrement: 2,
    unlocked: true,
    upgradePath: 'nothing',
  },
  astronaut: {
    name: 'Astronaut',
    genValue: 1,
    upPrice: 100,
    quantity: 0,
    upIncrement: 1.25,
    unlocked: true,
    upgradePath: 'cheeseDrill',
  },
  cheeseDrill: {
    name: 'Cheese Drill',
    genValue: 10,
    upPrice: 250,
    quantity: 0,
    upIncrement: 1.5,
    unlocked: true,
    upgradePath: 'research Center',
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
  drawUpdate()
}

// function ran by clicking moon, increments cheese based on click modifiers
function clickCheese(input) {
  currentCheese += (mineMethod[input].genValue) * (mineMethod[input].quantity)
  console.log(`Current Cheese: ${currentCheese}`)
  console.log(`${input}`)

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
    console.log('Cheese interval counter has started')
  } else {
    console.log('Cheese interval counter is already running')
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



drawUpdate()
cheeseInterval()