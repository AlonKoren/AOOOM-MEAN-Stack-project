import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommentCreateComponent } from './comment-create/comment-create.component';
import { CommentListComponent } from './comment-list/comment-list.component';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommentContentFilterPipe } from './comment-content-filter.pipe';
import {MatListModule} from '@angular/material/list';
import {CommentNameFilterPipe} from './comment-name-filter.pipe';
import {CommentDateFilterPipe} from './comment-date-filter.pipe';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';


@NgModule({
  declarations: [
    CommentCreateComponent,
    CommentListComponent,
    CommentContentFilterPipe,
    CommentNameFilterPipe,
    CommentDateFilterPipe,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AngularMaterialModule,
    RouterModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})

export class CommentsModule { }
