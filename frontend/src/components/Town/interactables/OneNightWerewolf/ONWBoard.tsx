import { Container, Heading, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import ONWAreaController from '../../../../classes/interactable/ONWAreaController';

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
  const [gameStatusText, setGameStatusText] = useState<string>('');

  useEffect(() => {
    const handleStatusUpdate = (status: string) => {
      if (status === 'WELCOME_PLAYERS') {
        setGameStatusText('Welcome to the game!');
      } else if (status === 'ROLE_ASSIGNMENT') {
        setGameStatusText('The players are learning their roles.');
      }
      // Add more conditions for other states if needed
    };

    const handleGameStart = () => {
      // Additional logic when the game starts
    };

    const handleRoleAssignment = () => {
      // Additional logic when role assignment occurs
    };

    // Subscribe to events
    gameAreaController.addListener('onwStatusUpdated', handleStatusUpdate);
    gameAreaController.addListener('onwGameStart', handleGameStart);
    gameAreaController.addListener('onwRoleAssignment', handleRoleAssignment);

    // Cleanup event listeners on component unmount
    return () => {
      gameAreaController.removeListener('onwStatusUpdated', handleStatusUpdate);
      gameAreaController.removeListener('onwGameStart', handleGameStart);
      gameAreaController.removeListener('onwRoleAssignment', handleRoleAssignment);
    };
  }, [gameAreaController]);

  return (
    <Container maxW="xl" mt={8}>
      <Heading as="h2" textAlign="center" mb={4}>
        One Night Werewolf
      </Heading>
      <Text textAlign="center" fontSize="xl" mb={4}>
        {gameStatusText}
      </Text>
    </Container>
  );

}
