import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { WebSocketService } from '../services/web-socket.service';

@Component({
  selector: 'app-live-server',
  templateUrl: './live-server.component.html',
  styleUrls: ['./live-server.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class LiveServerComponent {
  flag=false;
  backendresponse=false;
  websocketservice!:WebSocketService;
  constructor() {
    this.websocketservice=new WebSocketService(this);
  }

  ngOnInit(): void {
    this.websocketservice._connect();
    this.websocketservice.stompClient.subscribe("/topic/greetings", (sdkEvent: any) => {
      console.log("Received from Server");
      this.websocketservice.onMessageReceived(sdkEvent);
    });
  }
  onRunCodeClicked(event: { livecode: string }) {
    this.websocketservice._send(event.livecode);
    setTimeout(()=>{
      if(this.backendresponse){
        this.flag=true;}
    },20000);
}
}
