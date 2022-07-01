import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { plainToClass } from "class-transformer";

const paramsMap = {
  'userIds': 'users:array:_id',
  'sprintIds': 'sprints:array:_id',
  'taskIds': 'tasks:array:_id'
};

@Injectable({
  providedIn: 'root'
})
export class QueryParamsService {

  public constructor(private route: ActivatedRoute,
                     private location: Location,
                     private router: Router) {
  }

  public getFilteredQueryParams<T>(dto: new () => T, currentParams: Record<string, any> = {}): T {
    const result: T = plainToClass(dto, currentParams);
    const queryParams = this.route.snapshot.queryParams;

    Object.keys(result).forEach((key) => {
      if (key === 'offset') {
        result[key] = 0;
        return;
      }

      const type = paramsMap[key] && paramsMap[key].includes(':') ? paramsMap[key].split(':')[1] : '';

      result[key] = queryParams[key] || currentParams[key];

      if (type === 'number') {
        result[key] = +result[key];
      } else if (type === 'boolean') {
        if (String(result[key]) === 'true') {
          result[key] = true;
        } else {
          delete result[key];
        }
      }

      if (result[key] == undefined || Number.isNaN(result[key])) {
        delete result[key];
      }
    });

    return result;
  }

  public setQueryParams(queryParams: Record<string, any>) {
    const filteredParams = { ...queryParams };

    delete filteredParams.limit;
    delete filteredParams.offset;
    delete filteredParams.sort;
    delete filteredParams.search;

    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: filteredParams,
        replaceUrl: true
      }).catch(console.error);
  }

  public getFilteredEntities<T>(filters: T, queryParams: Record<string, any>): T {
    const result = {} as T;

    Object.keys(paramsMap).forEach((key) => {
      const [fieldName, fieldType, fieldKey] = paramsMap[key].split(':');

      if (!(fieldName in filters)) {
        return;
      }

      if (fieldType === 'array') {

        if (queryParams[key] != undefined && !Array.isArray(queryParams[key])) {
          queryParams[key] = [queryParams[key]];
        }

        result[fieldName] = queryParams[key] && fieldKey
          ? filters[fieldName].filter((option: any) => queryParams[key].map((param: any) => String(param)).includes(String(option[fieldKey])))
          : (queryParams[key] || []);
      }
    });

    return result;
  }

}
