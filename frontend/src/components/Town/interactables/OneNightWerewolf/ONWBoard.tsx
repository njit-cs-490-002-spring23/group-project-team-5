import { Button, chakra, Container, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import ONWAreaController, {
} from '../../../../classes/interactable/ONWAreaController';

export type ONWGameProps = {
    gameAreaController: ONWAreaController;
  };

/**
 * An empty One Night Werewolf board
 */
export default function ONWBoard({ gameAreaController }: ONWGameProps): JSX.Element {
  return (
    <h1>hello world</h1>
  );
}
