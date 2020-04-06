import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Appearance } from '@angular-material-extensions/google-maps-autocomplete';
import PlaceResult = google.maps.places.PlaceResult;
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { Marker } from '../map.model';
import {PostService} from '../../posts/post.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  public appearance = Appearance;
  public zoom: number;
  public lat: number;
  public lng: number;
  public selectedAddress: PlaceResult;
  public markers: Marker[] = [];
  public locations: any;
  constructor(private userCountry: AuthService, private postlocation: PostService, private router: Router) {
  }

  ngOnInit() {
    // tslint:disable-next-line: variable-name
    const other_array: any[] = [];
    this.lat = 32.2912256; // the default map location
    this.lng = 34.873344;
    this.postlocation.newGetAll().subscribe((d: any) => {
      const allposts = d.posts;
      const result = allposts.reduce((r, a) => {
          const num = Math.pow(2, (a.latitude)) * Math.pow(3, (a.longitude));
          r[num] = r[num] || [];
          r[num].push(a);
          return r;
        }, {});

      console.log('result', result);
      for (const [key, value] of Object.entries(result)) {
        console.log(`${key}: ${value}`);
        // @ts-ignore
        const elements: string[] = value.reduce((r, a) => {
          r.push(a.title);
          return r;
        }, []);

        console.log(elements);
        const mark: Marker = { lat: value[0].latitude, lng: value[0].longitude, labels: elements, draggable: false };
        other_array.push(mark);
      }
    });
    this.markers = other_array;
  }
  clickedMarker(label: string, index: number) {
  }

}
