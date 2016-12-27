import './pagination.scss';

import React from 'react';
import Url from 'module.url';

let urlObj = new Url();

// 分页
class Pagination extends React.Component {
  constructor() {
    super();

    this.setInitState();
  }

  setInitState(){

    this.state = {
      pageData: []
    };
  }

  getPaginationArray(current) {
    let perpage = this.props.perpage;
    let total = this.props.total;
    let pagenum = Math.ceil(total / perpage);
    let pageLength = this.props.pageLength || 5;
    let half = (pageLength - 1) / 2;
    let pageData = [];
    let ellipsis = '...';
    let i;

    if (total <= 0) {
      return;
    }

    if (pagenum <= pageLength) {
      for (i = 1; i <= pagenum; i++) {
        pageData.push(i);
      }
    } else {
      // 1 2 3 [4] 5 6... 8
      if (current <= pageLength - half) {
        for (i = 1; i <= pageLength - 1; i++) {
          pageData.push(i);
        }
        pageData.push(ellipsis);
        pageData.push(pagenum);
        // 1...13 14 [15] 16 17 18
      } else if (current >= pagenum - half) {
        pageData.push(1);
        pageData.push(ellipsis);

        for (i = pagenum - (pageLength - 2); i <= pagenum; i++) {
          pageData.push(i);
        }
        // 1...13 14 [15] 16 17...19
      } else {
        pageData.push(1);
        pageData.push(ellipsis);
        for (i = current - (half - 1); i <= current + (half - 1); i++) {
          pageData.push(i);
        }
        pageData.push(ellipsis);
        pageData.push(pagenum);
      }
    }

    return pageData;
  }

  goPrevPage() {
    let page = this.props.page;

    if (page <= 1) {
      return;
    }

    page = page - 1;

    this.changePage(page);

  }

  goNextPage() {
    let page = this.props.page;
    let pagenum = Math.ceil(this.props.total / this.props.perpage);

    if (page >= pagenum) {
      return;
    }

    page = page + 1;

    this.changePage(page);
  }

  goToPage(page) {
    if (page == '...') {
      return;
    }

    this.changePage(page);
  }

  changePage(page) {
    urlObj.setHash('p', page);

    if (this.props.onPageChange) {
      this.props.onPageChange(page);
    }
  }

  render() {
    let page = this.props.page;
    let pageData = this.getPaginationArray(page);
    let total = this.props.total;
    let perpage = this.props.perpage;
    let pagenum = Math.ceil(total / perpage);
    let html = '';

    if (pagenum > 1) {
      html =
        <ul className="pagination pagination-sm">
          <li className={page==1?'disabled':''} onClick={this.goPrevPage.bind(this)}>
            <a href="javascript:;">
              <span>&laquo;</span>
            </a>
          </li>
          {
            pageData.map((ele, index) => {
              let goToPage = this.goToPage.bind(this, ele);
              let li =
              <li onClick={goToPage} className={ele==page?'active':''} key={index}>
               <a className={ele=='...'? 'ellipsis':''} href="javascript:;">{ele}</a>
              </li>

              return li;
            })
          }
          <li className={page==pagenum?'disabled':''} onClick={this.goNextPage.bind(this)}>
            <a href="javascript:;">
              <span>&raquo;</span>
            </a>
          </li>
        </ul>
    }

    return <div className="component-pagination clearfix">{html}</div>;
  }
}

export default Pagination;
