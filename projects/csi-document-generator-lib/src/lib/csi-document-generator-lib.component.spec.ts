import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsiDocumentGeneratorLibComponent } from './csi-document-generator-lib.component';

describe('CsiDocumentGeneratorLibComponent', () => {
  let component: CsiDocumentGeneratorLibComponent;
  let fixture: ComponentFixture<CsiDocumentGeneratorLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CsiDocumentGeneratorLibComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsiDocumentGeneratorLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
