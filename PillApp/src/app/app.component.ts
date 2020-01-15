import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessagingService } from './services/messaging.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'PillApp';

  public activeLang = 'es';
  message;
  constructor(private translate: TranslateService, private messagingService: MessagingService) {
    this.translate.setDefaultLang(this.activeLang);
    this.translate.use('es');
  }

  ngOnInit(){
    this.messagingService.getPermission();
    this.messagingService.receiveMessage();
    this.message = this.messagingService.currentMessage;
  }
}
