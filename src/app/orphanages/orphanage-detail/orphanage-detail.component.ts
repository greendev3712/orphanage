import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/global.service';
import { OrphonageService } from 'src/app/_service/orphonage.service';
import { Orphonage } from '../../_models/Orphonage';

import { DomSanitizer } from "@angular/platform-browser";
import { TokenStorageService } from 'src/app/_service/token-storage.service';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { environment } from 'src/environments/environment';

// import $ from 'jquery'
// import {Editor} from 'ngx-editor'
@Component({
  selector: 'app-orphanage-detail',
  templateUrl: './orphanage-detail.component.html',
  styleUrls: ['./orphanage-detail.component.scss']
})
export class OrphanageDetailComponent implements OnInit {
  orphonage: Orphonage = new Orphonage();
  showMore = false;
  showMore2 = false;
  stepsModel: any;
  certificate = false;
  selectedImage:string = "";
  tabToShow: string = 'story';
  update: boolean = false;
  faqShowIndex:number = 0;
  story_editor:string = '';
  moneyuse_editor:string = '';
  activities_editor:string = '';
  beneheading_editor:string = '';
  benecontent_editor:string = '';
  temp_editor:Orphonage = new Orphonage();
  storyConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
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

    moreinfoConfig: AngularEditorConfig = {
      editable: true,
      spellcheck: true,
      height: '15rem',
      minHeight: '5rem',
      placeholder: 'Edit your more info',
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
      uploadUrl: environment.AUTH_API + '/image_upload',
      };
  //Editors
  // story_editor:Editor = new Editor();
  // activity_editor:Editor = new Editor();
  // money_editor:Editor = new Editor();
  // bene_editor:Editor = new Editor();
  // bene_text: Editor = new Editor();
  constructor(public globalService: GlobalService,
    public token: TokenStorageService,
    private router: Router,
    private orphonageService: OrphonageService, public sanitizer: DomSanitizer) { }
  ngOnInit(): void {
    this.orphonage = this.orphonageService.orphonage;
    if(this.orphonage.id){
        window.localStorage.setItem('current_orphonage', JSON.stringify(this.orphonage))
      }
    else
      if(window.localStorage.getItem('current_orphonage')){
        let temp : any = window.localStorage.getItem('current_orphonage');
        this.orphonage = JSON.parse(temp);
        this.orphonageService.orphonage = JSON.parse(temp);
      }
  }
  onTabChange(param: string) {
    switch(param)
    {
      case 'moreinfo':
        document.getElementById('moreinfo-tab')?.classList.add('active');
        document.getElementById('story-tab')?.classList.remove('active');
        document.getElementById('faqs-tab')?.classList.remove('active');
        break;
      case 'faqs':
        document.getElementById('faqs-tab')?.classList.add('active');
        document.getElementById('moreinfo-tab')?.classList.remove('active');
        document.getElementById('story-tab')?.classList.remove('active');
        break;
      default:
        document.getElementById('story-tab')?.classList.add('active');
        document.getElementById('moreinfo-tab')?.classList.remove('active');
        document.getElementById('faqs-tab')?.classList.remove('active');
    }
    this.tabToShow = param;
  }
  onFileChange(event: any) {
    let image = event.target.files[0];
    this.getImagePreview(image);
    this.certificate = false;
  }

  onFileCertificateChange(event: any){
    let image = event.target.files[0];
    this.getImagePreview(image);
    this.certificate = true;
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
  faqToShow(param:number){
    let items = document.getElementsByClassName('accordion-button');
    for(let i = 0; i < items.length; i++)
    {
      items[i].setAttribute('aria-expanded', 'false');
    }
    items[param].setAttribute('aria-expanded', 'true');
    this.faqShowIndex = param;
  }
  addImages() {
    console.log(this.certificate);
    let fData = new FormData();
    fData.append("media", JSON.stringify(this.stepsModel));
    fData.append("file", this.stepsModel[0].file);
    let photos_links: any;
    //Upload file on the backeend filesystem
    this.orphonageService.image_upload(fData).subscribe(result => {
      //update backend db for mapping filepaths
      if(this.certificate) {
        console.log(result.filepath);
        this.orphonage.registration_certificate = result.filepath;
        console.log(result);
        console.log(this.orphonage);
        this.orphonageService.updateOrphonage(this.orphonage).subscribe(result => {
          this.globalService.close();
        });
      }
      else{
        this.orphonage.photos_links.push(result);
        console.log(photos_links);
        console.log(this.orphonage);
        this.orphonageService.affectPicOrphanage(this.orphonage.id, this.orphonage).subscribe(result => {
          this.globalService.close();
        });
      }
    });
  }
  
  onClickImage(path: string) {
    alert(path);
  }

  goToDonate(orphonage: any) {
    this.orphonageService.orphonage = orphonage;
    this.router.navigateByUrl('/donate', { state: orphonage });
  }

   
  toServiceDeleteImage(filepath: string, certificate: boolean){  
    //send to backend the new photos_links
    if(certificate){
      this.orphonage.registration_certificate = "";
      this.orphonageService.updateOrphonage(this.orphonage).subscribe(result => {
        this.globalService.close();
      });
    }
    else{
      this.orphonage.photos_links = this.orphonage.photos_links.filter(function(old_photo_links){
        return old_photo_links.filepath != filepath;
      });
      this.orphonageService.deleteImageLink(this.orphonage.id , this.orphonage).subscribe(result => {
        this.globalService.close();
      });
    }

    //Delete image file
    this.orphonageService.deleteImage(filepath).subscribe(result => {
      console.log(result);
      this.globalService.close();
    });

  }

  save() {
    this.orphonageService.addOrphonage(this.orphonage).subscribe(result => {
      // this.orphonages.push(result)
      // this.orphonage = new Orphonage();
      this.globalService.close();
      this.globalService.showSuccess("the addition of the orphanage is successful");

    }, error => {
      console.log(error);
      this.globalService.showError(error.error.message);
    })
  }

  updateOrphonage() {
    this.orphonageService.updateOrphonage(this.temp_editor).subscribe(result => {
      // this.orphonages.push(result)
      // this.modelorphonage = new Orphonage();
      this.orphonage = {...this.temp_editor};
      localStorage.setItem('current_orphonage', JSON.stringify(this.orphonage))
      this.getAllOrphonage();
      this.globalService.close();
      this.globalService.showSuccess("the update of the orphanage is successful");

    }, error => {
      this.globalService.showError(error);
    })
  }
  
  getAllOrphonage() {
    this.orphonageService.getAllOrphonage().subscribe(result => {

      this.globalService.global_orphonages = result.items;

      // this.orphonages.map(item => {
      //   item.location = JSON.parse(item.location)
      //   item.location.url = item.location.url + '&t=&z=13&ie=UTF8&iwloc=&output=embed'
      // })

    })
  }
  deepOrphonageCopy(param: Orphonage) {
    this.update=true;
    this.temp_editor = {...param};
  }
}
