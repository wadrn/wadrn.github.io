# 继承React.Component的类的方法时遵循下面的顺序
1. constructor
2. optional static methods
3. getChildContext
4. componentWillMount
5. componentDidMount
6. componentWillReceiveProps
7. shouldComponentUpdate
8. componentWillUpdate
9. componentDidUpdate
10. componentWillUnmount
11. 点击回调或者事件回调，比如onClickSubmit()或者onChangeDescription()
12. render函数中的getter()方法，，比如getSelectReason()或者getFooterContent()
13. 可选的render方法
14. render

