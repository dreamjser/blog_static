import './return-top.scss';

import React from 'react';

// 回顶部
class ReturnTop extends React.Component {

	componentDidMount() {
		let $returnBox = $(this.refs.returnbox);

    this.onWindowScroll($returnBox);

		$(window).on('scroll', () => {
			this.onWindowScroll($returnBox);
		});
	}

  onWindowScroll($returnBox){
    let sTop = $(window).scrollTop();

      if (sTop > 400) {
        $returnBox.show();
      } else {
        $returnBox.hide();
      }
  }

	returnTop() {
    $(window).scrollTop(0);
	}

	render() {
		return (
			<div className="component-returntop" ref="returnbox" onClick={this.returnTop.bind(this)}>
        <i className="glyphicon glyphicon-arrow-up"></i>
      </div>
		)
	}
}

export {ReturnTop};
