import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { TextboxComponent } from 'src/app/components/atomic/textbox/textbox.component';
import { PageSingleComponent } from 'src/app/components/page-single/page-single.component';
import { FilesystemService } from 'src/app/services/filesystem.service';
import { Image } from "src/app/models/image";
import * as Path from "path";

@Component({
  selector: 'app-workbench-single-cam',
  templateUrl: './workbench-single-cam.component.html',
  styleUrls: ['./workbench-single-cam.component.scss']
})
export class WorkbenchSingleCamComponent implements OnInit, AfterViewInit {

  @ViewChild('scene')
  scene!: ElementRef<HTMLDivElement>;

  img!: HTMLImageElement;

  constructor(
    private _electron: ElectronService,
    private fs: FilesystemService
  ) {

    // Init file state Handlers
    this.fileAdded.subscribe((path: string) => { this.fileAddedHandler(path) });
    this.fileRemoved.subscribe((path: string) => { this.fileRemovedHandler(path) });

  }

  ngAfterViewInit(): void {
    this.img = this.scene.nativeElement.querySelector('img') as HTMLImageElement;
  }

  ngOnInit(): void {
  }

  watchedFolder!: string

  selectedPage!: PageSingleComponent;

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

  folderClicked() {

    const ans = this.fs.openFolderDialog();

    if (ans.canceled) return;

    this.watchedFolder = ans.filePaths[0];

    this.startWatching();

  }

  watchTimer!: NodeJS.Timeout
  readonly timerInterval: number = 768;

  startWatching(): void {
    this.watchTimer = setInterval(() => { this.watch() }, this.timerInterval);
  }

  stopWatching(): void {
    clearInterval(this.watchTimer);
  }

  cachedFiles: string[] = [];

  images: Image[] = [];

  readonly acceptedFileTypes: string[] = [
    '.jpg',
    '.jpeg',
    '.png',
  ]

  watch(): void {

    let check = this.fs.readdir(this.watchedFolder);

    // Ignore unsupported file types
    check = check.filter(i => this.acceptedFileTypes.includes(Path.extname(i)));

    // Files that are present in cache but not in the new check | DELETED Files
    this.cachedFiles.filter(file => !check.includes(file)).forEach(deletedFile => {
      this.fileRemoved.emit(Path.join(this.watchedFolder, deletedFile));
    });

    // Files that are present in the check but aren't on the cache |ADDED Files
    check.filter(file => !this.cachedFiles.includes(file)).forEach(addedFile => {
      this.fileAdded.emit(Path.join(this.watchedFolder, addedFile));
    });

    this.cachedFiles = check;

  }

  /** When a file is added to the watched folder */
  fileAdded: EventEmitter<string> = new EventEmitter<string>();

  /** When a file in the watcehd folder is removed */
  fileRemoved: EventEmitter<string> = new EventEmitter<string>();

  fileAddedHandler(path: string): void {

    console.log('addedfile', path);

    const fileStats = this.fs.stat(path);

    const buff = this.fs.readFile(path);

    const newImg = new Image(path, fileStats, buff);

    this.images.push(newImg);


  }

  fileRemovedHandler(path: string): void {

    const deletedImage: Image = this.images.filter(i => i.path === path)[0];

    this.images.splice(this.images.indexOf(deletedImage), 1);

  }

  pageClicked(e: PageSingleComponent): void {
    if (this.selectedPage) // if there was a formerly selected item, deselect it
      this.selectedPage.selected = false;

    this.selectedPage = e;
    e.selected = true;

  }


}
