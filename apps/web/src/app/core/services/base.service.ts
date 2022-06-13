import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  protected baseUrl: string;

  public constructor(protected http: HttpClient) {
  }

  public find<T>(options?: any): Observable<T[]> {
    return this.http.get<T[]>(
      this.baseUrl,
      {
        params: this.getParams(options)
      });
  }

  public findById<T>(id: string): Observable<T> {
    return this.http.get<T>(this.baseUrl + '/' + id);
  }

  public create<T, K>(model: T): Observable<K> {
    return this.http.post<K>(this.baseUrl, model);
  }

  public update<T extends { id?: string }, K>(model: T): Observable<K> {
    return this.http.put<K>(this.baseUrl + '/' + model.id, model);
  }

  public deleteById<T>(id: string): Observable<T> {
    return this.http.delete<T>(this.baseUrl + '/' + id);
  }

  protected getParams(options: any) {
    const params = {};
    if (options) {
      Object.entries(options).map((o) => {
        params[o[0]] = o[1];
      });
    }
    return params;
  }

}
