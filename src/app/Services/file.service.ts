import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "./environment";
import { firstValueFrom, Observable } from "rxjs";
import { FileItem } from "./models/models";

@Injectable({
  providedIn: 'root'
})

export class FileServices {
  constructor(private http: HttpClient) { }

  private base = `${environment.apiUrl}/api/file-management`

  uploadFile(file: File, folderId: number, notes?: string): Observable<FileItem> {
    const form = new FormData();
    form.append('File', file);
    form.append('FolderId', String(folderId));
    if (notes?.trim()) {
      form.append('Notes', notes.trim())
    }
    return this.http.post<FileItem>(`${this.base}/add`, form)
  }

  updateFile(fileId: number, file: File, folderId?: number, notes?: string): Observable<FileItem> {
    const form = new FormData();
    form.append('File', file);
    if (folderId !== undefined) {
      form.append('FolderId', String(folderId));
    }
    if (notes?.trim()) {
      form.append('Notes', notes.trim());
    }

    return this.http.put<FileItem>(`${this.base}/update/${fileId}`, form)

  }

  updateFileInfo(fileId: number, get: { folderId?: number, phoneNumber?: string, notes?: string, isPrivate?: boolean }): Observable<FileItem> {

    const payload: Partial<{ folderId: number, notes: string, phoneNumber: string, isPrivate: boolean }> = {}
    if (typeof get.folderId === 'number'){ 
        payload.folderId = get.folderId; 
      }
    if (get.phoneNumber?.trim()) {
      payload.phoneNumber = get.phoneNumber.trim();
    }
    if (get.notes?.trim()) {
      payload.notes = get.notes.trim();
    }
    if (typeof get.isPrivate === 'boolean') {
      payload.isPrivate = get.isPrivate
    }
    return this.http.patch<FileItem>(`${this.base}/update-info/${fileId}`, payload)

  }

  downloadFile(fileId: number): Observable<Blob>{
    return this.http.get(`${this.base}/download/${fileId}`,{responseType: 'blob'})
  }

  async deleteFiles(fileId: number , notes?: string): Promise<FileItem>{
     
    let params = new HttpParams();
    if(notes?.trim()){
      params = params.set('notes' , notes.trim())
    }

    return firstValueFrom(
      this.http.delete<FileItem>(`${this.base}/${fileId}`,{params})
    )

  }



}