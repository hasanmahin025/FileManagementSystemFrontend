import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FolderService } from '../../Services/Folder.services';
import { DriveContextService } from '../../Services/drive-context.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileResponse, FolderResponse } from '../../Services/models/models';

@Component({
  selector: 'app-drive',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './drive.html',
  styleUrls: ['./drive.css'],
})
export class Drive  implements OnInit , OnDestroy {
    contents: {folders:any[]; files:any[]} = {folders:[] , files:[]};
    currentFolderId: number | null = null;
    isLoading = false;
    private sub = new Subscription();

    constructor(
      private folderService: FolderService,
      private driveCtx: DriveContextService,
      private cdr:ChangeDetectorRef
    ){}

    ngOnInit(){
      this.driveCtx.setCurrentFolder(null);
      this.loadContents();

      this.sub.add(
        this.driveCtx.currentFolderId$.subscribe(id =>{
          this.currentFolderId = id;
          this.loadContents();
        })
      )
      this.sub.add(
        this.driveCtx.refresh$.subscribe(() =>{
          this.loadContents();
        })
      )
    }
    loadContents(){
      this.isLoading = true;
      const handleResponse = (res: any) =>{
        this.contents = {
          folders: res.subFolders || [],
          files: res.files || []
        };
        this.isLoading = false;
        this.cdr.detectChanges()
      }
      const handleError = (err : any) =>{
        console.error("Failed To Load Contents", err);
        this.contents = {folders: [] , files: []}
        this.isLoading = false;
        alert("Failed To load Contents")
      }
      if(this.currentFolderId === null){
        this.folderService.getRootContents().subscribe({
          next: handleResponse,
          error:handleError
        })
      }
      else{
        this.folderService.getFolderContent(this.currentFolderId).subscribe({
          next:handleResponse ,
          error:handleError
        })
      }
    }

    onFolderClick(folderId: number){
      this.driveCtx.setCurrentFolder(folderId);
    }

    goBack(){
      this.driveCtx.setCurrentFolder(null)
    }

    ngOnDestroy(){
      this.sub.unsubscribe();
    }




}
