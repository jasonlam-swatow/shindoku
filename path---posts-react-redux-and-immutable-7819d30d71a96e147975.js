webpackJsonp([98624306534198],{407:function(a,n){a.exports={data:{site:{siteMetadata:{title:"Jason Lam",subtitle:"慎獨｜純亦不已",author:{name:"Jason Lam",twitter:"jasonlam0619"},disqusShortname:"",url:"https://lumen.netlify.com"}},markdownRemark:{id:"/Users/mac/jasonlam-swatow.github.io/src/pages/articles/2018-03-09---React-Redux-and-Immutable/index.md absPath of file >>> MarkdownRemark",html:'<h2>react-redux</h2>\n<p>兩個前提：</p>\n<ol>\n<li><code class="language-text">shouldComponentUpdate</code> 默認返回 <code class="language-text">true</code>，即只要組件的狀態（<code class="language-text">props</code> 或者 <code class="language-text">state</code>）發生改變，組件就會執行 <code class="language-text">render</code> 函數進行重渲染。除非重寫 <code class="language-text">shouldComponentUpdate</code> 透過返回 <code class="language-text">false</code> 阻止重渲染，或者讓組件直接繼承自 <code class="language-text">PureComponent</code>。</li>\n<li><code class="language-text">PureComponent</code> 的原理只不過代替你實現了 <code class="language-text">shouldComponentUpdate</code>：在函數內對當前和過去的 <code class="language-text">props</code>/<code class="language-text">state</code> 進行淺對比（即僅比較對象的引用而非比較對象每個屬性值）。</li>\n</ol>\n<p>其實在 <code class="language-text">react-redux</code> 中實現了這套邏輯，對數據進行淺對比：</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js"><span class="token keyword">import</span> <span class="token punctuation">{</span> connect <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">\'react-redux\'</span>\n\n<span class="token keyword">function</span> <span class="token function">mapStateToProps</span><span class="token punctuation">(</span>state<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">return</span> <span class="token punctuation">{</span>\n    todos<span class="token punctuation">:</span> state<span class="token punctuation">.</span>todos<span class="token punctuation">,</span>\n    visibleTodos<span class="token punctuation">:</span> <span class="token function">getVisibleTodos</span><span class="token punctuation">(</span>state<span class="token punctuation">)</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">connect</span><span class="token punctuation">(</span>mapStateToProps<span class="token punctuation">,</span> mapDispatchToProps<span class="token punctuation">)</span><span class="token punctuation">(</span>App<span class="token punctuation">)</span></code></pre>\n      </div>\n<p><code class="language-text">react-redux</code> 會假設 <code class="language-text">App</code> 是一個 <code class="language-text">PureComponent</code>，即對於唯一的 <code class="language-text">props</code>/<code class="language-text">state</code> 有唯一的渲染結果。故 <code class="language-text">react-redux</code> 首先會對根狀態（即上述代碼中 <code class="language-text">mapStateToProps</code> 的第一個形參 <code class="language-text">state</code>）創建索引，進行淺對比，若對比結果一致則不對組件進行重渲染，否則繼續調用 <code class="language-text">mapStateToProps</code> 函數；同時繼續對 <code class="language-text">mapStateToProps</code> 返回的 <code class="language-text">props</code> 對象中每個屬性值（<code class="language-text">state.todos</code> 和 <code class="language-text">getVisibleTodos(state)</code> 值）創建索引。和 <code class="language-text">shouldComponentUpdate</code> 類似，只有當淺對比失敗，即索引發生變動時才會對封裝組件進行重渲染。</p>\n<p>只有 <code class="language-text">state.todos</code> 和 <code class="language-text">getVisibleTodos(state)</code> 值不變，那麼 <code class="language-text">App</code> 組件就永不會重渲染。但注意下面的陷阱模式：</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function">mapStateToProps</span><span class="token punctuation">(</span>state<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">return</span> <span class="token punctuation">{</span>\n    data<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n      todos<span class="token punctuation">:</span> state<span class="token punctuation">.</span>todos<span class="token punctuation">,</span>\n      visibleTodos<span class="token punctuation">:</span> <span class="token function">getVisibleTodos</span><span class="token punctuation">(</span>state<span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>即使兩者不再變化，但由於每次 <code class="language-text">mapStateToProps</code> 返回結果 <code class="language-text">{ data: { ... } }</code> 中的 <code class="language-text">data</code> 都是新創建的字面量對象，導致淺對比失敗，<code class="language-text">App</code> 依然會重渲染。</p>\n<p>其次是 <code class="language-text">combineReducers</code>。Redux Store 鼓勵我們把狀態對象劃分為不同碎片（slices）或領域（domains，業務），並分別編寫 reducer 函數以管理其狀態，最後使用 <code class="language-text">combineReducers</code> 將這些領域及其 reducer 關聯起來，拼裝成一個整體的 <code class="language-text">state</code>。</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js"><span class="token function">combineReducers</span><span class="token punctuation">(</span><span class="token punctuation">{</span> todos<span class="token punctuation">:</span> myTodoReducer<span class="token punctuation">,</span> counter<span class="token punctuation">:</span> myCounterReducer <span class="token punctuation">}</span><span class="token punctuation">)</span></code></pre>\n      </div>\n<p><code class="language-text">combineReducers</code> 會遍歷每一對領域（key 是領域名，value 是 reducer），對於每次遍歷：</p>\n<ol>\n<li>創建一個對當前碎片數據的引用</li>\n<li>調用 reducer 計算碎片數據的新狀態，並返回</li>\n<li>為 reducer 返回的新碎片數據創建新的引用，將新引用與當前數據進行淺對比，若對比失敗（意味著兩次引用不同，即 reducer 返回的是一個新對象），則將標識位 <code class="language-text">hasChanged</code> 設為 <code class="language-text">true</code></li>\n</ol>\n<p>遍歷完後，<code class="language-text">combineReducers</code> 就得到一個新狀態對象，透過 <code class="language-text">hasChanged</code> 標識位就能判斷出整體狀態是否發生更改，若為 <code class="language-text">true</code> 則新狀態會被返回給下游（下游指 <code class="language-text">react-redux</code> 及其更下游的介面組件）。</p>\n<p>綜上所述我們知道，<strong>當狀態需要發生更改時，務必讓相應的 reducer 函數始終返回新對象。</strong>修改原有對象的屬性值然後返回，並不會觸發組件的重渲染。</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js"><span class="token keyword">return</span> Object<span class="token punctuation">.</span><span class="token function">assign</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> state<span class="token punctuation">,</span> <span class="token punctuation">{</span> count<span class="token punctuation">:</span> state<span class="token punctuation">.</span>count<span class="token operator">++</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token comment">// 而非僅修改原對象：</span>\nstate<span class="token punctuation">.</span>count<span class="token operator">++</span>\n<span class="token keyword">return</span> state</code></pre>\n      </div>\n<h2>Immutable Data 和 ImmutableJS</h2>\n<p>結上可知，無論是從 reducer 的定義上，還是從 Redux 的工作機制上，我們都走上了同一條 <code class="language-text">Object.assign</code> 的模式，即不修改原狀態，只返回新狀態。可見 state 天生就是不可變異的（immutable）。</p>\n<p>使用 ImmutableJS 能實現幾類不可變異的數據結構，譬如 <code class="language-text">Map</code>、<code class="language-text">List</code>。</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js"><span class="token keyword">import</span> <span class="token punctuation">{</span> Map <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">\'immutable\'</span>\n<span class="token keyword">const</span> person <span class="token operator">=</span> <span class="token function">Map</span><span class="token punctuation">(</span><span class="token punctuation">)</span>    <span class="token comment">// 創建一個空對象</span>\n<span class="token keyword">const</span> personWithAge <span class="token operator">=</span> person<span class="token punctuation">.</span><span class="token keyword">set</span><span class="token punctuation">(</span><span class="token string">\'age\'</span><span class="token punctuation">,</span> <span class="token number">20</span><span class="token punctuation">)</span> <span class="token comment">// 為 person 實例添加 age 屬性</span>\n<span class="token comment">// 調用 toJS() 打印出兩個實例</span>\nconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>person<span class="token punctuation">.</span><span class="token function">toJS</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">// {}，person 的屬性不變</span>\nconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>personWithAge<span class="token punctuation">.</span><span class="token function">toJS</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">// { age: 20 }</span></code></pre>\n      </div>\n<p>在 Immutable 的數據結構中，當你想更改某個對象屬性時，你得到的永遠是一個新對象，而原對象不會變化。上述 reducer 中：</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js"><span class="token keyword">return</span> state<span class="token punctuation">.</span><span class="token keyword">set</span><span class="token punctuation">(</span><span class="token string">\'count\'</span><span class="token punctuation">,</span> state<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span><span class="token string">\'count\'</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span></code></pre>\n      </div>\n<p><strong>Immutable 的原理：</strong></p>\n<ol>\n<li>有這樣一個 JavaScript 結構對象，根據 key 作為索引，組織成字典查找樹：\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/1-240776bc643dadbcabb25db0b589d2a4-1caba.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 400px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 93.75%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAATABQDASIAAhEBAxEB/8QAGAABAQEBAQAAAAAAAAAAAAAAAAIBAwX/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAH3pwdEjZCwf//EABgQAAIDAAAAAAAAAAAAAAAAAAEQACAh/9oACAEBAAEFAqZAgF//xAAUEQEAAAAAAAAAAAAAAAAAAAAg/9oACAEDAQE/AR//xAAUEQEAAAAAAAAAAAAAAAAAAAAg/9oACAECAQE/AR//xAAUEAEAAAAAAAAAAAAAAAAAAAAw/9oACAEBAAY/Ah//xAAaEAEAAwEBAQAAAAAAAAAAAAABABExIRBB/9oACAEBAAE/IVqDXjyx1hq4GogvSBWfIYT/2gAMAwEAAgADAAAAEPMIgP/EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQMBAT8QH//EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQIBAT8QH//EABoQAQEBAQEBAQAAAAAAAAAAAAERACExcbH/2gAIAQEAAT8QuAKvmen0sZ+4aXPqD0PmcBiwXvHNqwWnzCYPEyVR4Nz8t//Z\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="image"\n        title=""\n        src="/static/1-240776bc643dadbcabb25db0b589d2a4-1caba.jpg"\n        srcset="/static/1-240776bc643dadbcabb25db0b589d2a4-38c71.jpg 240w,\n/static/1-240776bc643dadbcabb25db0b589d2a4-1caba.jpg 400w"\n        sizes="(max-width: 400px) 100vw, 400px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </li>\n<li>假設此時你想修改 <code class="language-text">tea</code> 屬性的值為 <code class="language-text">14</code>，首先找到訪問到 <code class="language-text">tea</code> 節點的關鍵路徑：\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/2-665dcf1a08f3fbfff48f8b173e8b6a5c-4cf8a.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 960px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 55.400000000000006%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAgABBf/EABQBAQAAAAAAAAAAAAAAAAAAAAH/2gAMAwEAAhADEAAAAe8UQdsv/8QAFxAAAwEAAAAAAAAAAAAAAAAAAAEQMf/aAAgBAQABBQJijyf/xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAEDAQE/AT//xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAECAQE/AT//xAAUEAEAAAAAAAAAAAAAAAAAAAAg/9oACAEBAAY/Al//xAAbEAACAwADAAAAAAAAAAAAAAABEQAQITFBgf/aAAgBAQABPyFlnMLH0TQtDAN9r//aAAwDAQACAAMAAAAQjw//xAAVEQEBAAAAAAAAAAAAAAAAAAAQQf/aAAgBAwEBPxCn/8QAFhEBAQEAAAAAAAAAAAAAAAAAERAh/9oACAECAQE/EDWf/8QAGxABAQACAwEAAAAAAAAAAAAAAREAECExsXH/2gAIAQEAAT8QYiRdKcGSiJQj3oGClPcMr191/9k=\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="image"\n        title=""\n        src="/static/2-665dcf1a08f3fbfff48f8b173e8b6a5c-d564d.jpg"\n        srcset="/static/2-665dcf1a08f3fbfff48f8b173e8b6a5c-865fd.jpg 240w,\n/static/2-665dcf1a08f3fbfff48f8b173e8b6a5c-d40a0.jpg 480w,\n/static/2-665dcf1a08f3fbfff48f8b173e8b6a5c-d564d.jpg 960w,\n/static/2-665dcf1a08f3fbfff48f8b173e8b6a5c-4cf8a.jpg 1000w"\n        sizes="(max-width: 960px) 100vw, 960px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </li>\n<li>然後將路徑上的節點複製出來，構建一棵一模一樣結構的樹，唯新樹的其他節點均是對原樹的引用：\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/3-6a3d9e29c3fd90d027c227cbdac79a00-4cf8a.jpg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 960px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 68.80000000000001%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAAOABQDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAECBf/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/9oADAMBAAIQAxAAAAHfkRQiT//EABgQAAMBAQAAAAAAAAAAAAAAAAABMQIQ/9oACAEBAAEFAuKMRmf/xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAEDAQE/AT//xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAECAQE/AT//xAAUEAEAAAAAAAAAAAAAAAAAAAAg/9oACAEBAAY/Al//xAAaEAACAgMAAAAAAAAAAAAAAAAAMQERQVGh/9oACAEBAAE/IZReIFGxC3wSf//aAAwDAQACAAMAAAAQcP8A/8QAFhEBAQEAAAAAAAAAAAAAAAAAAAEx/9oACAEDAQE/EEx//8QAFhEBAQEAAAAAAAAAAAAAAAAAAAEx/9oACAECAQE/EEx//8QAHBABAQEAAQUAAAAAAAAAAAAAAREAITFBUXHB/9oACAEBAAE/EGCuCnwyVnr6mMoBXzkQ8IEMCGkZ2V3/2Q==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="image"\n        title=""\n        src="/static/3-6a3d9e29c3fd90d027c227cbdac79a00-d564d.jpg"\n        srcset="/static/3-6a3d9e29c3fd90d027c227cbdac79a00-865fd.jpg 240w,\n/static/3-6a3d9e29c3fd90d027c227cbdac79a00-d40a0.jpg 480w,\n/static/3-6a3d9e29c3fd90d027c227cbdac79a00-d564d.jpg 960w,\n/static/3-6a3d9e29c3fd90d027c227cbdac79a00-4cf8a.jpg 1000w"\n        sizes="(max-width: 960px) 100vw, 960px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </li>\n<li>最後將新建的樹返回。</li>\n</ol>\n<p>完 :)</p>',fields:{tagSlugs:["/tags/react/","/tags/大前端/"]},frontmatter:{title:"react-redux 與 Immutable 優化",tags:["React","大前端"],date:"2016-09-01T23:46:37.121Z",description:"使用 react-redux 時，確保你熟悉它在更新和賦值時所做的操作，以及 immutable、side effects 和 mutation 的概念，以防止意外的 mutation 降低了應用性能。"}}},pathContext:{slug:"/posts/react-redux-and-immutable/"}}}});
//# sourceMappingURL=path---posts-react-redux-and-immutable-7819d30d71a96e147975.js.map