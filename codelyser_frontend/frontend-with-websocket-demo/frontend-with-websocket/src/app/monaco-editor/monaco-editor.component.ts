// src/app/monaco-editor/monaco-editor.component.ts
import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MonacoEditorService } from '../monaco-editor.service';
import { SharedDataService } from '../shared-data.service';
import { HttpClient } from '@angular/common/http';
import { log } from 'console';
import { Subscription } from 'rxjs';

declare const monaco: any;

@Component({
  selector: 'app-monaco-editor',
  templateUrl: './monaco-editor.component.html',
  styleUrls: ['./monaco-editor.component.scss']
})
export class MonacoEditorComponent implements OnInit, OnDestroy {

@ViewChild('editorContainer') editorContainer!: ElementRef;

private editor: any;

private messageSubscription!: Subscription;
compilecode!:string;
 
@Output() runCodeClicked = new EventEmitter<{ livecode: string}>();

constructor(private monacoService: MonacoEditorService) {}



ngOnInit() {
  this.monacoService.initMonaco().then(() => {
    this.editor = monaco.editor.create(this.editorContainer.nativeElement, {
      value: '',
      language: 'plaintext', // Default language mode
      theme: 'vs-dark'
    });
  });
}

ngOnDestroy() {
  if (this.editor) {
    this.editor.dispose();
  }
}

setEditorContent(content: string, language: string) {

  console.log("content "+content);
  console.log(language);
  
  if (this.editor) {
    this.editor.setValue(content);
    this.editor.getModel()?.updateOptions({ language });
    // monaco.editor.setModelLanguage(this.editor.getModel(), language);
  }
  console.log('Editor content set:', content);
}

getEditorContent(): string {
  return this.editor?.getModel()?.getValue() || '';
}

runCode() {
  const code = this.editor.getValue();
  //const fileType = this.getSelectedLanguage();
      this.runCodeClicked.emit({livecode:code})
}


//
// clearEditorContent(): void {
//   // Clear the content of the Monaco Editor
//   if (monaco && monaco.editor) {
//     const editor = monaco.editor.getModels()[0]; // Adjust this line based on your actual setup
//     editor.setValue(''); // Set an empty string to clear the content
//   }
// }

}