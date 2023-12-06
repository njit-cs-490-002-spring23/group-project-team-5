import InvalidParametersError, {
  GAME_ID_MISSMATCH_MESSAGE,
  GAME_NOT_IN_PROGRESS_MESSAGE,
  INVALID_COMMAND_MESSAGE,
} from '../../lib/InvalidParametersError';
import Player from '../../lib/Player';
import {
  GameInstance,
  InteractableCommand,
  InteractableCommandReturnType,
  InteractableType,
  ONWGameState,
} from '../../types/CoveyTownSocket';
import GameArea from './GameArea';
import ONWGame from './ONWGame';

/**
 * A ONWGameArea is a GameArea that hosts a ONWGame.
 * @see ONWGame
 * @see GameArea
 */
export default class ONWGameArea extends GameArea<ONWGame> {
  protected getType(): InteractableType {
    return 'ONWArea';
  }

  private _stateUpdated(updatedState: GameInstance<ONWGameState>) {
    if (updatedState.state.status === 'OVER') {
      // If we haven't yet recorded the outcome, do so now.
      const gameID = this._game?.id;
      if (gameID && !this._history.find(eachResult => eachResult.gameID === gameID)) {
        const { player1, player2, player3, player4, player5 } = updatedState.state;
        if (player1 && player2 && player3 && player4 && player5) {
          const player1Name =
            this._occupants.find(eachPlayer => eachPlayer.id === player1)?.userName || player1;
          const player2Name =
            this._occupants.find(eachPlayer => eachPlayer.id === player2)?.userName || player2;
          const player3Name =
            this._occupants.find(eachPlayer => eachPlayer.id === player3)?.userName || player3;
          const player4Name =
            this._occupants.find(eachPlayer => eachPlayer.id === player4)?.userName || player4;
          const player5Name =
            this._occupants.find(eachPlayer => eachPlayer.id === player5)?.userName || player5;
          this._history.push({
            gameID,
            scores: {
              [player1Name]: updatedState.state.winner === player1 ? 1 : 0,
              [player2Name]: updatedState.state.winner === player2 ? 1 : 0,
              [player3Name]: updatedState.state.winner === player3 ? 1 : 0,
              [player4Name]: updatedState.state.winner === player4 ? 1 : 0,
              [player5Name]: updatedState.state.winner === player5 ? 1 : 0,
            },
          });
        }
      }
    }
    this._emitAreaChanged();
  }

  /**
   * Handle a command from a player in this game area.
   * Supported commands:
   * - JoinGame (joins the game `this._game`, or creates a new one if none is in progress)
   * - LeaveGame (leaves the game)
   *
   * If the command ended the game, records the outcome in this._history
   * If the command is successful (does not throw an error), calls this._emitAreaChanged (necessary
   *  to notify any listeners of a state update, including any change to history)
   * If the command is unsuccessful (throws an error), the error is propagated to the caller
   *
   * @see InteractableCommand
   *
   * @param command command to handle
   * @param player player making the request
   * @returns response to the command, @see InteractableCommandResponse
   * @throws InvalidParametersError if the command is not supported or is invalid. Invalid commands:
   *  - LeaveGame and GameMove: No game in progress (GAME_NOT_IN_PROGRESS_MESSAGE),
   *        or gameID does not match the game in progress (GAME_ID_MISSMATCH_MESSAGE)
   *  - Any command besides LeaveGame, GameMove and JoinGame: INVALID_COMMAND_MESSAGE
   */
  public handleCommand<CommandType extends InteractableCommand>(
    command: CommandType,
    player: Player,
  ): InteractableCommandReturnType<CommandType> {
    if (command.type === 'JoinGame') {
      let game = this._game;
      if (!game || game.state.status === 'OVER') {
        // No game in progress, make a new one
        game = new ONWGame();
        this._game = game;
      }
      game.join(player);
      this._stateUpdated(game.toModel());
      return { gameID: game.id } as InteractableCommandReturnType<CommandType>;
    }
    if (command.type === 'LeaveGame') {
      const game = this._game;
      if (!game) {
        throw new InvalidParametersError(GAME_NOT_IN_PROGRESS_MESSAGE);
      }
      if (this._game?.id !== command.gameID) {
        throw new InvalidParametersError(GAME_ID_MISSMATCH_MESSAGE);
      }
      game.leave(player);
      this._stateUpdated(game.toModel());
      return undefined as InteractableCommandReturnType<CommandType>;
    }
    throw new InvalidParametersError(INVALID_COMMAND_MESSAGE);
  }
}
