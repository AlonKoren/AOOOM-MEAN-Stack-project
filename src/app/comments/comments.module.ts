import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommentCreateComponent } from './comment-create/comment-create.component';
import { CommentListComponent } from './comment-list/comment-list.component';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommentContentFilterPipe } from './comment-content-filter.pipe';
import {MatListModule} from '@angular/material/list';



@NgModule({
  declarations: [
    CommentCreateComponent,
    CommentListComponent,
    CommentContentFilterPipe,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AngularMaterialModule,
    RouterModule,
    MatListModule
  ]
})

export class CommentsModule { }
