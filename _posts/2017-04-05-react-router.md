##React-Router
路由本质就是嵌套的视图组件
###browserHistory
**功能**：监听浏览器地址栏的变化，解析URL并与路由组件进行匹配。还提供了一些方法让你在代码中进行导航。
//跳转到某个路径
`browserHistory.push('./some.path');`
//回退到先前的地址
`browserHistory.goBack()`
###路由匹配
配置路由匹配信息。

```
export default()=>(
  <Route path='/' component={Main}>
    <IndexRoute component={Home}/>
    <Route path='counter' component={Counter}/>
 </Route>
```
通过上面的配置，程序知道如何渲染这些URL:

| URL | Components |
| --- | --- |
| / | Main->Home  |
| /counter | Main->Counter |

使用了嵌套路由的概念
IndexRoute组件将作为父级Route的默认子路由组件，即为URL为/时显示的组件。

###使用Link和IndexLink导航
如果使用<Link to='/'>Home</Link>去导航/这个URL。只要进入以/开头的URL时，Link组件都会被激活。
common/comtainer/Main.js
-------

```
import React,{PropTypes} from 'react'
import {Link,IndexLink} from 'react-router'

function Main(props){
    return (
        <div>
          <ul>
            <li><IndexLink to='/' activeStyle={{color:'red'}}>Home</IndexLink></li>
            <li><IndexLink to='/counter' activeStyle={{color:'red'}}Counter</li>
        </ul>
        {/*this will render the child routes*/}
        {React.cloneElement(props.children,props)}
       </div>
    );
}
 Main.propTypes ={
    children:PropTypes.any.isRequired          
 };
 export default Main;
```
###服务端路由
在React-Router中实现服务端路由，需要在Express中间件中加一个用于匹配路由的match函数，并在match的回调中进行渲染就可以。

server/server.js
-------
 
```
function handleRender(req,res){
    const initialState ={counter:0};
    const store = configureStore(initialState);
    const routes =getRoutes();
    
match({routes,location:req.url},(err,redirect,renderProps)=>{
    const html = renderToString(
        <Provider store={store}>
         <RouterContext {...renderProps}/>
        </Provider>
        );
    const finalState =store.getState();
    res.send(renderFullPage(html,finalState)));
    });
    }
    
//第一个的参数是一个对象，包括所有路由集合和location
//第二个参数是一个回调函数，渲染路由组件
//match是专为异步路由设计的函数
//match会根据不同的请求，在回掉函数中返回不同的参数：
*     正确匹配，没有重定向，，前两个参数为null，renderProps包含了匹配的组件和location等信息
*     有重定向，redirect将包含重定向信息
*     出现内部错误，err将包含错误信息
*     404错误下，三个参数均为undefined
```






