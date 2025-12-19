import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "./environment";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class TrashManagement{
    constructor(private http: HttpClient){}

    private base = `${environment.apiUrl}/api/`

    getTrashItem():Observable<any>{
        return this.http.get(`${this.base}/trash`)
    }

    downloadTrashFile(fileId: number): Observable<any>{
        return this.http.get(`${this.base}/trash/file/${fileId}/download`,{
            responseType: 'blob'
        })
    }
    restoreAfileFromTrash(fileId: number): Observable<any>{
        return this.http.post(`${this.base}/trash/restore/file/${fileId}` , {})
    }

    
    restoreAfolderFromTrash(folderId: number): Observable<any>{
        return this.http.post(`${this.base}/trash/restore/folder/${folderId}`, null)
    }

    deleteFilePermanetFromTrash(fileId: number): Observable<any>{
        return this.http.delete(`${this.base}/trash/file/${fileId}/permanent`)
    }

    deleteFolderParmanentFromTrash(folderId : number): Observable<any>{
        return this.http.delete(`${this.base}/trash/folder/${folderId}/permanent`)
    }

    emptyTrash():Observable<any>{
       return this.http.delete(`${this.base}/trash/empty`)
    }

    deleteFileRecordFromTrash(fileId : number): Observable<any>{
        return this.http.delete(`${this.base}/trash/file/${fileId}`)
    }
    deleteFolderRecordFromTrash(folderId: number): Observable<any>{
        return this.http.delete(`${this.base}/trash/folder/${folderId}`)
    }




}