# HYF Foundation project - Memory matching game

# Overview

This is a simple and fun browser-based memory matching game built with HTML, CSS, and JavaScript,Node.js, and SQlite. The game features two difficulty levels (Easy and Hard) and challenges players to match pairs of cards within a time limit. Players can track their moves, matches, and time taken to complete the game. It also contains three different card packs to randomly choose from.Visual feedback is provided with emojis for wins and losses, making it an engaging experience for all ages.

## Features

- Two difficulty levels: Easy and Hard
- Multiple card packs for variety(stored in a SQLite database)
- Timer countdown for hard mode
- time, move and match tracking
- Sound effects for card flips,matches, not matches and shuffling
- Cards flip with a smooth animation
- Responsive design for play on different devices
- Cards are shuffled randomly at the start of each game
- Cards disappear when matched
- Visual feedback with emojis for wins and losses

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)
- Node.js
- SQLite
- Postman (for testing API endpoints)
- Express.js (for backend API to fetch card data from SQLite database)
- Git (version control)

## Installation and setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Idesta1/FoundationGameProject.git
   ```
2. Navigate to the project directory:
   ```bash
   cd FoundationGameProject
   ```
3. Install dependencies:
   ```bash
    npm install
   ```
4. Start the server:

   ```bash
   node server.js
   ```

5. Open your browser and go to `http://localhost:3000` to play the game.
