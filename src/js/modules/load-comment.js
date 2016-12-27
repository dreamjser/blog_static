import React from 'react';
import ReactDOM from 'react-dom';

// 评论随机token
const token = $('#token').val();
const aid = $('#aid').val();
const $comment = $('#J_comment');
const commentTop = $comment.offset().top;
const loadingClass = 'comment-loading';

const handleUpdateComment = function() {
  $('html,body').animate({
    scrollTop: commentTop
  }, 200);
};

const loadComment = {
  init: function() {
    this.bindEvent();
  },

  bindEvent: function() {
    this.checkCommentLocation();
    $(window).on('scroll.comment', () => this.checkCommentLocation());
  },
  checkCommentLocation: function() {
    let scrollTop = $(window).scrollTop();
    let winHeight = $(window).height();

    if (commentTop < winHeight + scrollTop) {

      require.ensure([], function() {
        const {
          Comment
        } = require('component.comment');

        ReactDOM.render(<Comment aid={aid} token={token} onUpdateComment={handleUpdateComment} />, $comment[0]);

        $comment.removeClass(loadingClass);

      }, 'comment');

      $(window).off('scroll.comment');
    }
  }
}

export default loadComment;
