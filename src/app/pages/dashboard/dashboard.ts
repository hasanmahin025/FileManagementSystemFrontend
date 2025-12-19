import { Component, OnInit } from '@angular/core';
import { FileService } from '../../Services/file.service';
import { FolderService } from '../../Services/Folder.services';
import { FileItem, FolderModel } from '../../Services/models/models';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  standalone: true,
  imports: [FormsModule, CommonModule , RouterLink]
})
export class DashboardComponent implements OnInit {

  folders: FolderModel[] = [];
  files: FileItem[] = [];
  folderTree: FolderModel[] = [];

  currentFolderId: number | null = null;
  showUploadPanel = false;

  // Folder creation
  newFolderName = '';
  newFolderDescription = '';

  // File upload
  selectedFile: File | null = null;
  notes = '';

  // File update
  editNotes = '';
  editPhoneNumber = '';
  editIsPrivate = false;

  constructor(
    private fileService: FileService,
    private folderService: FolderService
  ) {}

  ngOnInit() {
    this.loadRootFolders();
    this.loadFolderTree();
  }

  // -------------------------------------------------
  // FOLDER METHODS
  // -------------------------------------------------

  loadRootFolders() {
    this.folderService.getRootFolders().subscribe(res => {
      this.folders = res.subFolders ?? [];
      this.currentFolderId = null;

      //Add showEdit dynamically
      this.files = (res.files ?? []).map((f: any) => ({
        ...f,
        showEdit: false
      }));
    });
  }

  loadFolderContents(folderId: number) {
    this.currentFolderId = folderId;

    this.folderService.getFolderContents(folderId).subscribe(res => {
      this.folders = res.subFolders;

      //Add showEdit dynamically
      this.files = res.files.map((f: any) => ({
        ...f,
        showEdit: false
      }));
    });
  }

  loadFolderTree() {
    this.folderService.getFolderTree().subscribe(res => {
      this.folderTree = res;
    });
  }

  createFolder() {
    if (!this.newFolderName.trim()) return;

    const parentId = this.currentFolderId ?? null;

    this.folderService.createFolder(
      this.newFolderName,
      this.newFolderDescription,
      parentId
    ).subscribe(() => {
      this.newFolderName = '';
      this.newFolderDescription = '';
      this.loadFolderContents(this.currentFolderId ?? 0);
      this.loadFolderTree();
      alert("Folder Create Sucessfully")
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

  // -------------------------------------------------
  // FILE METHODS
  // -------------------------------------------------

  selectFile(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (!this.selectedFile) return;

    this.fileService.uploadFile(
      this.selectedFile,
      this.currentFolderId,
      this.notes
    ).subscribe({
      next: () => {
        this.selectedFile = null;
        this.notes = '';
        this.loadFolderContents(this.currentFolderId ?? 0);
        alert("File Upload SuccessFully")
      },
      error: err => {
        alert('File upload failed: ' + (err.error?.title || err.message));
      }
    });
  }

  downloadFile(fileId: number, fileName: string) {
    this.fileService.downloadFile(fileId).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  deleteFile(fileId: number) {
    if (!confirm('Are you sure you want to delete this file?')) return;

    this.fileService.deleteFile(fileId).subscribe({
      next: () => this.loadFolderContents(this.currentFolderId ?? 0),
      error: err => alert('File deletion failed: ' + (err.error?.title || err.message))
    });
  }

  // -------------------------------------------------
  // EXTRA FILE FEATURES
  // -------------------------------------------------

  updateFileInfo(fileId: number) {
    this.fileService.updateFileInfo(
      fileId,
      this.currentFolderId,
      this.editPhoneNumber,
      this.editNotes,
      this.editIsPrivate
    ).subscribe({
      next: () => {
        this.loadFolderContents(this.currentFolderId ?? 0);
        alert('File updated successfully');
      },
      error: err => alert('Update failed: ' + (err.error?.title || err.message))
    });
  }

  toggleFavorite(fileId: number) {
    console.log("Favorite clicked for file:", fileId);
    // You will implement FavoriteService here later
  }

  onMoveFolder(folderId: number, event: Event) {
    const select = event.target as HTMLSelectElement;
    const value = select.value;
    const newParentId = value ? Number(value) : null;
    this.moveFolder(folderId, newParentId);
  }

  toggleUploadPanel() {
    this.showUploadPanel = !this.showUploadPanel;
  }
}
