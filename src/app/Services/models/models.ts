export interface FileItem {
    id: number;

    fileName: string;

    contentType: string;

    fileSize: number;

    filePath?: string;

    phoneNumber?: string;

    ownerId?: number;

    ownerName?: string;

    folderId?: number | null;

    folderName?: string | null;

    isPrivate?: boolean;

    createOn?: string;
    
    updateOn?: string;

    notes?: string | null;
}

export interface FolderModel {
  id: number;
  name: string;

  description?: string | null;

  parentFolderId?: number | null;
  parentFolderName?: string | null;

  ownerId?: number;
  ownerName?: string;
  createdOn?: string;   
  updatedOn?: string; 

  subFolderCount?: number;
  fileCount?: number;

  children?: FolderModel[];
}

export interface TwoFactorAuthentication{

   userId: number;

   twoFactorToken:string;

   code:string;

   pin:string;

   recoveryCode:string;

   masterpin: string;
   
}