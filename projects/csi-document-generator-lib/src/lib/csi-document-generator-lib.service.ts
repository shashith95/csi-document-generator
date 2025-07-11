import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENVIRONMENT_CONFIG, EnvironmentConfig } from './config/environment-config';
import { firstValueFrom, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import * as htmlToImage from 'html-to-image';
import { CustomPrinterService } from './services/custom-printer.service';
import { DocumentTypesEnum } from './constants/document-types.enum';
import * as _ from 'lodash';
import { ResolvedDocumentResponse } from './models/resolved-document-response';

@Injectable({
  providedIn: 'root'
})
export class CsiDocumentGeneratorLibService {
  BASE_URL: string;
  constructor(@Inject(ENVIRONMENT_CONFIG) private readonly config: EnvironmentConfig,
              private readonly toastr: ToastrService,
              private readonly printerService: CustomPrinterService,
              private readonly http: HttpClient) {
    this.BASE_URL = this.config?.apiBaseUrl || 'https://dev.cloudsolutions.com.sa/csi-api';
  }

  /**
   * Initiates the document printing process by resolving the document from the server
   * and determining the print flow (V1 or V2) based on the framework type.
   *
   * @param documentId - The unique identifier of the document to be printed.
   * @param apiContext - The API context required for the backend request.
   * @param headers - HTTP headers for the backend request.
   * @param isDocumentPreviewEnabled - Flag to enable/disable preview mode.
   */
  public async documentPrint(documentId: string, apiContext: any, headers: any, isDocumentPreviewEnabled: boolean = false): Promise<void> {
    if (!documentId) {
      this.toastr.error("No document id found. Please provide a valid document id.", "Error!");
    }

    if (!headers) {
      this.toastr.error("No headers found. Please provide a valid headers.", "Error!");
    }

    let resolvedDocumentResponse: ResolvedDocumentResponse;
    try {
      resolvedDocumentResponse = await firstValueFrom(
        this.getResolvedDocumentById(documentId, apiContext, headers)
      );
    } catch (error) {
      console.error(`Error occurred while fetching resolved document by id: ${documentId}`, error);
      this.toastr.error(`Error occurred while fetching resolved document by id: ${documentId}`);
      return;
    }

    if (!resolvedDocumentResponse) {
      this.toastr.error(`Document not found for ID: ${documentId}. Please check your inputs!`);
      return;
    }

    const documentOptions: any = resolvedDocumentResponse?.options;
    const resolvedHtml: string = resolvedDocumentResponse?.html;
    const documentType: string = resolvedDocumentResponse?.type;
    const frameWork: string = documentOptions?.frameworkType ?? 'v1';

    if (frameWork == 'v1') {
      await this.handleDocumentPrintV1(documentOptions, resolvedHtml, isDocumentPreviewEnabled, documentId)
    }

    if (frameWork == 'v2') {
      await this.handleDocumentPrintV2(documentOptions, resolvedHtml, isDocumentPreviewEnabled, documentType)
    }
  }

  /**
   * Handles document printing using the legacy (v1) framework.
   * Converts the HTML to image and sends it to the printer.
   *
   * @param options - Document options used for layout and printer settings.
   * @param resolvedHtml - The resolved HTML content of the document.
   * @param isDocumentPreviewEnabled - Whether preview mode is enabled.
   * @param documentId - The document identifier.
   */
  private async handleDocumentPrintV1(options: any, resolvedHtml: string, isDocumentPreviewEnabled: boolean, documentId: string) {
    let divElement;
    if (isDocumentPreviewEnabled) {
      divElement = document.getElementById(`print-section-report`);
    }

    divElement = document.createElement('div');
    divElement.innerHTML = resolvedHtml;

    if (!options) {
      this.toastr.error(`Document options are not available for document id: ${documentId}`);
    }

    const viewportSizingTypeWidth = options.viewportSizingTypeWidth ?? 'px';
    divElement.style.width = options.width + viewportSizingTypeWidth;
    divElement.style.backgroundColor = 'white';
    divElement.style.color = 'black';
    divElement.style.fontWeight = '1000';
    divElement.id = 'csi-local-printer-print-area2';

    if (this.config?.whiteSpaceFix) {
      divElement.style.position = 'absolute';
    }

    divElement.style.zIndex = '-10';

    await new Promise(f => setTimeout(f, 200));

    document.documentElement.appendChild(divElement);

    await htmlToImage.toJpeg(divElement, { backgroundColor: '#ffffff' }).then(async (blob) => {
      document.documentElement.removeChild(divElement);
      const obj = { base64Image: blob };
      return this.printerService.printTemplate(obj, DocumentTypesEnum.BILL);
    }).catch((error) => {
      document.documentElement.removeChild(divElement);
      console.error('Error occurred in htmlToImage method!', error);
      return error;
    });
  }

  /**
   * Handles document printing using the modern (v2) framework.
   * Fetches printer version, configures printer settings and sends HTML for printing.
   *
   * @param options - Document options used for layout and printer settings.
   * @param resolvedHtml - The resolved HTML content of the document.
   * @param isDocumentPreviewEnabled - Whether preview mode is enabled.
   * @param documentType - The type of the document (e.g., 'Label', 'Bill').
   */
  private async handleDocumentPrintV2(options: any, resolvedHtml: string, isDocumentPreviewEnabled: boolean, documentType: string) {
    const category = options.category;
    const paper = options.paper;
    let printerVersionData: any;

    try {
      printerVersionData = await firstValueFrom(this.printerService.checkPrinterVersion());
    } catch (e) {
      console.error("Error occurred while checking printer version", e)
    }


    if (printerVersionData) {
      if (printerVersionData.latestVersion > printerVersionData.currentVersion && printerVersionData.mandatoryVersion) {
        // Display an alert and stop the printing process
        this.toastr.error(
          `Printing process stopped. Printer update to version ${printerVersionData.latestVersion} is mandatory.`,
          "Error"
        );
        return;
      } else if (printerVersionData.latestVersion > printerVersionData.currentVersion) {
        // Check if warning message was sent
        if (!localStorage.getItem("printerUpdateWarningSent")) {
          // Display an alert only
          this.toastr.warning(
            `Printer update to version ${printerVersionData.latestVersion} is recommended`,
            "Warning"
          );
          localStorage.setItem("printerUpdateWarningSent", "true");
        }
      }
    }

    const printerConfig: any = await this.printerService.setPrinterConfigs(documentType, paper, category);
    const printerConfigCloned = _.cloneDeep(printerConfig);

    if(documentType === DocumentTypesEnum.BILL) {
      printerConfigCloned['overflowY'] = 'visible'
      printerConfigCloned['driver'] = 'epos'
    } else {
      printerConfigCloned['overflowY'] = 'hidden';
      printerConfigCloned['driver'] = 'zpl';
    }
    printerConfigCloned['overflowX'] = 'hidden'
    printerConfigCloned['type'] = printerConfig['type'] ?? documentType;
    printerConfigCloned['rotation'] = options?.angle ?? printerConfig['rotation'];
    if (isDocumentPreviewEnabled) {
      printerConfigCloned['rotation'] = "0";
    }
    console.log('LabelPrinterService - printerServiceV2, printerConfigCloned==', printerConfigCloned);
    return await firstValueFrom(this.printerService.printTemplateV2({ htmlString: resolvedHtml, preview: isDocumentPreviewEnabled, ...printerConfigCloned }));
  }

  /**
   * Fetches a resolved document (as HTML) from the backend by document ID.
   *
   * @param documentId - The document identifier to resolve.
   * @param apiContext - API context to be sent in the request payload.
   * @param headers - HTTP headers to use in the request.
   * @returns An Observable containing the resolved document response.
   */
  getResolvedDocumentById(documentId: string | undefined, apiContext: any, headers: any): Observable<any> {
    console.log(`Base URL: ${this.BASE_URL}`)
    const config = {
      headers: { ...headers }
    }
    const payload = {
      apiContext: { ...apiContext }
    }
    const url = `${this.BASE_URL}/document-generator-core/generate/html/${documentId}?lang=en&internationalization=false`;
    return this.http.post(url, payload, config);
  }
}
