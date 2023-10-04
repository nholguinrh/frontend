import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mask'
})
export class MaskPipe implements PipeTransform {

    transform(email: string): string {
        const mask = email.split('@');
        let textfiller = mask[0].substring(1,  mask[0].length - 1);
        const org = mask[1].split('.');
        let domainfiller = org[0].substring(1,  org[0].length - 1);
        let textReplaced = textfiller.replace(/[^]/gi, '*');
        let domainReplaced = domainfiller.replace(/[^]/gi, '*');
        
        return mask[0].substring(0, 1) + textReplaced +  mask[0].substring(mask[0].length -1, mask[0].length) + '@' + org[0].substring(0, 1) + domainReplaced + org[0].substring(org[0].length -1, org[0].length) + '.' + org[1];
    }

}