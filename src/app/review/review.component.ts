import {Component, Input, OnInit} from '@angular/core';
import {Review} from "../interface/review";

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  @Input() review: Review

  ngOnInit(): void {
  }

}
