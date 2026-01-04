import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "./environment";
import { Observable } from "rxjs";
import { FileResponse, FileUpdateInfoRequest } from "./models/models";

@Injectable({
    providedIn: 'root'
})
export class FileService{
    constructor(private http: HttpClient){}
    private base = `${environment.apiUrl}/file-management`;


    uploadFile(file : File , folderId?: number | null , notes?: string): Observable<FileResponse>{
        const formData = new FormData();

        formData.append('File' , file);
        if(folderId !== undefined && folderId !== null){
            formData.append('FolderId' , folderId.toString());
        }
        if(notes){
            formData.append('Notes' , notes);
        }
        return this.http.post<FileResponse>(`${this.base}/add`,formData);
    }
    updateFile(fileId: number , folderId?: number | null , notes?: string): Observable<FileResponse>{
        const formData = new FormData();
        if(folderId !== undefined && folderId !== null){
            formData.append('FolderId', folderId.toString())

        }
        if(notes){
            formData.append('Notes', notes);
        }
        return this.http.put<FileResponse>(`${this.base}/update/${fileId}`, formData);
    }
    updateFileInfo(fileId : number , request: FileUpdateInfoRequest):Observable<FileResponse>{
        return this.http.patch<FileResponse>(`${this.base}/update-info/${fileId}`, request)
    }
    downloadFile(fileId: number):Observable<Blob>{
        return this.http.get(`${this.base}/download/${fileId}`, {responseType: 'blob' as 'blob'})
    }

    deleteFile(fileId: number , notes?: string): Observable<{message: string}>{
        let params = new HttpParams();
        if(notes){
            params = params.set('notes' , notes)
        }
        return this.http.delete<{message: string}>(`${this.base}/${fileId}`, {params})
    }


   downloadFileToDevice(fileId: number , fileName: string): void{
    this.downloadFile(fileId).subscribe(blob =>{
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url)
    });
   }



}