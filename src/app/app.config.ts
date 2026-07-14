import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, TitleStrategy, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideTranslateService, TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';

registerLocaleData(localeIt, 'it');
import { Observable, of } from 'rxjs';

import * as it from '../../public/assets/i18n/it.json';
import * as en from '../../public/assets/i18n/en.json';

import { routes } from './app.routes';
import { TranslateTitleStrategy } from './core/services/title.strategy';

const TRANSLATIONS: Record<string, TranslationObject> = { it, en };

// Translations are bundled at build time and returned synchronously (of(...)) instead
// of fetched over HTTP: on prerendered pages there's no client-side request to wait on
// for text to appear, and on the server there's no HTTP client available anyway.
class InlineTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<TranslationObject> {
    return of(TRANSLATIONS[lang] ?? TRANSLATIONS['it']);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
      withViewTransitions({ skipInitialTransition: true }),
    ),
    provideHttpClient(withFetch()),
    provideTranslateService({
      fallbackLang: 'it',
      loader: { provide: TranslateLoader, useClass: InlineTranslateLoader },
    }),
    { provide: TitleStrategy, useClass: TranslateTitleStrategy },
  ],
};
