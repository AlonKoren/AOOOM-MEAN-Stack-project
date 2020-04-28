import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { CommentsService } from '../comments.service';
import { Comment } from '../comment.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-comment-create',
  templateUrl: './comment-create.component.html',
  styleUrls: ['./comment-create.component.css']
})
export class CommentCreateComponent implements OnInit, OnDestroy {

  enteredTitle = '';
  enteredContent = '';
  comment: Comment;
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private commentId: string;
  private authStatusSub: Subscription;
  private postId: string;

  constructor(
    public commentsService: CommentsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
    this.form = new FormGroup({
      content: new FormControl(null, { validators: [Validators.required] })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('commentId')) {
        this.mode = 'edit';
        this.commentId = paramMap.get('commentId');
        this.isLoading = true;
        this.commentsService.getComment(this.commentId).subscribe(commentData => {
          this.isLoading = false;
          this.comment = {
            id: commentData._id,
            content: commentData.content,
            creator: commentData.creator,
            postId: commentData.postId,
            userName: null,
            commentDate: null
          };

          this.form.setValue({
            content: this.comment.content,
          });
        });
      } else {
        this.mode = 'create';
        this.commentId = null;
        this.postId = paramMap.get('postid');
      }
    });
  }

  onSaveComment() {
    if (!this.authService.isLogin()) {
      window.location.reload();
      return;
    }
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;

    if (this.mode === 'create') {// check if create or update
      this.commentsService.addComment(
        this.postId,
        this.form.value.content,
      );
    } else {
      this.commentsService.updateComment(
        this.commentId,
        this.form.value.content,
        null
      );
    }
    this.form.reset();
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
