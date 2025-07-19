document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const gameOverElement = document.getElementById('gameOver');

    const gridSize = 20;
    const canvasSize = canvas.width;
    const tileCount = canvasSize / gridSize;

    let snake = [{ x: 10, y: 10 }];
    let food = {};
    let direction = { x: 0, y: 0 };
    let score = 0;
    let isGameOver = false;
    let gameSpeed = 120; // milliseconds

    function startGame() {
        snake = [{ x: 10, y: 10 }];
        direction = { x: 0, y: 0 };
        score = 0;
        isGameOver = false;
        scoreElement.textContent = score;
        gameOverElement.classList.add('hidden');
        generateFood();
        mainLoop();
    }

    function mainLoop() {
        if (isGameOver) {
            gameOverElement.classList.remove('hidden');
            return;
        }

        setTimeout(() => {
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

    document.addEventListener('keydown', e => {
        switch (e.key) {
            case 'ArrowUp':
                if (direction.y === 0) direction = { x: 0, y: -1 };
                break;
            case 'ArrowDown':
                if (direction.y === 0) direction = { x: 0, y: 1 };
                break;
            case 'ArrowLeft':
                if (direction.x === 0) direction = { x: -1, y: 0 };
                break;
            case 'ArrowRight':
                if (direction.x === 0) direction = { x: 1, y: 0 };
                break;
            case 'r':
            case 'R':
                if (isGameOver) {
                    startGame();
                }
                break;
        }
    });

    startGame();
});