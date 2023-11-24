// import { Button, chakra, Container, useToast } from '@chakra-ui/react';
// import React, { useEffect, useState } from 'react';
import ONWAreaController from '../../../../classes/interactable/ONWAreaController';

export type ONWGameProps = {
  gameAreaController: ONWAreaController;
};

/**
 * An empty One Night Werewolf board
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ONWBoard({ gameAreaController }: ONWGameProps): JSX.Element {
  // eslint-disable-next-line react/react-in-jsx-scope
  return <h1>Hello</h1>;
}
