(function () {
    "use strict"

    const BLOCK_SIZE = 50                // Number of pixels per gameboard grid block
    const INITIAL_SPEED = 5              // In grid blocks/sec
    const INITIAL_SNAKE_DIRECTION = 'R'  // One of R, L, U, or D

    let gameState                        // Either 'running' or 'over'

    let boardEl,                         // The gameboard element
        foodEl,                          // The food element
        gameoverEl,                      // The gameover element

        snakeX,                          // The snake's coordinates in terms of the gameboard grid 
        snakeY,
        snakeDirection,
        snakeSpeed,
        snakeEl,                         // The snake element
        snakeColor = "#721745"

    let boardW,                          // The gameboard's size in terms of the gameboard grid
        boardH,
        score

    /**
     * Returns the number of pixels represented by a given size in gameboard blocks
     * @param sizeInBlocks The size to convert in terms of number of gameboard grid squares (blocks)
     * @param includeUnits Whether or not to include the 'px' unit in the returned value
     */
    function px(sizeInBlocks, includeUnits = true) {
        return sizeInBlocks * BLOCK_SIZE + (includeUnits ? 'px' : '')
    }

    /**
     * Sizes the gameboard so that it takes up the maximum amount of space within the browser viewport
     * but has width and height dimensions that are multiples of the BLOCK_SIZE
     */
    function resizeBoard() {

        let w = window.innerWidth
        let h = window.innerHeight

        // Size the board so there is a left/right margin by subtracting 2 grid block sizes from the window width
        let boardPxW = w - px(2, false);
        // Size the board so there is a bottom margin by subtracting 1 grid block size from the window height
        // Also make room for the header element by removing its height (boardEl.offsetTop) from the window height
        let boardPxH = h - boardEl.offsetTop - px(1, false);

        // At this point boardPxW and boardPxH are the pixel maximum width and height dimensions of the board.
        // These two lines now round these values down so that the dimensions are multiples of BLOCK_SIZE
        // For example, BLOCK_SIZE=10, boardPxW=1234px, boardPxH=879
        // So we need boardPxW=1230px, boardPxH=870px
        boardPxW -= boardPxW % BLOCK_SIZE   // In the example, boardPxW % BLOCK_SIZE = 4
        boardPxH -= boardPxH % BLOCK_SIZE   // In the example, boardPxH % BLOCK_SIZE = 9

        boardEl.style.width = boardPxW + 'px'
        boardEl.style.height = boardPxH + 'px';

        boardEl.style.borderWidth = px(0.5);  // Give the gameboard a 1/2 BLOCK_SIZE border

        // boardW and boardH are the gameboard dimensions in terms of gameboard grid blocks
        // (We will use gameboard coordinates rather than pixel coordinates to keep track of the location
        // of various elements in our app)
        boardW = boardPxW / BLOCK_SIZE
        boardH = boardPxH / BLOCK_SIZE
    }

    /**
     * Place the given element at the correct pixel position for the given grid coordinates.
     * This function assumes that the given element has position:absolute and is positioned relative to #gameboard
     * 
     * @param el The element to position on the gameboard grid
     * @param gridX The x-coordinate on the gameboard grid at which to position the segment
     * @param gridY The y-coordinate on the gameboard grid at which to position the segment
     */
    function positionElementOnGrid(el, gridY, gridX) {
        // TODO: position the element
        gridX = px(gridX);
        el.style.top = gridX;
        gridY = px(gridY);
        el.style.left = gridY;
    }

    /**
     * Returns true if the two given elements are in the same location
     */
    function isAtSamePos(el1, el2) {
        // TODO: determine if the two elements are at the same location
               
        let el1x = el1.style.top;
        let el2x = el2.style.top;
        let el1y = el1.style.left;
        let el2y = el2.style.left;
        if (el1x == el2x && el1y == el2y){
            return true;
        }
        else {return false;}
    }

    function isSnakeOutOfBounds() {
        // TODO: return true if the snake is out of bounds; otherwise return false
        if (snakeX >= boardW || snakeY >= boardH) {
            return true;
        }
        else if (snakeX < 0 || snakeY < 0){
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * Returns the milliseconds per tick needed if the snake is moving at the given speed
     * @param speed The number of gameboard grid blocks per second
     */
    function msPerTick(speed) {
        return 1000.0 / speed;
    }

    /**
     * This is the main driver of game progression.  This function should be called once per 'tick' of the game.
     * The number of ticks per second are determined by snakeSpeed, and this speed can be converted into a millisecond
     * value using the msPerTick function above.
     */
    function tick() {
        // TODO: use a timer to update the game and re-call tick
        let n = msPerTick(snakeSpeed);
        setTimeout(function () {
            if (gameState == 'running') {
                updateGame();
                tick();
            }
        }, n);
    }

    function createSnakeSegmentElement() {
        // TODO: create and return a snake segment element
        let newSegment = document.createElement('div');
        newSegment.className = 'snake-segment';
        newSegment.style.backgroundColor = snakeColor;
        newSegment.style.width = BLOCK_SIZE + 'px';
        newSegment.style.height = BLOCK_SIZE + 'px';
        return newSegment;
    }

    function createFoodElement() {
        // TODO: create and return a food element
        let newFood = document.createElement('div');
        newFood.className = 'food';
        newFood.style.width = BLOCK_SIZE + 'px';
        newFood.style.height = BLOCK_SIZE + 'px';
        newFood.style.borderRadius = "50%";
        newFood.style.backgroundColor = 'green';
        return newFood;
    }

    function killSnake() {
        // TODO: set the snake's background color to transparent
        snakeEl.style.opacity = "0";
    }

    function clearBoard() {
        // TODO: remove all elements from the gameboard element
        let clear = document.getElementById("gameboard");
        while (clear.firstChild) {
            clear.removeChild(clear.firstChild);
        }
        hideGameover();
    }

    function hideMenu() {
        // TODO: hide the menu
        document.getElementById('menu').classList.remove("open");
    }

    function showMenu() {
        // TODO: show the menu
        document.getElementById('menu').classList.add("open");
    }

    function hideGameover() {
        // TODO: hide the gameover element
        document.getElementById("game-over").classList.remove("show");
    }

    function showGameover() {
        // TODO: show the gameover element
        document.getElementById("game-over").classList.add("show");
    }

    function initSnake() {
        // TODO: get a snake element initialized and on the board!

        snakeX = 0;
        snakeY = 0;
        snakeSpeed = INITIAL_SPEED;
        snakeDirection = INITIAL_SNAKE_DIRECTION;
        snakeEl = createSnakeSegmentElement();
        boardEl.appendChild(snakeEl);
        positionElementOnGrid(snakeEl, snakeX, snakeY);
    }

    function addNewFood() {
        // TODO: add a new food element
        foodEl = createFoodElement();
        boardEl.appendChild(foodEl);
        positionElementOnGrid(foodEl, boardW-1, boardH-1);
    }

    function updateScoreElement() {
        // TODO: update the score element to show the current score
        document.getElementById('score').innerText = score;
    }

    function updateSpeedElement() {
        // TODO: update the speed element to show the snake's speed
        document.getElementById('speed').innerText = snakeSpeed;
    }

    function updateSnakePosition() {
        // TODO: update the snake's position depending on the snake's direction
        if (snakeDirection == 'R') {
            snakeX++;
        }
        else if (snakeDirection == 'L') {
            snakeX--;
        }
        else if (snakeDirection == 'U') {
            snakeY--;
        }
        else if (snakeDirection == 'D') {
            snakeY++;
        }
    }

    function isGameOver() {
        return isSnakeOutOfBounds()
    }

    function snakeFoundFood() {
        return isAtSamePos(snakeEl, foodEl)
    }

    function updateGame() {

        updateSnakePosition()

        if (isGameOver()) {
            showGameover()
            killSnake()
            gameState = 'over'
        } else {
            positionElementOnGrid(snakeEl, snakeX, snakeY)

            if (snakeFoundFood()) {
                score += 10
                snakeSpeed *= 1.05
            }
            updateScoreElement()
            updateSpeedElement()
        }
    }

    function resetGame() {

        clearBoard()
        resizeBoard()

        // Needs to happen after the board has been cleared
        initSnake()
        addNewFood()

        score = 0

        // TODO: hide the GAME OVER element 

    }

    function startGame() {

        gameState = 'running'
        tick()

    }

    function handleFormSubmit(event) {
        hideMenu()

        resetGame()
        startGame()

        // This prevents the form from actually submitting
        event.preventDefault()
    }

    function handleKeyPress(event) {
        // TODO: set snakeDirection according to the key the user pressed
        var x = event.key;
        if (x == 'ArrowUp' && gameState == 'running'){
            snakeDirection = 'U';
        }
        if (x == 'ArrowDown' && gameState == 'running'){
            snakeDirection = 'D';
        }
        if (x == 'ArrowLeft' && gameState == 'running'){
            snakeDirection = 'L';
        }
        if (x == 'ArrowRight' && gameState == 'running'){
            snakeDirection = 'R';
        }

    }

    function init() {
        // TODO: initialize the app

        boardEl = document.getElementById('gameboard');
        gameoverEl = document.getElementById('game-over');
        gameoverEl.addEventListener('click', showMenu);
        window.addEventListener('submit', handleFormSubmit);
    }

    // TODO: add a window.load listener
    window.addEventListener('load', init);

    // TODO: add a window.keydown listener
    window.addEventListener('keydown', handleKeyPress);

})();