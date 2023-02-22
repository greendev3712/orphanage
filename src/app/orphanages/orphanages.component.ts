import { Component, OnInit, SimpleChanges } from '@angular/core';
import { GlobalService } from '../global.service';
import { TokenStorageService } from '../_service/token-storage.service';
import { OrphonageService } from '../_service/orphonage.service';
import { Orphonage } from '../_models/Orphonage';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-orphanages',
  templateUrl: './orphanages.component.html',
  styleUrls: ['./orphanages.component.scss']
})
export class OrphanagesComponent implements OnInit {
  orphonages: Orphonage[] = [];
  modelorphonage: Orphonage = new Orphonage();
  stepsModel: any;
  update = false;
  search_countries: any[] = [];
  all_countries: any[] = [];
  selected_country: any;
  storyConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '10rem',
    minHeight: '5rem',
    placeholder: 'Edit your story',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
      ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ],
    };

  constructor(public globalService: GlobalService,
    public token: TokenStorageService,
    private router: Router,
    private orphonageService: OrphonageService) {

  }

  ngOnInit(): void {
    this.modelorphonage.acttype = 'stripe'
    this.getAllOrphonage();
    this.getCountries();
  }


  getAllOrphonage() {
    this.orphonageService.getAllOrphonage().subscribe(result => {

      // this.orphonages = result.items;
      this.globalService.global_orphonages = result.items;
      // this.orphonages.map(item => {
      //   item.location = JSON.parse(item.location)
      //   item.location.url = item.location.url + '&t=&z=13&ie=UTF8&iwloc=&output=embed'
      // })

    })
  }

  save() {
    this.orphonageService.addOrphonage(this.modelorphonage).subscribe(result => {
      this.orphonages.push(result)
      this.modelorphonage = new Orphonage();
      this.globalService.close();
      this.globalService.showSuccess("the addition of the orphanage is successful");

    }, error => {
      console.log(error);
      this.globalService.showError(error.error.message);
    })
  }

  updateOrphonage() {
    this.orphonageService.updateOrphonage(this.modelorphonage).subscribe(result => {
      // this.orphonages.push(result)
      this.modelorphonage = new Orphonage();
      this.getAllOrphonage();
      this.globalService.close();
      this.globalService.showSuccess("the update of the orphanage is successful");

    }, error => {
      this.globalService.showError(error);
    })
  }
  
  onFileChange(event: any) {
    let image = event.target.files[0];
    this.getImagePreview(image);
  }

  getImagePreview(file: File) {
    console.log(file);
    this.stepsModel = [];
    let ext = this.getFileExtension(file.name);

    const reader: FileReader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      //this.imagePreview = reader.result;
      this.stepsModel.push({
        file: file,
        ext: ext,
        name: file.name
      });
      this.addImages();
    };



  }

  getFileExtension(filename: any) {
    if (filename) {
      return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2).toUpperCase();
    }
  }

  addImages() {
    let fData = new FormData();
    //fData.append("media", JSON.stringify(this.stepsModel));
    fData.append("file", this.stepsModel[0].file);
    this.orphonageService.image_upload(fData).subscribe((result: any) => {

      this.modelorphonage.photos_links.push(result);
      this.orphonageService.affectPicOrphanage(this.modelorphonage.id, this.modelorphonage).subscribe(result => {
        this.modelorphonage = new Orphonage();
        this.getAllOrphonage();
        this.globalService.close();
      });

    });
  }


  getAddress(event: any) {
    const tmpLocation = {
      formatted_address: event.formatted_address,
      url: event.url
    }
    this.modelorphonage.location = tmpLocation;
  }

  goToDetails(orphonage: any) {
    console.log(orphonage)
    this.orphonageService.orphonage = orphonage;
    this.router.navigate(['/orphenages/orphanageDetail']);
  }

  goToDonate(orphonage: any) {
    this.orphonageService.orphonage = orphonage;
    this.router.navigate(['/donate'], { state: orphonage });
  }


  deleteOrphonage(id: any) {
    this.orphonageService.deletteOrphonage(id).subscribe(result => {
      // this.orphonages.push(result)
      this.globalService.showSuccess("the delete of the orphanage is successful");
      this.getAllOrphonage()
    }, error => {
      this.globalService.showError(error);
    })
  }
  
  donnationOrphanage:any
  orphanage_donations(orphonage:any,modalName:any){
    console.log(orphonage)
    this.orphonageService.orphanage_donations(orphonage).subscribe(result => {
      this.donnationOrphanage = result
      this.globalService.triggerModal(modalName)
    }, error => {
      this.globalService.showError(error.error);
    })
  }

  //get countries for add/update modal and search field 
  getCountries() {
    this.orphonageService.getAllOrphonage().subscribe(result => {
      const unique = (value: any, index: any, self: any) => { return self.indexOf(value) === index }
      let unique_countries = result.items.map(function (item: any) { return item["country"]; }).filter(unique);
      this.search_countries = unique_countries;
    })
  }

  //set orphonages to values been searched 
  setSearchOrphonage() {
    this.orphonageService.getAllOrphonage().subscribe(result => {
    //  this.orphonages = result.items;
    this.globalService.global_orphonages = result.items;
     var selected_country = this.selected_country;
     if(selected_country != ''){
      // this.orphonages = this.orphonages.filter(function (orphonage) {
      //   return orphonage.country.toLowerCase() == selected_country.toLowerCase();
      // });
      this.globalService.global_orphonages = this.globalService.global_orphonages.filter(function (orphonage) {
        return orphonage.country.toLowerCase() == selected_country.toLowerCase();
      });
     }
    })
  }
  clearOrphonageCache() {
    this.modelorphonage = new Orphonage();
    this.update=false;
  }

}
