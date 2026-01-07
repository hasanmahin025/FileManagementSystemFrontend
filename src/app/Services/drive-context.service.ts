import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class DriveContextService{
    readonly currentFolderId$ = new BehaviorSubject<number | null>(null)

    readonly refresh$ = new Subject<void>()

    setCurrentFolder(folderId: number | null){
        this.currentFolderId$.next(folderId);
    }
    triggerRefresh(){
        this.refresh$.next();
    }
}