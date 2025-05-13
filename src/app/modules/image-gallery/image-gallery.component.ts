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
  AfterViewInit
} from "@angular/core";
import { Images } from "../../model/image";
import { HttpresoursService } from "../../services/httpresours.service";
import { catchError, of } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ImageCardComponent } from "../image-card/image-card.component";
import { NgFor, NgIf } from "@angular/common";

@Component({
  selector: "app-image-gallery",
  imports: [ImageCardComponent, NgFor],
  templateUrl: "./image-gallery.component.html",
  styleUrl: "./image-gallery.component.scss"
})
export class ImageGalleryComponent implements OnInit, AfterViewInit, OnDestroy {
  private httpResoursService = inject(HttpresoursService);
  public cleanup: EffectRef | null = null;

  images = signal<Images[]>([]);
  limit = this.httpResoursService.limit;
  page = this.httpResoursService.page;

  screenshotProtectionEnabled = false;

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
