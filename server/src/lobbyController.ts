import { Request, Response } from 'express';
import { createLobby } from './lobbyService';

export const createLobbyHandler = (req: Request, res: Response) => {
  try {
    const { timeConstraint } = req.body;

    if (timeConstraint !== undefined && typeof timeConstraint !== 'number') {
      return res
        .status(400)
        .json({ error: 'timeConstraint must be a number if provided' });
    }

    const lobbyCode = createLobby();

    return res.status(201).json({ lobbyCode });
  } catch (error) {
    console.error('Error creating lobby:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
