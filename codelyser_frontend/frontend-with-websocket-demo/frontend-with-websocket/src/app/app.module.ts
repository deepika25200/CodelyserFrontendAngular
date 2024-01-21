import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MonacoEditorComponent } from './monaco-editor/monaco-editor.component';
import { FileExplorerComponent } from './file-explorer/file-explorer.component';
import { LiveServerComponent } from './live-server/live-server.component';
import { NgxFileDropModule } from 'ngx-file-drop';
// import { provideHttpClient } from '@ngneat/overview';
import { HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTreeModule } from '@angular/material/tree';
import { SharedDataService } from './shared-data.service';

import { MiddleComponent } from './middle/middle.component';
import { HeaderComponent } from './header/header.component';



@NgModule({
  declarations: [
    AppComponent,
    MonacoEditorComponent,
    FileExplorerComponent,
    LiveServerComponent,
    MiddleComponent,
    HeaderComponent,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgxFileDropModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatTreeModule,

  ],
  providers: [
    provideClientHydration(),
    LiveServerComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
}