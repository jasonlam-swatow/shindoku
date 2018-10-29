webpackJsonp([2590805542364],{398:function(n,s){n.exports={data:{site:{siteMetadata:{title:"Jason Lam",subtitle:"慎獨｜純亦不已",author:{name:"Jason Lam",twitter:"https://twitter.com/jasonlam0619"},disqusShortname:"",url:"https://lumen.netlify.com"}},markdownRemark:{id:"/Users/mac/jasonlam-swatow.github.io/src/pages/articles/2018-07-27---Derived-State/index.md absPath of file >>> MarkdownRemark",html:'<h2>何時使用 derived state</h2>\n<p><code class="language-text">getDerivedStateFromProps</code> 的意義祇在使組件依其 props 的變化結果而改變其內部 state。</p>\n<ul>\n<li>如果你使用 derived state 以 memoize 一些祇基於當前 props 的計算，你就不需要 derived state。</li>\n<li>如果你無條件更新 derived state 或每當 props 和 state 不匹配時更新之，你的組件可能會過於頻繁地重置其 state。</li>\n</ul>\n<h2>使用 derived state 的常見 bugs</h2>\n<p>對於組件：</p>\n<ul>\n<li><strong>controlled</strong>：數據以 props 傳入，父組件得以控制數據</li>\n<li><strong>uncontrolled</strong>：數據僅存於內部 state，父組件不能直接改變之</li>\n</ul>\n<p>Derived state 的最常見錯誤是混淆此兩者。若一 derived state 值也能為 <code class="language-text">setState</code> 調用所更新，該數據就不止有一個 source of truth。</p>\n<h3>反模式：無條件複製 props 至 state</h3>\n<p>一個常見誤解是 <code class="language-text">getDerivedStateFromProps</code> 和 <code class="language-text">componentWillReceiveProps</code> 祇在 props 變更時調用。每當父組件重渲染時，這些 lifecycles 都會觸發，而不論 props 是否有變。因此，在這些 lifecycles 中無條件地覆蓋 state 即不安全，造成 state 更新丟失。</p>\n<p>一個將 prop 映射至 state 的 <code class="language-text">EmailInput</code> 組件：</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js"><span class="token keyword">class</span> <span class="token class-name">EmailInput</span> <span class="token keyword">extends</span> <span class="token class-name">Component</span> <span class="token punctuation">{</span>\n  state <span class="token operator">=</span> <span class="token punctuation">{</span> email<span class="token punctuation">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>props<span class="token punctuation">.</span>email <span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">return</span> <span class="token operator">&lt;</span>input onChange<span class="token operator">=</span><span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span>handleChange<span class="token punctuation">}</span> value<span class="token operator">=</span><span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">.</span>email<span class="token punctuation">}</span> <span class="token operator">/</span><span class="token operator">></span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token function-variable function">handleChange</span> <span class="token operator">=</span> event <span class="token operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> email<span class="token punctuation">:</span> event<span class="token punctuation">.</span>target<span class="token punctuation">.</span>value <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n  <span class="token function">componentWillReceiveProps</span><span class="token punctuation">(</span>nextProps<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// This will erase any local state updates!</span>\n    <span class="token comment">// Do not do this.</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> email<span class="token punctuation">:</span> nextProps<span class="token punctuation">.</span>email <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>每當其父組件重渲染時，往 <code class="language-text">&lt;input&gt;</code> 裏鍵入的內容就會丟失（<a href="https://codesandbox.io/s/m3w9zn1z8x">見例</a>）。</p>\n<p>加入 <code class="language-text">shouldComponentUpdate</code> 來讓組件祇在 <code class="language-text">email</code> prop 變更時才重渲染，可以解決這個問題。但實際情況中，組件經常接收多個 props；另外的 prop 變更也會引致重渲染。<code class="language-text">shouldComponentUpdate</code> 應祇用於優化性能，而非用以糾正 derived state。</p>\n<h3>反模式：props 變更時抹除 state</h3>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js"><span class="token function">componentWillReceiveProps</span><span class="token punctuation">(</span>nextProps<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// Any time props.email changes, update state.</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span>nextProps<span class="token punctuation">.</span>email <span class="token operator">!==</span> <span class="token keyword">this</span><span class="token punctuation">.</span>props<span class="token punctuation">.</span>email<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n        email<span class="token punctuation">:</span> nextProps<span class="token punctuation">.</span>email\n      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span></code></pre>\n      </div>\n<p>現在組件祇會在 props 真正變更時，才抹除鍵入的內容。但在一些邊緣需求的用例下，會引致 bugs（<a href="https://codesandbox.io/s/mz2lnkjkrx">見例</a>）。</p>\n<h2>Preferred solutions</h2>\n<h3>建議：fully controlled 組件</h3>\n<p>從組件完全移除 state——若 email 地址祇以 prop 形式存在，則不必擔心與 state 衝突。甚至可以把 <code class="language-text">EmailInput</code> 轉換成一個輕量的函數組件：</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function">EmailInput</span><span class="token punctuation">(</span>props<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">return</span> <span class="token operator">&lt;</span>input onChange<span class="token operator">=</span><span class="token punctuation">{</span>props<span class="token punctuation">.</span>onChange<span class="token punctuation">}</span> value<span class="token operator">=</span><span class="token punctuation">{</span>props<span class="token punctuation">.</span>email<span class="token punctuation">}</span> <span class="token operator">/</span><span class="token operator">></span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<h3>建議：帶 key 的 fully uncontrolled 組件</h3>\n<p>讓組件完全擁有「draft」email 地址，但仍可接收一個 prop 作為初始值，唯忽略其後續變更。</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js"><span class="token keyword">class</span> <span class="token class-name">EmailInput</span> <span class="token keyword">extends</span> <span class="token class-name">Component</span> <span class="token punctuation">{</span>\n  state <span class="token operator">=</span> <span class="token punctuation">{</span> email<span class="token punctuation">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>props<span class="token punctuation">.</span>defaultEmail <span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n  <span class="token function-variable function">handleChange</span> <span class="token operator">=</span> event <span class="token operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> email<span class="token punctuation">:</span> event<span class="token punctuation">.</span>target<span class="token punctuation">.</span>value <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">return</span> <span class="token operator">&lt;</span>input onChange<span class="token operator">=</span><span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span>handleChange<span class="token punctuation">}</span> value<span class="token operator">=</span><span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">.</span>email<span class="token punctuation">}</span> <span class="token operator">/</span><span class="token operator">></span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>（就上例的密碼管理器而言）為其加入一個 <code class="language-text">key</code> 屬性。當 <code class="language-text">key</code> 變化時，React 會新建一個組件實例，而非更新當前的組件實例。</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js"><span class="token operator">&lt;</span>EmailInput\n  defaultEmail<span class="token operator">=</span><span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span>props<span class="token punctuation">.</span>user<span class="token punctuation">.</span>email<span class="token punctuation">}</span>\n  key<span class="token operator">=</span><span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span>props<span class="token punctuation">.</span>user<span class="token punctuation">.</span>id<span class="token punctuation">}</span>\n<span class="token operator">/</span><span class="token operator">></span></code></pre>\n      </div>\n<p>每當 ID 有變，<code class="language-text">EmailInput</code> 會被重建且其 state 被重置（<a href="https://codesandbox.io/s/6v1znlxyxn">見例</a>）。你祇須為整個 form 配置一個 <code class="language-text">key</code>，每當 key 變化時，form 內的所有組件都會被重建並重置 state。</p>\n<p>在多數情況下，這是處理需要重置的 state 的最好方式。</p>\n<p>如果出於某些原因 <code class="language-text">key</code> 沒有用（可能組件的初始化非常昂貴），一個可能但笨拙的方法是在 <code class="language-text">getDerivedStateFromProps</code> 中監測 <code class="language-text">userID</code> 的變動：</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js"><span class="token keyword">class</span> <span class="token class-name">EmailInput</span> <span class="token keyword">extends</span> <span class="token class-name">Component</span> <span class="token punctuation">{</span>\n  state <span class="token operator">=</span> <span class="token punctuation">{</span>\n    email<span class="token punctuation">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>props<span class="token punctuation">.</span>defaultEmail<span class="token punctuation">,</span>\n    prevPropsUserID<span class="token punctuation">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>props<span class="token punctuation">.</span>userID\n  <span class="token punctuation">}</span><span class="token punctuation">;</span>\n  \n  <span class="token keyword">static</span> <span class="token function">getDerivedStateFromProps</span><span class="token punctuation">(</span>props<span class="token punctuation">,</span> state<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// Any time the current user changes,</span>\n    <span class="token comment">// Reset any parts of state that are tied to that user.</span>\n    <span class="token comment">// In this simple example, that\'s just the email.</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span>props<span class="token punctuation">.</span>userID <span class="token operator">!==</span> state<span class="token punctuation">.</span>prevPropsUserID<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">return</span> <span class="token punctuation">{</span>\n        email<span class="token punctuation">:</span> props<span class="token punctuation">.</span>defaultEmail<span class="token punctuation">,</span>\n        prevPropsUserID<span class="token punctuation">:</span> props<span class="token punctuation">.</span>userID\n      <span class="token punctuation">}</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  \n  <span class="token comment">// ...</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>完 :)</p>',fields:{tagSlugs:["/tags/react/","/tags/大前端/"]},frontmatter:{title:"你可能不需要 Derived State",tags:["React","大前端"],date:"2018-07-27T22:40:32.169Z",description:"React v16.4 納入了對 getDerivedStateFromProps 的 bugfix，使得 React 應用中一些 bugs 更易重現。此文旨在解釋一些關於 derived state 的反模式以及替代方案。"}}},pathContext:{slug:"/posts/derived-state/"}}}});
//# sourceMappingURL=path---posts-derived-state-ebc71779ac0a00d676b3.js.map