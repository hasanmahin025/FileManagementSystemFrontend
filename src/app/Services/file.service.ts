import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileItem } from './models/models';
import { environment } from './environment';
@Injectable({
  providedIn: 'root'
})
export class FileService {
 private base = `${environment.apiUrl}/api/file-management`

  constructor(private http: HttpClient) {}

  // Upload a file
  uploadFile(file: File, folderId: number | null, notes: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderId', folderId?.toString() ?? '');
    formData.append('notes', notes);

    return this.http.post(`${this.base}/add`, formData);
  }

  //Update full file (PUT)
 updateFile(fileId: number, file: File) { 
  const formData = new FormData(); formData.append('file', file); 
  return this.http.put(`${this.base}/update/${fileId}`, formData); 
 }

  //Update file info (PATCH)
 updateFileInfo(
  fileId: number,
  folderId: number | null,
  phoneNumber: string,
  notes: string,
  isPrivate: boolean
) {
  const body = {
    folderId,
    phoneNumber,
    notes,
    isPrivate
  };

  return this.http.patch(`${this.base}/update-info/${fileId}`, body);
}


  //Download file
  downloadFile(fileId: number): Observable<Blob> {
    return this.http.get(`${this.base}/download/${fileId}`, { responseType: 'blob' });
  }

  //Delete file
  deleteFile(fileId: number): Observable<any> {
    return this.http.delete(`${this.base}/${fileId}`);
  }

 
}
