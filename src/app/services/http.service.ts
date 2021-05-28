import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { forkJoin, Observable } from 'rxjs';
import { Game, APIReposnse } from '../models';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  getGameList(ordering: string, search?: string): Observable<APIReposnse<Game>> {
    let params = new HttpParams().set('ordering', ordering);

    if(search) {
      params = new HttpParams().set('ordering', ordering).set('search', search);
    }

    return this.http.get<APIReposnse<Game>>(`${env.BASE_URL}/games`, {
      params: params
    });
  }

  getGameDetails(id: string): Observable<Game> {
    const gameInfoRequest = this.http.get(`${env.BASE_URL}/games/${id}`);
    const gameTrailerRequest = this.http.get(`${env.BASE_URL}/${id}/movies`);
    const gameScreenshotsRequest = this.http.get(`${env.BASE_URL}/${id}/screenshots`);

    return forkJoin({gameInfoRequest, gameScreenshotsRequest, gameTrailerRequest}).pipe(map((resp: any) => {
      return {
        ...resp['gameInfoRequest'],
        screenshots: resp['gameScreenshotsRequest']?.results,
        trailers: resp['gameTrailersRequest']?.results
      };
    }));
  }
}