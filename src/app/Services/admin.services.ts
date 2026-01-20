import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "./environment";
import { CreateUserRequest, PaginateUsersRequest, PaginateUsersResponse, UpadteUserRequest, UserResponse } from "./models/models";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AdminService{
    constructor(private http: HttpClient){}
    private base = `${environment.apiUrl}/Admin-management`;

    addUser(request : CreateUserRequest ): Observable<UserResponse>{
        return this.http.post<UserResponse>(`${this.base}/Add-user` , request)
    }

    addAdmin(request: CreateUserRequest): Observable<UserResponse>{
        return this.http.post<UserResponse>(`${this.base}/Add-admin`, request)
    }
    getUserById(userId: number): Observable<UserResponse>{
       return this.http.get<UserResponse>(`${this.base}/Get-user/${userId}`)  
    }
    getUserByEmail(email: string): Observable<UserResponse>{
        return this.http.get<UserResponse>(`${this.base}/Get-user-by-email/${email}`)
    }
    getUserByUserName(username: string):Observable<UserResponse>{
        return this.http.get<UserResponse>(`${this.base}/Get-user-by-username/${username}`)
    }
    getAllUsers(request?: PaginateUsersRequest):Observable<PaginateUsersResponse>{
        let params = new HttpParams();
        if(request){
            if(request.pageNumber !== undefined){
                params = params.set('pageNumber', request.pageNumber.toString())
            }
            if(request.pageSize !== undefined){
                params = params.set('pageSize' , request.pageSize.toString())
            }
            if (request.searchTerm !== undefined) {
                params = params.set('SearchTerm', request.searchTerm);

            }
            if (request.sortBy !== undefined){ 
                params = params.set('SortBy', request.sortBy);
            }
            if (request.sortAscending !== undefined) {
                params = params.set('SortAscending', request.sortAscending.toString());

           }
           
        }
        return this.http.get<PaginateUsersResponse>(`${this.base}/Get-all-users`, { params });
    }

    updateUser(userId: number ,request:UpadteUserRequest ):Observable<UserResponse>{
        return this.http.put<UserResponse>(`${this.base}/Update-user/${userId}`, request)
    }
    deleteUser(userId: number):Observable<void>{
        return this.http.delete<void>(`${this.base}/Delete-user/${userId}`)
    }

    getAllusersWithAdmin(request?: PaginateUsersRequest):Observable<PaginateUsersResponse>{
         
        let params = new HttpParams();
        if(request){
            if(request.pageNumber !== undefined){
                params = params.set('pageNumber' , request.pageNumber.toString())
            }
            if(request.pageSize !== undefined){
                params = params.set("pageSize",request.pageSize.toString())
            }
            if(request.searchTerm !== undefined){
                params = params.set("searchTerm",request.searchTerm.toString())
            }
            if(request.sortBy !== undefined){
                params = params.set('sortBy' , request.sortBy.toString())
            }
            if(request.sortAscending !== undefined){
                params = params.set('sortAcending' , request.sortAscending)
            }
        }
           
        return this.http.get<PaginateUsersResponse>(`${this.base}/Get-all-admins-with-users` , {params})
    }

}