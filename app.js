/* Declare variables */

let gameStart = null //the button input from HTML
let gameSpeed = null //the counter input from HTML
let gameEasy = null //the easy mode checkbox input from HTML
let gameArea = null //the canvas where the game will be played
let gameAreaContext = null //the type of canvas graphics
let gameAreaWidth = 0 //the width of canvas
let gameAreaHeight = 0 //the height of canvas
let cellWidth = 0 //the size of each cell
let gameScore = 0 //the score of the game
let snake = null //the snake on canvas
let snakeFood = null //the food on canvas
let snakeDirection = null //the key stroke
let snakeSpeed = 0 //the speed of the snake
let timer = null
let newHead = null

//Improving Graphics
let canvasBG = document.getElementById('canvasBG')
let foodImg = document.getElementById('mouse')
let snakeHeadImgDown = document.getElementById('snakeHead')
let snakeHeadImgUp = document.getElementById('snakeHead1')
let snakeHeadImgRight = document.getElementById('snakeHead2')
let snakeHeadImgLeft = document.getElementById('snakeHead3')
let snakeBodyImg = document.getElementById('snakeBody')

//Checking Device
let device = navigator.userAgent
let regexp = /android|iphone|kindle|ipad/i;
let isMobileDevice = regexp.test(device);




/* Create a function that starts the game */
function initialize(){ //this function sets the varaible values
    gameStart = document.querySelector('#gameStart') //assigns button id from HTML to this variable
    gameSpeed = document.querySelector('#gameSpeed') //assigns speed from the counter in the HTML
    gameEasy = document.querySelector('#gameDifficulty') //assigns difficulty from the checkbox in the HTML
    gameArea = document.querySelector('#gameArea') //define the canvas area in HTML
    gameAreaContext = gameArea.getContext('2d') //define the canvas type
/*     gameAreaWidth = 400 //assign the canvas width
    gameAreaHeight = 600 //assign the canvas height */
    //resize based on device
    if (isMobileDevice) {
        gameAreaWidth = window.innerWidth - 20 //assign the canvas width
        gameAreaHeight = window.innerHeight - 160 //assign the canvas height
        cellWidth = 20 //define the size of food block and snake block
    } else {
        gameAreaWidth = window.innerWidth - 50 //assign the canvas width
        gameAreaHeight = window.innerHeight - 170 //assign the canvas height
        cellWidth = 40 //define the size of food block and snake block
    }
    gameArea.width = gameAreaWidth //add width key and value to gameArea object
    gameArea.height = gameAreaHeight //add height key and value to gameArea object
    canvasRect = gameArea.getBoundingClientRect() //gets the canvas element location in terms of the entire screen

    gameStart.onclick=function(){
        this.disabled=true //disables start button once clicked and game started
        window.ontouchstart = changeDirectionMobile //if the game is on mobile, it checks for touch inputs. It is in here so that it only starts listening once the game has started
        startGame() //executes startGame function
    }


    function startGame(){ //resets the score, snake's direction and speed as well as defines snake size
        gameScore = 0
        snakeDirection = 'right'
        snakeSpeed = parseInt(gameSpeed.value) //converts the string held in gameSpeed variable to integer
        //this conditional makes sure the speed is between 1 and 9 as defined in HTML
        if (snakeSpeed < 0){
            snakeSpeed = 1
        } else if (snakeSpeed > 9){
            snakeSpeed = 9
        }
        snake = [{x: Math.floor(gameAreaWidth / (2 * cellWidth)), y: Math.floor(gameAreaHeight / (2 * cellWidth))}] //converts snake to an array so that its size changes
        //snake.push({x:0 , y:cellWidth}) //pushes coordinates as key value pairs

        createFood() //declare a function that creates food pixels on canvas
        clearInterval(timer) //cancels the execution of createGameArea
        timer = setInterval(createGameArea, 500/gameSpeed.value) //The setInterval function executes the createGameArea function every 500 milliseconds / speedsize and stores the unique identifier in timer variable to be stoped later.
    }


}


function createFood(){
    snakeFood = {
        x: Math.round /*rounds to nearest integer*/((Math.random() /*a random number 0 and 1*/ * (gameAreaWidth - cellWidth)/*scales the random number to between 0 and canvas size minus 1 cell*/) /cellWidth /*normalizes the value to the size of the cell*/),
        y: Math.round((Math.random() * (gameAreaHeight - cellWidth)) /cellWidth) //same as above but for y coordinate
    }
}


function createGameArea(){
    // set up snake head
    let snakeX = snake[0].x //gets and stores the x coordinate of head from snake array object
    let snakeY = snake[0].y //gets and stores the y coordinate of head from snake array object

    //Colorize Game Area Canvas
    gameAreaContext.drawImage(canvasBG,0,0, gameAreaWidth,gameAreaHeight) // adds the background image to canvas
    gameAreaContext.shadowColor = 'black'
    gameAreaContext.shadowBlur = 3


/*     gameAreaContext.fillStyle= '#FFFFFF' //color of the game area canvas
    gameAreaContext.fillRect(0,0,gameAreaWidth,gameAreaHeight) //dimensions of where to apply the color
    gameAreaContext.strokeStyle= '#CCCCCC' //color of the game area canvas border
    gameAreaContext.strokeRect(0,0,gameAreaWidth,gameAreaHeight) //dimensions of where to apply the color to border */


    //Based on the value of snakeDirection variable, moves the snake's head by adding or subtracting 1 to the relavant coordinate
    if(snakeDirection === 'right'){
        snakeX++    }
    if(snakeDirection === 'left'){
        snakeX--
    }
    if(snakeDirection === 'up'){
        snakeY--
    }
    if(snakeDirection === 'down'){
        snakeY++
    }
    
    //Define game over conditions based on difficulty
    if(gameEasy.checked == false){
        if (snakeX === -1 || //checks the whether snake hit the left wall
        snakeX == Math.floor(gameAreaWidth/cellWidth) || //checks the whether snake hit the right wall
        snakeY === -1 || //checks the whether snake hit the top wall
        snakeY == Math.floor(gameAreaHeight/cellWidth) || //checks the whether snake hit the bottom wall
        control(snakeX, snakeY, snake)) //checks the whether snakehead hit the body
        {
        writeScore() //calls the function to write score on canvas
        clearInterval(timer) //cancels the execution of createGameArea
        gameStart.disabled = false //enables the start buttons
        return
        }
    }
    else {
        if(control(snakeX, snakeY, snake)) //checks the whether snakehead hit the body
        {
        writeScore() //calls the function to write score on canvas
        clearInterval(timer) //cancels the execution of createGameArea
        gameStart.disabled = false //enables the start buttons
        gameEasy.checked = false
        return
        }
        //checks whether snakehead hits a wall, if it does, the snakehead x and y coordinate change for it to appear out of opposite wall
        else if (snakeX === -1) snakeX = (Math.floor(gameAreaWidth/cellWidth)) //hits left wall
        else if (snakeY === -1) snakeY = (Math.floor(gameAreaHeight/cellWidth)) //hits top wall
        else if (snakeX == (1+Math.floor(gameAreaWidth/cellWidth))) snakeX = 0 //hits right wall
        else if (snakeY == (1+Math.floor(gameAreaHeight/cellWidth))) snakeY = 0 //hits bottom wall
    }


    // Define snake condition if it gets the food
    let newHead = {x: snakeX, y:snakeY} //adds the coordinate to a variable
    if (
        snakeX === snakeFood.x && //checks whether snake head and food is on the same cell horizontally
        snakeY === snakeFood.y //checks whether snake head and food is on the same cell verticall
    ){
        gameScore += snakeSpeed //increases the score by speed of the game
        createFood() //creates another food block
    } else { //if snake head is not on food
        let newHead = snake.pop() //returns the last element of the array and sets it to the variable
        newHead.x = snakeX //sets the x coordinate to variables x key
        newHead.y = snakeY //sets the y coordinate to variables y key
    } 
    snake.unshift(newHead) //adds the new coordinate to start of the array as new head


    //Create snake body on canvas
    for (i=0; i < snake.length; i++) { 
        if (i != 0){
        createSnakeBody(snake[i].x,snake[i].y) //this loops creates the snakes body on all the coordiates inside the snake array that are not the first index
        }
        else createSnakeHead(snake[i].x,snake[i].y) //this loops creates the snakes head on first index in snake array
    }
    
    //Create food block on canvas
    createFoodBlock(snakeFood.x,snakeFood.y)
}

function control (x,y,array) { //loops over the snakebody length to see if the snakehead x coordinate and y coordinate are the same as any of the snakebody x and y coordinate to determing if snakehead touched the body
        for (i=0; i < array.length; i++){
            if(array[i].x==x && array[i].y==y) return true
        }
        return false
}

function writeScore(){//writes score on canvas if game is over
    gameAreaContext.font = "bolder 30px Helvetica"
    gameAreaContext.fillStyle = '#FFFFFF'
    gameAreaContext.strokeStyle = '#CCCCCC'
    gameAreaContext.fillText(
        `Score: ${gameScore}`, gameAreaWidth/2-100, gameAreaHeight/2 //???
    )
}

function createFoodBlock(x,y){ //defines food block creation
    gameAreaContext.drawImage(foodImg,x*cellWidth,y*cellWidth, cellWidth, cellWidth)

    /*     gameAreaContext.fillStyle = "#000000"
    gameAreaContext.fillRect(x*cellWidth,y*cellWidth, cellWidth, cellWidth) */

}

function createSnakeHead(x,y){ //defines snake head block creation based on direction of the snake
    if(snakeDirection==='down') gameAreaContext.drawImage(snakeHeadImgDown,x*cellWidth,y*cellWidth, cellWidth, cellWidth)
    else if(snakeDirection==='right') gameAreaContext.drawImage(snakeHeadImgRight,x*cellWidth,y*cellWidth, cellWidth, cellWidth)
    else if(snakeDirection==='up') gameAreaContext.drawImage(snakeHeadImgUp,x*cellWidth,y*cellWidth, cellWidth, cellWidth)
    else if(snakeDirection==='left') gameAreaContext.drawImage(snakeHeadImgLeft,x*cellWidth,y*cellWidth, cellWidth, cellWidth)

/*     gameAreaContext.fillStyle = "green"
    gameAreaContext.fillRect(x*cellWidth,y*cellWidth, cellWidth, cellWidth) */

}

function createSnakeBody(x,y){ //defines snake body block creation
    gameAreaContext.drawImage(snakeBodyImg,x*cellWidth,y*cellWidth, cellWidth, cellWidth)

/*     gameAreaContext.fillStyle = "green"
    gameAreaContext.fillRect(x*cellWidth,y*cellWidth, cellWidth, cellWidth) */
}

function changeDirection(e){ //listens to the keyboard keys and changes the value of snakeDirection accordingly
    let keys = e.which

    if(keys == '40' && snakeDirection != 'up') snakeDirection='down'
    else if(keys == '39' && snakeDirection != 'left') snakeDirection='right'
    else if(keys == '38' && snakeDirection != 'down') snakeDirection='up'
    else if(keys == '37' && snakeDirection != 'right') snakeDirection='left'
}

function changeDirectionMobile (e){
    // these variables store the x and y coordinates of touches inside the canvas by subtracting the distance betwee the left side of the screen and left wall of canvas for x and top side of the screen and top wall of canvas for y
    let xLocation = e.touches[0].pageX - canvasRect.left
    let yLocation = e.touches[0].pageY - canvasRect.top

    //based on whether the snake is moving horizontally or vertically, it compares the x and y coordinates of the touch and with the position of the snake (multiplied by cellwitdh to get the cellwidth to unscale the coordinates) and changes directions accordningly 
    if(yLocation > (snake[0].y*cellWidth) && (snakeDirection == 'right' || snakeDirection == 'left')) snakeDirection='down'
    else if(xLocation > (snake[0].x*cellWidth) && (snakeDirection == 'up' || snakeDirection == 'down')) snakeDirection='right'
    else if(yLocation < (snake[0].y*cellWidth) && (snakeDirection == 'right' || snakeDirection == 'left')) snakeDirection='up'
    else if(xLocation < (snake[0].x*cellWidth) && (snakeDirection == 'up' || snakeDirection == 'down')) snakeDirection='left'
}


window.onkeydown=changeDirection
window.onload=initialize