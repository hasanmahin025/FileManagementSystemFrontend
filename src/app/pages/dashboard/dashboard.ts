import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FolderService } from '../../Services/Folder.services'; 
import { FileService } from '../../Services/file.service';    
import { FolderModel , FileItem } from '../../Services/models/models'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  folders: FolderModel[] = [];
  files: FileItem[] = [];
  folderTree: FolderModel[] = [];
  currentFolderId: number | null = null;
  breadcrumbs: FolderModel[] = [];
  isLoading: boolean = false;

  newFolderName: string = '';
  newFolderDesc: string = '';
  selectedFile: File | null = null;
  uploadNotes: string = '';

  constructor(
    private folderService: FolderService,
    private fileService: FileService
  ){}

  ngOnInit(): void {
    this.loadContent();
    this.loadFolderTree();
  }

  // Load folders & files for current folder
  loadContent(): void {
    this.isLoading = true;

    if(this.currentFolderId === null) {
      this.folderService.getRootFolders().subscribe({
        next: res => {
          console.log('Root folders:', res);
          this.folders = Array.isArray(res) ? res : [];
          this.files = [];
          this.isLoading = false;
        },
        error: err => this.handleError('Load root folders failed', err)
      });
    } else {
      this.folderService.getFolderContents(this.currentFolderId).subscribe({
        next: res => {
          console.log('Folder contents:', res);
          this.folders = Array.isArray(res.folders) ? res.folders : [];
          this.files = Array.isArray(res.files) ? res.files : [];
          this.isLoading = false;
        },
        error: err => this.handleError('Load folder content failed', err)
      });
    }
  }

  // Load folder tree for sidebar
  loadFolderTree(): void {
    this.folderService.getFolderTree().subscribe({
      next: res => this.folderTree = Array.isArray(res) ? res : [],
      error: err => this.handleError('Tree load failed', err)
    });
  }

  // Open folder
  openFolder(folder: FolderModel): void {
    this.breadcrumbs.push(folder);
    this.currentFolderId = folder.id;
    this.loadContent();
  }

  // Navigate up
  navigateUp(): void {
    if(this.breadcrumbs.length === 0) return;
    this.breadcrumbs.pop();
    const prev = this.breadcrumbs[this.breadcrumbs.length - 1];
    this.currentFolderId = prev ? prev.id : null;
    this.loadContent();
  }

  // Navigate to root
  navigateToRoot(): void {
    this.breadcrumbs = [];
    this.currentFolderId = null;
    this.loadContent();
  }

  // Create new folder
  createFolder(): void {
    if(!this.newFolderName.trim()) {
      alert('Folder Name is required!');
      return;
    }
    this.isLoading = true;
    this.folderService.createFolder(this.newFolderName, this.newFolderDesc, this.currentFolderId)
      .subscribe({
        next: res => {
          this.newFolderName = '';
          this.newFolderDesc = '';
          this.isLoading = false;

          if(res) this.folders.push(res); // Push new folder to list
          this.loadFolderTree();          // refresh sidebar
        },
        error: err => this.handleError('Create folder failed', err)
      });
  }

  // Delete folder
  deleteFolder(folderId: number): void {
    if(!confirm('Are you sure? This will delete the folder and ALL its contents!')) return;
    this.folderService.deleteFolder(folderId, true).subscribe({
      next: () => this.loadContent(),
      error: err => this.handleError('Delete folder failed', err)
    });
  }

  // File select
  onFileSelect(event: any): void {
    const file = event.target.files?.[0];
    if(file) this.selectedFile = file;
  }

  // Upload file
  uploadFile(): void {
    if(!this.selectedFile) {
      alert('Please select a file');
      return;
    }
    this.isLoading = true;
    this.fileService.uploadFile(this.selectedFile, this.currentFolderId, this.uploadNotes).subscribe({
      next: () => {
        alert('File uploaded successfully');
        this.selectedFile = null;
        this.uploadNotes = '';
        const input = document.getElementById('fileInput') as HTMLInputElement;
        if(input) input.value = '';
        this.loadContent();
      },
      error: err => this.handleError('Upload failed', err)
    });
  }

  // Delete file
  deleteFile(fileId: number): void {
    if(!confirm('Delete this file?')) return;
    this.fileService.deleteFile(fileId).subscribe({
      next: () => this.loadContent(),
      error: err => this.handleError('Delete file failed', err)
    });
  }

  private handleError(msg: string, err: any): void {
    this.isLoading = false;
    console.error(msg, err);
    const serverMsg = err.error?.message || err.message || 'Unknown error';
    alert(`${msg}: ${serverMsg}`);
  }

}
