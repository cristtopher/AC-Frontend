import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sidebar-group-section',
  templateUrl: './group-section.component.html',
  styleUrls: ['./group-section.component.css']
})
export class GroupSectionComponent implements OnInit {
  @Input() sectionName: string;
  @Input() iconClass: string;
  
  //isOpen: boolean = false;
  
  constructor() { }

  ngOnInit() {
  }

}
