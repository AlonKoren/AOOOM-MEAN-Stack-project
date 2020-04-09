import { Component, OnInit } from '@angular/core';
import { PostService } from '../posts/post.service';


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'mapReduceD3',
  templateUrl: './duplicates_in_titles.component.html',
  styleUrls: ['./duplicates_in_titles.component.css']
})

// tslint:disable-next-line: class-name
export class DuplicatesInTitlesComponent implements OnInit {

  data = [];
  show = false;

  constructor(private postService: PostService) { }

  ngOnInit() { // get the data to the d3 graph
    this.postService.getGroupByD3_2().subscribe((d: any) => {
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
