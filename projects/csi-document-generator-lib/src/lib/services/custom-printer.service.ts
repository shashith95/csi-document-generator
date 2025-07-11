import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DocumentTypesEnum } from '../constants/document-types.enum';
import { firstValueFrom, Observable, Subscription } from 'rxjs';
import { ENVIRONMENT_CONFIG, EnvironmentConfig } from '../config/environment-config';

@Injectable({
  providedIn: 'root'
})
export class CustomPrinterService {
  BASE_URL: string;
  constructor(private readonly http: HttpClient,
              @Inject(ENVIRONMENT_CONFIG) private readonly config: EnvironmentConfig) {
    this.BASE_URL = this.config?.apiBaseUrl || 'https://dev.cloudsolutions.com.sa/csi-api';
  }

  /**
   * Sends a base64 image to the printer based on the document type (ZPL or POS).
   *
   * @param obj - An object containing a base64-encoded image string.
   * @param documentType - The type of document (e.g., LABEL, BILL).
   * @returns Subscription to the HTTP POST request.
   */
  printTemplate(obj: { base64Image: string }, documentType: string): Subscription {
    const printUrl =
      documentType === DocumentTypesEnum.LABEL
        ? 'http://localhost:9000/api/ZPLPrinter'
        : 'http://localhost:8981/pos/print/bill';

    return this.http.post(printUrl, obj).subscribe({
      next: res => {
        console.log('Print success:', res);
      },
      error: err => {
        console.error('Print error:', err);
      }
    });
  }

  /**
   * Retrieves the current printer version information from the system endpoint.
   *
   * @returns Observable containing printer version data.
   */
  checkPrinterVersion(): Observable<any> {
    const url = 'http://localhost:8981/system/systemInfo';
    return this.http.get(url);
  }

  /**
   * Fetches available printer names from the POS system.
   *
   * @returns Observable containing available printer information.
   */
  getPrinterInfo(): Observable<any> {
    const printUrl = 'http://localhost:8981/pos/printHtml/printerNames'
    return this.http.get(printUrl);
  }

  /**
   * Sends a full HTML string along with printer config for version 2 printer rendering.
   *
   * @param obj - Object containing the HTML content, preview flag, and other print options.
   * @returns Observable of the print operation result.
   */
  printTemplateV2(obj: any): Observable<any> {
    const printUrl = 'http://localhost:8981/pos/printHtml/execute'
    return this.http.post(printUrl, obj);
  }

  /**
   * Retrieves all printer configuration settings from the personalization service.
   *
   * @returns Observable of all printer configuration objects.
   */
  getPrinterConfigs(): Observable<any> {
    const configUrl = `${this.BASE_URL}/csi-personalization-service/printer-config`;
    return this.http.get(configUrl);
  }

  /**
   * Sets the printer configuration by determining the appropriate printer and caching logic.
   *
   * @param type - The type of document (e.g., BILL, LABEL, WRISTBAND).
   * @param paperSize - The paper size required for printing.
   * @param category - The category of the printer.
   * @returns Promise resolving to the selected printer configuration object.
   */
  async setPrinterConfigs(type: string, paperSize: string, category: string): Promise<any> {
    let printerInfo: any;
    let printerName: any;

    try {
      printerInfo = await firstValueFrom(this.getPrinterInfo());
    } catch (e) {
      console.error('Error occurred when retrieving printer config==>', e)
    }

    let filterType: string;
    if (type === DocumentTypesEnum.BILL) {
      filterType = 'pos';
    } else if (type === DocumentTypesEnum.LABEL) {
      filterType = 'label';
    } else {
      filterType = 'wristband';
    }

    let filter: string = category ? filterType + category : filterType;
    if (printerInfo) {
      printerName = printerInfo[filter] ?? printerInfo[filterType];
    }
    //If disable-printer-config-cache is true then will call API to get latest configs
    if (localStorage.getItem('disable-printer-config-cache') && JSON.parse(<string>localStorage.getItem('disable-printer-config-cache')) === true) {
      return await this.getConfigData(printerName, paperSize, type, true);
    } else {
      //else first check for session storage and get from session storage or else call the API and get the configs
      let existingConfig = JSON.parse(<string>sessionStorage.getItem('printerConfigs')) ? JSON.parse(<string>sessionStorage.getItem('printerConfigs')) : [];
      if (existingConfig.length > 0) {
        return await this.getConfigData(printerName, paperSize, type);
      } else {
        return await this.getConfigData(printerName, paperSize, type, true);
      }
    }
  }

  /**
   * Retrieves printer configuration data either from API (force = true) or from session storage.
   *
   * @param printerName - Name of the printer to fetch configuration for.
   * @param paper - Paper size used for printing.
   * @param type - Type of document to print.
   * @param force - If true, fetch configs from API instead of session storage.
   * @returns Promise resolving to a matching printer configuration object or undefined.
   */
  async getConfigData(printerName: any, paper: any, type: any,force = false) {
    console.log('getConfigData=> printerName= ', printerName, 'paper= ', paper, 'force=', force);
    if (force) {
      try {
        //to call config API to fetch configs
        const configs: any = await firstValueFrom(this.getPrinterConfigs());
        if (configs && configs.length > 0) {
          //set configs to session storage and return
          sessionStorage.setItem('printerConfigs', JSON.stringify(configs))
          return this.filterConfigs(configs, printerName, paper, type);
        } else {
          console.error('configs are not defined')
          return undefined;
        }
      } catch (e) {
        console.error('error in retrieving printer configs from API==>', e)
        return undefined;
      }
    } else {
      const configs = JSON.parse(<string>sessionStorage.getItem('printerConfigs'));
      return this.filterConfigs(configs, printerName, paper, type);
    }
  }

  /**
   * Filters printer configurations to find the most appropriate match based on printer name, paper, and type.
   * Falls back to 'Default' printer config if no direct match is found.
   *
   * @param configs - Array of available printer configuration objects.
   * @param printerName - Target printer name.
   * @param paper - Paper size used for filtering.
   * @param type - Type of document.
   * @returns A matching printer config object or a default object with height and width properties.
   */
  filterConfigs(configs: any[], printerName: any, paper: any, type: any) {
    let config: undefined;
    if (printerName) {
      config = configs.find(config =>
        config?.printerName?.includes(printerName) &&
        config?.paper === paper &&
        config?.type === type
      );
      if (config) {
        return config;
      }
      config = configs.find(config => config['printerName'] && config['printerName'] === 'Default' && config['paper'] === paper && config['type'] === type);
      return config ?? {height: '', width: ''};
    } else {
      config = configs.find(config => config['printerName'] && config['printerName'] === 'Default' && config['paper'] === paper && config['type'] === type);
      return config ?? {height: '', width: ''};
    }
  }
}
