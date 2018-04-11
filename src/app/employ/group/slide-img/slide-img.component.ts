/*
import { Component, OnInit, Input, animate, style, transition, trigger, state, HostListener} from '@angular/core';
// import { SlideImg } from './slide-img.interface';
@Component({
  selector: 'app-slide-img',
  templateUrl: './slide-img.component.html',
  styleUrls: ['./slide-img.component.css'],
  animations: [
        trigger('imgMove', [
            /!** 不显示 *!/
            state('off', style({'display': 'none', 'z-index': '0', 'transform': 'translateX(0)'})),
            /!** 上一张图片 *!/
            state('prev', style({'z-index': '1',
             'transform': 'translateX(-100%)'})),
          /!** 下一张图片 *!/
          state('next', style({'z-index': '2', 'transform': 'translateX(100%)'})),
            /!** 当前图片 *!/
           state('on', style({'z-index': '3', 'transform': 'translateX(0)'})),
            transition('prev=>on', [
                animate('0.3s ease-in')
             ]),
           transition('next=>on', [
               animate('0.3s ease-in')
           ]),
           transition('on=>prev', [
                animate('0.3s ease-in')
             ]),
            transition('on=>next', [
                animate('0.3s ease-in')
             ])
        ])
    ]
})
export class SlideImgComponent implements OnInit {
  @Input() public imgs: SlideImg[];
      public current;
  constructor() { }

  ngOnInit() {
  }
  public ImgState(index) {
       if (this.imgs && this.imgs.length) {
            if (this.current === 0) {
                return index === 0 ? 'on' :
                index === 1 ? 'next' :
                index === this.imgs.length - 1 ? 'prev' :
                'off';
           } else if (this.current === this.imgs.length - 1) {
                return index === this.imgs.length - 1 ? 'on' :
                 index === this.imgs.length - 2 ? 'prev' :
                 index === 0 ? 'next' :
                 'off';
            }
            switch (index - this.current) {
                case 0:
                     return 'on';
                case 1:
                    return 'next';
                case -1:
                    return 'prev';
                 default:
                    return 'off';
             }
        } else {
            return 'off';
         }
    }
     public Next() {
         this.current = (this.current + 1) % this.imgs.length;
    }
    public Prev() {
        this.current = this.current - 1 < 0 ? this.imgs.length - 1 : this.current - 1;
    }

    public Change(e) {
       if (e === 'left') {
            this.Next();
        } else if (e === 'right') {
            this.Prev();
         }
    }

}
*/
import {Component,OnInit} from "@angular/core";
import {ErrorResponseService} from "../../../service/error-response/error-response.service";
import {IpSettingService} from "../../../service/ip-setting/ip-setting.service";

@Component({
  selector: 'app-slide-img',
  templateUrl: './slide-img.component.html',
  styleUrls: ['./slide-img.component.css'],
  providers: [ErrorResponseService]
})
export class SlideImgComponent implements OnInit {
  currentPic = 0;
  public imgPath = [];

  constructor(
    private errorVoid: ErrorResponseService,
    public  ipSetting:IpSettingService
  ) {
    setInterval(() => {
      let id = (this.currentPic + 1) % 3;
      this.currentPic = id;
    },3000)
  }

  changebanner(id) {
    this.currentPic = id;
  }
  ngOnInit() {
    this.getProductShowList();
  }
  /*获取商品列表*/
  getProductShowList(){
     let url = '/mmall/group/getGroupProduct/15';
     this.ipSetting.sendGet(url).subscribe(data => {
       if (this.errorVoid.errorMsg(data)) {
         // console.log(data.data);
         this.imgPath = data.data.imgPathList; // .split(';');
       }
       });
   }

}
