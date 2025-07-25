import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchArry'
})
export class SearchArryPipe implements PipeTransform {

  transform(categories: any, searchText: any, property: string): any {
    if (searchText == null) { return categories; }

    return categories.filter(function (category) {
      if (category) {
        if (property) {

          return category[property].toLowerCase().indexOf(
            searchText.toLowerCase()) > -1;
        } else {

          return category.toLowerCase().indexOf(
            searchText.toLowerCase()) > -1;
        }
      }
    })
  }

}
