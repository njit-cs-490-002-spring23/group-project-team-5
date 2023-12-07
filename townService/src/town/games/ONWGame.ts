import InvalidParametersError, {
  GAME_FULL_MESSAGE,
  GAME_NOT_IN_PROGRESS_MESSAGE,
  BOARD_POSITION_NOT_EMPTY_MESSAGE,
  MOVE_NOT_YOUR_TURN_MESSAGE,
  PLAYER_ALREADY_IN_GAME_MESSAGE,
  PLAYER_NOT_IN_GAME_MESSAGE,
} from '../../lib/InvalidParametersError';
import Player from '../../lib/Player';
import { GameMove, ONWGameState, ONWMove, ONWRole } from '../../types/CoveyTownSocket';
import Game from './Game';

/**
 * A ONWGame is a Game that implements the rules of One Night Werewolf.
 * @see https://www.ultraboardgames.com/one-night-ultimate-werewolf/game-rules.php
 */
export default class ONWGame extends Game<ONWGameState, ONWMove> {
  public constructor() {
    super({
      moves: [],
      status: 'WAITING_TO_START',
      roles: [],
    });
  }

  private get _board() {
    const { moves } = this.state;
    const board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
    for (const move of moves) {
      board[move.row][move.col] = move.gamePiece;
    }
    return board;
  }

  private _checkForGameEnding() {
    const board = this._board;
    // A game ends when there are 3 in a row
    // Check for 3 in a row or column
    for (let i = 0; i < 3; i++) {
      if (board[i][0] !== '' && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
        this.state = {
          ...this.state,
          status: 'OVER',
          winner: board[i][0] === 'player1' ? this.state.player1 : this.state.player2,
        };
        return;
      }
      if (board[0][i] !== '' && board[0][i] === board[1][i] && board[0][i] === board[2][i]) {
        this.state = {
          ...this.state,
          status: 'OVER',
          winner: board[0][i] === 'player1' ? this.state.player1 : this.state.player2,
        };
        return;
      }
    }
    // Check for 3 in a diagonal
    if (board[0][0] !== '' && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
      this.state = {
        ...this.state,
        status: 'OVER',
        winner: board[0][0] === 'player1' ? this.state.player1 : this.state.player2,
      };
      return;
    }
    // Check for 3 in the other diagonal
    if (board[0][2] !== '' && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
      this.state = {
        ...this.state,
        status: 'OVER',
        winner: board[0][2] === 'player1' ? this.state.player1 : this.state.player2,
      };
      return;
    }
    // Check for no more moves
    if (this.state.moves.length === 9) {
      this.state = {
        ...this.state,
        status: 'OVER',
        winner: undefined,
      };
    }
  }

  private _validateMove(move: ONWMove) {
    // A move is valid if the space is empty
    for (const m of this.state.moves) {
      if (m.col === move.col && m.row === move.row) {
        throw new InvalidParametersError(BOARD_POSITION_NOT_EMPTY_MESSAGE);
      }
    }

    // A move is only valid if it is the player's turn
    if (move.gamePiece === 'player1' && this.state.moves.length % 2 === 1) {
      throw new InvalidParametersError(MOVE_NOT_YOUR_TURN_MESSAGE);
    } else if (move.gamePiece === 'player2' && this.state.moves.length % 2 === 0) {
      throw new InvalidParametersError(MOVE_NOT_YOUR_TURN_MESSAGE);
    }
    // A move is valid only if game is in progress
    if (this.state.status !== 'IN_PROGRESS') {
      throw new InvalidParametersError(GAME_NOT_IN_PROGRESS_MESSAGE);
    }
  }

  private _applyMove(move: ONWMove): void {
    this.state = {
      ...this.state,
      moves: [...this.state.moves, move],
    };
    this._checkForGameEnding();
  }

  /*
   * Applies a player's move to the game.
   * Uses the player's ID to determine which game piece they are using (ignores move.gamePiece)
   * Validates the move before applying it. If the move is invalid, throws an InvalidParametersError with
   * the error message specified below.
   * A move is invalid if:
   *    - The move is out of bounds (not in the 3x3 grid - use MOVE_OUT_OF_BOUNDS_MESSAGE)
   *    - The move is on a space that is already occupied (use BOARD_POSITION_NOT_EMPTY_MESSAGE)
   *    - The move is not the player's turn (MOVE_NOT_YOUR_TURN_MESSAGE)
   *    - The game is not in progress (GAME_NOT_IN_PROGRESS_MESSAGE)
   *
   * If the move is valid, applies the move to the game and updates the game state.
   *
   * If the move ends the game, updates the game's state.
   * If the move results in a tie, updates the game's state to set the status to OVER and sets winner to undefined.
   * If the move results in a win, updates the game's state to set the status to OVER and sets the winner to the player who made the move.
   * A player wins if they have 3 in a row (horizontally, vertically, or diagonally).
   *
   * @param move The move to apply to the game
   * @throws InvalidParametersError if the move is invalid
   */
  public applyMove(move: GameMove<ONWMove>): void {
    let gamePiece: 'player1' | 'player2';
    if (move.playerID === this.state.player1) {
      gamePiece = 'player1';
    } else {
      gamePiece = 'player2';
    }
    const cleanMove = {
      gamePiece,
      col: move.move.col,
      row: move.move.row,
    };
    this._validateMove(cleanMove);
    this._applyMove(cleanMove);
  }

  /**
   * Adds a player to the game.
   * Updates the game's state to reflect the new player.
   * If the game is now full (has five players), updates the game's state to set the status to IN_PROGRESS.
   *
   * @param player The player to join the game
   * @throws InvalidParametersError if the player is already in the game (PLAYER_ALREADY_IN_GAME_MESSAGE)
   *  or the game is full (GAME_FULL_MESSAGE)
   */
  protected _join(player: Player): void {
    if (
      this.state.player1 === player.id ||
      this.state.player2 === player.id ||
      this.state.player3 === player.id ||
      this.state.player4 === player.id ||
      this.state.player5 === player.id
    ) {
      throw new InvalidParametersError(PLAYER_ALREADY_IN_GAME_MESSAGE);
    }
    if (!this.state.player1) {
      this.state = {
        ...this.state,
        player1: player.id,
      };
    } else if (!this.state.player2) {
      this.state = {
        ...this.state,
        player2: player.id,
      };
    } else if (!this.state.player3) {
      this.state = {
        ...this.state,
        player3: player.id,
      };
    } else if (!this.state.player4) {
      this.state = {
        ...this.state,
        player4: player.id,
      };
    } else if (!this.state.player5) {
      this.state = {
        ...this.state,
        player5: player.id,
      };
    } else {
      throw new InvalidParametersError(GAME_FULL_MESSAGE);
    }
    if (
      this.state.player1 &&
      this.state.player2 &&
      this.state.player3 &&
      this.state.player4 &&
      this.state.player5
    ) {
      this.state = {
        ...this.state,
        status: 'IN_PROGRESS',
      };
    }
  }

  /**
   * Removes a player from the game.
   * Updates the game's state to reflect the player leaving.
   * If the game has two players in it at the time of call to this method,
   *   updates the game's status to OVER and sets the winner to the other player.
   * If the game does not yet have two players in it at the time of call to this method,
   *   updates the game's status to WAITING_TO_START.
   *
   * @param player The player to remove from the game
   * @throws InvalidParametersError if the player is not in the game (PLAYER_NOT_IN_GAME_MESSAGE)
   */
  protected _leave(player: Player): void {
    if (
      this.state.player1 !== player.id &&
      this.state.player2 !== player.id &&
      this.state.player3 !== player.id &&
      this.state.player4 !== player.id &&
      this.state.player5 !== player.id
    ) {
      throw new InvalidParametersError(PLAYER_NOT_IN_GAME_MESSAGE);
    }
    // Handles case where the game has not started yet
    if (this.state.player5 === undefined) {
      this.state = {
        moves: [],
        status: 'WAITING_TO_START',
        roles: [],
      };
    }
    /*

    TODO: this is where we'd add if a player leaver mid game
    if (this.state.player1 === player.id) {
      this.state = {
        ...this.state,
        status: 'OVER',
        winner: this.state.player2,
      };
    } else {
      this.state = {
        ...this.state,
        status: 'OVER',
        winner: this.state.player1,
      };
    } */
  }

  /**
   * Assigns player roles upon beggining the game.
   * Should assign 3 villagers, 1 seer and 1 werewolf at random
   * 
   * The ONWRoles list in ONWGame instance is in order corresponding to the player in that game.
   *
   * @throws InvalidParametersError if the game is not able to start due to lack of players (PLAYER_NOT_IN_GAME_MESSAGE)
   */
  public assignRoles(): void {
    if (this.state.status != 'IN_PROGRESS') { //throws error if game is not in progress
      throw new InvalidParametersError(PLAYER_NOT_IN_GAME_MESSAGE);
    }
    else { // game is confirmed to be in progress and has 5 players

      /*
      player1 = this.state.roles[0]
      player2 = this.state.roles[1]
      player3 = this.state.roles[2]
      player4 = this.state.roles[3]
      player5 = this.state.roles[4]
      */
      let werewolfIndex = Math.floor(Math.random() * 5); // generates a number 0-4 for the index of the ONWRoles array that will represent the Werewolf player
      let seerIndex = werewolfIndex; 
      do {
        seerIndex = Math.floor(Math.random() * 5);
      } while (seerIndex === werewolfIndex); // generates a number 0-4 for the index of the ONWRoles array that will represent the Seer player, and the do while guarantees that it will not be the same player as the Werewolf.
      for (let i = 0; i < 5; i++) {
        if (!this.state.roles[i]) {
          this.state.roles[i] = {};
        }
        if (i == werewolfIndex) {
          this.state.roles[i].role = 'Werewolf';
          this.state.roles[i].seer_appearance = 'Werewolf';
          this.state.roles[i].immunity = true;
          this.state.roles[i].description = 'You are a Werewolf who is attempting to murder the villagers without being murdered at daytime. At night, you choose a player to kill.';
        }
        else if (i == seerIndex) {
          this.state.roles[i].role = 'Seer';
          this.state.roles[i].seer_appearance = 'Not Werewolf';
          this.state.roles[i].immunity = false;
          this.state.roles[i].description = 'You are a Seer who is attempting to identify the Werewolf and murder them at daytime. At night, you choose a player to see if they are a werewolf.';
        }
        else {
          this.state.roles[i].role = 'Villager';
          this.state.roles[i].seer_appearance = 'Not Werewolf';
          this.state.roles[i].immunity = false;
          this.state.roles[i].description = 'You are a Villager who is attempting to identify the Werewolf and murder them at daytime. At night, you take no actions.';
        }
      }
    }
  }
  
  /**
   * Matches a Player to the ONWRole roles element that is their role in this instance of the game.
   *
   * @param player The player to fetch their role information for.
   * @throws InvalidParametersError if the player is not in the game (PLAYER_NOT_IN_GAME_MESSAGE)
   * @returns number representing the index of the ONWRole roles array in this.state
   */
  private playerIDToONWRole(player: Player): number {
    if (
      this.state.player1 !== player.id &&
      this.state.player2 !== player.id &&
      this.state.player3 !== player.id &&
      this.state.player4 !== player.id &&
      this.state.player5 !== player.id
    ) {
      throw new InvalidParametersError(PLAYER_NOT_IN_GAME_MESSAGE);
    }

    if (this.state.player1 === player.id) return 0;
    else if (this.state.player2 === player.id) return 1;
    else if (this.state.player3 === player.id) return 2;
    else if (this.state.player4 === player.id) return 3;
    return 4;
  }
}
