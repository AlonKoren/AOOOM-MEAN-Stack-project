import { Post } from './post.model';
import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: 'postNameFilter'
})
// filter post by name

export class PostNameFilterPipe implements PipeTransform {
  transform(posts: Post[], searchTerm: string): Post[] {
    if (!posts || !searchTerm) {
      return posts;
    }
    return posts.filter(post =>
      post.userName.toLocaleLowerCase().indexOf(searchTerm.toLocaleLowerCase()) !== -1);
  }
}
