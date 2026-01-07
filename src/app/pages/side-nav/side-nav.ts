import { ChangeDetectorRef, Component, ElementRef, HostListener } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FileService } from '../../Services/file.service';
import { FolderService } from '../../Services/Folder.services';
import { DriveContextService } from '../../Services/drive-context.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-side-nav',
  imports: [RouterLink , CommonModule , FormsModule],
  standalone:true,
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.css',
})
export class SideNav {

   dropdownOpen = false;
   showFolderModel = false;
   isUploading = false;
   isCreating = false;
   folderName = '';
   notes = '';

   constructor(
    private el:ElementRef,
    private fileService:FileService,
    private folderService:FolderService,
    private driveCtx: DriveContextService,
    private cdr:ChangeDetectorRef
   ){}
   
   toggleDropdown(){
    this.dropdownOpen  = !this.dropdownOpen;
   }
   @HostListener('document:click' ,['$event'])
   onDocClick(event:MouseEvent){
    if(!this.el.nativeElement.contains(event.target)){
      this.dropdownOpen = false;
    }
   }
   openFilePicker(input: HTMLInputElement){
    input.click();
    this.dropdownOpen = false
   }
   openFileSelected(event : Event){
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if(!file) return

    this.isUploading = true;
    const folderId = this.driveCtx.currentFolderId$.value;
    this.fileService.uploadFile(file , folderId , this.notes || undefined).subscribe({
      next:() =>{
        this.isUploading = false;
        this.notes = '';
        this.driveCtx.triggerRefresh();
        alert('File Upload sucessfully');
        input.value = ''

      },
      error:(err) =>{
        this.isUploading = false;
        alert(`Failed To upload file: ${err?.error?.message ?? 'Unknown error'}`);
        input.value = '';
      }
    })
   }

   openCreateFolder(){
    this.folderName = ''
    this.showFolderModel = true
    this.dropdownOpen = false
   }

   createFolder(){
    const name = this.folderName.trim();
    if(!name){
      alert('Folder Name is Required');
      return
    }
    this.isCreating = true;
    const parentFolderId = this.driveCtx.currentFolderId$.value;

    const request: any = {name , parentFolderId};
    this.folderService.createFolders(request).subscribe({
      next:() =>{
        this.isCreating = false;
        this.showFolderModel = false;
        this.folderName = '';
        this.driveCtx.triggerRefresh();
        this.cdr.detectChanges()
       alert("Folder Created sucessFully")
      },
      error:(err) =>{
        this.isCreating = false;
        alert(`Failed To create Folder: ${err?.error?.message ?? "Unkonown Error"}`)
      }
    })
   }
   closeFolderModel(){
    this.showFolderModel =false
    this.folderName = ''
   }




}
