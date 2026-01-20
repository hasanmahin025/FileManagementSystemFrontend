export interface LoginRequest{
  username: string;
  password: string;
}
export interface LoginResponse{
  id: number;
  userName: string;
  email:string;
  token:string;
  refreshToken:string;
}

export interface RefreshTokenRequest{
  refreshToken:string;
}
export interface RevokeTokenRequest{
  refreshToken:string;
}
export interface CreateUserRequest{
  userName:string;
  email:string;
  password:string;
}
export interface UpadteUserRequest{
  userName:string;
  email:string;
  password?:string;
}
export interface UserResponse{
  id:number;
  userName:string;
  email:string;
}
export interface CreateUserResponse{
  id:number;
  userName:string;
  email:string;
}
export interface PaginateUsersRequest{
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortAscending?: boolean;
}
export interface PaginateUsersResponse{
  items: UserResponse[];
  totalCount:number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
export interface UpadteUserRequest{
  userName:string;
  email:string;
  password?:string;
}
export interface FileUploadRequest{
  file:File;
  folderId?: number | null;
  notes?: string;
}
export interface FileUpdateInfoRequest{
  folderId?: number | null;
  phoneNumber?: string;
  notes?: string;
  isPrivate?: boolean;
}
export interface FileResponse{
  id: number;
  fileName: string;
  contentType: string;
  fileSize:number;
  filePath:string;
  phoneNumber?: string;
  ownerId: number;
  ownerName:string;
  folderId?:string;
  folderName?:string;
  isPrivate: boolean;
  createOn:string;
  updateOn:string;
  
}
export interface CreateFolderRequest{
  name: string;
  description?: string;
  parentFolderId?: number | null;

}
export interface UpdateFolderRequest{
  name: string;
  description?: string;
}

export interface MoveFolderRequest{
  newParentFolderId?: number|null;

}
export interface FolderResponse{
  id: number;
  name: string;
  description?: string;
  ownerId:number;
  ownerName:string;
  parentFolderId?: number | null;
  parentFolderName?: string;
  createOn: string;
  updateOn: string;
  subFolderCount: number;
  fileCount: number;
}
export interface Breadcrumb{
  id: number;
  name:string;
}
export interface FolderContentsResponse{
  folder: FolderResponse;
  subFolders:FolderResponse[];
  files: FileResponse[];
  breadcrumbd: Breadcrumb[];
}
export interface FolderTreeNode{
  id:number;
  name:string;
  parentFolderId?: number | null;
  fileCount: number;
  children:FolderTreeNode[];
}

export interface SearchRequest{
  query?: string;
  phoneNumber?: string;
  folderId?: number;
  userId?: number;
  includeFiles?: boolean;
  includeFolders?: boolean;
  contentType?: 'image' | 'pdf'| 'document';
  fromDate?: string;
  toDate?: string;
  pageNumber?: number;
  pageSize?:number;
  sortBy?: 'FileName' | 'CreateOn' | 'FileSize' | 'PhoneNumber';
  sortAscending?: boolean;
}

export interface SearchResponse{
  query:string;
  totalFiles:number;
  totalFolders: number;
  page:number;
  pageSize: number;
  totalPages:number;
  files: FileResponse[];
  folders: FolderResponse[];
}
export enum Permission{
  View = 1,
  Download = 2 ,
  Edit = 3,
  Full = 4
}
export interface ShareRequest{
  shareWithUserId: number;
  permission: Permission;
}
export interface ShareByEmailRequest{
  email: string;
  permission: Permission;
}
export interface ShareResponse{
  id: number;
  sharedWithUserId: number;
  sharedWithUserName: string;
  sharedWithEmail: string;
  permission: Permission;
  sharedOn: string;
}
export interface SharedItem{
  itemId: number;
  itemName: string;
  itemType: 'File' | 'Folder';
  ownerId: number;
  ownerName: string;
  permission: Permission;
  sharedOn: string

}
export interface ShareableUser{
  UserId: number;
  userName: string;
  email: string;
  role: string;
}

export interface AddFavouriteRequest{
  fileId?: number | null;
  folderId?: number | null;
}

export interface FavouriteResponse{
  id: number;
  fileId?: number | null;
  folderId?: number | null;
  itemName: string;
  itemType: 'File' | 'Folder';
  contentType?: string;
  size?: number;
  addedOn: string;
}
export interface FavouriteCheckResponse{
  isFavourite: boolean;
}
export interface TrashItem{
  id: number;
  name: string;
  itemType: 'File' | 'Folder';
  size?: number;
  contentType?: string;
  deleteOn: string;
  orginalCreatedOn: string;
  daysUntilPermanentDelete: number;
  isExpried: boolean;
  detetionMessage: string;
}
export interface TrashResponse{
  totalItems: number;
  fileCount:number;
  totalSize: number;
  expriedItemCount: number;
  retentionPolicyMessage: string;
  items: TrashItem[]
}
export interface StorageQuotaResponse{
  totalQuotaBytes: number;
  usedBytes: number;
  availableBytes: number;
  usedPercentage: number;
  totalQuotaFormatted: string;
  usedFormatted:string;
  availableFormatted: string;
  lastCalculateOn: string;
}
export interface ApiError{
  message: string;
  errors?: string[];
}