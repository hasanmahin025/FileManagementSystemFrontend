import { Injectable } from "@angular/core";
import { environment } from "./environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { ShareableUser, ShareByEmailRequest, SharedItem, ShareRequest, ShareResponse } from "./models/models";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class Sharing{
  private base = `${environment}/share`
  constructor(private http: HttpClient){}

  shareFile(fileId: number , request: ShareRequest): Observable<ShareResponse>{
    return this.http.post<ShareResponse>(`${this.base}/file/${fileId}`, request)
  }
  shareFileByEmail(fileId: number , request: ShareByEmailRequest):Observable<ShareResponse>{
    return this.http.post<ShareResponse>(`${this.base}/${fileId}/email`, request)
  }
  shareFolderByUserId(folderId: number , request:ShareRequest): Observable<ShareResponse>{
    return this.http.post<ShareResponse>(`${this.base}/folder/${folderId}`, request)
  }
  shareFolderByEmail(folderId: number , request: ShareByEmailRequest): Observable<ShareResponse>{
    return this.http.post<ShareResponse>(`${this.base}/folder/${folderId}/email`, request)
  }
  getFileShares(fileId: number): Observable<ShareResponse[]>{
    return this.http.get<ShareResponse[]>(`${this.base}/file/${fileId}`)
  }
  getFolderShares(folderId: number): Observable<ShareResponse[]>{
    return this.http.get<ShareResponse[]>(`${this.base}/folder/${folderId}`)
  }
  getItemSharedWithMe():Observable<SharedItem[]>{
    return this.http.get<SharedItem[]>(`${this.base}/with-me`)
  }
  getItemSharedByMe():Observable<SharedItem[]>{
    return this.http.get<SharedItem[]>(`${this.base}/by-me`)
  }

  sharableUsers(searchTerm?: string): Observable<ShareableUser[]>
  {
    let params = new HttpParams();
    if(searchTerm){
      params = params.set('searchTerm', searchTerm)
    }
    return this.http.get<ShareableUser[]>(`${this.base}/users`, {params})
  }
  unshareFile(fileId: number , sharedWithUserId: number): Observable<{message: string}>{
    return this.http.delete<{message: string}>(`${this.base}/file/${fileId}/user/${sharedWithUserId}`)
  }
  unshareFolder(folderId: number , sharedWithUserId: number): Observable<{message: string}>{
    return this.http.delete<{message: string}>(`${this.base}/folder/${folderId}/user/${sharedWithUserId}`)
  }



}