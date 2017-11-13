"use strict"

var Service = (function (){
	function Pagination(page, count, docs_by_page){
		this.page = (page && typeof(page) == 'number') ? parseInt(page) : 1;
		this.docs_by_page = (docs_by_page && typeof(docs_by_page) == 'number') ? docs_by_page: 15;
		this.pages = 0;
		this.total_docs = (count)? count:0;
		this.pages = this.total_docs/this.docs_by_page;
		this.pages = (this.pages > Math.floor(this.pages)) ? Math.floor(this.pages) + 1 : Math.floor(this.pages);
		// si page es mayor que total de paginas o page == 1, entonce se asigna 0 al offset
		this.offset = (this.page > this.pages || this.page == 1 ) ? 0 : (this.page -1) * this.docs_by_page;
	}

	return Pagination;

})()

module.exports = Service;