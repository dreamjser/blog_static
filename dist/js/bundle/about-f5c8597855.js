webpackJsonp([3],[,function(t,n){t.exports=React},function(t,n){t.exports=ReactDOM},function(t,n,e){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(n,"__esModule",{value:!0});var i=e(1),c=o(i),a=e(2),u=o(a),l=$("#token").val(),r=$("#aid").val(),d=$("#J_comment"),f=d.offset().top,m="comment-loading",s=function(){$("html,body").animate({scrollTop:f},200)},h={init:function(){this.bindEvent()},bindEvent:function(){var t=this;this.checkCommentLocation(),$(window).on("scroll.comment",function(){return t.checkCommentLocation()})},checkCommentLocation:function(){var t=$(window).scrollTop(),n=$(window).height();f<n+t&&(e.e(1).then(function(){var t=e(4),n=t.Comment;u.default.render(c.default.createElement(n,{aid:r,token:l,onUpdateComment:s}),d[0]),d.removeClass(m)}.bind(null,e)).catch(e.oe),$(window).off("scroll.comment"))}};n.default=h},,function(t,n,e){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}var i=e(3),c=o(i),a=e(0),u=o(a);c.default.init(),u.default.init()}],[5]);