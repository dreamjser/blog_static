import './comment.scss';

import React from 'react';
import Pagination from 'component.pagination';
import Url from 'module.url';
import Tips from 'module.tips';

let tip = new Tips();
let urlObj = new Url();

const perpage = 10;
const API_COMMENT_GET = 'http://www.dreamjser.com/blog/ajaxGetComment';
const API_COMMENT_ADD = 'http://www.dreamjser.com/blog/ajaxAddComment';

let setNameStorage = function(name) {
  if (window.localStorage) {
    localStorage['name'] = name;
  }
}

// 评论组件
class Comment extends React.Component {
  constructor() {
    super();

    this.setInitState();
  }

  setInitState() {
    let page = urlObj.getHash('p') || 1;

    if (isNaN(page)) {
      page = 1;
    }

    this.state = {
      data: [],
      page: page,
      total: ''
    };
  }

  getCommentData(page, result) {
    let propsData = this.props;
    let _this = this;

    $.ajax({
      url: API_COMMENT_GET,
      dataType: 'json',
      cache: false,
      data: {
        aid: propsData.aid,
        page: page,
        perpage: perpage
      },
      success: function(res) {
        _this.setState(res);

        if (result) {
          result();
        }
      }
    });
  }

  handlePageChange(page) {
    var _this = this;

    this.getCommentData(page, function() {
      if (_this.props.onUpdateComment) {
        _this.props.onUpdateComment();
      }
    });
  }

  handleCommentSuccess(arr) {
    let state = this.state;

    this.getCommentData(1);
    state.total++;
    this.setState(state);
  }

  componentDidMount() {
    this.getCommentData(this.state.page);
  }

  render() {
    let state = this.state;
    let pagination = '';
    let commentList = '';

    if (state.total !== '') {
      pagination = <Pagination page={state.page} total={state.total} perpage={perpage} onPageChange={this.handlePageChange.bind(this)}/>;
      commentList = <CommentList data={state.data} aid={this.props.aid} token={this.props.token} onReplySuccess={this.handleCommentSuccess.bind(this)}/>;
    }

    return (
      <div className="component-comment">
        <h4>评论<span className="comment-total">({state.total})</span></h4>
        <CommentPublish aid={this.props.aid} token={this.props.token} onCommentSuccess={this.handleCommentSuccess.bind(this)}/>
        {pagination}
        {commentList}
        {pagination}
      </div>
    )
  }
}

// 评论发布
class CommentPublish extends React.Component {

  // 发表评论
  doSubmitComment(e) {
    e.preventDefault();

    let _this = this;
    let propsData = this.props;
    let refsData = this.refs;

    let name = refsData.name.value;
    let content = refsData.content.value;

    if (content == '') {
      tip.show('请填写评论');
      return;
    }

    if (name == '') {
      tip.show('请填写姓名');
      return;
    }

    $.ajax({
      url: API_COMMENT_ADD,
      dataType: 'json',
      type: 'post',
      data: {
        token: propsData.token,
        name: name,
        content: content,
        aid: propsData.aid
      },
      success: function(res) {
        if (res.code == 0) {
          setNameStorage(name);
          _this.publishSuccess();
          if (_this.props.onCommentSuccess) {
            _this.props.onCommentSuccess(res.data[0]);
          }
          tip.show('评论成功！');
        } else {
          tip.show(res.msg);
        }
      }
    });
  }

  publishSuccess() {
    this.refs.content.value = '';
  }

  componentWillMount() {
    let name = localStorage['name'] || '';

    this.setState({
      name: name
    });
  }

  render() {
    return (
      <form className="comment-publish" onSubmit={this.doSubmitComment.bind(this)}>
        <p>
          <textarea name="content" className="form-control" rows="4" ref="content" maxLength="200" placeholder="评论不能超过200字符"></textarea>
        </p>
        <div className="comment-submit clearfix">
          <span className="form-inline">
            <label htmlFor="component_comment_name">姓名：</label>
            <input type="text" id="component_comment_name" className="form-control" defaultValue={this.state.name} ref="name" maxLength="20"/>
          </span>
          <button type="submit" className="btn btn-primary">提交</button>
        </div>
      </form>
    );
  }
}

// 评论列表
class CommentList extends React.Component {
  constructor() {
    super();

    this.state = {
      data: {}
    }
  }

  showReply(cid) {
    let data = this.state.data;
    let isCid;

    if (data[cid]) {
      isCid = false;
    } else {
      isCid = true;
    }

    data = {};
    data[cid] = isCid;

    this.setState({
      data: data
    });
  }

  hideReply() {
    this.setState({
      data: {}
    });
  }

  render() {
    let list = this.props.data;
    let html = '';
    let _this = this;

    if (list.length == 0) {
      html = <li className="comment-nodata">暂无评论</li>;
    } else {
      html = this.props.data.map(function(data) {
        let reply = '';
        let replyComment = '';

        if (data.reply_data != null) {
          reply = <p className="comment-reply">回复{data.reply_data.name}：{data.reply_data.content}</p>
        }

        if (_this.state.data[data.cid]) {
          replyComment = <CommentReply cid={data.cid} aid={_this.props.aid} token={_this.props.token} data={_this.state.data} onHideReply={_this.hideReply.bind(_this)} onReplySuccess={_this.props.onReplySuccess} />;
        }

        return (
          <li key={data.cid}>
            <p>
              <span className="comment-name">{data.name}</span>
              <span className="comment-time">{data.time}</span>
            </p>
            <p className="comment-content">{data.content}</p>
            {reply}
            <p className="comment-replybtn">
              <a href="javascript:;" onClick={_this.showReply.bind(_this, data.cid)}>回复</a>
            </p>
            {replyComment}
          </li>
        )
      })
    }
    return (
      <ul className="comment-list">{html}</ul>
    )
  }
}

// 评论回复
class CommentReply extends React.Component {

  constructor() {
    super();

    let name = localStorage['name'] || '';

    this.state = {
      name: name
    }
  }

  // 发表评论
  doSubmitReply(e) {
    e.preventDefault();

    let _this = this;
    let propsData = this.props;
    let refsData = this.refs;

    let name = refsData.name.value;
    let content = refsData.content.value;

    if (content == '') {
      tip.show('请填写评论');
      return;
    }

    if (name == '') {
      tip.show('请填写姓名');
      return;
    }

    $.ajax({
      url: API_COMMENT_ADD,
      dataType: 'json',
      type: 'post',
      data: {
        token: propsData.token,
        name: name,
        content: content,
        aid: propsData.aid,
        reply_id: propsData.cid
      },
      success: function(res) {
        if (res.code == 0) {
          setNameStorage(name);
          if (_this.props.onReplySuccess) {
            _this.props.onReplySuccess(res.data[0]);
          }
          if (_this.props.onHideReply) {
            _this.props.onHideReply();
          }
          tip.show('回复成功！');
        } else {
          tip.show(res.msg);
        }
      }
    });
  }

  componentDidMount() {
    this.refs.content.focus();
  }

  render() {
    let html = '';
    let propsData = this.props;

    return (
      <div className="comment-reply-box">
        <form className="comment-publish" onSubmit={this.doSubmitReply.bind(this)}>
          <p>
            <textarea name="content" className="form-control" rows="4" ref="content" maxLength="200" placeholder="评论不能超过200字符"></textarea>
          </p>
          <div className="comment-submit clearfix">
            <span className="form-inline">
              <label htmlFor="component_comment_name">姓名：</label>
              <input type="text" id="component_comment_name" className="form-control" defaultValue={this.state.name} ref="name" maxLength="20"/>
            </span>
            <button type="submit" className="btn btn-primary">提交</button>
          </div>
        </form>
      </div>
    );
  }
}

export default Comment;
