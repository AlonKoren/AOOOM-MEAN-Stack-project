import { Component, OnInit } from '@angular/core';
import { Subscription, of } from 'rxjs';
declare const Clock: any;

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  title = 'angular-image-viewer';
  constructor() {
    this.loadScripts();
  }

  ngOnInit(): void {
  }

  loadScripts() {
    const externalScriptArray = [
      '../../assets/scripts/clock.js',
      '../../assets/scripts/weather.js'
    ];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < externalScriptArray.length; i++) {
      const scriptTag = document.createElement('script');
      scriptTag.src = externalScriptArray[i];
      scriptTag.type = 'text/javascript';
      scriptTag.async = false;
      scriptTag.charset = 'utf-8';
      document.getElementsByTagName('head')[0].appendChild(scriptTag);
    }
  }
}
