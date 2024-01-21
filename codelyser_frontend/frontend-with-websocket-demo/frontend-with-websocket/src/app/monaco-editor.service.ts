// src/app/monaco-editor.service.ts
import { Injectable } from '@angular/core';

declare const monaco: any;

@Injectable({
  providedIn: 'root'
})
export class MonacoEditorService {
  initMonaco() {
    return new Promise<void>((resolve) => {
      if ((window as any).monaco) {
        resolve();
        return;
      }

      const onGotAmdLoader = () => {
        // Load monaco
        (window as any).require.config({ paths: { 'vs': 'assets/monaco-editor/min/vs' } });
        (window as any).require(['vs/editor/editor.main'], () => {
          resolve();
        });
      };

      // Load AMD loader if necessary
      if (!(window as any).require) {
        const loaderScript = document.createElement('script');
        loaderScript.type = 'text/javascript';
        loaderScript.src = 'assets/monaco-editor/min/vs/loader.js';
        loaderScript.onload = onGotAmdLoader;
        document.body.appendChild(loaderScript);
      } else {
        onGotAmdLoader();
      }
    });
  }
}
