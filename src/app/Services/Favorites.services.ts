import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "./environment";
import { Favorites } from "./models/models";


@Injectable ({
    providedIn:'root'
})

export class FavoritesServices{

    constructor(private http: HttpClient){}
    private base = `${environment}/api/favorites`
     
    getFavorite(): Observable<Favorites[]>{

        return this.http.get<Favorites[]>(`${this.base}`)

    }

    addFavorite(favorite: {fileId : number | null , folderId: number | null}): Observable<any>{
         return this.http.post(`${this.base}` , favorite)
    }

    checkFavourite(C: {fileId: number | null , folderId: number | null}): Observable<any>{
        return this.http.get(`${this.base}/check`, 
            {
                params:{
                   fileId: C.fileId?.toString() ?? '',
                   folderId: C.folderId?.toString()?? ''
                }
            }
        )
        
    }

    deleteFavouriteById(folderId: number):Observable<any>{
        return this.http.delete(`${this.base}/${folderId}`)
    }

    deleteByFile(Item: {folderId: number | null , fileId: number | null}) : Observable<any>{
        return this.http.delete(`${this.base}/item`,
            {
                params:{
                    folderId : Item.folderId?.toString() ?? '',
                    fileId: Item.fileId?.toString()?? ''
                }
            }
        )
    }


}