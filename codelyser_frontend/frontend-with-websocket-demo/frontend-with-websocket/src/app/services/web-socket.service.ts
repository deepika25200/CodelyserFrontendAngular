import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { Injectable, NgZone } from '@angular/core';
import { LiveServerComponent } from '../live-server/live-server.component';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  webSocketEndPoint: string = 'http://localhost:8080/ws';
  topic: string = "/topic/greetings";
  stompClient: any;
  liveserver!: LiveServerComponent;
  compileoutput!: string;

  constructor(liveserver: LiveServerComponent) {
    this.liveserver=liveserver;
  }

  _connect() {
    console.log("Initialize WebSocket Connection");
    let ws = SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;
    _this.stompClient.connect({}, function (frame: any) {
      _this.stompClient.subscribe(_this.topic, function (sdkEvent: any) {
        console.log("Received from Server");
        _this.liveserver.backendresponse=true;
        _this.onMessageReceived(sdkEvent);
      });
      // _this.stompClient.reconnect_delay = 2000;
    }, _this.errorCallBack.bind(_this));
  }

  _disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log("Disconnected");
  }

  // on error, schedule a reconnection attempt
  errorCallBack(error: any) {
    console.log("Error is coming");
    console.log("errorCallBack -> " + error);
  }

  /**
   * Send message to sever via web socket
   * @param {*} message
   */
  _send(message: any) {
    console.log("calling logout api via web socket");
    this.stompClient.send("/app/hello", {}, JSON.stringify(message));
  }

  onMessageReceived(message: any) {
    console.log("Message Recieved from Server :: " + message);
    const jsonString: string = `${message.body}`;
    const contentValue: string = jsonString;
  }
}
