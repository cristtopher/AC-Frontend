import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sidebar-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css']
})
export class SectionComponent implements OnInit {
  @Input() sectionName: string;
  @Input() linkTo: string;
  @Input() iconClass: string;
  @Input() badgeClass: string;
  @Input() badgeValue: number;
  
  
  constructor() { }

  ngOnInit() {
  }

}
