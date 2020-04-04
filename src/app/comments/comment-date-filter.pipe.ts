import { Comment } from './comment.model';
import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: 'commentDateFilter'
})
// filter comments by date

export class CommentDateFilterPipe implements PipeTransform {
  transform(comments: Comment[], searchTerm: Date): Comment[] {
    if (!comments || !searchTerm) {
      return comments;
    }


    return comments.filter(comment => {
      return comment.commentDate.getDate() === searchTerm.getDate();
    });
  }
}
