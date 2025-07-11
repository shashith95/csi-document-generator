import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENVIRONMENT_CONFIG, EnvironmentConfig } from './config/environment-config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CsiDocumentGeneratorLibService {
  BASE_URL: string;
  constructor(@Inject(ENVIRONMENT_CONFIG) private readonly config: EnvironmentConfig,
              private readonly http: HttpClient) {
    this.BASE_URL = this.config?.apiBaseUrl || 'https://dev.cloudsolutions.com.sa/';
  }

  getResolvedDocumentById(documentId: string | undefined, apiContext: any, headers: any): Observable<any> {
    const config = {
      headers: { ...headers }
    }
    const url = `${this.BASE_URL}/csi-api/document-generator-core/generate/pdf/${documentId}?lang=en&internationalization=false`;
    return this.http.post(url, apiContext, config);
  }
}
