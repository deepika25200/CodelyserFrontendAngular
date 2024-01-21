import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MonacoEditorService } from './monaco-editor.service';
declare const monaco: any;
@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private htmlCodeSubject = new BehaviorSubject<string>('');
  private cssCodeSubject = new BehaviorSubject<string>('');

  htmlCode$ = this.htmlCodeSubject.asObservable();
  cssCode$ = this.cssCodeSubject.asObservable();

  updateHtmlCode(htmlCode: string): void {
    this.htmlCodeSubject.next(htmlCode);
  }

  updateCssCode(cssCode: string): void {
    this.cssCodeSubject.next(cssCode);
  }
}
