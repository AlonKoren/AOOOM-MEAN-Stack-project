import { Comment } from './comment.model';
import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: 'commentNameFilter'
})
// filter comments by name

export class CommentNameFilterPipe implements PipeTransform {
  transform(comments: Comment[], searchTerm: string): Comment[] {
    if (!comments || !searchTerm) {
      return comments;
    }
    return comments.filter(comment =>
      comment.userName.toLocaleLowerCase().indexOf(searchTerm.toLocaleLowerCase()) !== -1);
  }
}
