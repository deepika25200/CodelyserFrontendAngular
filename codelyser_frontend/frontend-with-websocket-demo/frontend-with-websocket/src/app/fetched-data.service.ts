import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { log } from 'console';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FetchedDataService {

  private baseUrl = 'http://localhost:8080'; // Update this with your server URL

  constructor(private http: HttpClient) {}

  getProjectStructure(): Observable<any> {
    const url = `${this.baseUrl}/api/project-structure`;
    return this.http.get(url);
  }
  getFileContent(filePath: string): Observable<any> {
    const requestData = { filepath: filePath };
    console.log(filePath);
    return this.http.post<any>(`${this.baseUrl}/api/project-structure/explorer/file-content`, requestData);
  }

  // getFileContent(filePath: string): Observable<any> {
  //   const requestData = { filePath };
  //   const url = `${this.baseUrl}/api/project-structure/explorer/file-content`;
  //   console.log(requestData);
  //   return this.http.post(url,requestData);
  // }

  
}
