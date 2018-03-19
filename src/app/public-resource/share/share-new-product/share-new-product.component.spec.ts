import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareNewProductComponent } from './share-new-product.component';

describe('ShareNewProductComponent', () => {
  let component: ShareNewProductComponent;
  let fixture: ComponentFixture<ShareNewProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareNewProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareNewProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
