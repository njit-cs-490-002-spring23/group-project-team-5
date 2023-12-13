/* eslint-disable @typescript-eslint/naming-convention */
import {
  Spacer,
  Image,
  Flex,
  chakra,
  Container,
  useColorModeValue,
  Heading,
  Center,
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
import ONWGame from '../../../../../../townService/src/town/games/ONWGame';

export type ONWGameProps = {
  gameAreaController: ONWAreaController;
};

// Custom component for the Welcome Players screen
// eslint-disable-next-line @typescript-eslint/naming-convention
const WelcomePlayersScreen: React.FC = () => {
  const bgColor = 'black' 
  const white = 'white'
  const orange = 'orange.100'

  return (
    <Flex direction="column" align="center" justify="center" w="60vh" h="43vh" bgImage="url('https://i.makeagif.com/media/9-18-2018/RySj_U.gif')">
      <Box textAlign='center' p={5}>
        <Text mb={3} fontSize='3xl' color={orange} fontWeight='medium'>
          Welcome to
        </Text>
        <Text mb={6} fontSize='6xl' color={orange} fontWeight='bold'>
          ONE NIGHT WEREWOLF
        </Text>
        <Spacer />
        <HStack spacing={10}>
          <Image src="https://i.pinimg.com/originals/8d/b2/ec/8db2ecdf326d0fad735bb37fb10313c4.png" alt="Werewolf Image" height="120px" borderRadius={20}/>
          <Image src="data:image/jpeg;base64,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" 
          alt="Werewolf Image" height="120px" borderRadius={20} />
          <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzC0Qw9eXSguNs6Z6c1l2IIi5djeRwfQmt_5mT4xqSV9O54u7FfjDuEmQhTiXFthpWJAQ&usqp=CAU" alt="Werewolf Image" height="120px" borderRadius={20}/>
        </HStack>
      </Box>
    </Flex>
  );
};

// Custom component for the Role Assignment screen
// eslint-disable-next-line @typescript-eslint/naming-convention
const RoleAssignmentScreen: React.FC<{ playerONWRole: ONWRole }> = ({ playerONWRole }) => {
  const bgColor = 'black' 
  const white = 'white'
  const orange = 'orange.100'
  const roleColor = 'teal.500'; 


  return (
    <Center justify="center" align="center" h="43vh" w="60vh" bg={bgColor}>
      <VStack spacing={6} align="center">
        <Text fontSize='4xl' fontWeight='bold' color={orange}>
          Role Assignment
        </Text>
        <Text fontSize='4xl' fontWeight='semibold' color={orange}>
          You are a {playerONWRole.role}
        </Text>
        <Text fontSize='lg'  w="30vh" color={orange}>
          {playerONWRole.description}
        </Text>

        <Text fontSize='xl' color={orange}>
          Everyone is getting their roles...
        </Text>
      </VStack>
    </Center>
  );
};

// Custom component for the Reveal Who Died screen
// eslint-disable-next-line @typescript-eslint/naming-convention
const RevealWhoDiedScreen: React.FC = () => (
  <Box textAlign='center' fontSize='xl' bg="black" w="50vh" h="44vh" bgImage="url('https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmx6c2UzamRhNzkyYnZ5b2x3MXgyNzRqeGZlNjRnMGF6amoxZDA2YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/gKZ8okUrtjkguMBsnt/giphy.gif')" p={5}>
      <Text mb={1} fontSize='2xl' fontWeight='bold' color='orange.100'>
        Revealing who died.
      </Text>
  </Box>
);

// Custom component for the Discussion Time screen
// eslint-disable-next-line @typescript-eslint/naming-convention
const DiscussionTimeScreen: React.FC = () => (
  <Box textAlign='center' fontSize='xl' bgImage="url('https://gifdb.com/images/high/black-background-space-stars-4l34z6vp3yv6qv3x.gif')"w="50vh" h="44vh" p={5}>
      <Text mb={1} fontSize='2xl' fontWeight='bold' color='orange.100'>
        Discussion Time!
      </Text>
  </Box>
);



// Custom component for the Vote screen
// eslint-disable-next-line @typescript-eslint/naming-convention
const VoteScreen: React.FC<{
  currentUsername: string;
  otherPlayerUsernames?: string[]; 
  playerRole: ONWRole;
  
}> = ({ currentUsername, otherPlayerUsernames, playerRole }) => {

  const [voteConfirmation, setVoteConfirmation] = useState('');

  const handleVoteClick = (targetUsername) => {
    ONWAreaController.handleVote(currentUsername, targetUsername);
    setVoteConfirmation(`${currentUsername} voted for ${targetUsername}`);
  };
  return (
    <Box textAlign='center' fontSize='xl' bgImage="url('https://66.media.tumblr.com/16cf982b03b0409e9428801e559b36bc/tumblr_o565psJdUZ1u9yiolo1_500.gif')" p={5}>
      <Text mb={2} fontSize='2xl' fontWeight='bold' color='orange.100'>
        Voting Time
      </Text>
      <Text mb={4} fontSize='lg' color='orange.100'>
        Select the player you would like to vote for!
      </Text>
      <VStack spacing={3}>
        <Button colorScheme='orange'>Player 1</Button>
        <Button colorScheme='orange'>Player 2</Button>
        <Button colorScheme='orange'>Player 3</Button>
        <Button colorScheme='orange'>Player 4</Button>
        <Button colorScheme='orange'>Player 5</Button>
      </VStack>
    </Box>
  );
};



// Custom component for the End Screen
// eslint-disable-next-line @typescript-eslint/naming-convention
const EndScreen: React.FC = () => (
  <Box textAlign='center' fontSize='xl' bgImage="url('https://www.gifcen.com/wp-content/uploads/2021/05/the-end-gif-2.gif')" w="50vh" h="44vh" p={5}>
      
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

  // Fetch other player usernames
  const currentUserUsername = townController.ourPlayer.userName;
  const otherPlayerUsernames = townController.players
    .filter(player => player.userName !== currentUserUsername)
    .map(player => player.userName);
  const playerRole = gameAreaController.playerONWRole(townController.ourPlayer);

  // Custom component for the Night screen
  const renderNightScreen = () => {
  const getNightText = () => {
    switch (playerRole.role) {
      case 'Villager':
        return (
            <>
              {`${currentUserUsername} `}
                <br />
                <br />
                {"pray you survive the night! One of these people is a Werewolf."}
            </> 
        );
      case 'Werewolf':
        return (
          <>
            <br />
            
            {`${currentUserUsername} `}
            <br />
          
            {"choose who you want to kill and defend yourself in the morning."}
          </>
        );
      case 'Seer':
        return (
          <>
            {`${currentUserUsername} `}
              <br />
              <br />
              {"choose one of these players to reveal their role."}
          </> 
      );
      default:
        return '';
    }
  };

  const getOtherPlayerRole = (username: string) => {
    const otherPlayer = townController.players.find(player => player.userName === username);
    if (otherPlayer) {
      const otherPlayerRole = gameAreaController.playerONWRole(otherPlayer);
      return otherPlayerRole.role;
    }
    return '';
  };

  return (
    <Flex direction="column" align="center" justify="center" w="50vh" h="43vh" bgImage="url('https://i.gifer.com/5qsh.gif')">
      <VStack spacing={1}>
      <Text fontSize='2xl' fontWeight='bold' color="orange.100" mb={4}>It's Night Time!</Text>
        <Text fontSize='2xl' fontWeight='bold' textAlign="center" w="35vh" color="orange.100" mb={4}>{getNightText()}</Text>
        {townController.players
          .filter(player => player.userName !== currentUserUsername)
          .map(player => (
            <Box key={player.userName} p={3} boxShadow='md' rounded='md'>
              <Text fontSize='lg'>{player.userName} - {getOtherPlayerRole(player.userName)}</Text>
            </Box>
          ))
        }
      </VStack>
    </Flex>
  );
};

  useEffect(() => {
    console.log('The ONW Game started!');
    console.log('gameStatus changed:', gameStatus);
    /*
     * This controlls the timing of the game
     */
    if (gameAreaController.onwStatus === 'WELCOME_PLAYERS') {
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
                  console.log('Game status should change to OVER after 3 seconds');
                  setTimeout(() => {
                    setONWgameStatus('WELCOME_PLAYERS');
                    setGameStatus('OVER');
                    console.log(
                      'gameAreaController.status in useEffect:',
                      gameAreaController.status,
                    );
                  }, 5000); // 3 seconds for END_SCREEN
                }, 5000); // 3 seconds for VOTE (3000 in milliseconds)
              }, 5000); // 3 seconds for DISCUSSION_TIME
            }, 5000); // 3 seconds for REVEAL_WHO_DIED
          }, 5000); // 3 seconds for NIGHT
        }, 5000); // 3 seconds for ROLE_ASSIGNMENT
      }, 5000); // 3 seconds for WELCOME
    }

    gameAreaController.addListener('ONWgameUpdated', setONWgameStatus);
    return () => {
      gameAreaController.removeListener('ONWgameUpdated', setONWgameStatus);
    };
  }, [townController, gameAreaController, gameStatus]);

  // Function to render the appropriate screen based on onwGameStatus
  const renderScreen = () => {
    return <EndScreen />;
    // return <DiscussionTimeScreen />;
    // return <RevealWhoDiedScreen />;
    // return <EndScreen />;
    // return renderNightScreen();
    // return <WelcomePlayersScreen />;
    // return <VoteScreen />;
    // return <RoleAssignmentScreen playerONWRole={playerRole} />;

    // switch (onwGameStatus) {
    //   case 'WELCOME_PLAYERS':
    //     return <WelcomePlayersScreen />;
    //   case 'ROLE_ASSIGNMENT':
    //     return <RoleAssignmentScreen playerONWRole={playerRole} />;
    //   case 'NIGHT':
    //     return (
    //       <NightScreen
    //         currentUsername={currentUserUsername}
    //         otherPlayerUsernames={otherPlayerUsernames}
    //         playerRole={playerRole}
    //       />
    //     );
    //   case 'REVEAL_WHO_DIED':
    //     return <RevealWhoDiedScreen />;
    //   case 'DISCUSSION_TIME':
    //     return <DiscussionTimeScreen />;
    //   case 'VOTE':
    //     return <VoteScreen />;
    //   case 'END_SCREEN':
    //     return <EndScreen />;
    //   default:
    //     return null;
    // }
    switch (onwGameStatus) {
      case 'WELCOME_PLAYERS':
        return <WelcomePlayersScreen />;
      case 'ROLE_ASSIGNMENT':
        return <RoleAssignmentScreen playerONWRole={playerRole} />;
      case 'NIGHT':
        return renderNightScreen();
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
