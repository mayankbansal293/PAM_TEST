import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'searchUserPipe'
})
export class SearchUserPipe implements PipeTransform {
  transform(array: any, query: string): any {
    if (query != undefined && query) {
      return array.filter(row => {
        if (!row.configDescription) {
          row.configDescription = ""
        }
        const orgName = row.orgName.toLowerCase().includes(query.toLowerCase())
        const emailId = row.emailId.toLowerCase().includes(query.toLowerCase())
        const mobileNumber = row.mobileNumber.toLowerCase().includes(query.toLowerCase())
        const userName = row.userName.toLowerCase().includes(query.toLowerCase())
        const name = row.name.toLowerCase().includes(query.toLowerCase())
        return ( orgName + emailId + mobileNumber + userName + name);
      }
      )
    }
    return array;
  }

}
