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
    showEdit?: boolean;
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

export interface Favorites{
  
  id: number;
  fileId: number;
  folderId: number;
  itemName:string;
  itemType:string;
  contentType:string;
  size: number;
  addedOn: string;

}

export enum permissions{
  Read = 1,
  Write = 2 , 
  Owner = 3
}

export interface Sharing{
  fileId: number
  sharedWithUserId: number
  permission: permissions
  sharedOn:string
  sharedWithUserName:string
  id: number
  email: string
  folderId:number
  userName:string
  role:string

 
}

export interface TrashManagement{
  fileId: number
  folderId: number

}

export interface Storage{
  message: string
}

export interface SearchFileAndFolder{
  Query: string
  PhoneNumber:string
  FolderId: number
  UserId: number
  IncludeFiles: boolean
  IncludeFolders: boolean
  ContentType: string
  FromDate?:string
  toDate?:string
  PageNumber: number
  PageSize: number
  SortBy:string
  SortAscending:string
  Page: number
  ParentFolderId: number
}

export interface Admin{
  userName:string
  email:string
  password:string
  userId:number
  PageNumber:number
  PageSize:number
  SearchTerm:string
  SortBy:string
  SortAscending:boolean

}
