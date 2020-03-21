import React, { Component,createRef } from 'react';
import './index.css';
import $ from 'jquery'

export default class RList extends Component {
  constructor(props) {
    super(props);
    var {get,height,size,value,length} = this.props;
    this.getItems();
    this.dom = createRef();
    this.state = {
      top: this.getTop(this.getTopByValue(value)),
      getItems:this.getItems.bind(this),
      length,
      get:get.toString(),
    };
    this.time = 0;
    this.date = new Date();
    this.touch = 'ontouchstart' in document.documentElement;
    if(this.touch){this.getClient = function(e){return {x: e.changedTouches[0].clientX,y:e.changedTouches[0].clientY }}}
    else{this.getClient = function(e){return {x:e.clientX,y:e.clientY}}}
  }
  static getDerivedStateFromProps(props,state){
    if(props.length !== state.length || props.get.toString() !== state.get){state.getItems()}
    return null;
  }
  eventHandler(selector, event, action,type = 'bind'){
    var me = { mousedown: "touchstart", mousemove: "touchmove", mouseup: "touchend" };
    event = this.touch ? me[event] : event;
    var element = typeof selector === "string"? 
    (selector === "window"?$(window):$(selector)):
    selector; 
    element.unbind(event, action); 
    if(type === 'bind'){element.bind(event, action)}
  }
  
  mouseDown(e){
    clearInterval(this.interval);
    this.deltaPX = 0;
    var {top} = this.state;
    this.so = {top,y:this.getClient(e).y}
    this.eventHandler('window','mousemove',$.proxy(this.mouseMove,this))
    this.eventHandler('window','mouseup',$.proxy(this.mouseUp,this))
  }
  mouseMove(e){
    var {dragChange,accel} = this.props;
    if(accel){
      var time = new Date().getTime()
      this.deltaT = time - this.time;
      this.time = time;
      var y = this.getClient(e).y;
      this.deltaPX = y - this.y;
      this.y = y;
    }
    this.setTop(this.so.top - (this.so.y - this.getClient(e).y),dragChange)
  }
  accel(){
    var {top} = this.state;
    var {dragChange} = this.props;
    clearInterval(this.interval);
    this.speed = this.deltaT?this.deltaPX / this.deltaT * 20 * 0.4:false;
    if(!this.speed || Math.abs(this.speed) < 1){
      this.setTop(Math.round(top / this.itemHeight) * this.itemHeight,!dragChange)
      return;
    }
    this.interval = setInterval(()=>{
      var top = this.state.top; 
      top += this.speed;
      this.speed *= 0.98;
      //console.log(this.speed)
      if(Math.abs(this.speed) < 0.7){
        this.setTop(Math.round(top / this.itemHeight) * this.itemHeight,!dragChange)
        clearInterval(this.interval);
        return;
      }
      if(top < this.minTop){
        top = this.minTop;
        this.setTop(top,!dragChange)
        clearInterval(this.interval)
        return;
      }
      if(top > this.maxTop){
        top = this.maxTop;
        this.setTop(top,!dragChange)
        clearInterval(this.interval)
        return;
      }
      this.setTop(top,dragChange)
    },20)
  }
  mouseUp(){
    this.eventHandler('window','mousemove',this.mouseMove,'unbind')
    this.eventHandler('window','mouseup',this.mouseUp,'unbind')
    var {accel,dragChange} = this.props;
    if(accel){
      this.accel();
    }
    else{
      var {top} = this.state;
      this.setTop(Math.round(top / this.itemHeight) * this.itemHeight,!dragChange)
    }
    
    
  }
  getMinTop(offset = 0){
    var {length} = this.props;
    return (length - 1 - this.offset + offset) * -this.itemHeight;
  }
  getMaxTop(offset = 0){
    return (this.offset + offset) * this.itemHeight;
  }
  getTop(top){
    if(top < this.minTop){top = this.minTop} else if(top > this.maxTop){top = this.maxTop}
    return top;
  }
  setTop(top,callOnchange){
    var {onchange,dragChange,set} = this.props;
    var {prevValue} = this.state;
    top = this.getTop(top);
    var value = this.getValueByTop(top);
    if(prevValue !== value){
      var items = $(this.dom.current).find('.drag-input-item');
      items.removeClass('active');
      items.filter('.drag-input-item' + value).addClass('active');
      if(callOnchange){
        prevValue = value;
        onchange(set(value));
      }
    }
    this.setState({top,prevValue});
  }
  moveBy(delta,type){
    var {top} = this.state;
    top -= Math.round(delta) * this.itemHeight;
    this.setTop(top,type)
  }
  moveTo(value,type){
    this.setTop(this.getTopByValue(value),type)
  }
  getTopByValue(value){
    return (this.offset - value) * this.itemHeight;
  }
  getValueByTop(top){
    top = this.getTop(top);
    return Math.round(((this.itemHeight * this.offset) - top) / this.itemHeight);
  }
  getItems(){
    var {length,get,align,height,size} = this.props;
    this.itemHeight = height / size;
    this.offset = Math.floor(size / 2);
    this.minTop = this.getMinTop();
    this.maxTop = this.getMaxTop();
    var alignMap = {start:'flex-start',end:'flex-end',center:'center'}
    var items = [];
    for(var i = 0; i <= length - 1; i++){
      let value = get(i);
      value = value === undefined?i:value;
      items.push(
        <div key={i} className={'drag-input-item drag-input-item' + i} style={{height:this.itemHeight,justifyContent:alignMap[align]}}>{value}</div>
      )
    }
    this.items = items;
  }  
  keyDown(e){
    var {length,dragChange} = this.props;
    var code = e.keyCode;
    if(code === 38){//up
      this.moveBy(-1,dragChange)
      this.arrow = true;
    }
    else if(code === 40){//down
      this.moveBy(1,dragChange)
      this.arrow = true;
    }
    else if(code === 36){//home
      this.moveTo(0,true)
    }
    else if(code === 35){//end
      this.moveTo(length - 1,true)
    } 
  }
  keyUp(){
    if(this.arrow){
      var {top} = this.state;
      var {dragChange} = this.props;
      this.setTop(Math.round(top / this.itemHeight) * this.itemHeight,!dragChange)
      this.arrow = false;
    }
  }
  
  render() {
    var {top} = this.state;
    var {height,width} = this.props; 
    var props = {
      ref:this.dom,
      className:'drag-input',style:{height,width},tabIndex:0,
      onWheel:(e)=>this.moveBy(e.deltaY / 100,true),
      onKeyDown:this.keyDown.bind(this),
      onKeyUp:this.keyUp.bind(this),
      [this.touch?'onTouchStart':'onMouseDown']:this.mouseDown.bind(this),
    }
    var listProps = {
      className:'drag-input-list',
      style:{top:top + 'px'}
    }
    return (
      <div {...props}>
        <div {...listProps}>
          {this.items}
        </div>
        
      </div>
    );
  }
}
RList.defaultProps = {length:10,height:60,size:3,width:48,value:0,get:(v)=>v,set:(v)=>v,dragChange:true,accel:true,align:'start'}