import { animate, style, transition, trigger } from '@angular/animations';

export const animation = [
  trigger('smooth', [
    transition(':enter', [style({ opacity: 0 }), animate('.5s ease-out', style({ opacity: 1 }))]),
    transition(':leave', [style({ opacity: 1 }), animate('.5s ease-in', style({ opacity: 0 }))]),
  ]),
  trigger('slideUp', [
    transition(':enter', [
      style({ transform: 'translateY(-300%)' }),
      animate('.5s ease-in', style({ transform: 'translateY(0%)' })),
    ]),
    transition(':leave', [animate('.5s ease-in', style({ transform: 'translateY(100%)' }))]),
  ]),
  trigger('slideDown', [
    transition(':enter', [
      style({ transform: 'translateY(100%)' }),
      animate('.5s ease-in', style({ transform: 'translateY(0%)' })),
    ]),
    transition(':leave', [animate('.5s ease-in', style({ transform: 'translateY(100%)' }))]),
  ]),
];
