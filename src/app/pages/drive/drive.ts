import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import {Subscription } from 'rxjs';
import { FolderService } from '../../Services/Folder.services';
import { Sharing } from '../../Services/sharing.services';
import { DriveContextService } from '../../Services/drive-context.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddFavouriteRequest, FileResponse, FolderResponse, ShareableUser } from '../../Services/models/models';
import { Favourite } from '../../Services/Favorites.services';
import { FileService } from '../../Services/file.service';

@Component({
  selector: 'app-drive',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './drive.html',
  styleUrls: ['./drive.css'],
})

export class Drive  implements OnInit , OnDestroy {
    contents: {folders:FolderResponse[]; files:FileResponse[]} = {folders:[] , files:[]};
    currentFolderId: number | null = null;
    isLoading = false;
    private sub = new Subscription();
    sharableUsers: ShareableUser[] = [];
    fileId:number | null = null
    folderId:number | null = null
    selectedUserId: number | null = null
    activeMenuId: number | null = null
    activeMenuType: 'folder' | 'file' | null = null
    
    constructor(
      private folderService: FolderService,
      private driveCtx: DriveContextService,
      private cdr:ChangeDetectorRef,
      private favourite:Favourite,
      private fileService:FileService
    ){}

    onFolderClick(folderId: number ){
      this.driveCtx.setCurrentFolder(folderId);
      this.cdr.detectChanges();
    }

    goBack(){
      this.ngOnInit()
      this.cdr.detectChanges();
    }

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
     ngOnDestroy(){
      this.sub.unsubscribe();
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

    toggleMenu(id: number , type: 'folder' | 'file' , event: MouseEvent){
      event.stopPropagation();

      if(this.activeMenuId === id && this.activeMenuType === type){
               this.closeMenu();
      }
      else{
        this.activeMenuId = id;
        this.activeMenuType = type;
      }
    }

    @HostListener('document:click')
    closeMenu(){
      this.activeMenuId = null;
      this.activeMenuType = null;
    }

    

   
    
   handleAction(action: string , folder: FolderResponse){
         this.closeMenu();

         switch(action){
          case 'move to Trash':
            this.folderService.deleteFolder(folder.id , true).subscribe({
              next:()=>{
                  alert(`Folder ${folder.name} move To Trash`)
                  this.loadContents();
                  this.cdr.detectChanges()
              },
              error:()=>{
                alert(`Folder ${folder.name} Failed To move Trash`)
              }
            })
            break;
            case 'Add to Favourite':
             const request:AddFavouriteRequest = {
              folderId: folder.id,
            
             }
             this.favourite.addFavorite(request).subscribe({
              next:()=>{
                 this.loadContents();
                 this.cdr.detectChanges();
              },
              error:()=>{
                alert(`folder ${folder.name} failed To add Favourite`)
              }
             })
             break;
              
         }

   }

   handleFileAction(action: string , file:FileResponse){
         this.closeMenu();

         switch(action){
          
            case 'Add to Favourite':
             const request:AddFavouriteRequest = {
                 fileId: file.id
             }
             this.favourite.addFavorite(request).subscribe({
              next:()=>{
                 this.loadContents();
                 this.cdr.detectChanges();
              },
              error:()=>{
                alert(`File ${file.fileName} failed To add Favourite`)
              }
             })
             break;
             case 'Download':
              console.log('Download action:', file);
              this.fileService.downloadFileToDevice(file.id , file.fileName);
              
              break;

              case 'Delete':
                this.fileService.deleteFile(file.id).subscribe({
                  next:()=>{
                     this.loadContents();
                     alert(`File ${file.fileName} Move To Trash`)
                     
                     this.cdr.detectChanges();
                  },
                  error:()=>{
                    alert(`file ${file.fileName} Faile To Move Trash`)
                    this.loadContents();
                    this.cdr.detectChanges();
                  }
                })
              
         }

         




   }
   
}
