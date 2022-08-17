import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'permissionPipe'
})
export class PermissionPipePipe implements PipeTransform {

  transform(array: any, query:string): any {
    if (query!=undefined && query) {
      return array.filter(row=> {
          const permissionCode = row.permissionCode.toLowerCase().includes(query.toLowerCase())
          const displayName =  row.displayName.toLowerCase().includes(query.toLowerCase())
          const description =  row.description.toLowerCase().includes(query.toLowerCase())
          const timeOut =  row.timeOut.toString().toLowerCase().includes(query.toLowerCase())
          const publicAccess =  (row.publicAccess == "1" ?"allowed":"not allowed").includes(query.toLowerCase())
          const accessUrl =  row.accessUrl.toLowerCase().includes(query.toLowerCase())
          const status = (row.status == "1" ?"active":"inactive").includes(query.toLowerCase())
          return (permissionCode+ displayName + description + timeOut +publicAccess+accessUrl+ status );
     })
     .filter(row=>{
        if((query.toLowerCase()).includes("active")){
            return row.status == "1";
        }else if((query.toLowerCase()).includes("allowed")){
            return row.publicAccess == "1";
        }else{
            return true;
        }
  })
  
  }
  return array;
  }

}
