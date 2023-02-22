import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrphanagesComponent } from './orphanages.component';

describe('OrphanagesComponent', () => {
  let component: OrphanagesComponent;
  let fixture: ComponentFixture<OrphanagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrphanagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrphanagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
