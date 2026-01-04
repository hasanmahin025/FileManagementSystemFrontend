import { Injectable } from "@angular/core";
import { environment } from "./environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { AddFavouriteRequest, FavouriteCheckResponse, FavouriteResponse } from "./models/models";

@Injectable({
    providedIn: 'root'
})
export class Favourite{
    private base = `${environment}/favorites`
    constructor(private http: HttpClient){}
   
    getFavourites(): Observable<FavouriteResponse[]>{
        return this.http.get<FavouriteResponse[]>(this.base)
    }
    checkedFavourite(fileId?: number , folderId?: number): Observable<FavouriteCheckResponse>{
        let params = new HttpParams();
        if(fileId !== undefined){
            params = params.set('fileId', fileId.toString())
        }
        if(folderId !== undefined){
            params = params.set('folderId' , folderId.toString())
        }
        return this.http.get<FavouriteCheckResponse>(`${this.base}/check`, {params})
    }
    addFavorite(request: AddFavouriteRequest): Observable<FavouriteResponse>{
        return this.http.post<FavouriteResponse>(this.base , request)
    }
    removeFavorite(favoriteId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/${favoriteId}`);
    }

    removeFavoriteByItem(fileId?: number, folderId?: number): Observable<{ message: string }> {
    let params = new HttpParams();

    if (fileId !== undefined) {
      params = params.set('fileId', fileId.toString());
    }

    if (folderId !== undefined) {
      params = params.set('folderId', folderId.toString());
    }

    return this.http.delete<{ message: string }>(`${this.base}/item`, { params });
  }
  
     
  

}