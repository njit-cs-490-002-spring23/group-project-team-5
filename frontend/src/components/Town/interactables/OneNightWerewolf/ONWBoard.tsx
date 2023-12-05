import { Container, Heading, Text, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import ONWAreaController from '../../../../classes/interactable/ONWAreaController';
import { ONWStatus, GameStatus } from '../../../../types/CoveyTownSocket';

export type ONWGameProps = {
  gameAreaController: ONWAreaController;
};

/**
 * One Night Werewolf board
 *
 * Hope: I started testing timing. If the ONW event is at a certain status, a certain text will appear:
 *  "WELCOME_PLAYERS" => "welcome to the game"
 *  "ROLE_ASSIGNMENT" => "The players are learning their roles."
 */
export default function ONWBoard({ gameAreaController }: ONWGameProps): JSX.Element {
  const [onwGameStatus, setONWgameStatus] = useState<ONWStatus>('WELCOME_PLAYERS'); // default start stage
  const [gameStatus, setGameStatus] = useState<GameStatus>(gameAreaController.status);

  const toast = useToast();

  useEffect(() => {
    console.log('Starting the ONW Game!');
    /*
     * This controlls the timing of the game
     */
    if (gameAreaController.onwStatus === 'WELCOME_PLAYERS') {
      setTimeout(() => {
        setONWgameStatus('ROLE_ASSIGNMENT');
        setTimeout(() => {
          setONWgameStatus('NIGHT');
          setTimeout(() => {
            setONWgameStatus('REVEAL_WHO_DIED');
            setTimeout(() => {
              setONWgameStatus('DISCUSSION_TIME');
              setTimeout(() => {
                setONWgameStatus('VOTE');
                setTimeout(() => {
                  setONWgameStatus('END_SCREEN');
                  setTimeout(() => {
                    setGameStatus('OVER');
                  }, 3000); // 3 seconds for OVER
                }, 3000); // 3 seconds for END_SCREEN (3000 in milliseconds)
              }, 3000); // 3 seconds for VOTE
            }, 3000); // 3 seconds for DISCUSSION_TIME
          }, 3000); // 3 seconds for REVEAL_WHO_DIED
        }, 3000); // 3 seconds for NIGHT
      }, 3000); // 3 seconds for ROLE_ASSIGNMENT
    }

    gameAreaController.addListener('ONWgameUpdated', setONWgameStatus);
    return () => {
      gameAreaController.removeListener('ONWgameUpdated', setONWgameStatus);
    };
  }, [gameAreaController]);

  let onwGameStatusText = <>Nothing yet!</>;
  if (onwGameStatus === 'WELCOME_PLAYERS') {
    onwGameStatusText = <>Hi everyone! Welcome to the game.</>;
  } else if (onwGameStatus === 'ROLE_ASSIGNMENT') {
    onwGameStatusText = <>Everyone is getting their roles.</>;
  } else if (onwGameStatus === 'NIGHT') {
    onwGameStatusText = <>It is night time!</>;
  } else if (onwGameStatus === 'REVEAL_WHO_DIED') {
    onwGameStatusText = <>Revealing who died...</>;
  } else if (onwGameStatus === 'DISCUSSION_TIME') {
    onwGameStatusText = <>Discussion time!</>;
  } else if (onwGameStatus === 'VOTE') {
    onwGameStatusText = <>Voting time!</>;
  } else if (onwGameStatus === 'END_SCREEN') {
    onwGameStatusText = <>Game over! Displaying end screen.</>;
  }

  return (
    <Container maxW='xl' mt={8}>
      <Heading as='h2' textAlign='center' mb={4}>
        One Night Werewolf
      </Heading>
      <Text textAlign='center' fontSize='xl' mb={4}>
        {onwGameStatusText}
      </Text>
    </Container>
  );
}
