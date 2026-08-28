import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';

@Pipe({
    name: 'myTraslate'
})
export class MyTraslatePipe implements PipeTransform {

    constructor(
        public languageService: LanguageService
    ) { }

    public async transform(value: string): Promise<string> {
        console.log('Mi valor pipe', value)
        return await this.languageService.getContent(value);
    }

}
