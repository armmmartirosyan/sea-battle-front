import { io, Socket } from "socket.io-client";
import EventEmitter from "../helpers/event-emitter";
import { MessageTypes, MessagesEventTypes } from "../constants";
import { AnswerMessageModel, AskMessageModel } from "../types";

const socketUrl = "http://localhost:3004";

class SignalingProvider {
  private socket: Socket | null = null;
  public eventEmitter: EventEmitter = new EventEmitter();

  public init() {
    this.socket = io(socketUrl, {
      query: {
        username: prompt("Enter a username: ") || "Ben" + Math.random(),
      },
    });

    this.socket.on(MessageTypes.ASK, this.onAsk);
    this.socket.on(MessageTypes.ANSWER, this.onAnswer);
    this.socket.on(MessageTypes.READY, this.onEnemyReady);
    this.socket.on(MessageTypes.CONNECT, this.onConnect);
    this.socket.on(MessageTypes.SWITCH_TURN, this.onSwitchTurn);
  }

  private onAsk = (askData: AskMessageModel) => {
    this.eventEmitter.emit(MessagesEventTypes.ON_ASK, askData);
  };

  private onAnswer = (answerData: AnswerMessageModel) => {
    this.eventEmitter.emit(MessagesEventTypes.ON_ANSWER, answerData);
  };

  private onEnemyReady = () => {
    this.eventEmitter.emit(MessagesEventTypes.ON_READY, true);
  };

  private onConnect = (connectData: any) => {
    this.eventEmitter.emit(MessagesEventTypes.ON_CONNECT, connectData);
  };

  private onSwitchTurn = () => {
    this.eventEmitter.emit(MessagesEventTypes.ON_SWITCH_TURN, undefined);
  };

  public sendMessage(
    type: string,
    data: AskMessageModel | AnswerMessageModel[] | null
  ) {
    if (!this.socket) return;

    this.socket.emit(type, data);
  }
}

export const signalingProvider = new SignalingProvider();
