import { createPlayerForTesting } from '../../TestUtils';
import {
  GAME_FULL_MESSAGE,
  PLAYER_ALREADY_IN_GAME_MESSAGE,
  PLAYER_NOT_IN_GAME_MESSAGE,
} from '../../lib/InvalidParametersError';
import Player from '../../lib/Player';
import ONWGame from './ONWGame';

describe('OneNightWerewolf', () => {
  let game: ONWGame;

  beforeEach(() => {
    game = new ONWGame();
  });

  describe('[T1.1] _join', () => {
    it('should throw an error if the player is already in the game', () => {
      const player = createPlayerForTesting();
      game.join(player);
      expect(() => game.join(player)).toThrowError(PLAYER_ALREADY_IN_GAME_MESSAGE);
      const player2 = createPlayerForTesting();
      // TODO weaker test suite doesn't add this
      game.join(player2);
      expect(() => game.join(player2)).toThrowError(PLAYER_ALREADY_IN_GAME_MESSAGE);
    });
    it('should throw an error if the game is full', () => {
      const player1 = createPlayerForTesting();
      const player2 = createPlayerForTesting();
      const player3 = createPlayerForTesting();
      const player4 = createPlayerForTesting();
      const player5 = createPlayerForTesting();
      const player6 = createPlayerForTesting();
      game.join(player1);
      game.join(player2);
      game.join(player3);
      game.join(player4);
      game.join(player5);
      game.join(player6);

      expect(() => game.join(player6)).toThrowError(GAME_FULL_MESSAGE);
    });
    describe('When the player can be added', () => {
      it('makes the first player "player1" and initializes the state with status WAITING_TO_START', () => {
        const player = createPlayerForTesting();
        game.join(player);
        expect(game.state.player1).toEqual(player.id);
        expect(game.state.player2).toBeUndefined();
        // expect(game.state.moves).toHaveLength(0);
        expect(game.state.status).toEqual('WAITING_TO_START');
        expect(game.state.winner).toBeUndefined();
      });
      describe('When the second player joins', () => {
        const player1 = createPlayerForTesting();
        const player2 = createPlayerForTesting();
        beforeEach(() => {
          game.join(player1);
          game.join(player2);
        });
        it('makes the second player "player2"', () => {
          expect(game.state.player1).toEqual(player1.id);
          expect(game.state.player2).toEqual(player2.id);
        });
        it('sets the game status to WAITNING_TO_START', () => {
          expect(game.state.status).toEqual('WAITNING_TO_START');
          expect(game.state.winner).toBeUndefined();
          expect(game.state.player3).toBeUndefined();
        });
      });
      describe('When the third player joins', () => {
        const player1 = createPlayerForTesting();
        const player2 = createPlayerForTesting();
        const player3 = createPlayerForTesting();
        beforeEach(() => {
          game.join(player1);
          game.join(player2);
          game.join(player3);
        });
        it('makes the third player "player3"', () => {
          expect(game.state.player1).toEqual(player1.id);
          expect(game.state.player2).toEqual(player2.id);
          expect(game.state.player3).toEqual(player3.id);
        });
        it('sets the game status to WAITNING_TO_START', () => {
          expect(game.state.status).toEqual('WAITNING_TO_START');
          expect(game.state.winner).toBeUndefined();
          expect(game.state.player4).toBeUndefined();
        });
      });
      describe('When the fourth player joins', () => {
        const player1 = createPlayerForTesting();
        const player2 = createPlayerForTesting();
        const player3 = createPlayerForTesting();
        const player4 = createPlayerForTesting();
        beforeEach(() => {
          game.join(player1);
          game.join(player2);
          game.join(player3);
          game.join(player4);
        });
        it('makes the fourth player "player4"', () => {
          expect(game.state.player1).toEqual(player1.id);
          expect(game.state.player2).toEqual(player2.id);
          expect(game.state.player3).toEqual(player3.id);
          expect(game.state.player4).toEqual(player4.id);
        });
        it('sets the game status to WAITNING_TO_START', () => {
          expect(game.state.status).toEqual('WAITNING_TO_START');
          expect(game.state.winner).toBeUndefined();
          expect(game.state.player5).toBeUndefined();
        });
      });
      describe('When the fifth player joins', () => {
        const player1 = createPlayerForTesting();
        const player2 = createPlayerForTesting();
        const player3 = createPlayerForTesting();
        const player4 = createPlayerForTesting();
        const player5 = createPlayerForTesting();
        beforeEach(() => {
          game.join(player1);
          game.join(player2);
          game.join(player3);
          game.join(player4);
          game.join(player5);
        });
        it('makes the fourth player "player5"', () => {
          expect(game.state.player1).toEqual(player1.id);
          expect(game.state.player2).toEqual(player2.id);
          expect(game.state.player3).toEqual(player3.id);
          expect(game.state.player4).toEqual(player4.id);
          expect(game.state.player5).toEqual(player5.id);
        });
        it('sets the game status to IN_PROGRESS', () => {
          expect(game.state.status).toEqual('IN_PROGRESS');
          expect(game.state.winner).toBeUndefined();
        });
      });
    });
  });
  describe('[T1.2] _leave', () => {
    it('should throw an error if the player is not in the game', () => {
      expect(() => game.leave(createPlayerForTesting())).toThrowError(PLAYER_NOT_IN_GAME_MESSAGE);
      // TODO weaker test suite only does one of these - above or below
      const player = createPlayerForTesting();
      game.join(player);
      expect(() => game.leave(createPlayerForTesting())).toThrowError(PLAYER_NOT_IN_GAME_MESSAGE);
    });
    describe('when the player is in the game', () => {
      describe('when the game is in progress, it should set the game status to OVER', () => {
        test('when player1 leaves', () => {
          const player1 = createPlayerForTesting();
          const player2 = createPlayerForTesting();
          const player3 = createPlayerForTesting();
          const player4 = createPlayerForTesting();
          const player5 = createPlayerForTesting();
          game.join(player1);
          game.join(player2);
          game.join(player3);
          game.join(player4);
          game.join(player5);
          expect(game.state.player1).toEqual(player1.id);
          expect(game.state.player2).toEqual(player2.id);
          expect(game.state.player3).toEqual(player3.id);
          expect(game.state.player4).toEqual(player4.id);
          expect(game.state.player5).toEqual(player5.id);

          game.leave(player1);

          // TODO: Set a winner if someone leaves mid game
          expect(game.state.status).toEqual('OVER');

          expect(game.state.player1).toEqual(player1.id);
          expect(game.state.player2).toEqual(player2.id);
          expect(game.state.player3).toEqual(player3.id);
          expect(game.state.player4).toEqual(player4.id);
          expect(game.state.player5).toEqual(player5.id);
        });
        test('when player2 leaves', () => {
          const player1 = createPlayerForTesting();
          const player2 = createPlayerForTesting();
          const player3 = createPlayerForTesting();
          const player4 = createPlayerForTesting();
          const player5 = createPlayerForTesting();
          game.join(player1);
          game.join(player2);
          game.join(player3);
          game.join(player4);
          game.join(player5);
          expect(game.state.player1).toEqual(player1.id);
          expect(game.state.player2).toEqual(player2.id);
          expect(game.state.player3).toEqual(player3.id);
          expect(game.state.player4).toEqual(player4.id);
          expect(game.state.player5).toEqual(player5.id);

          game.leave(player2);

          // TODO: Set a winner if someone leaves mid game
          expect(game.state.status).toEqual('OVER');

          expect(game.state.player1).toEqual(player1.id);
          expect(game.state.player2).toEqual(player2.id);
          expect(game.state.player3).toEqual(player3.id);
          expect(game.state.player4).toEqual(player4.id);
          expect(game.state.player5).toEqual(player5.id);
        });
        test('when player3 leaves', () => {
          const player1 = createPlayerForTesting();
          const player2 = createPlayerForTesting();
          const player3 = createPlayerForTesting();
          const player4 = createPlayerForTesting();
          const player5 = createPlayerForTesting();
          game.join(player1);
          game.join(player2);
          game.join(player3);
          game.join(player4);
          game.join(player5);
          expect(game.state.player1).toEqual(player1.id);
          expect(game.state.player2).toEqual(player2.id);
          expect(game.state.player3).toEqual(player3.id);
          expect(game.state.player4).toEqual(player4.id);
          expect(game.state.player5).toEqual(player5.id);

          game.leave(player3);

          // TODO: Set a winner if someone leaves mid game
          expect(game.state.status).toEqual('OVER');

          expect(game.state.player1).toEqual(player1.id);
          expect(game.state.player2).toEqual(player2.id);
          expect(game.state.player3).toEqual(player3.id);
          expect(game.state.player4).toEqual(player4.id);
          expect(game.state.player5).toEqual(player5.id);
        });
        test('when player4 leaves', () => {
          const player1 = createPlayerForTesting();
          const player2 = createPlayerForTesting();
          const player3 = createPlayerForTesting();
          const player4 = createPlayerForTesting();
          const player5 = createPlayerForTesting();
          game.join(player1);
          game.join(player2);
          game.join(player3);
          game.join(player4);
          game.join(player5);
          expect(game.state.player1).toEqual(player1.id);
          expect(game.state.player2).toEqual(player2.id);
          expect(game.state.player3).toEqual(player3.id);
          expect(game.state.player4).toEqual(player4.id);
          expect(game.state.player5).toEqual(player5.id);

          game.leave(player4);

          // TODO: Set a winner if someone leaves mid game
          expect(game.state.status).toEqual('OVER');

          expect(game.state.player1).toEqual(player1.id);
          expect(game.state.player2).toEqual(player2.id);
          expect(game.state.player3).toEqual(player3.id);
          expect(game.state.player4).toEqual(player4.id);
          expect(game.state.player5).toEqual(player5.id);
        });
        test('when player5 leaves', () => {
          const player1 = createPlayerForTesting();
          const player2 = createPlayerForTesting();
          const player3 = createPlayerForTesting();
          const player4 = createPlayerForTesting();
          const player5 = createPlayerForTesting();
          game.join(player1);
          game.join(player2);
          game.join(player3);
          game.join(player4);
          game.join(player5);
          expect(game.state.player1).toEqual(player1.id);
          expect(game.state.player2).toEqual(player2.id);
          expect(game.state.player3).toEqual(player3.id);
          expect(game.state.player4).toEqual(player4.id);
          expect(game.state.player5).toEqual(player5.id);

          game.leave(player5);

          // TODO: Set a winner if someone leaves mid game
          expect(game.state.status).toEqual('OVER');

          expect(game.state.player1).toEqual(player1.id);
          expect(game.state.player2).toEqual(player2.id);
          expect(game.state.player3).toEqual(player3.id);
          expect(game.state.player4).toEqual(player4.id);
          expect(game.state.player5).toEqual(player5.id);
        });
      });
      it('when the game is not in progress, it should set the game status to WAITING_TO_START and remove the player', () => {
        const player1 = createPlayerForTesting();
        game.join(player1);
        expect(game.state.player1).toEqual(player1.id);
        expect(game.state.player2).toBeUndefined();
        expect(game.state.status).toEqual('WAITING_TO_START');
        expect(game.state.winner).toBeUndefined();
        game.leave(player1);
        expect(game.state.player1).toBeUndefined();
        expect(game.state.player2).toBeUndefined();
        expect(game.state.status).toEqual('WAITING_TO_START');
        expect(game.state.winner).toBeUndefined();
      });
    });
  });
  describe('[T1.3] assignRoles', () => {
    it('should throw an error if the game is not full', () => {
      expect(() => game.assignRoles()).toThrowError(PLAYER_NOT_IN_GAME_MESSAGE);
      // TODO weaker test suite only does one of these - above or below
      const player1 = createPlayerForTesting();
      game.join(player1);
      expect(() => game.assignRoles()).toThrowError(PLAYER_NOT_IN_GAME_MESSAGE);
      const player2 = createPlayerForTesting();
      game.join(player2);
      expect(() => game.assignRoles()).toThrowError(PLAYER_NOT_IN_GAME_MESSAGE);
      const player3 = createPlayerForTesting();
      game.join(player3);
      expect(() => game.assignRoles()).toThrowError(PLAYER_NOT_IN_GAME_MESSAGE);
      const player4 = createPlayerForTesting();
      game.join(player4);
      expect(() => game.assignRoles()).toThrowError(PLAYER_NOT_IN_GAME_MESSAGE);
      const player5 = createPlayerForTesting();
      game.join(player5);
    });
    it('should assign 3 villagers, 1 werewolf and 1 seer', () => {
      const player1 = createPlayerForTesting();
      game.join(player1);
      const player2 = createPlayerForTesting();
      game.join(player2);
      const player3 = createPlayerForTesting();
      game.join(player3);
      const player4 = createPlayerForTesting();
      game.join(player4);
      const player5 = createPlayerForTesting();
      game.join(player5);
      game.assignRoles();
      const roleValues = ['Werewolf', 'Seer', 'Villager'];
      expect(roleValues).toContain(game.state.roles[0].role);
      expect(roleValues).toContain(game.state.roles[1].role);
      expect(roleValues).toContain(game.state.roles[2].role);
      expect(roleValues).toContain(game.state.roles[3].role);
      expect(roleValues).toContain(game.state.roles[4].role);
    });

    /*
    game.assignRoles();
      expect(game.state.roles[0]).toEqual('Werewolf');
      expect(game.state.roles[1]).toEqual('Werewolf');
      expect(game.state.roles[2]).toEqual('Werewolf');
      expect(game.state.roles[3]).toEqual('Werewolf');
      expect(game.state.roles[4]).toEqual('Werewolf');
    */
  });
  /*
  describe('[T1.4] playerIDToONWRole', () => {

  }); */

  describe('[T1.3] Voting', () => {
    describe('isPlayerInGame', () => {
      it('should return true if the player is in the game', () => {
        const player1 = createPlayerForTesting();
        game.join(player1);
        expect(game.isPlayerInGame(player1)).toBe(true);
      });

      it('should return false if the player is not in the game', () => {
        const player1 = createPlayerForTesting();
        expect(game.isPlayerInGame(player1)).toBe(false);
      });
    });

    describe('getPlayers', () => {
      it('should return true an array of players', () => {
        const player1 = createPlayerForTesting();
        const player2 = createPlayerForTesting();
        const player3 = createPlayerForTesting();
        const player4 = createPlayerForTesting();
        const player5 = createPlayerForTesting();
        game.join(player1);
        game.join(player2);
        game.join(player3);
        game.join(player4);
        game.join(player5);
        const players = game.getPlayers();
        expect(players).toHaveLength(5);
      });
    });

    describe('getPlayerByID', () => {
      it('should return the id of the player in string format', () => {
        const player1 = createPlayerForTesting();
        game.join(player1);

        expect(game.state.player1).toEqual(player1.id);
      });
    });

    describe('handleVote', () => {
      it('should update the vote count and handle the vote result correctly', () => {
        const player1 = createPlayerForTesting();
        const player2 = createPlayerForTesting();
        game.join(player1);
        game.join(player2);

        // player2 votes player1
        game.handleVote(player2, player1);

        // player1 vote should be 1
        expect(game.voteCount[player1.id]).toEqual(1);
      });
    });

    // it('should record the vote for the specified player', () => {
    //   //Creating players and making them join the game
    //   const player1 = createPlayerForTesting();
    //   const player2 = createPlayerForTesting();
    //   const player3 = createPlayerForTesting();
    //   const player4 = createPlayerForTesting();
    //   const player5 = createPlayerForTesting();
    //   game.join(player1);
    //   game.join(player2);
    //   game.join(player3);
    //   game.join(player4);
    //   game.join(player5);
    // })
  });
});
