import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "./environment";
import { FileItem, FolderModel } from "./models/models";
import { firstValueFrom } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class FolderService {

  constructor(private http: HttpClient) { }

  private base = `${environment.apiUrl}/api/folders`

  async createFolder(name: string, description?: string, parentFolderId: number | null = null): Promise<FolderModel> {
    const payload = {
      name,
      description: description?.trim() ? description.trim() : null
      ,
      parentFolderId

    };
    return  firstValueFrom(
      this.http.post<FolderModel>(`${this.base}`, payload)
    )
  }

  async getFolders(parentFolderId?: number | null): Promise<FolderModel[]> {

    let params = new HttpParams();
    if (parentFolderId != null) {
      params = params.set('parentFolderId', String(parentFolderId))
    }
    return  firstValueFrom(
      this.http.get<FolderModel[]>(this.base, { params })
    )

  }

  async getFolderById(folderId: number): Promise<FolderModel> {
    return  firstValueFrom(
      this.http.get<FolderModel>(`${this.base}/${folderId}`)
    )
  }

  async updateFolder(folderId: number, data: { name?: string | null, description?: string | null }): Promise<FolderModel> {
    const payload: Partial<{ name: string; description: string | null }> = {
      
    }
    if (data.name?.trim()) {
      payload.name = data.name.trim()
    }
    if (data.description?.trim()) {
      payload.description = data.description.trim()
    }
    if (Object.keys(payload).length === 0) {
      throw new Error('Nothing to Update')
    }
    return  firstValueFrom(this.http.put<FolderModel>(`${this.base}/${folderId}`, payload)
    )
  }

  async deleteFolder(folderId: number, recursive: boolean = false): Promise<{ message: string }> {
    const params = new HttpParams().set('recursive', recursive.toString())

    return  firstValueFrom(
      this.http.delete<{ message: string }>(`${this.base}/${folderId}`, { params })
    )

  }

  async getFolderContent(folderId: number): Promise<{ subFolders: FolderModel[]; files: FileItem[]; breadcrumbs: { id: number; name: string }[]; }> {

    return  firstValueFrom(
      this.http.get<{ subFolders: FolderModel[]; files: FileItem[]; breadcrumbs: { id: number; name: string }[]; }>(`${this.base}/${folderId}/contents`)
    )

  }

  async getRootFolders(): Promise<{ folder: FolderModel;subFolders: FolderModel[];files: FileItem[]; breadcrumbs: { id: number; name: string }[]; }> {
    return firstValueFrom(
      this.http.get<{
        folder: FolderModel;
        subFolders: FolderModel[];
        files: FileItem[];
        breadcrumbs: { id: number; name: string }[];
      }>(`${this.base}/root`)
    );
  }

  async getFolderTree(): Promise<FolderModel[]> {
    return  firstValueFrom(
      this.http.get<FolderModel[]>(`${this.base}/tree`)
    )

  }

  async moveFolder(folderId: number, newParentFolderId: number): Promise<FolderModel> {

    const payload = { newParentFolderId }

    return  firstValueFrom(
      this.http.put<FolderModel>(`${this.base}/${folderId}/move`, payload)
    )

  }


}