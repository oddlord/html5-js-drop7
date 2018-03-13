# HTML5/Javascript - Drop7

This is a clone in HTML5 and Javascript of the game [Drop7](https://en.wikipedia.org/wiki/Drop7), available for Android and iOS.

## Description

The game area is made of a 7-by-7 grid where each cell is either empty or occupied by a disc.
Each turn the player gets a new disc to drop into one of the seven columns.
The discs can be either numbered (from 1 to 7) or solid.

A numbered disc will explode when its number matches the number of consecutive discs (connected to himself) either on its column or its raw.
When exploding, a numbered disc will crack every solid disc nearby.
Solid discs reveal a numbered disc when cracked twice.

After 30 drops, a new level is reached, spawning a new row of solid discs from below, pushing the existing discs up.
When either the discs overflow the top row or the grid is full of discs, the game is over.

At each disc explosion, the player gets a number of points that increase as the explosion chain (i.e. the explosions combo) gets higher.
When a new level is reached, the player gets a bonus of 7'000 points and if the grid gets clearead 70'000 points.

Apart from the **classic game mode**, the game is available in:
* **blitz mode**: a new level is reached after every 5 drops (and awards 17'000 points for each new level) but let the player is given only numbered discs to drop;
* **sequence mode**: always spawns the same sequence of discs.

## Controls

The game is controlled through keyboard.

To control the disc, use **A**/**D** (**left**/**right** arrow keys) to move it sideways and **S** (**down** arrow key) to drop it.

To move through menus, use **W**/**S** (**up**/**down** arrow keys) to move through the options and **spacebar**/**enter** to select.

Hitting the **ESC** key will prompt the pause menu, where music and sound effects can be toggled and, if in the middle of a game, the current game can be restarted or quit.

To play the game, open the file *index.html* with any browser (Google Chrome 65 recommended).

## Credits

All the rights over the original Drop7 games belongs to Zynga Inc.

The music is the track [Retroland Recital](https://www.youtube.com/watch?v=JVUZq5etFzQ) by [TeknoAXE](http://teknoaxe.com/).

The ding sound is a modification of the [Ding Ding Small Bell](https://freesound.org/people/JohnsonBrandEditing/sounds/173932/) audio by [JohnsonBrandEditing](https://freesound.org/people/JohnsonBrandEditing/).

Everything else, including images and HTML5/CSS/Javascript code, is made entirely by myself.

## Disclaimer

This game has been tested only on Google Chrome 65, any other browser might not play the game as intended.

This game also doesn't provide any feature for saving the player progress, so highscores and average scores will persist only as long as the page is not refreshed.
