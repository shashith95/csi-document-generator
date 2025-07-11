import { Component } from '@angular/core';
import {
  CsiDocumentGeneratorLibComponent
} from '../../../projects/csi-document-generator-lib/src/lib/csi-document-generator-lib.component';

@Component({
  selector: 'app-dashboard',
  imports: [CsiDocumentGeneratorLibComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  documentId: string = '653fc3fc57807e10c44fb390';
  apiContext: any = {
    "patientPomrId": 38478,
    "pomrId": 38478,
    "patientId": 121593,
    "patientName": null,
    "doctorId": 25050,
    "doctorName": "Faruq Bilal",
    "appointmentId": 189271,
    "episodeId": 26851,
    "createdBy": null,
    "chiefComplainTemplateId": 0,
    "chiefComplain": null,
    "createdOn": "2022-05-24 10:51:44",
    "modifiedBy": null,
    "modifiedOn": "2022-06-01 00:00:03",
    "approvedBy": null,
    "approvedOn": null,
    "hospitalId": 59,
    "hospitalGroupId": 58,
    "clinicGroupId": 270,
    "clinicId": 220,
    "pomrStatus": 3,
    "pomrSingOn": "2022-06-01 00:00:03",
    "checkInDateTime": null,
    "checkOutDateTime": null,
    "isNursingServices": null,
    "fallowUpDate": null,
    "adtAdmissionId": 223567,
    "unitId": 2451,
    "hhcReferralId": null,
    "unitName": "CRITICAL CARE NG",
    "isReadOnly": false,
    "admissionNumber": "A202252423930",
    "loginUserId": null,
    "seenAtStatus": "PENDING",
    "vprnSeenAtStatus": "NOT_STARTED",
    "chiefComplains": [
      {
        "chiefComplainId": 27139,
        "patientPomrId": 38478,
        "patientId": 121593,
        "patientName": "SAADALLAH FAIHA GHANIM",
        "doctorId": 25050,
        "doctorName": "Faruq Bilal",
        "appointmentId": 189271,
        "episodeId": 26851,
        "createdBy": "Faruq Bilal",
        "createdId": 25050,
        "chiefComplainTemplateId": 722,
        "chiefComplain": "fever",
        "createdOn": "2022-05-24 10:55:22",
        "modifiedBy": null,
        "modifiedId": null,
        "modifiedOn": "2022-05-24 10:55:22",
        "approvedBy": null,
        "approvedOn": null,
        "hospitalId": 59,
        "hospitalGroupId": 58,
        "clinicGroupId": null,
        "clinicId": 220,
        "loginUserId": "3033",
        "locations": "{\r\n  \"location1\" : {\r\n    \"displayName\" : \"OPD\",\r\n    \"location\": \"OPD\"\r\n  },\r\n  \"location2\" : {\r\n    \"displayName\" : \"SOAP\",\r\n    \"location\": \"SOAP\"\r\n  }\r\n}"
      }
    ],
    "readOnly": false,
    "fallowUpRequired": false,
    "fallowUp": false
  };
  options: any | undefined;
  headers: any = {
    'x-group': '58',
    'x-hospital': '59',
    'x-location': '59',
    'x-module': 'admin-ui',
    'x-user': '4000',
  }

}
