import { Container, Heading, Text, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import ONWAreaController from '../../../../classes/interactable/ONWAreaController';
import { ONWStatus } from '../../../../types/CoveyTownSocket';

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
  const [onwGameStatus, setONWgameStatus] = useState<ONWStatus>('WELCOME_PLAYERS');
  const toast = useToast();

  useEffect(() => {
    const updateONWGameState = () => {
      const newStatus = gameAreaController.onwStatus || 'WELCOME_PLAYERS';
      setONWgameStatus(newStatus);
    };

    gameAreaController.addListener('ONWgameUpdated', updateONWGameState);

    return () => {
      gameAreaController.removeListener('ONWgameUpdated', updateONWGameState);
    };
  }, [gameAreaController, onwGameStatus, toast]);

  // Additional logic based on newStatus can go here
  if (gameAreaController.onwStatus === 'WELCOME_PLAYERS') {
    // Set 'ROLE_ASSIGNMENT' after 10 seconds
    setTimeout(() => {
      setONWgameStatus('ROLE_ASSIGNMENT');
      console.log('we changed to role assignment');
    }, 5000); // 10 seconds in milliseconds
  }

  let onwGameStatusText = <>Nothing yet!</>;
  if (onwGameStatus === 'WELCOME_PLAYERS') {
    onwGameStatusText = <>Hi everyone! Welcome to the game.</>;
  } else if (onwGameStatus === 'ROLE_ASSIGNMENT') {
    onwGameStatusText = <>Everyone is getting their roles.</>;
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
