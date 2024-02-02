import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CompilecodeService {
  private runCodeSubject = new Subject<FormData>();
  runCodeObservable$ = this.runCodeSubject.asObservable();
  triggerRunCode(code: string,filename:string) {
    const codeandfilename: FormData = new FormData();
    codeandfilename.append(filename,code);
    this.runCodeSubject.next(codeandfilename);
  }
}