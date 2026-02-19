import type { UserEntity } from 'optimus-package';
import type { Socket as BaseSocket, Server } from 'socket.io';

export type EventsMap = Record<string, any>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IServerToClientEvents extends EventsMap {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IClientToServerEvents extends EventsMap {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IInterServerEvents extends EventsMap {}

export interface ISocketData {
  user: Nullable<UserEntity>;
}

export type WsServer = Server;

export type Socket<
  C2SEvents extends EventsMap = IClientToServerEvents,
  S2CEvents extends EventsMap = IServerToClientEvents,
  InterSEvents extends EventsMap = IInterServerEvents,
  SocketData extends ISocketData = ISocketData,
> = BaseSocket<C2SEvents, S2CEvents, InterSEvents, SocketData>;
