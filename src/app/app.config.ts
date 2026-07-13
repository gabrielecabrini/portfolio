import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, TitleStrategy, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';
import { TranslateTitleStrategy } from './core/services/title.strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
      withViewTransitions({ skipInitialTransition: true }),
    ),
    provideHttpClient(withFetch()),
    provideTranslateService({ fallbackLang: 'it' }),
    provideTranslateHttpLoader({ prefix: 'assets/i18n/' }),
    { provide: TitleStrategy, useClass: TranslateTitleStrategy },
  ],
};
