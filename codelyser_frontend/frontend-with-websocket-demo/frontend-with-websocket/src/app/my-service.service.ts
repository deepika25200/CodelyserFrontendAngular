import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MyServiceService {
  constructor(private http: HttpClient) {
    // Enable fetch for HttpClient
    (this.http as any).useFetch = true;
  }

  // Your service methods using HttpClient
}
