"use strict";
/*!
 * Copyright (c) 2013-2014 9elements GmbH
 *
 * Released under Attribution-NonCommercial 3.0 Unported
 * http://creativecommons.org/licenses/by-nc/3.0/
 *
 * For commercial use, please contact us at contact@9elements.com
 */

import Control from "./control";
let fs = require("fs");

class SliderControl extends Control {
  /**
   * Entry point for this control
   */
  init () {
    let sliderTemplate = fs.readFileSync(__dirname + "/../../../templates/night/generics/slider_control.jst", "utf-8");
    this._sliderTemplate = sliderTemplate;
    this._dragging = false;

    // Mouse event callbacks bound to the class context
    this._bound_onMousedown = this._onMousedown.bind(this);
    this._bound_onMousemove = this._onMousemove.bind(this);
    this._bound_onMouseup = this._onMouseup.bind(this);
  }

  /**
   * Gets called when this control is activated
   */
  _onEnter () {
    this._sliderSlider = this._controls.querySelector(".imglykit-slider-slider");
    this._sliderDot = this._controls.querySelector(".imglykit-slider-dot");
    this._sliderFill = this._controls.querySelector(".imglykit-slider-fill");

    this._sliderDot.addEventListener("mousedown", this._bound_onMousedown);
    this._sliderDot.addEventListener("touchstart", this._bound_onMousedown);
  }

  /**
   * Gets called when the user presses a mouse button on the slider dot
   * @private
   */
  _onMousedown (e) {
    if (e.button !== 0) return; // Not the left mouse button
    e.preventDefault();
    this._dragging = true;

    document.addEventListener("mousemove", this._bound_onMousemove);
    document.addEventListener("touchmove", this._bound_onMousemove);

    document.addEventListener("mouseup", this._bound_onMouseup);
    document.addEventListener("touchend", this._bound_onMouseup);

    // Remember initial position
    let dotPosition = this._sliderDot.getBoundingClientRect();
    let sliderPosition = this._sliderSlider.getBoundingClientRect();

    this._initialSliderX = dotPosition.left - sliderPosition.left;
    this._initialMouseX = e.pageX;
  }

  /**
   * Gets called when the user drags the mouse
   * @private
   */
  _onMousemove (e) {
    e.preventDefault();

    let currentMouseX = e.pageX;
    let differenceX = currentMouseX - this._initialMouseX;

    // Add half width of the dot for negative margin compensation
    let halfDotWidth = this._sliderDot.offsetWidth * 0.5;
    let newSliderX = this._initialSliderX + differenceX + halfDotWidth;

    // X boundaries
    let sliderWidth = this._sliderSlider.offsetWidth;
    let newSliderX = Math.max(0, Math.min(newSliderX, sliderWidth));

    this._setSliderX(newSliderX);
  }

  /**
   * Sets the slider position to the given X value and resizes
   * the fill div
   * @private
   */
  _setSliderX (x) {
    this._sliderDot.style.left = `${x}px`;

    // X position relative to center to simplify calculations
    let halfSliderWidth = this._sliderSlider.offsetWidth / 2;
    let relativeX = x - halfSliderWidth;

    // Update style
    this._sliderFill.style.width = `${Math.abs(relativeX)}px`;
    if (relativeX < 0) {
      this._sliderFill.style.left = halfSliderWidth - Math.abs(relativeX) + "px";
    } else {
      this._sliderFill.style.left = halfSliderWidth + "px";
    }
  }

  /**
   * Gets called when the user does not press the mouse button anymore
   * @private
   */
  _onMouseup (e) {
    document.removeEventListener("mousemove", this._bound_onMousemove);
    document.removeEventListener("touchmove", this._bound_onMousemove);

    document.removeEventListener("mouseup", this._bound_onMouseup);
    document.removeEventListener("touchend", this._bound_onMouseup);
  }

  /**
   * Gets called when the back button has been clicked
   * @override
   */
  _onBack () {

  }

  get context () {
    let context = super.context;
    return context;
  }
}

export default SliderControl;
