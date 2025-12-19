import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "./environment";
import { Observable } from "rxjs";
import { Admin } from "./models/models";

@Injectable({
    providedIn: 'root'
})

export class AdminManagement {
    constructor(private http: HttpClient) { }

    private base = `${environment.apiUrl}/Admin-management`

    userCreateByAdmin(req: { userName: string, email: string, password: string }): Observable<any> {

        return this.http.post(`${this.base}/Add-user`, req)
    }

    adminCreatebySuperAdmin(req: { userName: string, email: string, password: string }): Observable<any> {
        return this.http.post(`${environment}/Add-admin`, req)
    }
    GetUserById(userId: number): Observable<any> {

        return this.http.get(`${environment}/Get-user/${userId}`)

    }

    GetUserByEmail(email: string): Observable<Admin> {
        return this.http.get<Admin>(`{${this.base}/Get-user-by-email/${email}`)
    }
    GetByUsername(userName: string): Observable<any> {
        return this.http.get(`${this.base}/Get-user-by-username/${userName}`)
    }

    GetAllUserByUserAndAdmin(req: Admin): Observable<any> {
        return this.http.get(`${this.base}/Get-all-admins-with-users`, {
            params: {
                pageNumber: req.PageNumber?.toString() ?? '',
                PageSize: req.PageSize?.toString() ?? '',
                SearchTerm: req.SearchTerm?.toString() ?? '',
                SortBy: req.SortBy?.toString() ?? '',
                SortAscending: req.SortAscending?.toString() ?? ''

            }
        })
    }
    GetAllUser(req: Admin): Observable<any> {
        return this.http.get(`${this.base}/Get-all-users`, {
            params: {
                pageNumber: req.PageNumber?.toString() ?? '',
                PageSize: req.PageSize?.toString() ?? '',
                SearchTerm: req.SearchTerm?.toString() ?? '',
                SortBy: req.SortBy?.toString() ?? '',
                SortAscending: req.SortAscending?.toString() ?? ''
            }
        })
    }
    UpdateUserToAdmin(userId: number ,req:{  userName:string , email:string , password:string}):Observable<any>{
        return this.http.put(`${this.base}/Update-user/${userId}`,req)
    }

    DeleteUser(userId: number): Observable<any>{
        return this.http.delete(`${this.base}/Delete-user/${userId}`)
    }








}