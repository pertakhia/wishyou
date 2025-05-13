import {
  Component,
  DestroyRef,
  EffectRef,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
  HostListener,
  AfterViewInit,
  ViewChild
} from "@angular/core";
import { Images } from "../../model/image";
import { HttpresoursService } from "../../services/httpresours.service";
import { catchError, of, tap } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ImageCardComponent } from "../image-card/image-card.component";
import { NgFor, NgIf } from "@angular/common";

import { NgxCaptureService } from "ngx-capture";

@Component({
  selector: "app-image-gallery",
  imports: [ImageCardComponent, NgFor],
  templateUrl: "./image-gallery.component.html",
  styleUrl: "./image-gallery.component.scss"
})
export class ImageGalleryComponent implements OnInit, AfterViewInit, OnDestroy {
  private httpResoursService = inject(HttpresoursService);
  public cleanup: EffectRef | null = null;
  public captureService = inject(NgxCaptureService);

  images = signal<Images[]>([]);
  limit = this.httpResoursService.limit;
  page = this.httpResoursService.page;

  screenshotProtectionEnabled = false;

  @ViewChild("screen", { static: true }) screen: any;

  @HostListener("window:blur")
  onBlur() {
    this.screenshotProtectionEnabled = true;
  }

  @HostListener("window:focus")
  onFocus() {
    this.screenshotProtectionEnabled = false;
  }

  constructor() {
    this.cleanup = effect(
      () => {
        this.images.set(this.httpResoursService.images());
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit() {
    // reactively watch the images resource
    this.captureService
      .getImage(document.body, true)
      .pipe(
        tap(img => {
          console.log(img);
        })
      )
      .subscribe();
  }

  ngAfterViewInit() {
    const element = new Image();

    Object.defineProperty(element, "id", {
      get: () => {
        this.screenshotProtectionEnabled = true;
        throw new Error("DevTools detected");
      }
    });
    console.log(element);
  }

  setLimit(event: Event) {
    const value = Number((event.target as HTMLSelectElement).value);
    this.httpResoursService.setLimit(value);
  }

  setPage(event: Event) {
    this.httpResoursService.setPage(Number((event.target as HTMLSelectElement).value));
  }

  onCopyLink(image: Images) {
    navigator.clipboard
      .writeText(image.download_url)
      .then(() => {
        alert("Image URL copied to clipboard!");
      })
      .catch(err => {
        console.error("Failed to copy:", err);
      });
  }
  ngOnDestroy() {}
}
