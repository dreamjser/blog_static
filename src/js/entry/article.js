import React from 'react';
import ReactDOM from 'react-dom';
import Comment from 'component.comment';

// 评论随机token
let token = $('#token').val();
let $comment = $('#J_comment');
let aid = $('#aid').val();

let handleUpdateComment = function () {
	let top = $comment.offset().top;

	$('html,body').animate({
		scrollTop: top
	}, 200);
}

ReactDOM.render(<Comment aid={aid} token={token} onUpdateComment={handleUpdateComment} />, $comment[0]);
