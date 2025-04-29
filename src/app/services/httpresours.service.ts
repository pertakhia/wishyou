import {  httpResource } from "@angular/common/http";
import { computed, Injectable, signal } from "@angular/core";
import { Image } from "../model/image";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class HttpresoursService {



  // signals for pagination
  limit = signal(10);
  page = signal(1);

  // URL + computed params
  private url =  environment.apiUrl;
  private imagesResource = httpResource<Image[]>(() => `${this.url}?limit=${this.limit()}&page=${this.page()}`);

  // signal for images
  images = computed(() => this.imagesResource.value() ?? []);

  setLimit(value: number) {
    this.limit.set(value);
  }

  setPage(value: number) {
    this.page.set(value);
  }
}
