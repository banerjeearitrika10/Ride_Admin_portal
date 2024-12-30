import { Injectable } from "@angular/core";

export interface Token {
    sub: string;
    preferred_username: string;
    orgid: string;
    role: Array<any>;
    realm_access: {
        roles: string[]
    };
    resource_access: {};
    userType: string;
    managePartners: string[];
}

@Injectable({
    providedIn: "root"
})

export class DecodeToken {

    constructor() { }

    decodeToken(token: string): Token {
        let jwtData = token.split('.')[1];
        let decodedJwtJsonData = window.atob(jwtData)
        let decodedJwtData = JSON.parse(decodedJwtJsonData);
        return decodedJwtData;
    }

}