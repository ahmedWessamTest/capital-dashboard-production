import { Directive, ElementRef, HostBinding, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: 'img[appImageLoader]',
  standalone: true
})
export class ImageLoaderDirective implements OnInit {
  @HostBinding('class.loaded') loaded = false;
  
  @Input() placeholderColor = 'skyblue';
  @Input() transitionDuration = '300ms';

  constructor(
    private el: ElementRef<HTMLImageElement>,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.setupStyles();
    this.setupPlaceholder();
  }

  private setupStyles() {
    const parent = this.renderer.parentNode(this.el.nativeElement);
    
    this.renderer.setStyle(parent, 'position', 'relative');
    this.renderer.setStyle(parent, 'width', '60px');
    this.renderer.setStyle(parent, 'height', '60px');
    this.renderer.setStyle(parent, 'border-radius', '50%');
    this.renderer.setStyle(parent, 'overflow', 'hidden');
    
    this.renderer.setStyle(this.el.nativeElement, 'width', '100%');
    this.renderer.setStyle(this.el.nativeElement, 'height', '100%');
    this.renderer.setStyle(this.el.nativeElement, 'object-fit', 'cover');
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
    this.renderer.setStyle(this.el.nativeElement, 'transition', `opacity ${this.transitionDuration} ease-in-out`);
  }

  private setupPlaceholder() {
    const parent = this.renderer.parentNode(this.el.nativeElement);
    const placeholder = this.renderer.createElement('div');
    
    this.renderer.setStyle(placeholder, 'position', 'absolute');
    this.renderer.setStyle(placeholder, 'inset', '0');
    this.renderer.setStyle(placeholder, 'background-color', this.placeholderColor);
    this.renderer.setStyle(placeholder, 'border-radius', '50%');
    this.renderer.setStyle(placeholder, 'transition', `opacity ${this.transitionDuration} ease-in-out`);
    this.renderer.addClass(placeholder, 'image-placeholder');
    
    this.renderer.insertBefore(parent, placeholder, this.el.nativeElement);
    
    this.el.nativeElement.onload = () => {
      this.loaded = true;
      this.renderer.setStyle(placeholder, 'opacity', '0');
      this.renderer.setStyle(placeholder, 'pointer-events', 'none');
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
    };
  }
}