import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "./environment";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class Storage {
    constructor(private http: HttpClient) { }

    private base = `${environment.apiUrl}/api/storage`

    getStorageQuota(): Observable<any> {
        return this.http.get(`${this.base}/quota`)
    }

    recalculateStorage(): Observable<any> {
        return this.http.get(`${this.base}/recalculate`)
    }
}