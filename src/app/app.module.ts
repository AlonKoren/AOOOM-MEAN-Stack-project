import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {AngularMaterialModule} from './angular-material.module';
import {PostsModule} from './posts/posts.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HeaderComponent} from './header/header.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptor} from './auth/auth-interceptor';
import {ErrorInterceptor} from './error-interceptor';
import {ErrorComponent} from './error/error.component';
import {CommentsModule} from './comments/comments.module';
import {WebSocketModule} from './web-socket/web.socket.module';
import {MapMdoule} from './map/map.mdoule';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatGoogleMapsAutocompleteModule} from '@angular-material-extensions/google-maps-autocomplete';
import {PiechartDirective} from './d3-graph/piechart.directive';
import {UserActivityLevelComponent} from './user_activity_level/user_activity_level.component';
import {DuplicatesInTitlesComponent} from './duplicates_in_titles/duplicates_in_titles.component';
import {FooterComponent} from './footer/footer.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        ErrorComponent,
        PiechartDirective,
        UserActivityLevelComponent,
        DuplicatesInTitlesComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    PostsModule,
    CommentsModule,
    MapMdoule,
    WebSocketModule,
    MatGoogleMapsAutocompleteModule,
    FlexLayoutModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
    ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
