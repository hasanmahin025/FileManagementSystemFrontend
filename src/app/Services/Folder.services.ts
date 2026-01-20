import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "./environment";
import { CreateFolderRequest, FolderContentsResponse, FolderResponse, FolderTreeNode, MoveFolderRequest, UpdateFolderRequest } from "./models/models";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class FolderService{
    constructor(private http: HttpClient){}
    private base = `${environment.apiUrl}/folders`

    createFolders(create: CreateFolderRequest): Observable<FolderResponse>{
        return this.http.post<FolderResponse>(this.base,create );
    }
    listfolder(parentFolderId?: number | null): Observable<FolderResponse[]>{

        let params = new HttpParams();
        if(parentFolderId !== undefined && parentFolderId !== null){
            params = params.set('parentFolderId', parentFolderId.toString());

        }
        return this.http.get<FolderResponse[]>(this.base , {params});
    }
    getFolderContent(folderId: number ): Observable<FolderContentsResponse>{
          console.log('Calling folder API:', `${this.base}/${folderId}/contents`);
 
        return this.http.get<FolderContentsResponse>(`${this.base}/${folderId}/contents`,{
            
        })

    }
    getRootContents():Observable<FolderContentsResponse>{
        return this.http.get<FolderContentsResponse>(`${this.base}/root`)
    }

    getFolderTree(): Observable<FolderTreeNode[]>{
        return this.http.get<FolderTreeNode[]>(`${this.base}/tree`)
    }

    updateFolder(folderId: number , request: UpdateFolderRequest): Observable<FolderResponse>{
        return this.http.put<FolderResponse>(`${this.base}/${folderId}`, request)
    }
    moveFolder(folderId: number , request: MoveFolderRequest ): Observable<FolderResponse>{
        return this.http.put<FolderResponse>(`${this.base}/${folderId}/move`, request)
    }

    deleteFolder(folderId: number , recursive: boolean = false ): Observable<{message: string}>{
        let params = new HttpParams();
        if(recursive){
            params = params.set('recursive', recursive.toString());
        }
        return this.http.delete<{message: string}>(`${this.base}/${folderId}`, {params})
    }


}