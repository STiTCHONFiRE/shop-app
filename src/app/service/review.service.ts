import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ReviewStat} from "../interface/review-stat";
import {Review} from "../interface/review";
import {first} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly SERVER_URL: string = "http://localhost:8081/api/v1/reviews"

  constructor(private httpClient: HttpClient) {
  }

  reviews$ = (id: string, page: number) => this.httpClient.get<Review[]>(`${this.SERVER_URL}/${id}?page=${page}`);

  reviewsStat$ = (id: string) => this.httpClient.get<ReviewStat>(`${this.SERVER_URL}/${id}/stat`);

  createReview$ = (id: string, rating: number, text: string, orderId: string) =>
    this.httpClient.post<Review>(`${this.SERVER_URL}/${id}/create`, {rating: rating, text: text, orderId: orderId})
      .pipe(
        first()
      )

}
