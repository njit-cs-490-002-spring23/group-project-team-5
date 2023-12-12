import {
  chakra,
  Container,
  Heading,
  Text,
  useToast,
  Box,
  Button,
  HStack,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import ONWAreaController from '../../../../classes/interactable/ONWAreaController';
import { ONWStatus, GameStatus, ONWRole } from '../../../../types/CoveyTownSocket';
import useTownController from '../../../../hooks/useTownController';
import { toString } from 'lodash';

export type ONWGameProps = {
  gameAreaController: ONWAreaController;
};

// Custom component for the Welcome Players screen
// eslint-disable-next-line @typescript-eslint/naming-convention
const WelcomePlayersScreen: React.FC = () => (
  <Box textAlign='center' fontSize='4xl' fontFamily='fantasy' color='black'>
    <Text mb={8} fontSize='xl'>
      welcome to
    </Text>
    <Text mb={8} fontSize='5xl'>
      ONE NIGHT WEREWOLF
    </Text>
  </Box>
);

// Custom component for the Role Assignment screen
// eslint-disable-next-line @typescript-eslint/naming-convention
const RoleAssignmentScreen: React.FC<{ playerONWRole: ONWRole }> = ({ playerONWRole }) => (
  <Box textAlign='center' fontSize='xl'>
    <Text mb={8} fontSize='5xl'>
      Role Assignment
    </Text>
    <Text mb={8} fontSize='3xl'>
      You are a {playerONWRole.role}
    </Text>
    <Text mb={4}>Everyone is getting their roles.</Text>
    <Text fontSize='lg'>{playerONWRole.description}</Text>
  </Box>
);
// Custom component for the Night screen
// eslint-disable-next-line @typescript-eslint/naming-convention
const NightScreen: React.FC = () => (
  <Box textAlign='center' fontSize='xl'>
    <Text mb={4} fontSize='2xl' fontWeight='bold'>
      Night Time
    </Text>
    <Text mb={4}>The creatures of the night awaken...</Text>
    <VStack spacing={4} align='center'>
      {/* Use Chakra UI Button for each player */}
      <HStack spacing={4}>
        <VStack>
          <Button variant='solid' colorScheme='teal'>
            Player Name
          </Button>
          <Button variant='solid' colorScheme='teal'>
            Player Name
          </Button>
        </VStack>
        <VStack>
          <Button variant='solid' colorScheme='teal'>
            Player Name
          </Button>
          <Button variant='solid' colorScheme='teal'>
            Player Name
          </Button>
        </VStack>
      </HStack>
    </VStack>
  </Box>
);

// Custom component for the Reveal Who Died screen
// eslint-disable-next-line @typescript-eslint/naming-convention
const RevealWhoDiedScreen: React.FC = () => (
  <Box textAlign='center' fontSize='xl'>
    <Text mb={4}>Revealing who died...</Text>
  </Box>
);

// Custom component for the Discussion Time screen
// eslint-disable-next-line @typescript-eslint/naming-convention
const DiscussionTimeScreen: React.FC = () => (
  <Box textAlign='center' fontSize='xl'>
    <Text mb={4}>Discussion time!</Text>
  </Box>
);

// Custom component for the Vote screen
// eslint-disable-next-line @typescript-eslint/naming-convention
const VoteScreen: React.FC = () => (
  <Box textAlign='center' fontSize='xl'>
    <Text mb={4}>Voting time!</Text>
  </Box>
);

// Custom component for the End Screen
// eslint-disable-next-line @typescript-eslint/naming-convention
const EndScreen: React.FC = () => (
  <Box textAlign='center' fontSize='xl'>
    <Text mb={4}>Game over! Displaying end screen.</Text>
  </Box>
);

/**
 * A component that will render the StyledONWBoard board, styled
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
const StyledONWBoard = chakra(Container, {
  baseStyle: {
    display: 'flex',
    justifyContent: 'center', // Center horizontally
    alignItems: 'center', // Center vertically
    width: '400px',
    height: '400px',
    padding: '5px',
    flexWrap: 'wrap',
  },
});
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
  const townController = useTownController();

  useEffect(() => {
    console.log('The ONW Game started!');

    /*
     * This controlls the timing of the game
     */
    if (gameAreaController.onwStatus === 'WELCOME_PLAYERS') {
      console.log('We made it to status [WELCOME_PLAYERS]');
      setTimeout(() => {
        setONWgameStatus('ROLE_ASSIGNMENT');
        console.log(
          `${townController.ourPlayer.userName}'s role is ${toString(
            gameAreaController.playerONWRole(townController.ourPlayer),
          )}`,
        );
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
                  }, 3000); // 3 seconds for END_SCREEN
                }, 3000); // 3 seconds for VOTE (3000 in milliseconds)
              }, 3000); // 3 seconds for DISCUSSION_TIME
            }, 3000); // 3 seconds for REVEAL_WHO_DIED
          }, 3000); // 3 seconds for Ns\IGHT
        }, 10000); // 3 seconds for ROLE_ASSIGNMENT
      }, 3000); // 3 seconds for WELCOME
    }

    gameAreaController.addListener('ONWgameUpdated', setONWgameStatus);
    return () => {
      gameAreaController.removeListener('ONWgameUpdated', setONWgameStatus);
    };
  }, [townController, gameAreaController]);

  // Function to render the appropriate screen based on onwGameStatus
  // Function to render the appropriate screen based on onwGameStatus
  const renderScreen = () => {
    switch (onwGameStatus) {
      case 'WELCOME_PLAYERS':
        return <WelcomePlayersScreen />;
      case 'ROLE_ASSIGNMENT':
        return (
          <RoleAssignmentScreen
            playerONWRole={gameAreaController.playerONWRole(townController.ourPlayer)}
          />
        );
      case 'NIGHT':
        return <NightScreen />;
      case 'REVEAL_WHO_DIED':
        return <RevealWhoDiedScreen />;
      case 'DISCUSSION_TIME':
        return <DiscussionTimeScreen />;
      case 'VOTE':
        return <VoteScreen />;
      case 'END_SCREEN':
        return <EndScreen />;
      default:
        return null;
    }
  };

  return <StyledONWBoard aria-label='One Night Werewolf'>{renderScreen()}</StyledONWBoard>;
}
