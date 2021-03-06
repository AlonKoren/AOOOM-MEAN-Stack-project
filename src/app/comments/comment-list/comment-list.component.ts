import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Comment } from '../comment.model';
import { CommentsService } from '../comments.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import {APP_DATE_FORMATS, AppDateAdapter} from '../date.adapter';


@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})

export class CommentListComponent implements OnInit, OnDestroy {

  comments: Comment[] = []; // comments array

  isLoading = false;
  totoalComments = 0;
  commentsPerPage = 25;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10, 25, 50, 100];
  userIsAuth = false;
  userId: string;
  private commentsSub: Subscription;
  private authStateusSub: Subscription;
  postId: string;

  searchTermByContent: string;
  searchTermByName: string;
  searchTermByDate: Date;

  constructor(public commentsService: CommentsService, public route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;

    this.userId = this.authService.getUserId();
    this.commentsSub = this.commentsService.getCommentUpdateListener()
      .subscribe((commentData: { comments: Comment[], commentCount: number }) => {
        this.isLoading = false;
        this.totoalComments = commentData.commentCount;
        this.comments = commentData.comments;
      });
    this.userIsAuth = this.authService.getIsAuth();
    this.authStateusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuth = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.postId = paramMap.get('postid');
      this.commentsService.getFilteredComments(this.postId, this.commentsPerPage, 1);
    });
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.commentsPerPage = pageData.pageSize;
    this.commentsService.getFilteredComments(this.postId, this.commentsPerPage, this.currentPage);
  }

  onDelete(commentId: string) {
    this.isLoading = true;
    this.commentsService.deleteComment(commentId).subscribe(() => {
      this.commentsService.getFilteredComments(this.postId, this.commentsPerPage, this.currentPage);
    });
    this.comments = [];
    window.location.reload();
  }

  ngOnDestroy() {
    this.commentsSub.unsubscribe();
    this.authStateusSub.unsubscribe();
    this.comments = [];
  }
}
