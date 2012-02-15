/*  WysiHat - WYSIWYG JavaScript framework, version 0.2.1
 *  (c) 2008-2010 Joshua Peek
 *  JQ-WysiHat - jQuery port of WysiHat to run on jQuery
 *  (c) 2010 Scott Williams & Aaron Gustafson
 *
 *  WysiHat is freely distributable under the terms of an MIT-style license.
 *--------------------------------------------------------------------------*/
var WysiHat={name:"WysiHat"};(function(e){var m=WysiHat.name,c="-editor",g="-field",f=":change",n=m+c,l="id",k=n+f,j=m+g+f,h=":immediate",b=0,d=null,a="";WysiHat.Editor={attach:function(s){var u=s.attr(l),v=(u!=a?u:m+b++)+c,q=d,r=d,t=e("#"+v);if(u==a){u=v.replace(c,g);s.attr(l,u)}if(t.length){if(!t.hasClass(n)){t.addClass(n)}return t}else{t=e('<div id="'+v+'" class="'+n+'" contentEditable="true" role="application"></div>').html(WysiHat.Formatting.getBrowserMarkupFrom(s)).data("field",s);e.extend(t,WysiHat.Commands);function o(){s.val(WysiHat.Formatting.getApplicationMarkupFrom(t));this.fTimer=null}function p(){t.html(WysiHat.Formatting.getBrowserMarkupFrom(s));this.eTimer=null}s.data("editor",t).bind("keyup mouseup",function(){s.trigger(j)}).bind(j,function(){if(this.fTimer){clearTimeout(this.fTimer)}this.fTimer=setTimeout(p,250)}).bind(j+h,p).hide().before(t.bind("keyup mouseup",function(){t.trigger(k)}).bind(k,function(){if(this.eTimer){clearTimeout(this.eTimer)}this.eTimer=setTimeout(o,250)}).bind(k+h,o))}return t}}})(jQuery);WysiHat.BrowserFeatures=(function(e){var c={};function d(k){var g,h=e("<iframe></iframe>"),j=h.get(0);h.css({position:"absolute",left:"-1000px"}).load(function(){if(typeof j.contentDocument!=="undefined"){g=j.contentDocument}else{if(typeof j.contentWindow!=="undefined"&&typeof j.contentWindow.document!=="undefined"){g=j.contentWindow.document}}g.designMode="on";k(g);h.remove()});e("body").append(h)}function a(h){var g;h.body.innerHTML="";h.execCommand("insertparagraph",false,null);element=h.body.childNodes[0];if(element&&element.tagName){g=element.tagName.toLowerCase()}if(g=="div"){c.paragraphType="div"}else{if(h.body.innerHTML=="<p><br></p>"){c.paragraphType="br"}else{c.paragraphType="p"}}}function b(h){var g;h.body.innerHTML="tab";h.execCommand("indent",false,null);element=h.body.childNodes[0];if(element&&element.tagName){g=element.tagName.toLowerCase()}c.indentInsertsBlockquote=(g=="blockquote")}c.run=function f(){if(c.finished){return}d(function(g){a(g);b(g);c.finished=true})};return c})(jQuery);WysiHat.Element=(function(g){var y=false,l=["blockquote","details","fieldset","figure","td"],x=["article","aside","header","footer","nav","section"],s=["col","colgroup","dl","menu","ol","table","tbody","thead","tfoot","tr","ul"],F=["command","dd","dt","li","td","th"],A=["address","caption","dd","div","dt","figcaption","figure","h1","h2","h3","h4","h5","h6","hgroup","hr","p","pre","summary","small"],j=["audio","canvas","embed","iframe","img","object","param","source","track","video"],H=["a","abbr","b","br","cite","code","del","dfn","em","i","ins","kbd","mark","span","q","samp","s","strong","sub","sup","time","u","var","wbr"],a=["b","code","del","em","i","ins","kbd","span","s","strong","u"],G=["address","blockquote","div","dd","dt","h1","h2","h3","h4","h5","h6","p","pre"],f=["button","datalist","fieldset","form","input","keygen","label","legend","optgroup","option","output","select","textarea"];function h(M){var L=arguments.length,K=y;while(K==y&&L-->1){K=M.is(arguments[L].join(","))}return K}function B(K){return h(K,l)}function m(K){return h(K,x)}function o(K){return h(K,s)}function t(K){return h(K,F)}function r(K){return h(K,l,x,s,F,A)}function z(K){return h(K,G)}function v(K){return h(K,F,A)}function q(K){return h(K,j)}function I(K){return h(K,H)}function w(K){return h(K,a)}function n(K){return h(K,f)}function C(){return l}function u(K){return x}function p(){return s}function E(){return F}function D(){return l.concat(x,s,F,A)}function J(){return G}function c(){return F.concat(A)}function b(){return j}function d(){return H}function e(){return a}function k(){return f}return{isRoot:B,isSection:m,isContainer:o,isSubContainer:t,isBlock:r,isHTML4Block:z,isContentElement:v,isMediaElement:q,isPhraseElement:I,isFormatter:w,isFormComponent:n,getRoots:C,getSections:u,getContainers:p,getSubContainers:E,getBlocks:D,getHTML4Blocks:J,getContentElements:c,getMediaElements:b,getPhraseElements:d,getFormatters:e,getFormComponents:k}})(jQuery);if(!window.getSelection){(function(d){var c=null,a=false,b={isDataNode:function(f){try{return f&&f.nodeValue!==null&&f.data!==null}catch(g){return false}},isAncestorOf:function(e,f){if(!e){return false}return !b.isDataNode(e)&&(f.parentNode==e||e.contains(b.isDataNode(f)?f.parentNode:f))},isAncestorOrSelf:function(e,f){return e==f||b.isAncestorOf(e,f)},findClosestAncestor:function(e,f){if(b.isAncestorOf(e,f)){while(f&&f.parentNode!=e){f=f.parentNode}}return f},getNodeLength:function(e){return b.isDataNode(e)?e.length:e.childNodes.length},splitDataNode:function(f,g){if(!b.isDataNode(f)){return false}var e=f.cloneNode(false);f.deleteData(g,f.length);e.deleteData(0,g);f.parentNode.insertBefore(e,f.nextSibling)}};window.Range=(function(){function g(h){this._document=h;this.startContainer=this.endContainer=h.body;this.endOffset=b.getNodeLength(h.body)}function e(j){for(var h=0;j=j.previousSibling;h++){continue}return h}g.prototype={START_TO_START:0,START_TO_END:1,END_TO_END:2,END_TO_START:3,startContainer:null,startOffset:0,endContainer:null,endOffset:0,commonAncestorContainer:null,collapsed:false,_document:null,_toTextRange:function(){function j(t,r,s){var l=r[s?"startContainer":"endContainer"],n=r[s?"startOffset":"endOffset"],m=0,p=b.isDataNode(l)?l:l.childNodes[n],o=b.isDataNode(l)?l.parentNode:l,k=r._document.createElement("a"),q=r._document.body.createTextRange();if(l.nodeType==3||l.nodeType==4){m=n}t.setEndPoint(s?"StartToStart":"EndToStart",q);t[s?"moveStart":"moveEnd"]("character",m)}var h=this._document.body.createTextRange();j(h,this,true);j(h,this,false);return h},_refreshProperties:function(){this.collapsed=(this.startContainer==this.endContainer&&this.startOffset==this.endOffset);var h=this.startContainer;while(h&&h!=this.endContainer&&!b.isAncestorOf(h,this.endContainer)){h=h.parentNode}this.commonAncestorContainer=h},setStart:function(h,j){this.startContainer=h;this.startOffset=j;this._refreshProperties()},setEnd:function(h,j){this.endContainer=h;this.endOffset=j;this._refreshProperties()},setStartBefore:function(h){this.setStart(h.parentNode,e(h))},setStartAfter:function(h){this.setStart(h.parentNode,e(h)+1)},setEndBefore:function(h){this.setEnd(h.parentNode,e(h))},setEndAfter:function(h){this.setEnd(h.parentNode,e(h)+1)},selectNode:function(h){this.setStartBefore(h);this.setEndAfter(h)},selectNodeContents:function(h){this.setStart(h,0);this.setEnd(h,b.getNodeLength(h))},collapse:function(h){if(h){this.setEnd(this.startContainer,this.startOffset)}else{this.setStart(this.endContainer,this.endOffset)}},cloneContents:function(){return(function h(j){for(var k,l=document.createDocumentFragment();k=j.next();){k=k.cloneNode(!j.hasPartialSubtree());if(j.hasPartialSubtree()){k.appendChild(h(j.getSubtreeIterator()))}l.appendChild(k)}return l})(new f(this))},extractContents:function(){var h=this.cloneRange();if(this.startContainer!=this.commonAncestorContainer){this.setStartAfter(b.findClosestAncestor(this.commonAncestorContainer,this.startContainer))}this.collapse(true);return(function j(k){for(var l,m=document.createDocumentFragment();l=k.next();){k.hasPartialSubtree()?l=l.cloneNode(false):k.remove();if(k.hasPartialSubtree()){l.appendChild(j(k.getSubtreeIterator()))}m.appendChild(l)}return m})(new f(h))},deleteContents:function(){var h=this.cloneRange();if(this.startContainer!=this.commonAncestorContainer){this.setStartAfter(b.findClosestAncestor(this.commonAncestorContainer,this.startContainer))}this.collapse(true);(function j(k){while(k.next()){k.hasPartialSubtree()?j(k.getSubtreeIterator()):k.remove()}})(new f(h))},insertNode:function(h){if(b.isDataNode(this.startContainer)){b.splitDataNode(this.startContainer,this.startOffset);this.startContainer.parentNode.insertBefore(h,this.startContainer.nextSibling)}else{var j=this.startContainer.childNodes[this.startOffset];if(j){this.startContainer.insertBefore(h,j)}else{this.startContainer.appendChild(h)}}this.setStart(this.startContainer,this.startOffset)},surroundContents:function(h){var j=this.extractContents();this.insertNode(h);h.appendChild(j);this.selectNode(h)},compareBoundaryPoints:function(m,n){var l,k,j,h;switch(m){case this.START_TO_START:case this.START_TO_END:l=this.startContainer;k=this.startOffset;break;case this.END_TO_END:case this.END_TO_START:l=this.endContainer;k=this.endOffset;break}switch(m){case this.START_TO_START:case this.END_TO_START:j=n.startContainer;h=n.startOffset;break;case this.START_TO_END:case this.END_TO_END:j=n.endContainer;h=n.endOffset;break}return(l.sourceIndex<j.sourceIndex?-1:(l.sourceIndex==j.sourceIndex?(k<h?-1:(k==h?0:1)):1))},cloneRange:function(){var h=new g(this._document);h.setStart(this.startContainer,this.startOffset);h.setEnd(this.endContainer,this.endOffset);return h},detach:function(){},toString:function(){return this._toTextRange().text},createContextualFragment:function(h){var k=(b.isDataNode(this.startContainer)?this.startContainer.parentNode:this.startContainer).cloneNode(false),j=this._document.createDocumentFragment();k.innerHTML=h;for(;k.firstChild;){j.appendChild(k.firstChild)}return j}};function f(j){this.range=j;if(j.collapsed){return}var h=j.commonAncestorContainer;this._next=j.startContainer==h&&!b.isDataNode(j.startContainer)?j.startContainer.childNodes[j.startOffset]:b.findClosestAncestor(h,j.startContainer);this._end=j.endContainer==h&&!b.isDataNode(j.endContainer)?j.endContainer.childNodes[j.endOffset]:b.findClosestAncestor(h,j.endContainer).nextSibling}f.prototype={range:null,_current:null,_next:null,_end:null,hasNext:function(){return !!this._next},next:function(){var h=this._current=this._next;this._next=this._current&&this._current.nextSibling!=this._end?this._current.nextSibling:null;if(b.isDataNode(this._current)){if(this.range.endContainer==this._current){(h=h.cloneNode(true)).deleteData(this.range.endOffset,h.length-this.range.endOffset)}if(this.range.startContainer==this._current){(h=h.cloneNode(true)).deleteData(0,this.range.startOffset)}}return h},remove:function(){if(b.isDataNode(this._current)&&(this.range.startContainer==this._current||this.range.endContainer==this._current)){var j=this.range.startContainer==this._current?this.range.startOffset:0,h=this.range.endContainer==this._current?this.range.endOffset:this._current.length;this._current.deleteData(j,h-j)}else{this._current.parentNode.removeChild(this._current)}},hasPartialSubtree:function(){return !b.isDataNode(this._current)&&(b.isAncestorOrSelf(this._current,this.range.startContainer)||b.isAncestorOrSelf(this._current,this.range.endContainer))},getSubtreeIterator:function(){var h=new g(this.range._document);h.selectNodeContents(this._current);if(b.isAncestorOrSelf(this._current,this.range.startContainer)){h.setStart(this.range.startContainer,this.range.startOffset)}if(b.isAncestorOrSelf(this._current,this.range.endContainer)){h.setEnd(this.range.endContainer,this.range.endOffset)}return new f(h)}};return g})();window.Range._fromTextRange=function(h,e){function g(j,m,n){var k=e.createElement("a"),o=m.duplicate(),l;o.collapse(n);l=o.parentElement();do{l.insertBefore(k,k.previousSibling);o.moveToElementText(k)}while(k.previousSibling&&o.compareEndPoints(n?"StartToStart":"StartToEnd",m)>0);if(k.nextSibling&&o.compareEndPoints(n?"StartToStart":"StartToEnd",m)==-1){o.setEndPoint(n?"EndToStart":"EndToEnd",m);j[n?"setStart":"setEnd"](k.nextSibling,o.text.length)}else{j[n?"setStartBefore":"setEndBefore"](k)}k.parentNode.removeChild(k)}var f=new Range(e);g(f,h,true);g(f,h,false);return f};document.createRange=function(){return new Range(document)};window.Selection=(function(){function e(f){this._document=f;var g=this;f.attachEvent("onselectionchange",function(){g._selectionChangeHandler()});setTimeout(function(){g._selectionChangeHandler()},10)}e.prototype={rangeCount:0,_document:null,anchorNode:null,focusNode:null,_selectionChangeHandler:function(){var h=this._document.selection.createRange(),m=h.text.split(/\r|\n/),l=d(h.parentElement()),j,k,f,g;if(m.length>1){j=new RegExp(m[0]+"$");f=new RegExp("^"+m[m.length-1]);l.children().each(function(){if(d(this).text().match(j)){this.anchorNode=this}if(d(this).text().match(f)){this.focusNode=this}})}else{this.anchorNode=l.get(0);this.focusNode=this.anchorNode}this.rangeCount=this._selectionExists(h)?1:0},_selectionExists:function(f){return f.parentElement().isContentEditable||f.compareEndPoints("StartToEnd",f)!=0},addRange:function(f){var g=this._document.selection.createRange(),h=f._toTextRange();if(!this._selectionExists(g)){try{h.select()}catch(j){}}else{if(h.compareEndPoints("StartToStart",g)==-1){if(h.compareEndPoints("StartToEnd",g)>-1&&h.compareEndPoints("EndToEnd",g)==-1){g.setEndPoint("StartToStart",h)}}else{if(h.compareEndPoints("EndToStart",g)<1&&h.compareEndPoints("EndToEnd",g)>-1){g.setEndPoint("EndToEnd",h)}}g.select()}},removeAllRanges:function(){this._document.selection.empty()},getRangeAt:function(f){var g=this._document.selection.createRange();if(this._selectionExists(g)){return Range._fromTextRange(g,this._document)}return null},toString:function(){return this._document.selection.createRange().text},isCollapsed:function(){var f=document.createRange();return f.collapsed},deleteFromDocument:function(){var f=this._document.selection.createRange();f.pasteHTML("")}};return e})();window.getSelection=(function(){var e=new Selection(document);return function(){return e}})()})(jQuery)}jQuery.extend(Range.prototype,(function(){function a(f){if(!f||!f.compareBoundaryPoints){return false}return(this.compareBoundaryPoints(this.START_TO_START,f)==-1&&this.compareBoundaryPoints(this.START_TO_END,f)==-1&&this.compareBoundaryPoints(this.END_TO_END,f)==-1&&this.compareBoundaryPoints(this.END_TO_START,f)==-1)}function b(f){if(!f||!f.compareBoundaryPoints){return false}return(this.compareBoundaryPoints(this.START_TO_START,f)==1&&this.compareBoundaryPoints(this.START_TO_END,f)==1&&this.compareBoundaryPoints(this.END_TO_END,f)==1&&this.compareBoundaryPoints(this.END_TO_START,f)==1)}function d(f){if(!f||!f.compareBoundaryPoints){return false}return !(this.beforeRange(f)||this.afterRange(f))}function c(f){if(!f||!f.compareBoundaryPoints){return false}return(this.compareBoundaryPoints(this.START_TO_START,f)==0&&this.compareBoundaryPoints(this.START_TO_END,f)==1&&this.compareBoundaryPoints(this.END_TO_END,f)==0&&this.compareBoundaryPoints(this.END_TO_START,f)==-1)}function e(){var f=this.commonAncestorContainer,g=this,h;while(f.nodeType==Node.TEXT_NODE){f=f.parentNode}jQuery(f).children().each(function(){var j=document.createRange();j.selectNodeContents(this);h=g.betweenRange(j)});return $(h||f).get(0)}return{beforeRange:a,afterRange:b,betweenRange:d,equalRange:c,getNode:e}})());if(typeof Selection=="undefined"){var Selection={};Selection.prototype=window.getSelection().__proto__}(function(b,c){if(c.browser.msie){function d(){var e=this._document.selection.createRange();return c(e.parentElement())}function a(f){var e=this._document.body.createTextRange();e.moveToElementText(f);e.select()}}else{function d(){return(this.rangeCount>0)?this.getRangeAt(0).getNode():null}function a(f){var e=document.createRange();e.selectNode(f[0]);this.removeAllRanges();this.addRange(e)}}c.extend(Selection.prototype,{getNode:d,selectNode:a})})(document,jQuery);(function(a){a(document).ready(function(){function b(g){var d=a(this),f=d.get(0),h,c;if(d.is('*[contenteditable=""],*[contenteditable=true]')){h=d.html();c="editor:change"}else{h=d.val();c="field:change"}if(h&&f.previousValue!=h){d.trigger("WysiHat-"+c);f.previousValue=h}}a("body").delegate("input,textarea,*[contenteditable],*[contenteditable=true]","keydown",b)})})(jQuery);WysiHat.Commands=(function(r,R,N){var H=true,ad=false,K=null,O,y="ol",B="ul",E="WysiHat-editor",U=E+":change",u=["backColor","bold","createLink","fontName","fontSize","foreColor","hiliteColor","italic","removeFormat","strikethrough","subscript","superscript","underline","unlink","delete","formatBlock","forwardDelete","indent","insertHorizontalRule","insertHTML","insertImage","insertLineBreak","insertOrderedList","insertParagraph","insertText","insertUnorderedList","justifyCenter","justifyFull","justifyLeft","justifyRight","outdent","copy","cut","paste","selectAll","styleWithCSS","useCSS"],I={bold:{ctrl:true,keycode:66},createLink:{ctrl:true,keycode:76},italic:{ctrl:true,keycode:73},underline:{ctrl:true,keycode:85}},k=WysiHat.Element.getContentElements().join(",").replace(",div,",",div:not(."+E+"),");function e(){this.execCommand("bold",ad,K)}function S(){return x("b,strong")}function Z(){this.execCommand("underline",ad,K)}function b(){return x("u,ins")}function j(){this.execCommand("italic",ad,K)}function z(){return x("i,em")}function aj(){this.execCommand("strikethrough",ad,K)}function F(){return x("s,del")}function G(){var ak=N("<blockquote/>");this.manipulateSelection(function(am,an){var al=an.clone();this.getRangeElements(am,k).each(function(ap){var ar=N(this),aq=false,ao;if(ar.is("li")){aq=true;ao=N("<p/>").html(ar.html());ar.replaceWith(ao);ar=ao}if(!ap){if(aq){al.wrap("<li/>");ao=al.parent();ar.replaceWith(ao)}else{ar.replaceWith(al)}}ar.appendTo(al)})},ak)}function o(){this.manipulateSelection(function(ak){this.getRangeElements(ak,"blockquote > *").each(function(){var am=N(this).unwrap("blockquote"),al=am.parent();if(al.is("li")&&al.children().length==1){al.html(am.html())}})})}function q(){if(this.isIndented()){this.unquoteSelection()}else{this.quoteSelection()}}function A(){return x("blockquote")}function g(ak){this.execCommand("fontname",ad,ak)}function M(ak){this.execCommand("fontsize",ad,ak)}function ah(ak){this.execCommand("forecolor",ad,ak)}function w(ak){if(N.browser.mozilla){this.execCommand("hilitecolor",ad,ak)}else{this.execCommand("backcolor",ad,ak)}}function D(ak){this.execCommand("justify"+ak)}function t(){var ak=r.getSelection().getNode();return N(ak).css("textAlign")}function l(ak){this.execCommand("createLink",ad,ak)}function ai(){this.manipulateSelection(function(ak){this.getRangeElements(ak,"[href]").each(this.clearElement)})}function V(){return x("a[href]")}function v(){var ak=N("<ol/>");if(J()){this.manipulateSelection(function(al,am){this.getRangeElements(al,"ol").each(function(an){var ao=N(this);ao.children("li").each(function(){var ap=N(this);Y(ap,"p");ap.find("ol,ul").each(function(){var aq=N(this).parent();if(aq.is("p")){n.apply(aq)}})});n.apply(ao)})})}else{this.manipulateSelection(function(al,am){var an=am.clone();this.getRangeElements(al,k).each(function(ao){var ap=N(this);if(ap.parent().is("ul")){Y(ap.parent(),"ol");an=ap.parent()}else{if(!ao){ap.replaceWith(an)}ap.appendTo(an)}});an.children(":not(li)").each(function(){Y(N(this),"li")})},ak)}N(R.activeElement).trigger(U)}function ac(){v()}function J(){return x("ol")}function s(){var ak=N("<ul/>");if(ag()){this.manipulateSelection(function(al,am){this.getRangeElements(al,"ul").each(function(an){var ao=N(this);ao.children("li").each(function(){var ap=N(this);Y(ap,"p");ap.find("ol,ul").each(function(){var aq=N(this).parent();if(aq.is("p")){n.apply(aq)}})});n.apply(ao)})})}else{this.manipulateSelection(function(al,am){var an=am.clone();this.getRangeElements(al,k).each(function(ao){var ap=N(this);if(ap.parent().is("ol")){Y(ap.parent(),"ul");an=ap.parent()}else{if(!ao){ap.replaceWith(an)}ap.appendTo(an)}});an.children(":not(li)").each(function(){Y(N(this),"li")})},ak)}N(R.activeElement).trigger(U)}function Q(){s()}function ag(){return x("ul")}function L(al,ak){this.execCommand("insertImage",ad,al)}function ab(al){if(N.browser.msie){var ak=r.document.selection.createRange();ak.pasteHTML(al);ak.collapse(ad);ak.select();N(R.activeElement).trigger(U)}else{this.execCommand("insertHTML",ad,al)}}function af(){var am=r.getSelection(),ak=am.getRangeAt(0),ao=am.getNode(),an=arguments.length,al;if(ak.collapsed){ak=R.createRange();ak.selectNodeContents(ao);am.removeAllRanges();am.addRange(ak)}ak=am.getRangeAt(0);while(an--){al=N("<"+arguments[an]+"/>");ak.surroundContents(al.get(0))}N(R.activeElement).trigger(U)}function P(an){var ap=r.getSelection(),ao=this,ar=N(ao),aq="WysiHat-replaced",am=ap.rangeCount,ak=[],al;while(am--){al=ap.getRangeAt(am);ak.push(al);this.getRangeElements(al,k).each(function(){ao.replaceElement(N(this),an)}).data(aq,H)}ar.children(an).removeData(aq);N(R.activeElement).trigger(U);this.restoreRanges(ak)}function X(){this.changeContentBlock("p")}function Y(ao,an){if(ao.is("."+E)){return}var al=ao.get(0),ap=N("<"+an+"/>").html(ao.html()),am=al.attributes,ak=am.length;if(ak){while(ak--){ap.attr(am[ak].name,am[ak].value)}}ao.replaceWith(ap);N(R.activeElement).trigger(U);return ap}function n(){var ak=N(this);ak.replaceWith(ak.html());N(R.activeElement).trigger(U)}function p(){function am(ar,at){var aq=N(at);aq.children().each(am);if(ap(aq)){n.apply(aq)}}var ao=r.getSelection(),ap=WysiHat.Element.isFormatter,an=ao.rangeCount,ak=[],al;while(an--){al=ao.getRangeAt(an);ak.push(al);this.getRangeElements(al,k).each(am)}N(R.activeElement).trigger(U);this.restoreRanges(ak)}function d(ak){return(N.inArray(ak,u)>-1)}function W(ak){return(!!I[ak])?I[ak]:false}function a(ao,am,al){var ak=this.commands[ao];if(ak){ak.bind(this)(al)}else{C();try{r.document.execCommand(ao,am,al)}catch(an){return K}}N(R.activeElement).trigger(U)}function C(){try{r.document.execCommand("styleWithCSS",0,ad);C=function(){r.document.execCommand("styleWithCSS",0,ad)}}catch(ak){try{r.document.execCommand("useCSS",0,H);C=function(){r.document.execCommand("useCSS",0,H)}}catch(ak){try{r.document.execCommand("styleWithCSS",ad,ad);C=function(){r.document.execCommand("styleWithCSS",ad,ad)}}catch(ak){}}}}C();function h(al){var ak=this.queryCommands[al];if(ak){return ak()}else{try{return r.document.queryCommandState(al)}catch(am){return K}}}function c(){var al={},ak=this;ak.styleSelectors.each(function(am){var an=ak.selection.getNode();al[am.first()]=N(an).css(am.last())});return al}function T(ap){var ar=ad,ao=N(this),ak=N(ap.target),aq=ak.text(),an=ak.closest("button,[role=button]"),am=ao.data("field"),al=an.siblings();if(an.data("toggle-text")==O){an.data("toggle-text","View Content")}this.toggleHTML=function(){if(!ar){an.find("b").text(an.data("toggle-text"));al.hide();ao.trigger("WysiHat-editor:change:immediate").hide();am.show()}else{an.find("b").text(aq);al.show();am.trigger("WysiHat-field:change:immediate").hide();ao.show()}ar=!ar};this.toggleHTML()}function f(){var ao=r.getSelection(),an=ao.rangeCount,ak=[],am=arguments,ap=am[0],al;while(an--){al=ao.getRangeAt(an);ak.push(al);am[0]=al;ap.apply(this,am)}N(R.activeElement).trigger(U);this.restoreRanges(ak)}function m(al,ak){var an=N(al.startContainer).closest(ak),ao=N(al.endContainer).closest(ak),am=N("nullset");if(!!an.parents(".WysiHat-editor").length&&!!ao.parents(".WysiHat-editor").length){am=an;if(!an.filter(ao).length){if(an.nextAll().filter(ao).length){am=an.nextUntil(ao).andSelf().add(ao)}else{am=an.prevUntil(ao).andSelf().add(ao)}}}return am}function aa(){var an=r.getSelection(),am=an.rangeCount,ak=[],al;while(am--){al=an.getRangeAt(am);ak.push(al)}return ak}function ae(ak){var am=r.getSelection(),al=ak.length;am.removeAllRanges();while(al--){am.addRange(ak[al])}}function x(am){var ao=WysiHat.Element.getPhraseElements(),al=ad,ap=am.split(","),aq=ap.length,ar=r.getSelection(),an=ar.anchorNode,ak=ar.focusNode;if(an.nodeType&&an.nodeType==3&&an.nodeValue==""){an=an.nextSibling}if(N.browser.mozilla){while(aq--){if(N.inArray(ap[aq],ao)!=-1){al=H;break}}if(al&&an.nodeType==1&&N.inArray(an.nodeName.toLowerCase(),ao)==-1){aq=an.firstChild;if(aq.nodeValue==""){aq=aq.nextSibling}if(aq.nodeType==1){an=aq}}}while(an.nodeType!=1&&ak.nodeType!=1){if(an.nodeType!=1){an=an.parentNode}if(ak.nodeType!=1){ak=ak.parentNode}}return !!(N(an).closest(am).length||N(ak).closest(am).length)}return{boldSelection:e,isBold:S,italicizeSelection:j,isItalic:z,underlineSelection:Z,isUnderlined:b,strikethroughSelection:aj,isStruckthrough:F,quoteSelection:G,unquoteSelection:o,toggleIndentation:q,isIndented:A,fontSelection:g,fontSizeSelection:M,colorSelection:ah,backgroundColorSelection:w,alignSelection:D,alignSelected:t,linkSelection:l,unlinkSelection:ai,isLinked:V,toggleOrderedList:v,insertOrderedList:ac,isOrderedList:J,toggleUnorderedList:s,insertUnorderedList:Q,isUnorderedList:ag,insertImage:L,insertHTML:ab,wrapHTML:af,changeContentBlock:P,unformatContentBlock:X,replaceElement:Y,deleteElement:n,stripFormattingElements:p,execCommand:a,noSpans:C,queryCommandState:h,getSelectedStyles:c,toggleHTML:T,isValidCommand:d,getDefaultShortcut:W,manipulateSelection:f,getRangeElements:m,getRanges:aa,restoreRanges:ae,selectionIsWithin:x,commands:{},queryCommands:{bold:S,italic:z,underline:b,strikethrough:F,createLink:V,orderedlist:J,unorderedlist:ag},styleSelectors:{fontname:"fontFamily",fontsize:"fontSize",forecolor:"color",hilitecolor:"backgroundColor",backcolor:"backgroundColor"}}})(window,document,jQuery);if(typeof Node=="undefined"){(function(){function a(){return{ATTRIBUTE_NODE:2,CDATA_SECTION_NODE:4,COMMENT_NODE:8,DOCUMENT_FRAGMENT_NODE:11,DOCUMENT_NODE:9,DOCUMENT_TYPE_NODE:10,ELEMENT_NODE:1,ENTITY_NODE:6,ENTITY_REFERENCE_NODE:5,NOTATION_NODE:12,PROCESSING_INSTRUCTION_NODE:7,TEXT_NODE:3}}window.Node=new a()})()}(function(a,c){if(c.browser.msie){function b(){var f=c("#WysiHat-bookmark"),g=c("<div/>"),e=this._document.selection.createRange();if(f.length>0){f.remove()}f=c('<span id="WysiHat-bookmark">&nbsp;</span>').appendTo(g);e.collapse(true);e.pasteHTML(g.html())}function d(g){var f=c("#WysiHat-bookmark"),e=this._document.selection.createRange();if(f.length>0){f.remove()}e.moveToElementText(f.get(0));e.collapse(true);e.select();f.remove()}}else{function b(){var e=c("#WysiHat-bookmark");if(e.length>0){e.remove()}e=c('<span id="WysiHat-bookmark">&nbsp;</span>');this.getRangeAt(0).insertNode(e.get(0))}function d(g){var f=c("#WysiHat-bookmark"),e=a.createRange();if(f.length>0){f.remove()}e.setStartBefore(f.get(0));this.removeAllRanges();this.addRange(e);f.remove()}}c.extend(Selection.prototype,{setBookmark:b,moveToBookmark:d})})(document,jQuery);(function(f){var g={},e={},b={};function a(k,n){var j=k.get(0).tagName.toLowerCase(),m=n.length,l=f("<"+j+"></"+j+">");while(m--){attribute=n[i];if(k.attr(attribute)){l.attr(attribute,k.attr(attribute))}}return result}function c(j,k){j.children().map(k)}function d(j){var m=j.get(0),l,k;switch(m.nodeType){case"1":l=m.tagName.toLowerCase();if(b){k=j.clone(false);h(j,k);j.before(k)}else{if(l in e){k=a(j,e[l]);h(j,k);j.before(k)}else{if(!(l in g)){h(j)}}}break;case"8":j.remove();break}}function h(j,k){c(j,function(){var l=f(this);if(k){k.append(l)}else{j.before(l)}d(l)})}f.fn.sanitizeContents=function(l){l=l||{remove:"",allow:"",skip:[]};g={};e={};b=l.skip;var j=f(this),k=(l.remove||"").split(",");if(k.length>0&&k[0]!=""){f.each(k,function(m){g[f.trim(m)]=true})}k=(l.allow||"").split(",");if(k.length>0&&k[0]!=""){f.each(k,function(m){var p=f.trim(m).split(/[\[\]]/),n=p[0],o=f.grep(p.slice(1),function(r,q){return(/./).test(r)});e[n]=o})}c(j,function(){d(f(this))});return j}})(jQuery);(function(){function b(d,f){function e(){if(d.readyState==="complete"){$(d).unbind("readystatechange",e);f();return true}else{return false}}$(d).bind("readystatechange",e);e()}function c(e){e=$(e);var f=e.get(0);var d,h;d=false;function g(){if(d){return}d=true;if(h){h.stop()}e.trigger("frame:loaded")}if(window.addEventListener){h=$(document).bind("DOMFrameContentLoaded",function(j){if(e==$(this)){g()}})}e.load(function(){var j;if(typeof e.contentDocument!=="undefined"){j=e.contentDocument}else{if(typeof e.contentWindow!=="undefined"&&typeof e.contentWindow.document!=="undefined"){j=e.contentWindow.document}}b(j,g)});return e}function a(d,e){d.bind("frame:loaded",e);d.observeFrameContentLoaded()}jQuery.fn.observeFrameContentLoaded=c;jQuery.fn.onFrameLoaded=a})();jQuery(document).ready(function(){var d=jQuery,b=document,e=d(b),c,a;if("onselectionchange" in b&&"selection" in b){a=function(){var f=b.selection.createRange(),g=f.parentElement();d(g).trigger("WysiHat-selection:change")};e.bind("selectionchange",a)}else{a=function(){var h=b.activeElement,g=h.tagName.toLowerCase(),j,f;if(g=="textarea"||g=="input"){c=null}else{j=window.getSelection();if(j.rangeCount<1){return}f=j.getRangeAt(0);if(f&&f.equalRange(c)){return}c=f;h=f.commonAncestorContainer;while(h.nodeType==Node.TEXT_NODE){h=h.parentNode}}d(h).trigger("WysiHat-selection:change")};e.mouseup(a);e.keyup(a)}});(function(b){if(!b.browser.msie){b("body").delegate(".WysiHat-editor","contextmenu click doubleclick",function(){var g=b(this),f=g.data("field"),e=window.getSelection(),d=e.getRangeAt(0);if(d){d=d.cloneRange()}else{d=document.createRange();d.selectNode(g.get(0).firstChild)}f.data("saved-range",{startContainer:d.startContainer,startOffset:d.startOffset,endContainer:d.endContainer,endOffset:d.endOffset})}).delegate(".WysiHat-editor","paste",function(g){var h=g.originalEvent,f=b(this),d=f.data("field");d.data("original-html",f.children().detach());if(h.clipboardData&&h.clipboardData.getData){if(/text\/html/.test(h.clipboardData.types)){f.html(h.clipboardData.getData("text/html"))}else{if(/text\/plain/.test(h.clipboardData.types)){f.html(h.clipboardData.getData("text/plain"))}else{f.html("")}}a(f);h.stopPropagation();h.preventDefault();return false}else{f.html("");a(f);return true}});function a(d){if(d.contents().length){c(d)}else{setTimeout(function(){a(d)},20)}}function c(j){j.remove("script,noscript,style,:hidden").html(j.get(0).innerHTML.replace(/></g,"> <"));var f=j.data("field"),h=f.data("original-html"),e=document.createTextNode(j.text()),g=f.data("saved-range"),d=document.createRange();j.empty().append(h);d.setStart(g.startContainer,g.startOffset);d.setEnd(g.endContainer,g.endOffset);if(!d.collapsed){d.deleteContents()}d.insertNode(e);WysiHat.Formatting.cleanup(j);j.trigger("WysiHat-editor:change")}}else{b("body").delegate(".WysiHat-editor","paste",function(){WysiHat.Formatting.cleanup(b(this));$editor.trigger("WysiHat-editor:change")})}})(jQuery);WysiHat.Formatting=(function(c){var a={},b={},d={};return{cleanup:function(f){var e=WysiHat.Commands.replaceElement;f.find("span").each(function(){var g=c(this);if(g.is(".Apple-style-span")){g.removeClass(".Apple-style-span")}if(g.css("font-weight")=="bold"&&g.css("font-style")=="italic"){g.removeAttr("style").wrap("<strong>");e(g,"em")}else{if(g.css("font-weight")=="bold"){e(g.removeAttr("style"),"strong")}else{if(g.css("font-style")=="italic"){e(g.removeAttr("style"),"em")}}}}).end().children("div").each(function(){var g=c(this);if(!g.get(0).attributes.length){e(g,"p")}}).end().find("b").each(function(){e(c(this),"strong")}).end().find("i").each(function(){e(c(this),"em")}).end().find("strike").each(function(){e(c(this),"del")}).end().find("u").each(function(){e(c(this),"ins")}).end().find("p:empty").remove()},format:function(f){var g=new RegExp("(<(?:ul|ol)>|</(?:"+WysiHat.Element.getBlocks().join("|")+")>)[\r\n]*","g"),e=f.html().replace("<p>&nbsp;</p>","").replace(/<br\/?><\/p>/,"</p>").replace(g,"$1\n").replace(/\n+/,"\n").replace(/<p>\n+<\/p>/,"");f.html(e)},getBrowserMarkupFrom:function(e){var f=c("<div>"+e.val().replace(/\n/,"")+"</div>");this.cleanup(f);if(f.html()==""){f.html("<p><br/></p>")}return f.html()},getApplicationMarkupFrom:function(h){var j=h.clone(),e=h.attr("id"),f=WysiHat.Commands.replaceElement,k,g;k=c("<div/>").html(j.html());this.cleanup(k);this.format(k);return k.html().replace(/<\/?[A-Z]+/g,function(l){return l.toLowerCase()})}}})(jQuery);(function(a){WysiHat.Toolbar=function(){var d,j;function k(r){d=r;c()}function c(){j=a('<div class="'+WysiHat.name+'-editor-toolbar" role="presentation"></div>').insertBefore(d)}function h(r){a(r.buttons).each(function(s,t){p(t)})}function p(t,u){var s,v,r;if(!t.name){t.name=t.label.toLowerCase()}s=t.name;v=o(j,t);if(u){t.handler=u}u=q(s,t);l(v,u);u=f(s,t);m(v,s,u);return v}function o(s,r){var t=a('<button aria-pressed="false" tabindex="-1"><b>'+r.label+"</b></button>").addClass("button "+r.name).appendTo(s).hover(function(){var u=a(this).closest("button");u.attr("title",u.find("b").text())},function(){a(this).closest("button").removeAttr("title")});if(r.cssClass){t.addClass(r.cssClass)}if(r.title){t.attr("title",r.title)}t.data("text",r.label);if(r["toggle-text"]){t.data("toggle-text",r["toggle-text"])}return t}function q(s,r){var t=function(){};if(r.handler){t=r.handler}else{if(WysiHat.Commands.isValidCommand(s)){t=function(u){return u.execCommand(s)}}}return t}function l(s,r){s.click(function(t){r(d,t);a(document.activeElement).trigger("WysiHat-selection:change");return false})}function f(s,r){var t=function(){};if(r.query){t=r.query}else{if(WysiHat.Commands.isValidCommand(s)){t=function(u){return u.queryCommandState(s)}}}return t}function m(u,s,t){var r;d.bind("WysiHat-selection:change",function(){var v=t(d,u);if(v!=r){r=v;e(u,s,v)}})}function e(u,s,t){var v=u.data("text"),r=u.data("toggle-text");if(t){u.addClass("selected").attr("aria-pressed","true").find("b").text(r?r:v)}else{u.removeClass("selected").attr("aria-pressed","false").find("b").text(v)}}function g(t,s){var r=s.shortcut||WysiHat.Commands.getDefaultShortcut(t),w,v,u;if(!!r){w=!!r.alt;v=!!r.ctrl;u=r.keycode;r=function(x){return(u==x.which&&w==x.altKey&&v==x.ctrlKey)}}return r}function b(s,r){d.keydown(function(t){if(s(t)){r()}})}function n(u){var t=a(this).closest("button,[role=button]"),s=u.which,r;switch(s){case 37:case 38:r=t.prev();if(!r.length){r=a(t.parent().get(0).lastChild)}r.focus();break;case 39:case 40:r=t.next();if(!r.length){r=a(t.parent().get(0).firstChild)}r.focus();break}}return{initialize:k,createToolbarElement:c,addButtonSet:h,addButton:p,createButtonElement:o,buttonHandler:q,observeButtonClick:l,buttonStateHandler:f,observeStateChanges:m,updateButtonState:e}}})(jQuery);WysiHat.Toolbar.ButtonSets={};WysiHat.Toolbar.ButtonSets.Basic=[{label:"Bold"},{label:"Underline"},{label:"Italic"}];WysiHat.Toolbar.ButtonSets.Standard=[{label:"Bold",cssClass:"toolbar_button"},{label:"Italic",cssClass:"toolbar_button"},{label:"Strikethrough",cssClass:"toolbar_button"},{label:"Bullets",cssClass:"toolbar_button",handler:function(a){return a.toggleUnorderedList()}}];jQuery.fn.wysihat=function(a){a=jQuery.extend({buttons:WysiHat.Toolbar.ButtonSets.Standard},a);return this.each(function(){var b=WysiHat.Editor.attach(jQuery(this)),c=new WysiHat.Toolbar(b);c.initialize(b);c.addButtonSet(a)})};