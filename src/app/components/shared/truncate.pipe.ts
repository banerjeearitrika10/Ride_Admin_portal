import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
 
  transform(value: string, limit: number): string {
    if (!value) {
      return '';
    }

    // Truncate text to the specified limit
    const truncated = value.split(' ').slice(0, limit).join(' ');
    return value.split(' ').length > limit ? `${truncated}...` : value;
  }

}
