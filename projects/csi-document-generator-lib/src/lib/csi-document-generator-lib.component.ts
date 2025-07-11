import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'csi-document-generator-lib',
  imports: [],
  templateUrl: './csi-document-generator-lib.component.html',
  styles: ``
})
export class CsiDocumentGeneratorLibComponent implements OnInit, OnDestroy {
  @Input() documentId: string | undefined;
  @Input() apiContext: any | undefined;
  @Input() options: any | undefined;
  @Input() headers: any | undefined;

  constructor() {
  }

  ngOnInit(): void {
    console.log(`Csi Document Generator Lib Works`);
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy');
  }
}
