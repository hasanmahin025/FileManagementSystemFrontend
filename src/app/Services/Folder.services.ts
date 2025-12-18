import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FolderModel } from './models/models';
import { environment } from './environment';

@Injectable({
  providedIn: 'root'
})
export class FolderService {

  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/folders`

  //cretae folder
  createFolder(name: string, description?: string, parentFolderId: number | null = null): Observable<FolderModel> {
    const payload: any = {
      name: name,
      description: description && description.trim().length > 0 ? description : null,
      parentFolderId: parentFolderId
    };

    console.log('Folder payload:', payload);

    return this.http.post<FolderModel>(`${this.base}`, payload);
  }


  //Get user's folders
  getFolders(parentFolderId?: number | null): Observable<FolderModel[]> {
    const params: any = {};
    if (parentFolderId !== undefined) params.parentFolderId = parentFolderId;

    return this.http.get<FolderModel[]>(`${this.base}`, { params });
  }

  //Get folder by ID
  getFolderById(folderId: number): Observable<FolderModel> {
    return this.http.get<FolderModel>(`${this.base}/${folderId}`);
  }

  //Update folder (rename or update description)
  updateFolder(folderId: number, name: string, description?: string): Observable<FolderModel> {
    const payload: any = { name };
    if (description) payload.description = description;

    return this.http.put<FolderModel>(`${this.base}/${folderId}`, payload);
  }

  deleteFolder(folderId: number, recursive: boolean = false): Observable<{ message: string }> {

    const params = { recursive: recursive.toString() }

    return this.http.delete<{ message: string }>(`${this.base}/${folderId}`, { params })

  }

  getFolderContents(folderId: number): Observable<any> {
    return this.http.get<any>(`${this.base}/${folderId}/contents`)
  }
  getRootFolders(): Observable<FolderModel[]> {
    return this.http.get<FolderModel[]>(`${this.base}/root`)
  }

  getFolderTree(): Observable<FolderModel[]> {
    return this.http.get<FolderModel[]>(`${this.base}/tree`)
  }

  moveFolder(folderId: number, newParentFolderId?: number | null): Observable<FolderModel> {

    const payload: any = { newParentFolderId: newParentFolderId ?? null }
    return this.http.put<FolderModel>(`${this.base}/${folderId}/move`, payload);
  }
}
