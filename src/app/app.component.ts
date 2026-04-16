import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Project, PROJECTS } from './projects';
import { NgFor, NgClass, NgIf } from '@angular/common';
import { ProjectsComponent } from "./projects/projects.component";
import { PersonalComponent } from "./personal/personal.component";
import { ColorService } from './color.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, NgIf, ProjectsComponent, PersonalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  showProjects = false
  
  clickRandomProject(){
    var validProjects = PROJECTS.filter(project => project.mainLink != "")
    var randomProject = validProjects[Math.floor(Math.random() * validProjects.length)]
    window.open(randomProject.links.get(randomProject.mainLink))
    console.log(randomProject.links.get(randomProject.mainLink))
  }

  clickProjects(){
    this.showProjects = !this.showProjects
  }

  getTop(){
    return this.showProjects ? "-100%" : "-0%"
  }

  getColor(){
    return this.colorService.color
  }

  constructor(private colorService: ColorService){}
}
