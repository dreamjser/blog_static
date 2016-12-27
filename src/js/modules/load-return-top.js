import React from 'react';
import ReactDOM from 'react-dom';

const $returnTop = $('#J_return_top');

const loadReturnTop = {
  init: function() {
    this.bindEvent();
  },

  bindEvent: function() {
    this.checkReturnTopLocation();
    $(window).on('scroll.return-top', () => this.checkReturnTopLocation());
  },

  checkReturnTopLocation: function() {
    let scrollTop = $(window).scrollTop();

    if (scrollTop > 300) {

      require.ensure([], function() {
        const {
          ReturnTop
        } = require('component.return-top');

        ReactDOM.render(<ReturnTop />, $returnTop[0]);

      }, 'return-top');

      $(window).off('scroll.return-top');
    }
  }
}
export default loadReturnTop;
