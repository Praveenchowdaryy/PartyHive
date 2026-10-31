import { describe, it, expect, beforeEach } from 'vitest';
import { Room } from '../src/room/Room';
import { MostLikelyToGame } from '../src/engine/games/MostLikelyToGame';

function createMockSocket() {
  return { connected: true, emit: () => {}, join: () => {}, leave: () => {} } as any;
}

describe('Most Likely To Game Engine', () => {
  let room: Room;
  let game: MostLikelyToGame;
  let p1Id: string;
  let p2Id: string;

  beforeEach(() => {
    room = new Room('MLT001', '');
    const { player: p1 } = room.addPlayer('Kavya', 'panda', createMockSocket());
    const { player: p2 } = room.addPlayer('Leo', 'lion', createMockSocket());
    p1Id = p1.id;
    p2Id = p2.id;

    game = new MostLikelyToGame(room);
    game.start();
  });

  it('serves superlative prompt to all players', () => {
    const pub = game.getPublicState();
    expect(pub.gameId).toBe('most-likely-to');
    expect(pub.currentPrompt).toBeDefined();
    expect(pub.currentPrompt?.prompt).toBeDefined();
    expect(pub.roundReveal).toBeNull();
  });

  it('records votes and reveals winner when all players vote', () => {
    // P1 votes for P2
    game.handleAction(p1Id, { type: 'vote_player', payload: { targetPlayerId: p2Id } });
    expect(game.phase).toBe('PLAYING');

    // P2 votes for P2
    game.handleAction(p2Id, { type: 'vote_player', payload: { targetPlayerId: p2Id } });

    // Since both players voted, phase transitions to ROUND_END
    expect(game.phase).toBe('ROUND_END');
    const pub = game.getPublicState();
    expect(pub.roundReveal).toBeDefined();
    expect(pub.roundReveal?.winnerId).toBe(p2Id);
    expect(pub.roundReveal?.voteCount).toBe(2);
    expect(game.scores[p2Id]).toBe(700);
  });
});
