import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project, PROJECTS } from '../projects';
import { KeyValuePipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [NgFor, NgIf, KeyValuePipe],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.less'
})
export class ProjectsComponent {
  selectedIndex = 0;
  newSelected = 0;
  selectTimer = 0;
  showDeadname = false;

  parseMonthYear(str: string): number {
    const [month, year] = str.split(" ");
    const date = new Date(`${month} 1, ${year}`);
    return date.getTime();
  }

  sortProjectsByDate(projects: Project[]): Project[] {
      return [...projects].sort((a, b) => {
          return this.parseMonthYear(b.date) - this.parseMonthYear(a.date)
      });
  }

  getTransform(){
    if(this.newSelected != this.selectedIndex){
      return "translate(-50%, -50%) scale(0) "
    }
    return "translate(-50%, -50%) scale(1) "
  }

  clickProject(index: number){
    this.newSelected = index
    this.selectTimer = 30
  }

  getProjects(): Array<Project> {
    return this.sortProjectsByDate(PROJECTS)
  }

  getSelectedProject(): Project {
    return this.getProjects()[this.selectedIndex]
  }

  getDates(): String{
    if(this.getSelectedProject().start == ''){
      return this.getSelectedProject().date
    }
    return `${this.getSelectedProject().start} - ${this.getSelectedProject().date}`
  }

  onInterval() {
    if(this.selectTimer > 0){
      this.selectTimer -= 1
      if(this.selectTimer == 0){
        this.selectedIndex = this.newSelected
      }
    }
  }

  ngOnInit() {
    this.showDeadname = window.location.href.includes("?w")

    setInterval(() => this.onInterval())
  }

  constructor(private route: ActivatedRoute){

  }
}
