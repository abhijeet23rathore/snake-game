document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const gameOverElement = document.getElementById('gameOver');

    const gridSize = 20;
    const canvasSize = canvas.width;
    const tileCount = canvasSize / gridSize;

    let snake = [];
    let food = {};
    let direction = { x: 0, y: 0 };
    let score = 0;
    let isGameOver = false;
    let gameSpeed = 120; // milliseconds
    let gameLoopTimeoutId = null;

    function initialDraw() {
        clearScreen();
        drawFood();
        drawSnake();
    }

    function startGame() {
        if (gameLoopTimeoutId) {
            clearTimeout(gameLoopTimeoutId);
        }
        snake = [
            { x: 12, y: 10 }, // Head
            { x: 11, y: 10 },
            { x: 10, y: 10 }  // Tail
        ];
        direction = { x: 0, y: 0 };
        score = 0;
        isGameOver = false;
        scoreElement.textContent = score;
        gameOverElement.classList.add('hidden');
        generateFood();
        initialDraw(); // Draw the initial state, but don't start the loop
    }

    function mainLoop() {
        if (isGameOver) {
            gameOverElement.classList.remove('hidden');
            return;
        }

        gameLoopTimeoutId = setTimeout(() => {
            clearScreen();
            moveSnake();
            drawFood();
            drawSnake();
            checkCollision();
            mainLoop();
        }, gameSpeed);
    }

    function clearScreen() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvasSize, canvasSize);
    }

    function moveSnake() {
        const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
        snake.unshift(head);

        // Check if snake ate food
        if (head.x === food.x && head.y === food.y) {
            score++;
            scoreElement.textContent = score;
            generateFood();
        } else {
            snake.pop();
        }
    }

    function drawSnake() {
        ctx.fillStyle = '#6cff5c'; // snake color
        snake.forEach(part => {
            ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
        });
    }

    function generateFood() {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };

        // Ensure food doesn't spawn on the snake
        snake.forEach(part => {
            if (part.x === food.x && part.y === food.y) {
                generateFood();
            }
        });
    }

    function drawFood() {
        ctx.fillStyle = '#ff4136'; // food color
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    }

    function checkCollision() {
        const head = snake[0];

        // Wall collision
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            isGameOver = true;
        }

        // Self collision
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                isGameOver = true;
            }
        }
    }

    function handleDirectionChange(newDirectionKey) {
        const isGameReadyToStart = direction.x === 0 && direction.y === 0;
        let proposedDirection = null;

        switch (newDirectionKey) {
            case 'ArrowUp': case 'up':
                if (direction.y === 0) proposedDirection = { x: 0, y: -1 };
                break;
            case 'ArrowDown': case 'down':
                if (direction.y === 0) proposedDirection = { x: 0, y: 1 };
                break;
            case 'ArrowLeft': case 'left':
                if (direction.x === 0) proposedDirection = { x: -1, y: 0 };
                break;
            case 'ArrowRight': case 'right':
                if (direction.x === 0) proposedDirection = { x: 1, y: 0 };
                break;
        }

        if (proposedDirection) {
            direction = proposedDirection;
            // If this is the first valid move, kick off the game loop.
            if (isGameReadyToStart && !isGameOver) {
                mainLoop();
            }
        }
    }

    function handleCanvasTap(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        const dx = x - centerX;
        const dy = y - centerY;

        if (Math.abs(dx) > Math.abs(dy)) {
            // Horizontal tap is stronger
            handleDirectionChange(dx > 0 ? 'right' : 'left');
        } else {
            // Vertical tap is stronger
            handleDirectionChange(dy > 0 ? 'down' : 'up');
        }
    }

    document.addEventListener('keydown', e => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            handleDirectionChange(e.key);
        } else if (e.key.toLowerCase() === 'r' && isGameOver) {
            startGame();
        }
    });

    canvas.addEventListener('click', handleCanvasTap);

    startGame();
});