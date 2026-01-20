import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Favourite } from '../../Services/Favorites.services';
import { FileService } from '../../Services/file.service';
import { FolderService } from '../../Services/Folder.services';
import { FavouriteResponse, FolderResponse} from '../../Services/models/models';
import { CommonModule } from '@angular/common';
import { DriveContextService } from '../../Services/drive-context.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-favourites',
  imports: [CommonModule],
  templateUrl: './favourites.html',
  styleUrl: './favourites.css',
})
export class Favourites implements OnInit{
          
         contents:{folders: any[] ; files:any[]} = {folders:[] , files:[]}
         id?:number
         folderId:number | null = null
         fileId?:number
         favouriteId: number | null = null
          private sub = new Subscription();
         isLoading = false
         activeMenuId: number | null = null
         activeMenuType: 'file' | 'folder' | null = null
         currentFolderId: number | null = null
    

         constructor(
              private favourite:Favourite,
              private cdr: ChangeDetectorRef,
              private driveCtx: DriveContextService,
              private folderService: FolderService,
              private fileSrvice: FileService
         ){}

   ngOnInit(): void{
           
       this.driveCtx.setCurrentFolder(null)
       this.loadContents();

       this.sub.add(
        this.driveCtx.currentFolderId$.subscribe( id =>
          {
              this.currentFolderId = id
              this.loadContents();
          }
        )

       )
      this.sub.add(
        this.driveCtx.refresh$.subscribe(() =>{
          this.loadContents();
        })
      )

   }
   ngOnDestroy():void{
        this.sub.unsubscribe()
   }
   onFolderClick(folderId: number): void{
    console.log('Opening folder:', folderId);
    if(!folderId && folderId === 0){
      console.error("Failed To laod Content:", folderId);
      return;
      
    }
        this.driveCtx.setCurrentFolder(folderId)
   }
   loadContents() {
       
       this.isLoading = true;
       console.log("Loading Contents for Folders:", this.currentFolderId)

       const handleError = (err: any) =>{
        console.log("Failed To load Contents", err)
        this.contents = {folders:[], files:[]}
        this.isLoading = false
       }

       if(this.currentFolderId === null){
          this.favourite.getFavourites().subscribe({
            next:(res: FavouriteResponse[])=>{
              console.log("Favourite Contents:", res)

              const folders = res
              .filter(item => item.folderId !== undefined && item.folderId !== null)
              .map(item => ({
                 favouriteId: item.id,
                 id: item.folderId,
                 name: item.itemName,
                 isFavourite: true
              }));

              //files
              const files = res
              .filter(item=> item.fileId !== undefined && item.fileId !== null)
              .map(item => ({
                favouriteId: item.id,
                id: item.fileId,
                name: item.itemName,
                isFavourite: true
              }))
              this.contents ={folders , files};
              this.isLoading = false
              this.cdr.detectChanges();
            },
            error: handleError
          })
       }
       else{
           this.folderService.getFolderContent(this.currentFolderId).subscribe({
            next:(res: any)=>
            {
              console.log("Load Folder Content", res)

            const folders = (res.subFolders || res.folders || [])
            .map((folder: any) => ({
            id: folder.id,
            name: folder.name,
            isFavourite: true
               }));

            const files = (res.files || []).map((file: any) => ({
            id: file.id,
            name: file.fileName,
            isFavourite: true
            }));
            this.contents = {folders , files}
            this.isLoading = false;
            this.cdr.detectChanges();
            /*
            debug
            console.log('subfolders:',folders);
            console.log('subfiles:',files);
            */
            }
            ,error:handleError
           })
       }


  }
   toggleMenu(id: number , type: 'folder' | 'file' , event:MouseEvent){
       
       event.stopPropagation()
       if(this.activeMenuId === id && this.activeMenuType === type){
        this.closeMenu()
       }
       else{
          this.activeMenuId = id
          this.activeMenuType = type
       }

   }
   @HostListener('document:click')
    closeMenu(){
      this.activeMenuId = null
      this.activeMenuType = null

    }

    handleFolderAction(action: string , folder:any){
      this.closeMenu();
      switch(action){
        case 'Remove Form Favourite':
          this.favourite.removeFavorite(folder.favouriteId).subscribe({
            next:()=>{
              alert(`Folder ${folder.name} Remove From Favourite`)
              this.loadContents();
              this.cdr.detectChanges();
              
            },
            error:(err)=>{
              alert("Failed To Remove Favourite")
            }
          
          })   

      }
    }
    handleFileAction(action: string , file:any){
      this.closeMenu();
      switch(action){
         case 'Remove From Favourite':

         this.favourite.removeFavorite(file.favouriteId).subscribe({
          next:()=>{
            alert("Remove File From Favourite");
            this.loadContents();
            this.cdr.detectChanges();
          },
          error:()=>{
            alert("Failed Remove From Favourite")
          }
         })
         break

         case 'Download':
          this.fileSrvice.downloadFileToDevice(file.id , file.name)
          break
      

          
      }
      
    }
   goBack(): void{

      this.driveCtx.setCurrentFolder(null);

   }
   
}
