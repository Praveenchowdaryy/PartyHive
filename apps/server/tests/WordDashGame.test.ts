import { describe, it, expect, beforeEach } from 'vitest';
import { Room } from '../src/room/Room';
import { WordDashGame } from '../src/engine/games/WordDashGame';

function createMockSocket() {
  return { connected: true, emit: () => {}, join: () => {}, leave: () => {} } as any;
}

describe('Word Dash Game Engine', () => {
  let room: Room;
  let game: WordDashGame;
  let p1Id: string;
  let p2Id: string;

  beforeEach(() => {
    room = new Room('WORD01', '');
    const { player: p1 } = room.addPlayer('Sara', 'rabbit', createMockSocket());
    const { player: p2 } = room.addPlayer('Liam', 'fox', createMockSocket());
    p1Id = p1.id;
    p2Id = p2.id;

    game = new WordDashGame(room);
    game.start();
  });

  it('serves scrambled word prompt with clue and hidden answer', () => {
    const pub = game.getPublicState();
    expect(pub.gameId).toBe('word-dash');
    expect(pub.currentWord).toBeDefined();
    expect(pub.currentWord?.scrambled).toBeDefined();
    expect(pub.currentWord?.clue).toBeDefined();
    expect(pub.roundReveal).toBeNull();
  });

  it('validates submitted solutions and awards points to solvers', () => {
    const currentAnswer = (game as any).words[(game as any).currentWordIndex].answer;
    expect(currentAnswer).toBeDefined();

    // Wrong answer
    const wrongRes = game.handleAction(p1Id, { type: 'submit_word', payload: { word: 'INCORRECT' } });
    expect(wrongRes.success).toBe(false);

    // Correct answer from P1
    const correctRes = game.handleAction(p1Id, { type: 'submit_word', payload: { word: currentAnswer } });
    expect(correctRes.success).toBe(true);
    expect(game.scores[p1Id]).toBeGreaterThan(0);

    const priv = game.getPrivateState(p1Id);
    expect(priv.hasSolved).toBe(true);
  });
});
