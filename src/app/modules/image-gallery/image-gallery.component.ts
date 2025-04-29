import { Component, DestroyRef, EffectRef, effect, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { Image } from "../../model/image";
import { HttpresoursService } from "../../services/httpresours.service";
import { catchError, of } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ImageCardComponent } from "../image-card/image-card.component";
import { NgFor, NgIf } from "@angular/common";

@Component({
  selector: "app-image-gallery",
  imports: [ImageCardComponent, NgFor, NgIf],
  templateUrl: "./image-gallery.component.html",
  styleUrl: "./image-gallery.component.scss"
})
export class ImageGalleryComponent implements OnInit, OnDestroy {
  private httpResoursService = inject(HttpresoursService);
  public cleanup: EffectRef | null = null;

  images = signal<Image[]>([]);
  limit = this.httpResoursService.limit;
  page = this.httpResoursService.page;

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
  setLimit(event: Event) {
    const value = Number((event.target as HTMLSelectElement).value);
    this.httpResoursService.setLimit(value);
  }

  setPage(event: Event) {
    this.httpResoursService.setPage(Number((event.target as HTMLSelectElement).value));
  }

  onCopyLink(image: Image) {
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
