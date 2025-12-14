import { Injectable } from "@angular/core";
import { environment } from "./environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";
import { FileItem } from "./models/models";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private base = `${environment.apiUrl}/api/file-management`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  // Upload File: phoneNumber is REQUIRED
  uploadFile(file: File, phoneNumber: string, folderId?: number | null, notes?: string): Observable<FileItem> {
    if (!phoneNumber || phoneNumber.trim().length === 0) {
      throw new Error('phoneNumber is required for uploadFile');
    }

    const form = new FormData();
    form.append('File', file);
    form.append('PhoneNumber', phoneNumber.trim());
    form.append('FolderId', folderId == null ? '' : String(folderId));
    if (notes != null && notes.trim().length > 0) form.append('Notes', notes.trim());

    const token = this.auth.getAcessToken();
    const headers = token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : undefined;

    return this.http.post<FileItem>(`${this.base}/add`, form, { headers });
  }

  // Update File Info: phoneNumber OPTIONAL
  updateFileInfo(
    fileId: number,
    folderId?: number | null,
    phoneNumber?: string,
    notes?: string,
    isPrivate?: boolean
  ): Observable<FileItem> {
    const payload: any = {};
    if (folderId !== undefined) payload.folderId = folderId;
    if (phoneNumber !== undefined) payload.phoneNumber = phoneNumber; // optional
    if (notes !== undefined) payload.notes = notes;
    if (isPrivate !== undefined) payload.isPrivate = isPrivate;

    const token = this.auth.getAcessToken();
    const headers = token ? new HttpHeaders({ 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }) : new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.patch<FileItem>(`${this.base}/update-info/${fileId}`, payload, { headers });
  }

  // Download File
  downloadFile(fileId: number): Observable<Blob> {
    const token = this.auth.getAcessToken();
    const headers = token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : undefined;
    return this.http.get(`${this.base}/download/${fileId}`, { headers, responseType: 'blob' });
  }

  // Delete File
  deleteFile(fileId: number, notes?: string): Observable<{ message: string }> {
    const token = this.auth.getAcessToken();
    const headers = token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : undefined;

    const params = notes ? new HttpParams().set('notes', notes) : undefined;
    return this.http.delete<{ message: string }>(`${this.base}/${fileId}`, { headers, params });
  }

  // Stream File
  streamFile(fileId: number): Observable<Blob> {
    const token = this.auth.getAcessToken();
    const headers = token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : undefined;
    return this.http.get(`${this.base}/stream/${fileId}`, { headers, responseType: 'blob' });
  }

  // Presigned URL
  getPresignedUrl(fileId: number): Observable<{ url: string }> {
    const token = this.auth.getAcessToken();
    const headers = token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : undefined;
    return this.http.get<{ url: string }>(`${this.base}/presigned-url/${fileId}`, { headers });
  }
}
 