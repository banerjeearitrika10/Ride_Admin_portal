import { Observable } from "rxjs";

export interface DeactivationGuard {
    canDeactivate(nextState?: string): Observable<boolean> | Promise<boolean> | boolean;
}
