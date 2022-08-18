import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PamComponent } from './pam.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { IframeComponent } from './iframe/iframe.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from '../@theme/components';
import { SharedModule } from './shared/shared.module';
import { AppTranslationModule } from '../app-translation.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    SharedModule,
    AppTranslationModule,
    TranslateModule
    // NgbModule,
    // CsvModule,
    // FormsModule,
    // AngularMultiSelectModule,
    // BlockUIModule.forRoot()
    
  ],
  declarations: [
    PamComponent,
    // HeaderComponent, 
    IframeComponent,
     HomeComponent
  ],

})
export class PagesModule {
}
