---
title: 二分查找总结
date: 2018-01-04
categories:
- Algorithm
tags:
- BinarySearch
---


# 二分查找总结

## 二分查找主要解决的问题

一堆数中找出指定的数

##  条件

 数组、有序 （数据结构不能用链表）


## 用二分法精确查找
```javascript
var binarySearch = function(arr,low,high,target){
    var mid = parseInt((low+high)/2);
    while(low < high){
        if(arr[mid] < target){
            low = mid+1;
        }else if(arr[mid] > target){
            high = mid-1;
        }else{
            return mid;
        }
        mid = parseInt((low+high)/2);
    }
    return -1;
}
```
## 用二分法界限查找

### 严格界限查找

在有序数组中找到
1. 第一个大于target的值
2. 最后一个小于target的值

```javascript
var binarySearchUpperBound = function(arr,low,high,target){
    if(low >high || target >=arr[high]){
        return -1;
    }
    var mid = parseInt((low+high)/2);
    while(high >low){
        if(arr[mid] > target){
            high = mid;  //arr[mid]也有可能是结果
        }else{
            low = mid+1;
        }
        mid = parseInt((low+high)/2);
    }
    return mid;
}


var binarySearchLowerBound =function(arr,low,high,target){
    if(low >high || target >=arr[high]){
        return -1;
    }
    var mid = parseInt((low+high+1)/2);
    while(high >low){
        if(arr[mid] < target){
            low = mid;
        }else{
            high = mid-1;
        }
        mid = parseInt((low+high+1)/2);  //防止进入无限循环
    }
    return mid;
}
```

### 松散界限查找

在有序数组中找到
1. 第一个大于等于target的值
2. 最后一个小于等于target的值

```javascript

//修改判断条件
arr[mid] >=target;

arr[mid] <=target;

```

## 用二分法查找区域

找到下届和上届即可求出中间部分区域


## 在轮转数组中应用二分查找

轮转数组就是以某个数为轴将数组旋转之后的形式

```javascript
var SearchInRotateSortedArray = function(arr,low,high,target){
    while(low <= high){
        var mid = parseInt((low+high)/2);
        if(target < arr[mid]){
            if(arr[mid] > arr[high]){
                if(target > arr[low]){
                    high = mid-1;
                }else{
                    low = mid+1;
                }
            }else{
                high = mid-1;
            }
        }else if(target > arr[mid]){
            if(arr[mid] > arr[low]){
                low = mid+1;
            }else{
                if(target >arr[high]){
                    high = mid-1;
                }else{
                    low = mid+1;
                }
            }
        }else{
            return mid;
        }
    }
    return -1;
}
```