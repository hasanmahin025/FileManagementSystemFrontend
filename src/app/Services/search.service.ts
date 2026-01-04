import { Injectable } from "@angular/core";
import { environment } from "./environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { FileResponse, SearchRequest, SearchResponse } from "./models/models";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class Search{
    private base = `${environment.apiUrl}/search`

    constructor(private http: HttpClient){}

    search(request : SearchRequest):Observable<SearchResponse>{
        let params = new HttpParams();
        if(request.query){
            params = params.set('query' , request.query)
        }
        if(request.phoneNumber){
            params = params.set('phoneNumber', request.phoneNumber)
        }
        if(request.folderId !== undefined){
            params = params.set('folderId', request.folderId.toString())
        }
        if(request.userId !== undefined){
            params = params.set('userId', request.userId.toString())
        }
        if(request.includeFiles !== undefined){
            params = params.set('includeFiles', request.includeFiles.toString())
        }
        if(request.includeFolders !== undefined){
            params = params.set('includeFolders', request.includeFolders.toString())
        }
        if(request.contentType){
            params = params.set('contentType', request.contentType)
        }
        if(request.fromDate){
            params = params.set('fromDate', request.fromDate)
        }
        if(request.toDate){
            params = params.set('toDate', request.toDate)
        }
        if(request.pageNumber !== undefined){
           params = params.set('pageNumber', request.pageNumber.toString())
        }
        if(request.pageSize !== undefined){
            params = params.set('pageSize', request.pageSize.toString())
        }
        if(request.sortBy){
            params = params.set('sortBy',request.sortBy)
        }
        if(request.sortAscending !== undefined){
            params = params.set('sortAscending', request.sortAscending.toString())
        }
        return this.http.get<SearchResponse>(this.base , {params})

    }
    searchByPhoneNumber(phoneNumber: string): Observable<FileResponse[]>{
       return this.http.get<FileResponse[]>(`${this.base}/by-phone/${phoneNumber}`)
    }
    searchInFolder(folderId: number , query?: string): Observable<SearchResponse>{
        let params = new HttpParams();
        if(query){
            params = params.set('query', query)
        }
        return this.http.get<SearchResponse>(`${this.base}/in-folder/${folderId}`, {params})
    }
    searchByUser(userId : number , query?: string):  Observable<SearchResponse>{
        let params = new HttpParams();
        if(query){
            params = params.set('query' , query)
        }
        return this.http.get<SearchResponse>(`${this.base}/by-user/${userId}`, {params})
    }
}