# Connect Four with MinMax

A short project to practice some typescript and get my head around the minmax algorithm.

Play Connect Four against the computer. It will probably beat you!

#### Info

This implementation of minmax uses a depth of 4.
Score evaluation is implemented as follows:

-   if the board state is terminal (i.e a player has won), the score of that board state is returned.
-   if the board state is not terminal, but minmax has reached it's max depth of recursion, the move made is scored heuristically.

#### Extras:

More info on the minmax algorithm can be found [here](https://en.wikipedia.org/wiki/Minimax).<br/>
