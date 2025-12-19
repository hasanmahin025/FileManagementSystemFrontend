import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "./environment";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'

})

export class Sharing {
  constructor(private http: HttpClient) { }

  private base = `${environment.apiUrl}/api/share`

  sharedfileByUserId(fileId: number): Observable<any> {
    return this.http.post(`${this.base}/file/${fileId}`, {})
  }

  getFileShare(fileId: number): Observable<any> {
    return this.http.get(`${this.base}/file/${fileId}`)
  }

  sharedByEmail(fileId: number, payload: any): Observable<any> {
    return this.http.post(`${this.base}/file/${fileId}/email`, payload)
  }

  deleteUnsharedFile(fileId: number, sharedWithUserId: number): Observable<any> {
    return this.http.delete(`${this.base}/file/${fileId}/user/${sharedWithUserId}`)
  }

  sharedFolderByUserId(folderId: number, payload: any): Observable<any> {
    return this.http.post(`${this.base}/folder/${folderId}`, payload)
  }

  getFolderShare(folderId: number): Observable<any> {
    return this.http.get(`${this.base}/folder/${folderId}`)
  }

  sharedFolderByEmail(folderId: number, payload: any): Observable<any> {
    return this.http.post(`${this.base}/folder/${folderId}/email`, payload)
  }

  deleteUnshareFolder(folderId: number, sharedfileByUserId: Number): Observable<any> {
    return this.http.delete(`${this.base}/folder/${folderId}/user/${sharedfileByUserId}`)
  }
  iteamShareWithme(): Observable<any> {
    return this.http.get(`${this.base}/with-me`)
  }
  getIteamSharedByme(): Observable<any> {
    return this.http.get(`${this.base}/by-me`)
  }

  getSharableUser(searchTerm: string): Observable<any> {
    return this.http.get(`${this.base}/users`, {
      params: {
        search: searchTerm
      }
    })
  }


}