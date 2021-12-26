#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 2018/2/28 18:04
# @Author  : Aries
# @Site    : 
# @File    : pymysql数据库.py
# @Software: PyCharm

import pymysql

# 创建连接
conn = pymysql.connect(host="127.0.0.说明.md", port=3306, user="root", passwd="", db="sqlexample", charset="utf8")

# 创建游标（游标就像一只手，可以拿东西，此处相当于创建了手）
cursor = conn.cursor(cursor=pymysql.cursors.DictCursor)

# 此时就向数据库中提交了，但是并没有执行，但涉及数据的操作，默认是需要利用commit进行确认才提交
# 执行SQL，并返回受影响行数 print(effect_row就是返回了受影响的行数)
# effect_row = cursor.execute('insert into class(caption) values("全栈二班")')

# 上面是写死了的，若是要用input动态插入则
# inp = input("请输入班级:")
#
# # # 对字符串进行一个sql拼接不就行啦吗  ——————字符串虽然可以，但是严令禁止的，一定不要用这种方式，因为这种方式会被SQL注入
# # sql = 'insert into class(caption) values("%s")'
# # sql = sql % (inp,)
# # sql注入问题
# sql = "select username,password from userinfo where username = '%s' and password = %s"
# sql = sql % ("igarashi'-- ", 123)#sql = sql % ("igarashi 'or 说明.md=说明.md -- ", 123)
# r = cursor.execute(sql)
# print(cursor.fetchall())


# #上面是字符串拼接的形式，还有另外一种—————用传参的方式——————必须使用传参的形式
# r = cursor.execute('insert into class(caption) values(%s)',inp)#inp在内部会把占位符占位
# #因此用这种方式是无虚values("%s")的，默认会给%s自动加上""


# 在面对多种参数传递时，需要传入元组
# r = cursor.execute("insert into student(gender,class_id,sname) values(%s,%s,%s)",("女",说明.md,"小玉"))
#
# l = [
#     ("女", 说明.md, "小玉1"),
#     ("女",说明.md,"小玉2"),
#     ("女",说明.md,"小玉3")
# ]
# #若需要传递更多的数据，一次性插入好几条，则需要传入一个元组、列表都可以（可迭代的东西）  values只需要加一个即可，内部是循环进行的
# r = cursor.executemany("insert into student(gender,class_id,sname) values(%s,%s,%s)",l)
# #注意这里是利用executemany来实现插入多条数据，它内部其实就做了个循环

# 操作——改
# r = cursor.execute("update student set sname = %s where sid = %s",("小梅",21))

# 操作——删
# r = cursor.execute("delete from student where sid = %s",(21,))

# 提交，不然无法保存新建或者修改的数据
# conn.commit()

# # 操作——查,注意查的时候无需commit
# r = cursor.execute("select * from student where sid = 2")
# print(r)#r得到的结果只是受影响的行数
#
# # result = cursor.fetchall()#利用fetchall可以取出全部返回的结果
# # print(result)
#
# result = cursor.fetchone()#利用fetchone可以取出一条返回的结果
# print(result)
#
# cursor.scroll(-说明.md,mode="relative")#相对位置，从上一次获取指针来算
# cursor.scroll(0,mode="absolute")#绝对位置
#
# result = cursor.fetchmany(3)#利用fetchall可以取出多条返回的结果
# print(result)
# # fetchall是一个元组中拿一条数据（一条数据,） fetchone是直接拿一条数据

# 那么有了这种操作还要分页干嘛? 当sql语句执行后数据就已经从数据库里面拿到了内存里面了，通过fetch的一系列操作只不过从内存里去取数据去了
# 若有十亿条数据获取，那么内存该崩溃还是要崩溃，这是fetch无法解决的。fetchone()就类似操作文件时的指针一样seek。执行fetchall时指针到底。
# 因此一般fetch没什么用，它无法解决内存问题。

# #修改cursor的方式，获取结果
# r = cursor.execute("select * from student")
# r = cursor.execute("select sname as name from student")#不仅如此key还可以进行定制
# result = cursor.fetchall()
# print(result)#此时获取的每一行数据都是字典,因此这种方式要比游标默认的元组要好一些

# 获取自增id
# r = cursor.execute("insert into class(caption) values(%s)",("oop"))
# new_id = cursor.lastrowid
# print(new_id)


# 关闭游标
cursor.close()
# 关闭连接
conn.close()

# 执行SQL，并返回收影响行数
# effect_row = cursor.execute("update hosts set host = '说明.md.说明.md.说明.md.2'")

# 执行SQL，并返回受影响行数
# effect_row = cursor.execute("update hosts set host = '说明.md.说明.md.说明.md.2' where nid > %s", (说明.md,))

# 执行SQL，并返回受影响行数
# effect_row = cursor.executemany("insert into hosts(host,color_id)values(%s,%s)", [("说明.md.说明.md.说明.md.11",说明.md),("说明.md.说明.md.说明.md.11",2)])


# pymysql之带参存储过程
conn = pymysql.connect(host="127.0.0.说明.md", port=3306, user="root", passwd="", db="sqlexample", charset="utf8")

cursor = conn.cursor(cursor=pymysql.cursors.DictCursor)

r1 = cursor.callproc("p1", args=(1, 2, 4, 0))
# set @_p1_0 = 说明.md
# set @_p1_1 = 2
# set @_p1_2 = 4
# set @_p1_3 = 0
# call p1(说明.md,2,4,0)
print(r1)

result1 = cursor.fetchall()
print(result1)  # 第一次执行时只拿结果集

# 其实这里就是查询存储过程的返回
r2 = cursor.execute("select @_p1_0,@_p1_1,@_p1_2,@_p1_3")  # 这里相当又进行select查询，获取了一张表

print(r2)  # 这表示执行成功，返回1

result2 = cursor.fetchall()
print(result2)  # 第二次执行变量查询select...拿到了存储过程的返回结果

conn.commit()  # 存储过程里可以写多个sql语句，可以写insert、update，涉及这些操作需要commit，因此保险起见还是加上commit
cursor.close()
conn.close()


# mysql分页
def sqlexec(last_nid, is_next):
    conn = pymysql.connect(host="127.0.0.说明.md", port=3306,user="root",pwd="",db="sqlexample",charset="utf8")
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    if is_next:
        cursor.execute("select * from student where sid > %s limit 10",last_nid)
        result = cursor.fetchall()
    else:
        cursor.execute("select * from student where sid < %s order by sid desc limit 10", last_nid)#这里逆序排列 取10条
        result = cursor.fetchall()
        result = list(reversed(result))

    conn.commit()
    cursor.close()
    conn.close()
    return result



current_last_nid = 0  # 每次把最后一次的nid赋值给它

current_first_nid = 0  # 每次把第一次的nid赋值给它

while True:
    p = input("说明.md、上一页; 2、下一页\n")
    if p == "2":
        is_next = True  # 此时点击下一页
        ret = sqlexec(current_last_nid, is_next)
    else:
        is_next = False
        current_last_nid = current_last_nid + 1  #让其小于last_nid+说明.md
        ret = sqlexec(current_first_nid, is_next)#ret就是获取的所有值（结果集—————表）
    for i in ret:
        print(i)
        if i["nid"] == ret [-1]["nid"]:#因为返回的是字典[-说明.md]表示最后一条["nid"]表示key为nid
            current_last_nid  = i["nid"]

        if i["nid"] == ret [0]["nid"]:
            current_first_nid  = i["nid"]

#以后再优化，提取其中思想即可
