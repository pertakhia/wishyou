import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full"
  },
  {
    path: "home",
    loadComponent: () => import("./modules/image-gallery/image-gallery.component").then(m => m.ImageGalleryComponent)
  }
];
