import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrphanageDetailComponent } from './orphanage-detail.component';


describe('OrphanageDetailComponent', () => {
  let component: OrphanageDetailComponent;
  let fixture: ComponentFixture<OrphanageDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrphanageDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrphanageDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
