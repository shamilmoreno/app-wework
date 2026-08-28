import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { UserModel } from "@core/models/user.model";
import { ActionEventModel } from '@core/models/action-event.model';

@Injectable({
    providedIn: 'root'
})
export class UserStoreService {
    private userListSubject = new BehaviorSubject<UserModel[]>([]);
    userList$ = this.userListSubject.asObservable();

    private activeUserSubject = new BehaviorSubject<UserModel | null>(null);
    activeUser$ = this.activeUserSubject.asObservable();

    private actionSubject = new Subject<ActionEventModel>();
    action$ = this.actionSubject.asObservable();

    public setUserList(list: UserModel[]) {
        this.userListSubject.next(list);
    }

    public setActiveUser(user: UserModel | null) {
        this.activeUserSubject.next(user);
    }

    public dispatch(action: ActionEventModel) {
        this.actionSubject.next(action);
    }
}