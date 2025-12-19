import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "./environment";
import { Observable } from "rxjs";
import { SearchFileAndFolder } from "./models/models";

@Injectable({
    providedIn: 'root'
})

export class Search{
    constructor(private http: HttpClient){}

    private base = `${environment.apiUrl}/api/search`

    searchFileAndFolder(req: SearchFileAndFolder):Observable<any>{
        return this.http.get(`${this.base}`,{
            params:{
                ...req
            }
        })
    }

    searchByPhoneNumber(req: SearchFileAndFolder):Observable<any>{
        return this.http.get(`${environment}/by-phone/${req.PhoneNumber}`,{
            params:{
              pageNumber: req.PageNumber?.toString()?? '',
              pageSize: req.PageSize?.toString()?? ''
            }
        })
    }

    searchfileAndFolder(req: SearchFileAndFolder):Observable<any>{
        return this.http.get(`${this.base}/in-folder/${req.FolderId}}`, {
            params:{
                query: req.Query?.toString()?? '',
                pagenumber: req.PageNumber?.toString()?? '',
                pageSize: req.PageSize?.toString()??''
            }
        })
    }
    
    searchByUserId(req: SearchFileAndFolder):Observable<any>{
        return this.http.get(`${this.base}/by-user/${req.UserId}`,{
            params:{
                query: req.Query?.toString()?? '',
                pageNumber:req.PageNumber?.toString()??'',
                pageSize: req.PageSize?.toString()??''
            }
        })
    }



}