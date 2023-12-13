/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Container,
  Heading,
  List,
  ListItem,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import ONWAreaController from '../../../../classes/interactable/ONWAreaController';
import PlayerController from '../../../../classes/PlayerController';
import { useInteractable, useInteractableAreaController } from '../../../../classes/TownController';
import useTownController from '../../../../hooks/useTownController';
import {
  GameResult,
  GameStatus,
  InteractableID,
  ONWStatus,
} from '../../../../types/CoveyTownSocket';
import GameAreaInteractable from '../GameArea';
import ONWLeaderboard from '../Leaderboard';
import ONWBoard from './ONWBoard';

/**
 * The ONWArea component renders the ONW game area.
 * It renders the current state of the area, optionally allowing the player to join the game.
 *
 * It uses Chakra-UI components (does not use other GUI widgets)
 *
 * It uses the ONWAreaController to get the current state of the game.
 * It listens for the 'gameUpdated' and 'gameEnd' events on the controller, and re-renders accordingly.
 * It subscribes to these events when the component mounts, and unsubscribes when the component unmounts. It also unsubscribes when the gameAreaController changes.
 *
 * It renders the following:
 * - A leaderboard (@see Leaderboard.tsx), which is passed the game history as a prop
 * - A list of observers' usernames (in a list with the aria-label 'list of observers in the game', one username per-listitem)
 * - A list of players' usernames (in a list with the aria-label 'list of players in the game', % items for each player
 *    - If there is no player in the game, the username is '(No player n yet!)'
 *    - List the players as (exactly) `Player n: ${username}` n is a number less than or equal to 5 based on the chronilogical order players o
 * - If the game is in status WAITING_TO_START or OVER, a button to join the game is displayed, with the text 'Join New Game'
 *    - Clicking the button calls the joinGame method on the gameAreaController
 *    - Before calling joinGame method, the button is disabled and has the property isLoading set to true, and is re-enabled when the method call completes
 *    - If the method call fails, a toast is displayed with the error message as the description of the toast (and status 'error')
 *    - Once the player joins the game, the button dissapears
 * - The ONWBoard component, which is passed the current gameAreaController as a prop (@see ONWBoard.tsx)
 *
 * - When the game ends, a toast is displayed with the result of the game:
 *    - Tie: description 'Game ended in a tie'
 *    - Our player won: description 'You won!'
 *    - Our player lost: description 'You lost :('
 *
 */

const onwImage = {
  backgroundImage:
    'url("https://clan.akamai.steamstatic.com/images/5854753/b66553f114b91d1264e5323cc3262b1313f7cdde.jpg")',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  height: '23vh',
};

const containerStyle = {
  backgroundColor: '#fff8e3',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  aligItems: 'center',
  justifyContent: 'center',
};

const center = {
  textAlign: 'center',
};

function ONWArea({ interactableID }: { interactableID: InteractableID }): JSX.Element {
  const gameAreaController = useInteractableAreaController<ONWAreaController>(interactableID);
  const townController = useTownController();
  const [history, setHistory] = useState<GameResult[]>(gameAreaController.history);
  const [gameStatus, setGameStatus] = useState<GameStatus>(gameAreaController.status);
  const [onwGameStatus, setONWGameStatus] = useState<ONWStatus>(gameAreaController.onwStatus);
  const [observers, setObservers] = useState<PlayerController[]>(gameAreaController.observers);
  const [joiningGame, setJoiningGame] = useState(false);
  const [player1, setPlayer1] = useState<PlayerController | undefined>(gameAreaController.player1);
  const [player2, setPlayer2] = useState<PlayerController | undefined>(gameAreaController.player2);
  const [player3, setPlayer3] = useState<PlayerController | undefined>(gameAreaController.player3);
  const [player4, setPlayer4] = useState<PlayerController | undefined>(gameAreaController.player4);
  const [player5, setPlayer5] = useState<PlayerController | undefined>(gameAreaController.player5);
  const [rolesAssigned, setRolesAssigned] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const updateGameState = async () => {
      console.log('ONWArea event triggered');
      setHistory(gameAreaController.history);
      setGameStatus(gameAreaController.status || 'WAITING_TO_START');
      setObservers(gameAreaController.observers);
      setPlayer1(gameAreaController.player1);
      setPlayer2(gameAreaController.player2);
      setPlayer3(gameAreaController.player3);
      setPlayer4(gameAreaController.player4);
      setPlayer5(gameAreaController.player5);

      // Check if the game is in progress and roles are not assigned
      if (gameAreaController.status === 'IN_PROGRESS' && !rolesAssigned) {
        try {
          await new Promise<void>(resolve => {
            gameAreaController.assignRoles();
            gameAreaController.playerIDToONWRole();
            resolve();
          });
          setRolesAssigned(true);
          console.log('roles were assigned successfully!');
        } catch (error) {
          console.error('Error assigning roles:', error);
        }
      }

      // Check if the game is over and reset to WAITING_TO_START
      // Check if the game is over and reset to WAITING_TO_START
      if (gameAreaController.status === 'OVER') {
        setGameStatus('WAITING_TO_START');
        setRolesAssigned(false);
      }
    };

    updateGameState();

    gameAreaController.addListener('gameUpdated', updateGameState);
    const onGameEnd = () => {
      const winner = gameAreaController.winner;
      if (!winner) {
        toast({
          title: 'Game over',
          description: 'Game ended in a tie',
          status: 'info',
        });
      } else if (winner === townController.ourPlayer) {
        toast({
          title: 'Game over',
          description: 'You won!',
          status: 'success',
        });
      } else {
        toast({
          title: 'Game over',
          description: `You lost :(`,
          status: 'error',
        });
      }
    };
    gameAreaController.addListener('gameEnd', onGameEnd);

    return () => {
      gameAreaController.removeListener('gameEnd', onGameEnd);
      gameAreaController.removeListener('gameUpdated', updateGameState);
    };
  }, [townController, gameAreaController, toast, gameStatus, rolesAssigned]);

  let gameStatusText = <></>;
  if (gameStatus === 'IN_PROGRESS') {
    gameStatusText = <>Game in Progress!</>;
  } else {
    let joinGameButton = <></>;
    if (
      (gameAreaController.status === 'WAITING_TO_START' && !gameAreaController.isPlayer) ||
      !gameAreaController.players.some(
        player => player.userName === townController.ourPlayer.userName,
      )
    ) {
      joinGameButton = (
        <Button
          onClick={async () => {
            setJoiningGame(true);
            try {
              await gameAreaController.joinGame();
            } catch (err) {
              toast({
                title: 'Error joining game',
                description: (err as Error).toString(),
                status: 'error',
              });
            }
            setJoiningGame(false);
          }}
          isLoading={joiningGame}
          disabled={joiningGame}
          colorScheme='yellow'
          variant='solid'
          size='md'
          borderRadius='md'
          _hover={{ bg: 'yellow.500' }}
          _focus={{ boxShadow: 'outline' }}>
          Join New Game
        </Button>
      );
    }
    gameStatusText = (
      <Box>
        <b>Game {gameStatus === 'WAITING_TO_START' ? 'not yet started' : 'over'}.</b>
        <br></br>
        <br></br>
        {joinGameButton}
      </Box>
    );
  }

  return (
    <Container style={containerStyle}>
      <br></br>
      <div style={onwImage}></div>
      <Accordion allowToggle>
        <AccordionItem>
          <Heading as='h3' textAlign='center'>
            <br></br>
            <AccordionButton
              _hover={{
                backgroundColor: 'yellow.500',
              }}>
              <Box as='span' flex='1' textAlign='center'>
                Leaderboard
                <AccordionIcon />
              </Box>
            </AccordionButton>
          </Heading>
          <AccordionPanel>
            <ONWLeaderboard results={history} />
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <Heading as='h3'>
            <AccordionButton>
              <Box as='span' flex='1' textAlign='center'>
                Current Observers For Game
                <AccordionIcon />
              </Box>
            </AccordionButton>
          </Heading>
          <AccordionPanel>
            <List aria-label='list of observers in the game' textAlign='center'>
              {observers.map(player => {
                return <ListItem key={player.id}>{player.userName}</ListItem>;
              })}
            </List>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <br></br>
      <Heading textAlign='center' fontSize='20px'>
        {gameStatusText}
      </Heading>
      <br></br>
      {gameStatus !== 'IN_PROGRESS' && (
        <List aria-label='list of players in the game' textAlign='center'>
          <ListItem>Player 1: {player1?.userName || '(No Player 1 yet!)'}</ListItem>
          <ListItem>Player 2: {player2?.userName || '(No Player 2 yet!)'}</ListItem>
          <ListItem>Player 3: {player3?.userName || '(No Player 3 yet!)'}</ListItem>
          <ListItem>Player 4: {player4?.userName || '(No Player 4 yet!)'}</ListItem>
          <ListItem>Player 5: {player5?.userName || '(No Player 5 yet!)'}</ListItem>
        </List>
      )}
      {gameStatus === 'IN_PROGRESS' && <ONWBoard gameAreaController={gameAreaController} />}
    </Container>
  );
}

/**
 * A wrapper component for the ONWArea component.
 * Determines if the player is currently in a tic tac toe area on the map, and if so,
 * renders the ONWArea component in a modal.
 *
 */
export default function ONWAreaWrapper(): JSX.Element {
  const gameArea = useInteractable<GameAreaInteractable>('gameArea');
  const [modalOpen, setModalOpen] = useState(true);
  const townController = useTownController();
  const toast = useToast();
  const [gameStatus, setGameStatus] = useState<GameStatus>('WAITING_TO_START');

  const closeModal = useCallback(() => {
    if (gameArea) {
      townController.interactEnd(gameArea);
      const controller = townController.getGameAreaController(gameArea);
      controller.leaveGame();
      // Show toast when the modal is closed
      toast({
        title: 'You left the game',
        description: 'The game restarted for everyone',
        status: 'info',
      });
    }
    setModalOpen(false);
  }, [townController, gameArea, toast]);

  useEffect(() => {
    if (gameStatus === 'OVER') {
      closeModal();
    }
  }, [gameStatus, closeModal]);

  if (gameArea && gameArea.getData('type') === 'OneNightWerewolf') {
    return (
      <Modal isOpen={true} onClose={closeModal} closeOnOverlayClick={false}>
        <div>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{gameArea.name}</ModalHeader>
            <ModalCloseButton />
            <ONWArea interactableID={gameArea.name} />;
          </ModalContent>
        </div>
      </Modal>
    );
  }
  return <></>;
}
