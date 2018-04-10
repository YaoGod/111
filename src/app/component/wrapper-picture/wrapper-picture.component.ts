import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
declare var $:any;
@Component({
  selector: 'app-wrapper-picture',
  templateUrl: './wrapper-picture.component.html',
  styleUrls: ['./wrapper-picture.component.css']
})
export class WrapperPictureComponent implements OnChanges {

  @Input ()  list : Array<any>;   /*展示信息*/
  @Input ()  width : number;   /*展示信息*/
  public pos = 0;
  public totalSlides = 0;
  public sliderWidth;
  public colorList = ['#1abc9c','#3498db','#9b59b6','#34495e','#e74c3c'];
  private autoSlider = setInterval(()=>{this.slideRight();}, 3000);
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnChanges() {
    this.sliderWidth = this.width?this.width:600;
    if(this.list&&this.list.length>0){
      this.totalSlides = this.list.length;
    }
    else{
      this.totalSlides = 0;
      this.list = [{
        title: '暂无信息'
      }]
    }
    this.pagination();
    /* //set width to be 'x' times the number of slides*/
    $('#slider-wrap ul#slider').width(this.sliderWidth*this.totalSlides);

    /*  //hide/show controls/btns when hover
     //pause automatic slide when hover*/
    $('#slider-wrap').hover(
      ()=> {
        $('#slider-wrap').addClass('active');
        clearInterval(this.autoSlider);
      },
      ()=> {
        $('#slider-wrap').removeClass('active');
       // this.autoSlider = setInterval(()=>{this.slideRight();}, 3000);
      }
    );
  }

  setImgInterval(){
    this.autoSlider = setInterval(()=>{this.slideRight();}, 3000);
  }
  /***********
   SLIDE LEFT
   ************/
  slideLeft(){
    if(this.totalSlides>0){
      this.pos--;
      if(this.pos===-1){ this.pos = this.totalSlides-1; }
      $('#slider-wrap ul#slider').css('left', -(this.sliderWidth*this.pos));
      /*  //!*> optional*/
      this.pagination();
    }
  }


  /************
   SLIDE RIGHT
   *************/
  slideRight() {
    if(this.totalSlides>0){
      this.pos++;
      if (this.pos === this.totalSlides) {
        this.pos = 0;
      }
      $('#slider-wrap ul#slider').css('left', -(this.sliderWidth * this.pos));
      this.pagination();
    }
  }

  pagination(){
    $('#pagination-wrap ul li').removeClass('active');
    $('#pagination-wrap ul li:eq('+this.pos+')').addClass('active');
  }
  linkAddress(url){
    if(url){
      this.router.navigate([url],{relativeTo: this.route});
    }
  }
}
