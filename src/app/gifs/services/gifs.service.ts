import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_KEY } from 'env.variables';
import { Gif, SearchGifsResponse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private apiKey: string = API_KEY
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs'
  private _historial: string[] = []

  public results: Gif[] = []

  constructor (private http: HttpClient) { 
    this._historial = JSON.parse(localStorage.getItem('historial')!) || []
    this.results = JSON.parse(localStorage.getItem('results')!) || []
  }

  get historial () {
    return [ ...this._historial ]
  }

  searchGift (query: string = '') {
    query = query.trim().toLowerCase()

    if (!this._historial.includes(query)) {
      this._historial.unshift(query)
      this._historial = this._historial.splice(0, 10)
      localStorage.setItem('historial', JSON.stringify(this._historial))
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('q', query)
      .set('limit', '10')

    this.http.get<SearchGifsResponse>(`${this.serviceUrl}/search`, { params })
      .subscribe((response) => {
        this.results = response.data
        localStorage.setItem('results', JSON.stringify(this.results))
      })
  }
}
