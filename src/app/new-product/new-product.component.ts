import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductService} from "../service/product.service";
import {catchError, map, Observable, of, startWith, Subject, takeUntil} from "rxjs";
import {Product} from "../interface/product";
import {HttpErrorResponse} from "@angular/common/http";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Type} from "../interface/type";
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss']
})
export class NewProductComponent implements OnInit, OnDestroy {
  productCreated$: Observable<{ appState: string; appData?: Product; err?: HttpErrorResponse; }>
  state: string;
  productForm: FormGroup;
  files: File[];
  productTypes: Type[];
  productStates: Type[];
  private ngUnsubscribe = new Subject<void>();
  editorConfig: AngularEditorConfig;

  constructor(private productService: ProductService, private fb: FormBuilder) {
    this.productService.productTypes$().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => this.productTypes = response);
    this.productStates = [{name: "Активный", tp: "ACTIVE"}, {name: "Нет в наличии", tp: "OUT_OF_STOCK"}, {name: "Неактивен", tp: "INACTIVE"}]
    this.files = [];

    this.productForm = this.fb.group({
      productType: [null, Validators.required],
      productState: [null, Validators.required],
      productProducer: ["", Validators.required],
      tittle: ["", Validators.required],
      characteristicsShort: ["", Validators.required],
      characteristics: ["", Validators.required],
      description: ["", Validators.required],
      price: [null, Validators.required],
      n: [null, Validators.required]
    });
    this.state = "INPUT";
  }

  onUploadFiles(event: Event) {
    const files: FileList = (event.target as HTMLInputElement).files
    for (let i = 0; i < files.length; ++i) {
      this.files.push(files.item(i));
    }
  }

  onSendData(): void {
    const formData: FormData = new FormData();
    formData.append("productType", (this.productForm.get("productType").value as Type).tp);
    formData.append("productState", (this.productForm.get("productState").value as Type).tp);
    formData.append("productProducer", this.productForm.get("productProducer").value);
    formData.append("tittle", this.productForm.get("tittle").value);
    formData.append("characteristicsShort", this.productForm.get("characteristicsShort").value);
    formData.append("characteristics", this.productForm.get("characteristics").value);
    formData.append("description", this.productForm.get("description").value);
    formData.append("price", this.productForm.get("price").value)
    formData.append("n", this.productForm.get("n").value);
    for (const file of this.files) {
      formData.append("files", file, file.name)
    }

    this.productCreated$ = this.productService.createdProduct$(formData).pipe(
      map((response) => {
        return {appData: response, appState: "APP_LOADED"}
      }),
      startWith({appState: "APP_LOADING"}),
      catchError((err: HttpErrorResponse) => of({appState: "APP_ERROR", err}))
    )

    this.state = "SHOWING";
  }

  ngOnInit(): void {
    this.editorConfig = {
      editable: true,
      spellcheck: true,
      height: '300px',
      minHeight: '0',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      toolbarHiddenButtons: [
        [
          'strikeThrough',
          'justifyLeft',
          'justifyCenter',
          'justifyRight',
          'justifyFull',
          'indent',
          'outdent',
          'insertUnorderedList',
          'insertOrderedList',
          'heading',
          'fontName'
        ],
        [
          'fontSize',
          'textColor',
          'backgroundColor',
          'link',
          'unlink',
          'insertImage',
          'insertVideo',
          'insertHorizontalRule',
          'removeFormat',
          'toggleEditorMode'
        ]
      ]
    };
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
