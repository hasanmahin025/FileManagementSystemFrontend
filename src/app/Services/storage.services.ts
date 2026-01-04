import { Injectable } from "@angular/core";
import { environment } from "./environment";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { StorageQuotaResponse } from "./models/models";

@Injectable({
    providedIn: 'root'
})
export class StorageService{
    private base = `${environment.apiUrl}/storage`;
    
    private storageQuotaSubject = new BehaviorSubject<StorageQuotaResponse |null>(null);
    public storageQuota$ = this.storageQuotaSubject.asObservable();
    constructor(private http: HttpClient){}

    getStorageQuota(): Observable<StorageQuotaResponse>{
        return this.http.get<StorageQuotaResponse>(`${this.base}/quota`).pipe(
            tap(response => this.storageQuotaSubject.next(response))
        );
    }

    recalculateStorage(): Observable<StorageQuotaResponse>{
        return this.http.post<StorageQuotaResponse>(`${this.base}/recalculate` , {}).pipe(
            tap(response => this.storageQuotaSubject.next(response))
        )
    }

    canUpload(fileSize: number): Observable<boolean>{
        return new Observable(observer =>{
            const currentQuota = this.storageQuotaSubject.value;

            if(currentQuota){
                observer.next(fileSize <= currentQuota.availableBytes);
                observer.complete();
            }
            else{
                this.getStorageQuota().subscribe({
                    next:(quota) =>{
                        observer.next(fileSize <= quota.availableBytes);
                        observer.complete();
                    },
                    error:(error) => observer.error(error)
                })
            }
        })
    }

    formatBytes(bytes: number , decimals: number = 2): string{
        if(bytes === 0){
            return '0 Bytes';
        }
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes' , 'KB' , 'MB' , 'GB' , 'TB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))

        return parseFloat((bytes / Math.pow(k , i)).toFixed(dm)) + ' ' + sizes[i];
    }

}