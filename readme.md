# Promise
符合promise A+规范的promise历程
## promise-base
实现基础的promise类，then方法，状态只支持从PEDDING到RESOLVE,REJECT
## promise异步
promise内部支持异步resolve，reject
## promise链式调用
then方法返回一个新的promise
## resolvePromise方法
判断前一个then方法中的返回值：**常量**或是**引用对象**或**null**
- 常量，默认执行resolve
- 引用对象
    - function 默认是promise
    - 对象  默认是普通对象
    - null  同常量

因为promise2内部无法调用自己，所用通过异步放入下一个宏任务中
## then的穿透效果
then可以不传resolve，reject，仍然会向下传递，直到有个then内部执行了resolve，reject

