import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "./environment";
import { Observable } from "rxjs";
import { TrashResponse } from "./models/models";

@Injectable({
    providedIn: 'root'
})
export class Trash{
    constructor(private http: HttpClient){}
    private base = `${environment.apiUrl}/trash`
   getTrashItem():Observable<TrashResponse>{
    return this.http.get<TrashResponse>(this.base)
   }
   downloadFileFormTrash(fileId: number):Observable<Blob>{
    return this.http.get(`${this.base}/${fileId}/download`,
        {responseType:'blob'}
    )
   }
   restoreFile(fileId: number): Observable<{message: string}>{
    return this.http.post<{message:string}>(`${this.base}/restore/file/${fileId}` , {})  


   }
   restoreFolder(folderId: number): Observable<{message: string}>{
    return this.http.post<{message:string}>(`${this.base}restore/folder/${folderId}`, {})
   }
   permanentDeleteFile(fileId: number):Observable<{message: string}>{
    return this.http.delete<{message:string}>(`${this.base}/file/${fileId}/permanent`)
   }
   permanentDeleteFolder(folderId:number):Observable<{message:string}>{
    return this.http.delete<{message:string}>(`${this.base}/folder/${folderId}/permanent`)
   }
   emptyTrash():Observable<{message:string}>{
    return this.http.delete<{message:string}>(`${this.base}/empty`)
   }
   deleteFileRecord(fileId:number):Observable<{message:string}>{
    return this.http.delete<{message:string}>(`${this.base}/file/${fileId}`)
   }
   deleteFolderRecord(folderId:number):Observable<{message:string}>{
    return this.http.delete<{message:string}>(`${this.base}/folder/${folderId}`)
   }
   downloadFileFromTrashToDevice(fileId: number, fileName: string): void {
    this.downloadFileFormTrash(fileId).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }
}