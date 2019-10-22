import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'PillApp';

  public activeLang = 'es';

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang(this.activeLang);
    this.translate.use('es');

  }
}
