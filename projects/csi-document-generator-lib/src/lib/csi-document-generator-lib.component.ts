import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { CsiDocumentGeneratorLibService } from './csi-document-generator-lib.service';
import { ToastrService } from 'ngx-toastr';

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

  constructor(private readonly csiDocumentGeneratorLibService: CsiDocumentGeneratorLibService,
              private readonly toastr: ToastrService) {
  }

  ngOnInit(): void {
    if (!this.documentId) {
      this.toastr.error("No document id found. Please provide a valid document id.", "Error!");
    }

    if (!this.headers) {
      this.toastr.error("No headers found. Please provide a valid headers.", "Error!");
    }

    this.csiDocumentGeneratorLibService.getResolvedDocumentById(this.documentId, this.apiContext, this.headers);
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy');
  }

}
