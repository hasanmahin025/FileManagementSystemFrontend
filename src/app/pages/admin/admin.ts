import { ChangeDetectorRef, Component, NgModule } from '@angular/core';
import { CreateUserRequest, PaginateUsersResponse, UpadteUserRequest, UserResponse } from '../../Services/models/models';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../Services/admin.services';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-admin',
  imports: [FormsModule , CommonModule , ReactiveFormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
     users: UserResponse[] = []
     totalCount:number = 0
     pageNumber: number = 1
     pageSize:number = 10
     totalPages:number = 0
     searchTerm:string = ''
     sortBy:string = 'id'
     sortAscending:boolean = true


     showAddUserModel:boolean = false
     showAddAdminModel:boolean = false
     showUpdateModel:boolean = false
     showDeleteModel:boolean =false

     addUserForm!:FormGroup
     addAdminForm!:FormGroup
     updateUserForm!:FormGroup

     selectedUser:UserResponse |null = null
     isLoading:boolean = false
     errorMessage:string = ''
     successMessage:string = ''


     constructor(private adminService:AdminService,
                private fb:FormBuilder,
                 private cdr:ChangeDetectorRef
     ){}

     ngOnInit():void{
      this.initializeForms();
      this.loadUsers();
     }

     initializeForms(): void{
      this.addUserForm = this.fb.group({
         userName:['' , Validators.required],
         email:['',[Validators.required , Validators.email]],
         password:['',[Validators.required , Validators.minLength(6)]]
      })
      this.addAdminForm = this.fb.group({
        userName:['',Validators.required],
        email:['',[Validators.required , Validators.email]],
        password:['',[Validators.required ,Validators.minLength(6)]]
      })
      this.updateUserForm = this.fb.group({
        userName:['',Validators.required],
        email:['',[Validators.required , Validators.email]],
        password:['',Validators.required]
      })
     }
    

     loadUsers(): void{
         this.isLoading = true
         this.errorMessage = ''

         this.adminService.getAllUsers({
            pageNumber:this.pageNumber,
            pageSize:this.pageSize,
            searchTerm:this.searchTerm,
            sortBy: this.sortBy,
            sortAscending: this.sortAscending
         }).subscribe({
          next:(response: PaginateUsersResponse) =>{
            this.users = response.items;
            this.totalCount = response.totalCount;
            this.totalPages = response.totalPages;
             
            this.isLoading = false;
            this.cdr.detectChanges()
          },
          error:(error) =>{
            this.errorMessage = 'Failed To Load Users';
            this.isLoading = false;
             console.error('Error loading Users:',error)
          }
         })
     }

     openAddUserModel():void{
      this.addUserForm.reset()
      this.showAddUserModel = true
      this.errorMessage = ''
      this.successMessage = ''
     }
     openAddAdminModel():void{
      this.addAdminForm.reset()
      this.showAddAdminModel = true
      this.errorMessage = ''
      this.successMessage = ''
     }

     openUpdateModel(user:UserResponse):void{
    
       this.selectedUser = user;
       
       this.updateUserForm.patchValue({
        userName:user.userName,
        email:user.email,
        password:''
       })
       this.showUpdateModel = true
       this.errorMessage = ''
       this.successMessage = ''
        this.cdr.detectChanges()
     }
     

     openDeleteModel(user:UserResponse):void{
      this.selectedUser = user;
      this.showDeleteModel = true;
      this.errorMessage = ''
      this.successMessage = ''
       this.cdr.detectChanges()
     }

     closeModels():void{
      this.showAddAdminModel = false;
      this.showAddUserModel = false;
      this.showUpdateModel = false
      this.showDeleteModel = false;
      this.selectedUser = null;
      this.errorMessage=''
      this.successMessage=''
      this.cdr.detectChanges()
     }
  
     addUser():void{
      if(this.addUserForm.invalid)return
      this.isLoading = true;
      const request: CreateUserRequest = this.addUserForm.value;
     // console.log('Request being sent:', JSON.stringify(request, null, 2));
      this.adminService.addUser(request).subscribe({
        next:() =>{
          this.successMessage = 'User Created Successfully';
          this.loadUsers();
           
          this.isLoading = false;
          this.cdr.detectChanges()
        },
        error:(error)=>{
          this.errorMessage = error.error?.message || 'Failed To create User'
          this.isLoading = false
        }
      })
     }

     addAdmin():void{
      if(this.addAdminForm.invalid)return
      this.isLoading = true
      const request: CreateUserRequest = this.addAdminForm.value;
      this.adminService.addAdmin(request).subscribe({
        next:() =>{
          this.successMessage = "Admin created Succcessfullly";

          this.loadUsers();
           
          this.isLoading = false
          this.cdr.detectChanges()
        },
        error:(error) =>{
          this.errorMessage = error.error?.message || 'Failed To created Admin'
        }
      })
     }

     updateUser():void{
      if(this.updateUserForm.invalid || !this.selectedUser)return
      this.isLoading = true;
      const request:UpadteUserRequest = this.updateUserForm.value;
      this.adminService.updateUser(this.selectedUser.id , request).subscribe({
        next:()=>{
          this.successMessage = 'user Upadated SuccessFully';
          this.loadUsers();
          this.isLoading = false
          this.cdr.detectChanges()
        },
        error:(error)=>{
          this.errorMessage = error.error?.message||'Failed To upadte User'
          this.isLoading = false
        }
      })
     }
     deleteUser():void{
      if(!this.selectedUser)return
      this.isLoading = true;
      this.adminService.deleteUser(this.selectedUser.id).subscribe({
        next:() =>{
           this.successMessage = "User Deleted Successfully";
           this.loadUsers();
           
           this.isLoading = false
            this.cdr.detectChanges()
          
        },
        error:(error)=>{
          this.errorMessage = error.error?.message || "Failed To Delete User"
        }
      })
     }
     onSearch():void{
      this.pageNumber = 1;
      this.loadUsers()
      this.cdr.detectChanges()
     }
     onPageChange(page:number):void{
      this.pageNumber = page
      this.loadUsers()
      this.cdr.detectChanges()
     }
     onPageSizeChange(size:number): void{
      this.pageSize = size;
      this.pageNumber = 1;
      this.loadUsers()
      this.cdr.detectChanges()
     }
     onSort(column:string):void{
      if(this.sortBy === column){
        this.sortAscending = !this.sortAscending
      }else{
        this.sortBy = column;
        this.sortAscending = true
      }
      this.loadUsers()
      this.cdr.detectChanges()
     }

     get Pages():number[]{
         return Array.from({length:this.totalPages},(_ ,i)=> i + 1)
         
     }
  
}
