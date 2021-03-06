import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import {Observable} from 'rxjs/Observable';

import * as io from 'socket.io-client';

@Injectable()
export class WebSocketService {
    private socket: SocketIOClient.Socket;
    constructor() {
        if (!this.socket) {
            this.socket = io(`http://localhost:7777`);
            //this.socket = io(`http://${window.location.hostname}:${window.location.port}`);
        }
    }

    sendChatMessage(message: any) {
        this.socket.emit('chat', message);
    }

    getPlayersMessages(): Observable<any> {
        return this.listenOnChannel('players');
    }

    getBoards(): Observable<any> {
        return this.listenOnChannel('boards');
    }
	sendGame(game: any) {
        this.socket.emit('game', game);
    }

    getTheir(): Observable<any> {
        return this.listenOnChannel('their');
    }

    sendClickElementMessage(index: number) {
        this.socket.emit('clickElement', index);
    }
    getBoard(): Observable<any> {
        return this.listenOnChannel('board');
    }

    getGame(): Observable<any> {
        return this.listenOnChannel('game');
    }

    sendClickElementTiro(index: number) {
        this.socket.emit('clickElementTiro', index);
    }

    getChatMessages(): Observable<any> {
        return this.listenOnChannel('chat');
    }

    private listenOnChannel(channel: string): Observable<any> {
        return new Observable((observer:any) => {
            this.socket.on(channel, (data:any) => {
                observer.next(data);
            });
            return () => this.socket.disconnect();
        });
    }
}
