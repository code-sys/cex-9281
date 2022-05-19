import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TblPdfsResultadoLaboratorioComponent } from './tbl-pdfs-resultado-laboratorio.component';

describe('TblPdfsResultadoLaboratorioComponent', () => {
  let component: TblPdfsResultadoLaboratorioComponent;
  let fixture: ComponentFixture<TblPdfsResultadoLaboratorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TblPdfsResultadoLaboratorioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TblPdfsResultadoLaboratorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
