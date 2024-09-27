import { User } from "src/app/core/models/user";

enum SortType {
    ASC = 'asc',
    DSC = 'dsc'
}

export class CommonUtil {

    static queryStringToJSON(qs: string) {
        qs = qs || location.search.slice(1);

        var pairs = qs.split('&');
        var result: any = {};
        pairs.forEach(function (p) {
            var pair = p.split('=');
            var key = pair[0];
            var value = decodeURIComponent(pair[1] || '');

            if (result[key]) {
                if (Object.prototype.toString.call(result[key]) === '[object Array]') {
                    result[key].push(value);
                } else {
                    result[key] = [result[key], value];
                }
            } else {
                result[key] = value;
            }
        });

        return JSON.parse(JSON.stringify(result));
    };

    static getUser(): User {
        const user: User = ['undefined', null].indexOf(localStorage.getItem('user')) === -1 ?
            JSON.parse(localStorage.getItem('user') || '') : {};
        return user;
    }

    static sortBy(list: any[], field: string, sortType: SortType = SortType.ASC) {
        if (!list || !field) return [];
        if (sortType === SortType.ASC) {
            return list.sort((a: any, b: any) => a[field] < b[field] ? -1 : 1);
        } else if (sortType === SortType.DSC) {
            return list.sort((a: any, b: any) => a[field] > b[field] ? 1 : -1);
        } else {
            return list;
        }
    }
}