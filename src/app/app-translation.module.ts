declare var $: any;
import { NgModule, Inject } from "@angular/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateService } from "@ngx-translate/core";
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
const translationOptions = {
  loader: {
    provide: TranslateLoader,
    useFactory: createTranslateLoader,
    deps: [HttpClient],
  },
};
@NgModule({
  imports: [TranslateModule.forRoot(translationOptions)],
  exports: [TranslateModule],
  providers: [TranslateService],
})
export class AppTranslationModule {
  constructor(private translate: TranslateService) {
    if (!localStorage.getItem("lang")) {
      localStorage.setItem("lang", "en");
    }
    translate.addLangs(["en", "br"]);
    translate.setDefaultLang(localStorage.getItem("lang") || "en");
    translate.use(localStorage.getItem("lang") || "en");
    this.listenToEvent();
  }

  listenToEvent() {
    // var that = this;
    // $(window).on("changeLang", {}, function (event) {
    //   that.translate.use(localStorage.getItem("lang") || "en");
    // });
  }
}
