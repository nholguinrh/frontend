import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TopographyService {
  constructor(private http: HttpClient) {}

  getTopographyData(): Observable<any> {
    const topoDataURL =
      'https://gist.githubusercontent.com/leenoah1/535b386ec5f5abdb2142258af395c388/raw/a045778d28609abc036f95702d6a44045ae7ca99/geo-data.json';
      /* const topoDataURL = 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson';  */
    return this.http.get(topoDataURL);
  }
}