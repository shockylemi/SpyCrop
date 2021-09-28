import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { PageSingleComponent } from 'src/app/components/page-single/page-single.component';
import { NgxfsService } from 'src/app/services/ngxfs.service';

@Component({
  selector: 'app-workbench-single-cam',
  templateUrl: './workbench-single-cam.component.html',
  styleUrls: ['./workbench-single-cam.component.scss']
})
export class WorkbenchSingleCamComponent implements OnInit {

  constructor(
    private _electron: ElectronService,
    private fs: NgxfsService
  ) { }

  ngOnInit(): void {
  }

  selectedPage!: PageSingleComponent;

  pages: object[] = [{}, {}, {}, {}, {}, {}, {}, {}, {},]

  list = [
    { id: 0, name: 'banana' },
    { id: 1, name: 'apple' },
    { id: 2, name: 'carrots' },
    { id: 3, name: 'peach' },
    { id: 4, name: 'potato' },
    { id: 5, name: 'tomato' },
    { id: 6, name: 'leeks' },
    { id: 7, name: 'pomegranate' },
    { id: 8, name: 'strawberry' },
    { id: 9, name: 'blueberry' },
  ]

  e: object = {};

  folderClicked(): void {
    this._electron.shell.beep();
    console.log(this.fs.fs);
    console.log(typeof (this.fs.fs))
    // console.log(this._electron)
    // console.log(this._electron.clipboard)
    // console.log(this._electron.crashReporter)
    // console.log(this._electron.desktopCapturer)
    // console.log(this._electron.ipcRenderer)
    // console.log(this._electron.isArm)
    // console.log(this._electron.isElectronApp)
    // console.log(this._electron.isLinux)
    // console.log(this._electron.isMacOS)
    // console.log(this._electron.isWindows)
    // console.log(this._electron.isX64)
    // console.log(this._electron.isX86) 
    // console.log(this._electron.nativeImage)
    // console.log(this._electron.process)
    // console.log(this._electron.remote)
    // console.log(this._electron.screen)
    // console.log(this._electron.shell)
    // console.log(this._electron.webFrame)
  }

  pageClicked(e: PageSingleComponent): void {
    if (this.selectedPage) // if there was a formerly selected item, deselect it
      this.selectedPage.selected = false;

    this.selectedPage = e;
    e.selected = true;
  }


}
