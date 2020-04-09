import { Component, OnInit } from '@angular/core';
import { PostService } from '../posts/post.service';


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'postd3',
  templateUrl: './user_activity_level.component.html',
  styleUrls: ['./user_activity_level.component.css']
})

export class UserActivityLevelComponent implements OnInit {

  data = [];
  show = false;

  constructor(private postService: PostService) { }
// get the data to the d3 graph
  ngOnInit() {
    this.postService.getGroupByD3().subscribe(d => {
      console.log(d)
      this.data = d.docs;
      if (this.data.length === 0) {
        this.show = false;
      } else {
        this.show = true;
      }
    });
  }
}
