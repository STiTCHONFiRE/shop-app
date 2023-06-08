import {Component, Input, OnInit} from '@angular/core';
import {OrderPosition} from "../interface/order-position";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReviewService} from "../service/review.service";

@Component({
  selector: 'app-order-position',
  templateUrl: './order-position.component.html',
  styleUrls: ['./order-position.component.scss']
})
export class OrderPositionComponent implements OnInit {
  @Input() position: OrderPosition;
  @Input() state: string
  @Input() id: string
  form: FormGroup;

  constructor(private fb: FormBuilder, private reviewService: ReviewService) {
  }

  ngOnInit(): void {
    if (this.state == "DONE") {
      this.form = this.fb.group({
        rating: ["", Validators.required],
        text: ["", Validators.required]
      })
    }
  }

  onSendData() {
    this.reviewService.createReview$(this.position.product.id, this.form.get("rating").value, this.form.get("text").value, this.id)
      .subscribe((value) => this.position.review = value);
  }
}
