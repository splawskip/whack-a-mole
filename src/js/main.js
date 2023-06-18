const App = {
  /**
   * DOM elements used by the application.
   *
   * @property {Element} scoreBoard - The score board element.
   * @property {Element} backyard - The backyard element.
   * @property {NodeList} holes - The list of hole elements.
   */
  $: {
    scoreBoard: document.querySelector('[data-game="score"]'),
    backyard: document.querySelector('[data-game="board"]'),
    holes: document.querySelectorAll('[data-game="hole"]'),
    startButton: document.querySelector('[data-game="start-button"]'),
  },
  /**
   * The last mole hole that appeared.
   *
   * @type {Element|null}
   */
  lastHole: null,
  /**
   * Indicates whether the game time is up.
   *
   * @type {boolean}
   */
  timeUp: false,
  /**
   * The current score.
   *
   * @type {number}
   */
  score: 0,
  /**
   * Generates a random time between min and max.
   *
   * @param {number} min - The minimum time value.
   * @param {number} max - The maximum time value.
   * @returns {number} The random number that represents time in miliseconds.
   */
  getRandomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  },
  /**
   * Gets a random hole element from the provided list of holes.
   *
   * @param {NodeList} holes - The list of hole elements.
   * @returns {Element} The random hole element.
   */
  getRandomHole(holes) {
    // Get hole index.
    const holeIndex = Math.floor(Math.random() * holes.length);
    // Get hole.
    const hole = holes[holeIndex];
    // If new hole is the same as previous one, get random hole again.
    if (hole === App.lastHole) {
      return App.getRandomHole(holes);
    }
    // Set hole as last hole.
    App.lastHole = hole;
    // Return hole.
    return hole;
  },
  /**
   * Makes a mole appear from a random hole for a random duration.
   *
   * @returns {void}
   */
  peep() {
    // Get mole peep duration.
    const peepDuration = App.getRandomTime(200, 1000);
    // Get hole from which mole will peep.
    const hole = App.getRandomHole(App.$.holes);
    // Force mole to peep from the hole.
    hole.classList.add('peep');
    // Hide mole when time has passed.
    setTimeout(() => {
      hole.classList.remove('peep');
      // If game should last, show another mole.
      if (!App.timeUp) {
        App.peep();
      }
    }, peepDuration);
  },
  /**
   * Bonks a mole when clicked, increments the score, and updates the UI.
   *
   * @param {Event} event - The click event object.
   * @returns {void}
   */
  bonk(event) {
    // Bail if no real click.
    if (!event.isTrusted) {
      return;
    }
    // Add point to scoring.
    App.score += 1;
    // Hide clicked mole.
    event.target.classList.remove('peep');
    // Update score board UI.
    App.$.scoreBoard.textContent = App.score;
  },
  /**
   * Starts the game by initializing the score, setting the game time, and starting the mole appearances.
   *
   * @returns {void}
   */
  startGame() {
    // Reset game variables.
    App.$.scoreBoard.textContent = 0;
    App.timeUp = false;
    App.score = 0;
    // Force moles to peep.
    App.peep();
    // End game after 10 seconds.
    setTimeout(() => {
      App.timeUp = true;
    }, 10000);
  },
  /**
   * Binds event listeners to relevant elements.
   *
   * @returns {void}
   */
  bindEvents() {
    // Delegate click events from gameboard to moles.
    App.$.backyard.addEventListener('click', (event) => {
      if (event.target.matches('[data-game="mole"]')) {
        App.bonk(event);
      }
    });
    // Attach start game event to start button.
    App.$.startButton.addEventListener('click', App.startGame);
  },
  /**
   * Boots the application by binding events.
   *
   * @returns {void}
   */
  boot() {
    App.bindEvents();
  },
};
// Boot the app.
App.boot();
