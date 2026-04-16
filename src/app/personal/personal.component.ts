import { NgFor, NgIf, NgStyle, NgOptimizedImage } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { ColorService } from '../color.service';

export interface Wisp{
  time: number,
  px: number,
  py: number,
  vx: number,
  vy: number,
}

export interface Flower{
  x: number,
  y: number,
  rotation: number,
  size: number,
  icon: string
}

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [NgIf, NgFor, NgStyle, NgOptimizedImage, NgStyle, NgOptimizedImage],
  templateUrl: './personal.component.html',
  styleUrl: './personal.component.less'
})
export class PersonalComponent {
  value = 0
  greatest_value = 0
  power = 1
  wisps: Array<Wisp> = []
  flowers: Array<Flower> = []
  initial_velocity = 0.5

  stopRunning = false

  mouse_x = 0;
  mouse_y = 0;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouse_x = event.clientX;
    this.mouse_y = event.clientY;
  }

  save() {
    const data = {
      value: this.value,
      greatest_value: this.greatest_value,
      power: this.power,
      flowers: this.flowers,
      color: this.colorService.color
    };

    localStorage.setItem("personal_data", JSON.stringify(data));
  }

  load() {
    const raw = localStorage.getItem("personal_data");
    if (!raw) return;

    try {
      const data = JSON.parse(raw);

      this.value = data.value ?? this.value;
      this.greatest_value = data.greatest_value ?? this.greatest_value;
      this.power = data.power ?? this.power;
      this.colorService.color = data.color
      this.flowers = data.flowers
    } catch {
      console.error('Failed to parse localStorage data');
      this.reset()
    }
  }

  getRandomWisp(){
    return {
      time: 0,
      px: this.mouse_x,
      py: this.mouse_y,
      vx: 2 * (0.5 - Math.random()) * this.initial_velocity * 2.5,
      vy: -(Math.random() + 0.5) * this.initial_velocity
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key.toLowerCase() === 'r') {
      this.reset();
    }
  }

  reset(){
    this.stopRunning = true
    localStorage.clear(); 
    window.location.reload();
  }

  getUpgradeCost(){
    return Math.pow(this.power, 2) * 10
  }

  distanceFlowers(f1: Flower, f2: Flower): number {
    const dx = f1.x - f2.x;
    const dy = f1.y - f2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  validateFlower(position: Flower): boolean {
    // reject if inside forbidden rectangle
    if (Math.abs(position.x - 50) < 40 && Math.abs(position.y - 50) < 12.5) {
      return false;
    }
   
    if(position.x > 80 && position.y < 15){
      return false
    }

    if(position.x < 40 && position.y < 25){
      return false
    }

    // reject if within 2 units of any existing flower
    for (const flower of this.flowers) {
      if (this.distanceFlowers(position, flower) < 8) {
        return false;
      }
    }

    return true;
  }

  addFlower(){
    var test_flower = {x: 50, y: 50, size: 0, rotation: 0, icon: ""}  
    var icon = ["twirly", "lotus", "vanilla", "vine"][Math.floor(Math.random() * 4)]

    while(!this.validateFlower(test_flower)){
      test_flower = {
        x: Math.random() * 95 + 2.5, 
        y: Math.random() * 75 + 5,
        size: Math.random() * 4 + 1.5,
        rotation: Math.random() * Math.PI * 0.2 - Math.PI * 0.1,
        icon:  `assets/${icon}-flower.svg`        
      }
    }
    this.flowers.push(test_flower)
  }

  clickTitle(){
    for(var i = 0; i < this.power; i++){
      this.wisps.push(this.getRandomWisp())
    }
  }

  clickUpgrade(){
    if(this.value >= this.getUpgradeCost()){
      this.value -= this.getUpgradeCost()
      this.power += 1
      this.addFlower()
    }
  }

  getWispStyle(wisp: Wisp) {
    return {
      "left": wisp.px + "px",
      "top": wisp.py + "px",
    }
  }

  getFlowerStyle(flower: Flower) {
    return {
      "left": flower.x + "vw",
      "top": flower.y + "vh",
      "width": flower.size + "vw",
      "height": flower.size + "vw",
      "transform": `translate(-50%, -50%) rotate(${flower.rotation}rad)`
    }
  }

  onInterval() {
    if(this.stopRunning){
      return
    }

    this.wisps.forEach(wisp => {
      wisp.time += 1
      wisp.px += wisp.vx
      wisp.py += wisp.vy

      if(Math.random() > 0.8){
        wisp.vy -= 0.1
      }

      if(wisp.py < 0){
        this.value += 1
      }
    })

    this.wisps = this.wisps.filter(wisp => wisp.py > 0)

    if(this.value > this.greatest_value){
      this.greatest_value = this.value
    }

    this.save()
  }

  copyMessage(val: string){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    alert("Copied to clipboard!")
  }

  getColor(){
    return this.colorService.color
  }

  clickGift(){
    if(this.value > 1000){
      this.value -= 1000
      this.colorService.color = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
    }
  }

  ngOnInit() {
    this.load()
    setInterval(() => this.onInterval(), 1)
  }

  getTitle(){
    return "lennongrad.com"
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: any) {
    event.preventDefault();
  }

  constructor(private colorService: ColorService){}
}
