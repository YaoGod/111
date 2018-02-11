import { Injectable } from '@angular/core';

@Injectable()
export class Dossier {

  id : number;
  buildingId   : string;
  buildingNum  : string;
  buildingName : string;
  classId      : string;
  className    : string;
  title        : string;
  bookName     : string;
  content      : string;
  filePath     : Array<string>;
  fileName     : Array<string>;
  baseDossier  : Array<any>;
}
