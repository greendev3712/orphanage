import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit {

  constructor() { }
  @Input() adressType!: string;
  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  @ViewChild('addresstext') addresstext: any;

  autocompleteInput!: string;
  queryWait!: boolean;
  ngOnInit(): void {
  }

  
  ngAfterViewInit() {
    this.getPlaceAutocomplete();
  }

    
private getPlaceAutocomplete() {
  const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement,
      {
          
          types: [this.adressType]  // 'establishment' / 'address' / 'geocode'
      });
  google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      this.invokeEvent(place);
  });
}

invokeEvent(place: Object) {
  this.setAddress.emit(place);
}



}
