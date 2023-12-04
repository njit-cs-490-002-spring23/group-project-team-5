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
  const [onwGameStatus, setONWgameStatus] = useState<ONWStatus>(gameAreaController.onwStatus);
  // const [gameStatusText, setGameStatusText] = useState<string>('');
  const toast = useToast();

  useEffect(() => {
    gameAreaController.addListener('statusChanged', setONWgameStatus);
    return () => {
      gameAreaController.removeListener('statusChanged', setONWgameStatus);
    };
  }, [gameAreaController]);

  return (
    <Container maxW='xl' mt={8}>
      <Heading as='h2' textAlign='center' mb={4}>
        One Night Werewolf
      </Heading>
      <Text textAlign='center' fontSize='xl' mb={4}>
        {onwGameStatus}
      </Text>
    </Container>
  );
}
