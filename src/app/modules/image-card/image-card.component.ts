import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Image } from "../../model/image";
import { NgIf } from "@angular/common";

@Component({
  selector: "app-image-card",
  imports: [NgIf],
  templateUrl: "./image-card.component.html",
  styleUrl: "./image-card.component.scss"
})
export class ImageCardComponent {
  @Input({ required: true }) image!: Image;
  @Output() copyLink = new EventEmitter<Image>();
  imageLoaded = false;

  onCopyLink() {
    this.copyLink.emit(this.image);
  }

  onImageLoad() {
    this.imageLoaded = true;
  }
}
