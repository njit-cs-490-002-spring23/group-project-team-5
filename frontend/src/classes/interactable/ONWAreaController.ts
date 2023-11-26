import _ from 'lodash';
import { GameArea, GameStatus, ONWGameState, ONWGridPosition } from '../../types/CoveyTownSocket';
import PlayerController from '../PlayerController';
import GameAreaController, { GameEventTypes } from './GameAreaController';

export const PLAYER_NOT_IN_GAME_ERROR = 'Player is not in game';

export const NO_GAME_IN_PROGRESS_ERROR = 'No game in progress';

export type ONWCell = 'player1' | 'player2' | undefined;
export type ONWEvents = GameEventTypes & {
  boardChanged: (board: ONWCell[][]) => void;
  turnChanged: (isOurTurn: boolean) => void;
};

/**
 * This class is responsible for managing the state of the Tic Tac Toe game, and for sending commands to the server
 */
export default class ONWAreaController extends GameAreaController<ONWGameState, ONWEvents> {
  protected _board: ONWCell[][] = [
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
  ];

  /**
   * Returns the current state of the board.
   *
   * The board is a 3x3 array of ONWCell, which is either 'player1', 'player2', or undefined.
   *
   * The 2-dimensional array is indexed by row and then column, so board[0][0] is the top-left cell,
   * and board[2][2] is the bottom-right cell
   */
  get board(): ONWCell[][] {
    return this._board;
  }

  /**
   * Returns the player with the 'Player1' game piece, if there is one, or undefined otherwise
   */
  get player1(): PlayerController | undefined {
    const player1 = this._model.game?.state.player1;
    if (player1) {
      return this.occupants.find(eachOccupant => eachOccupant.id === player1);
    }
    return undefined;
  }

  /**
   * Returns the player with the 'player2' game piece, if there is one, or undefined otherwise
   */
  get player2(): PlayerController | undefined {
    const player2 = this._model.game?.state.player2;
    if (player2) {
      return this.occupants.find(eachOccupant => eachOccupant.id === player2);
    }
    return undefined;
  }

  /**
   * Returns the player with the 'player3' game piece, if there is one, or undefined otherwise
   */
  get player3(): PlayerController | undefined {
    const player3 = this._model.game?.state.player3;
    if (player3) {
      return this.occupants.find(eachOccupant => eachOccupant.id === player3);
    }
    return undefined;
  }

  /**
   * Returns the player with the 'player4' game piece, if there is one, or undefined otherwise
   */
  get player4(): PlayerController | undefined {
    const player4 = this._model.game?.state.player4;
    if (player4) {
      return this.occupants.find(eachOccupant => eachOccupant.id === player4);
    }
    return undefined;
  }

  /**
   * Returns the player with the 'player5' game piece, if there is one, or undefined otherwise
   */
  get player5(): PlayerController | undefined {
    const player5 = this._model.game?.state.player5;
    if (player5) {
      return this.occupants.find(eachOccupant => eachOccupant.id === player5);
    }
    return undefined;
  }

  /**
   * Returns the number of moves that have been made in the game
   */
  get moveCount(): number {
    return this._model.game?.state.moves.length || 0;
  }

  /**
   * Returns the winner of the game, if there is one
   */
  get winner(): PlayerController | undefined {
    const winner = this._model.game?.state.winner;
    if (winner) {
      return this.occupants.find(eachOccupant => eachOccupant.id === winner);
    }
    return undefined;
  }

  /**
   * Returns the player whose turn it is, if the game is in progress
   * Returns undefined if the game is not in progress
   */
  get whoseTurn(): PlayerController | undefined {
    const player1 = this.player1;
    const player2 = this.player2;
    if (!player1 || !player2 || this._model.game?.state.status !== 'IN_PROGRESS') {
      return undefined;
    }
    if (this.moveCount % 2 === 0) {
      return player1;
    } else if (this.moveCount % 2 === 1) {
      return player2;
    } else {
      throw new Error('Invalid move count');
    }
  }

  get isOurTurn(): boolean {
    return this.whoseTurn?.id === this._townController.ourPlayer.id;
  }

  /**
   * Returns true if the current player is a player in this game
   */
  get isPlayer(): boolean {
    return this._model.game?.players.includes(this._townController.ourPlayer.id) || false;
  }

  /**
   * Returns the game piece of the current player, if the current player is a player in this game
   *
   * Throws an error PLAYER_NOT_IN_GAME_ERROR if the current player is not a player in this game
   */
  get gamePiece(): 'player1' | 'player2' | 'player3' | 'player4' | 'player5' {
    if (this.player1?.id === this._townController.ourPlayer.id) {
      return 'player1';
    } else if (this.player2?.id === this._townController.ourPlayer.id) {
      return 'player2';
    } else if (this.player3?.id === this._townController.ourPlayer.id) {
      return 'player2';
    } else if (this.player4?.id === this._townController.ourPlayer.id) {
      return 'player2';
    } else if (this.player5?.id === this._townController.ourPlayer.id) {
      return 'player2';
    }
    throw new Error(PLAYER_NOT_IN_GAME_ERROR);
  }

  /**
   * Returns the status of the game.
   * Defaults to 'WAITING_TO_START' if the game is not in progress
   */
  get status(): GameStatus {
    const status = this._model.game?.state.status;
    if (!status) {
      return 'WAITING_TO_START';
    }
    return status;
  }

  /**
   * Returns true if the game is in progress
   */
  public isActive(): boolean {
    return this._model.game?.state.status === 'IN_PROGRESS';
  }

  /**
   * Updates the internal state of this ONWAreaController to match the new model.
   *
   * Calls super._updateFrom, which updates the occupants of this game area and
   * other common properties (including this._model).
   *
   * If the board has changed, emits a 'boardChanged' event with the new board. If the board has not changed,
   *  does not emit the event.
   *
   * If the turn has changed, emits a 'turnChanged' event with true if it is our turn, and false otherwise.
   * If the turn has not changed, does not emit the event.
   */
  protected _updateFrom(newModel: GameArea<ONWGameState>): void {
    const wasOurTurn = this.whoseTurn?.id === this._townController.ourPlayer.id;
    super._updateFrom(newModel);
    const newState = newModel.game;
    if (newState) {
      const newBoard: ONWCell[][] = [
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
      ];
      newState.state.moves.forEach(move => {
        newBoard[move.row][move.col] = move.gamePiece;
      });
      if (!_.isEqual(newBoard, this._board)) {
        this._board = newBoard;
        this.emit('boardChanged', this._board);
      }
    }
    const isOurTurn = this.whoseTurn?.id === this._townController.ourPlayer.id;
    if (wasOurTurn != isOurTurn) this.emit('turnChanged', isOurTurn);
  }

  /**
   * Sends a request to the server to make a move in the game
   *
   * If the game is not in progress, throws an error NO_GAME_IN_PROGRESS_ERROR
   *
   * @param row Row of the move
   * @param col Column of the move
   */
  public async makeMove(row: ONWGridPosition, col: ONWGridPosition) {
    const instanceID = this._instanceID;
    if (!instanceID || this._model.game?.state.status !== 'IN_PROGRESS') {
      throw new Error(NO_GAME_IN_PROGRESS_ERROR);
    }
    await this._townController.sendInteractableCommand(this.id, {
      type: 'GameMove',
      gameID: instanceID,
      move: {
        row,
        col,
        gamePiece: this.gamePiece,
      },
    });
  }
}
