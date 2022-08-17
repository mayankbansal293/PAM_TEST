import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'searchDomainPipe'
})
export class SearchDomainPipe implements PipeTransform {
  transform(array: any, query: string): any {
    if (query != undefined && query) {
      return array.filter(row => {
        const domainName= row.domainName.toLowerCase().includes(query.toLowerCase())
        const createdAt = row.createdAt.toLowerCase().includes(query.toLowerCase())
        const createdBy= row.createdBy.toLowerCase().includes(query.toLowerCase())
        return ( domainName + createdAt + createdBy);
      }
      )
    }
    return array;
  }
}
