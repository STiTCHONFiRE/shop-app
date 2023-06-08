import {Component, HostListener, Input, OnInit} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, startWith, switchMap} from "rxjs";
import {Order} from "../interface/order";
import {HttpErrorResponse} from "@angular/common/http";
import {Review} from "../interface/review";
import {ReviewStat} from "../interface/review-stat";
import {ReviewService} from "../service/review.service";

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {
  @Input() id: string;
  page$ = new BehaviorSubject<number>(0);
  reviewsContent$ = new BehaviorSubject<Review[]>([]);
  reviews$: Observable<{ appState: string; appErr?: HttpErrorResponse }>
  reviewStat$: Observable<{ appState: string; appData?: ReviewStat; appErr?: HttpErrorResponse }>
  hasNext = true;
  isLoading = true;

  constructor(private reviewService: ReviewService) {
  }

  ngOnInit(): void {
    this.reviews$ = this.page$.pipe(
      switchMap((value) =>
        this.reviewService.reviews$(this.id, value).pipe(
          map((response) => {
            this.reviewsContent$.next(
              [...this.reviewsContent$.value, ...response]
            );

            if (response.length < 5) {
              this.hasNext = false;
            }

            this.isLoading = false;
            return {appState: "APP_LOADED"};
          }),
          startWith({appState: "APP_LOADING"}),
          catchError((err: HttpErrorResponse) => of({appState: "APP_ERROR", appErr: err}))
        )
      )
    )

    this.reviewStat$ = this.reviewService.reviewsStat$(this.id).pipe(
      map((response) => {
        return {appState: "APP_LOADED", appData: response};
      }),
      startWith({appState: "APP_LOADING"}),
      catchError((err: HttpErrorResponse) => of({appState: "APP_ERROR", appErr: err}))
    )
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (this.isScrollAtBottom() && this.hasNext && !this.isLoading) {
      this.isLoading = true;
      this.page$.next(this.page$.value + 1);
    }
  }

  getSum(stat: ReviewStat) {
    let sum: number = 0;
    stat.pc.forEach((value, index) => sum += value * (index + 1));

    return sum / stat.n
  }

  private isScrollAtBottom(): boolean {
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
    return windowBottom >= docHeight;
  }
}
