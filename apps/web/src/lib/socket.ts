import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '@partyhive/shared';

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export function getSocketServerUrl(): string {
  if (process.env.NEXT_PUBLIC_SOCKET_URL) {
    return process.env.NEXT_PUBLIC_SOCKET_URL.replace(/\/+$/, '');
  }
  const defaultHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  return `http://${defaultHost}:4000`;
}

export function warmupServer(): void {
  if (typeof window === 'undefined') return;
  try {
    const url = `${getSocketServerUrl()}/health`;
    fetch(url, { method: 'GET', mode: 'cors' }).catch(() => {});
  } catch {
    // Ignore warmup network errors
  }
}

export function getSocket(): Socket<ServerToClientEvents, ClientToServerEvents> {
  if (!socket) {
    const socketUrl = getSocketServerUrl();
    socket = io(socketUrl, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 15,
      reconnectionDelay: 800,
      reconnectionDelayMax: 4000,
      transports: ['websocket', 'polling'],
      timeout: 20000,
    });
  }
  return socket;
}

export function saveSession(
  roomCode: string,
  token: string,
  nickname: string,
  avatar: string,
  playerId?: string
) {
  if (typeof window === 'undefined') return;
  const sessionData = {
    roomCode: roomCode.toUpperCase(),
    token,
    nickname,
    avatar,
    playerId,
    timestamp: Date.now(),
  };
  localStorage.setItem(`cp_session_${roomCode.toUpperCase()}`, JSON.stringify(sessionData));
  localStorage.setItem('cp_last_user', JSON.stringify({ nickname, avatar }));
}

export function getSavedSession(
  roomCode: string
): { token: string; nickname: string; avatar: string; playerId?: string } | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(`cp_session_${roomCode.toUpperCase()}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getLastUserProfile(): { nickname: string; avatar: string } {
  if (typeof window === 'undefined') return { nickname: '', avatar: 'cat' };
  const raw = localStorage.getItem('cp_last_user');
  if (!raw) return { nickname: '', avatar: 'cat' };
  try {
    return JSON.parse(raw);
  } catch {
    return { nickname: '', avatar: 'cat' };
  }
}
