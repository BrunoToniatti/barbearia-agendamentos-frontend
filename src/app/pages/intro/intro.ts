import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './intro.html',
  styleUrls: ['./intro.scss']
})
export class Intro implements OnInit, OnDestroy {
  private timer?: number;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Ajuste o tempo total da animação + delay do redirect
    this.timer = window.setTimeout(() => {
      this.router.navigateByUrl('/identificacao');
    }, 2800); // 2.8s
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  pular(): void {
    this.router.navigateByUrl('/identificacao');
  }
}
