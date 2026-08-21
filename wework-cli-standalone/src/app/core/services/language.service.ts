import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root',
})
export class LanguageService {
    public languages: string[] = ['en', 'es', 'de'];

    constructor(public translate: TranslateService) {
        let browserLang: any | null | undefined;
        translate.addLangs(this.languages);

        if (localStorage.getItem('lang')) {
            browserLang = localStorage.getItem('lang');
        } else {
            browserLang = translate.getBrowserLang();
        }
        /*         translate.use(browserLang.match(/en|es|de/) ? browserLang : 'es'); */
        this.setLanguage(browserLang.match(/en|es|de/) ? browserLang : 'es');
    }

    public async setLanguage(lang: string) {
        this.translate.resetLang(this.translate.currentLang);
        this.translate.setDefaultLang(lang);
        this.translate.use(lang);
        this.getContent('MENUITEMS.DASHBOARD.LIST.DASHBOARD1');
        //console.log('Mi idioma es:', lang, this.translate.getDefaultLang(), this.translate.currentLang);
        localStorage.setItem('lang', lang);
    }

    public async getContent(key: string): Promise<string> {
        const content = await this.translate.get(key).toPromise();
        return content;
    }
}
