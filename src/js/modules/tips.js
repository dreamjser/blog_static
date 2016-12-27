const TIPS_CLASS_ANIMATION = 'mod-tips-animation';
const TIPS_TEMPLATES = '<div class="mod-tips"><span><i class="glyphicon glyphicon-info-sign"></i> <em></em></span></div>';

class Tips {
	constructor() {
		this.addTimeOut = null;
		this.removeTimeOut = null;
		this.fetch();
	}

	fetch() {
		this.wrap = $(TIPS_TEMPLATES);
		$(document.body).append(this.wrap);
	}

	show(words) {
		this.wrap.show().find('em').html(words);
		this.addTipsClass();
		this.removeTipsClass();
	}

	addTipsClass() {
		this.addTimeOut && clearTimeout(this.addTimeOut);
		this.addTimeOut = setTimeout(() => this.wrap.addClass(TIPS_CLASS_ANIMATION), 0);
	}

	removeTipsClass() {
		this.removeTimeOut && clearTimeout(this.removeTimeOut);
		this.removeTimeOut = setTimeout(() => this.wrap.removeClass(TIPS_CLASS_ANIMATION), 2000);
	}
}

export default Tips;
