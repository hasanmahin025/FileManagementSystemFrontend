import { Component, OnInit } from '@angular/core';
import { FileService } from '../../Services/file.service'; 
import { FolderService } from '../../Services/Folder.services';
import { FileItem , FolderModel } from '../../Services/models/models'; 
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  standalone: true,          
  imports: [FormsModule , CommonModule] 
})
export class DashboardComponent implements OnInit {

  folders: FolderModel[] = [];
  files: FileItem[] = [];
  folderTree: FolderModel[] = [];
  currentFolderId: number | null = null;
  newFolderName: string = '';
  newFolderDescription: string = '';
  selectedFile: File | null = null;
  notes: string = '';
  userPhoneNumber:string = '';

  constructor(private fileService: FileService, private folderService: FolderService) {}

  ngOnInit() {
    this.loadRootFolders();
    this.loadFolderTree();
  }

  // -----------------------------
  // Folder Methods
  // -----------------------------

  loadRootFolders() {
    this.folderService.getRootFolders().subscribe(res => {
      this.folders = res;
      this.files = [];
      this.currentFolderId = null;
    });
  }

  loadFolderContents(folderId: number) {
    this.currentFolderId = folderId;
    this.folderService.getFolderContents(folderId).subscribe(res => {
      this.folders = res.subFolders;
      this.files = res.files;
    });
  }

  loadFolderTree() {
    this.folderService.getFolderTree().subscribe(res => this.folderTree = res);
  }

 createFolder() {
  if (!this.newFolderName) return;

  const parentId = this.currentFolderId ?? null;

  this.folderService.createFolder(
    this.newFolderName,
    this.newFolderDescription,
    parentId
  ).subscribe(res => {

    this.newFolderName = '';
    this.newFolderDescription = '';

    this.loadFolderContents(this.currentFolderId ?? 0);
    this.loadFolderTree();
  });
}


  deleteFolder(folderId: number) {
    if (!confirm('Are you sure you want to delete this folder?')) return;
    this.folderService.deleteFolder(folderId).subscribe(() => {
      this.loadFolderContents(this.currentFolderId ?? 0);
      this.loadFolderTree();
    });
  }

  moveFolder(folderId: number, newParentId: number | null) {
    this.folderService.moveFolder(folderId, newParentId).subscribe(() => {
      this.loadFolderContents(this.currentFolderId ?? 0);
      this.loadFolderTree();
    });
  }

  // -----------------------------
  // File Methods
  // -----------------------------

  selectFile(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
  if (!this.selectedFile) return;

  const phoneNumber = this.userPhoneNumber?.trim();
  if (!phoneNumber) {
    alert('Phone number is required to upload file.');
    return;
  }

  this.fileService.uploadFile(this.selectedFile, phoneNumber, this.currentFolderId, this.notes)
    .subscribe({
      next: res => {
        this.selectedFile = null;
        this.notes = '';
        this.userPhoneNumber = '';
        this.loadFolderContents(this.currentFolderId ?? 0);
      },
      error: err => {
        console.error('Upload failed', err);
        alert('File upload failed: ' + (err.error?.title || err.message));
      }
    });
}




  downloadFile(fileId: number, fileName: string) {
    this.fileService.downloadFile(fileId).subscribe(blob => {
      const a = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  deleteFile(fileId: number) {
  if (!confirm('Are you sure you want to delete this file?')) return;

  this.fileService.deleteFile(fileId).subscribe({
    next: () => {
      this.loadFolderContents(this.currentFolderId ?? 0);
    },
    error: err => {
      console.error('Delete failed', err);
      alert('File deletion failed: ' + (err.error?.title || err.message));
    }
  });
}

}
