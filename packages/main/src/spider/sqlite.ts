import { existsSync, openSync } from 'fs';

import sqlite3 from 'sqlite3';
var DB = DB || {};

DB.SqliteDB = function (file:string) {
    DB.db = new sqlite3.Database(file);
    DB.exists = existsSync(file);
    if (!DB.exists) {
        console.log('Creating db file!');
        openSync(file, 'w');
    };
};

DB.printErrorInfo = function (err:any) {
    console.log('Error Message: ' + err.message + 'ErrorNumber: ' + err);
}

// const createTableSql = "CREATE TABLE IF NOT EXISTS beauty (title TEXT,href TEXT,srcs BLOB,star INTEGER,collect NUMERIC,deleted NUMERIC,download NUMERIC);";
// sqliteDB.createTable(createTableSql);
DB.SqliteDB.prototype.createTable = function (sql:string) {
    DB.db.serialize(function () {
        DB.db.run(sql, function (err:any) {
            if (null != err) {
                DB.printErrorInfo(err);
                return;
            }
        });
    });
};

// const insertData = [
//     ['[IMISS愛蜜社] 2021.05.14 Vol.592 Vanessa (44P)',
//         'http://w11.a6def2ef910.rocks/pw/html_data/14/2201/5787735.html',
//         'http://p1.pi22y.cc/i/2022/01/13/z7qtwh.jpg,http://p1.pi22y.cc/i/2022/01/13/z7rjaj.jpg,http://p1.pi22y.cc/i/2022/01/13/z7rxow.jpg,http://p1.pi22y.cc/i/2022/01/13/z7su0t.jpg,http://p1.pi22y.cc/i/2022/01/13/z7theh.jpg,http://p1.pi22y.cc/i/2022/01/13/z7tsy8.jpg,http://p1.pi22y.cc/i/2022/01/13/z7u6lt.jpg,http://p1.pi22y.cc/i/2022/01/13/z7ur8b.jpg,http://p1.pi22y.cc/i/2022/01/13/z7v3gc.jpg,http://p1.pi22y.cc/i/2022/01/13/z7vsej.jpg,http://p1.pi22y.cc/i/2022/01/13/z7wfln.jpg,http://p1.pi22y.cc/i/2022/01/13/z85dl4.jpg,http://p1.pi22y.cc/i/2022/01/13/z85tz4.jpg,http://p1.pi22y.cc/i/2022/01/13/z86cly.jpg,http://p1.pi22y.cc/i/2022/01/13/z86tzg.jpg,http://p1.pi22y.cc/i/2022/01/13/z87def.jpg,http://p1.pi22y.cc/i/2022/01/13/z87rsi.jpg,http://p1.pi22y.cc/i/2022/01/13/z887wn.jpg,http://p1.pi22y.cc/i/2022/01/13/z88tba.jpg,http://p1.pi22y.cc/i/2022/01/13/z89lqr.jpg,http://p1.pi22y.cc/i/2022/01/13/z8a8zj.jpg,http://p1.pi22y.cc/i/2022/01/13/z8aov1.jpg,http://p1.pi22y.cc/i/2022/01/13/z8bbcz.jpg,http://p1.pi22y.cc/i/2022/01/13/z8bsjv.jpg,http://p1.pi22y.cc/i/2022/01/13/z8cfbj.jpg,http://p1.pi22y.cc/i/2022/01/13/z8d6bz.jpg,http://p1.pi22y.cc/i/2022/01/13/z8dsaj.jpg,http://p1.pi22y.cc/i/2022/01/13/z8edpj.jpg,http://p1.pi22y.cc/i/2022/01/13/9sc5l51.jpg,http://p1.pi22y.cc/i/2022/01/13/z8fpby.jpg,http://p1.pi22y.cc/i/2022/01/13/z8gct4.jpg,http://p1.pi22y.cc/i/2022/01/13/z8h8v4.jpg,http://p1.pi22y.cc/i/2022/01/13/z8hraq.jpg,http://p1.pi22y.cc/i/2022/01/13/z8rirv.jpg,http://p1.pi22y.cc/i/2022/01/13/z8sa0f.jpg,http://p1.pi22y.cc/i/2022/01/13/z8tggg.jpg,http://p1.pi22y.cc/i/2022/01/13/z8um4o.jpg,http://p1.pi22y.cc/i/2022/01/13/z8vtci.jpg,http://p1.pi22y.cc/i/2022/01/13/z8wzro.jpg,http://p1.pi22y.cc/i/2022/01/13/z8yf8z.jpg,http://p1.pi22y.cc/i/2022/01/13/9shxhp0.jpg,http://p1.pi22y.cc/i/2022/01/13/z916o0.jpg,http://p1.pi22y.cc/i/2022/01/13/z92r8s.jpg,http://p1.pi22y.cc/i/2022/01/13/z9cpiz.jpg',
//         0, 0, 0,
//     ]
// ]
// const insertSql = 'INSERT INTO beauty VALUES (?,?,?,?,?,?,?);';
// sqliteDB.insertData(insertSql, insertData);

DB.SqliteDB.prototype.insertDatas = function (sql:string, objects:[]) {
    DB.db.serialize(function () {
        let stmt = DB.db.prepare(sql);
        for (let i = 0; i < objects.length; ++i) {
            stmt.run(objects[i])
        }
        stmt.finalize();
    });
}
DB.SqliteDB.prototype.insertData = function (sql:string, object:[]) {
    DB.db.serialize(function () {
        let stmt = DB.db.prepare(sql);
        stmt.run(object)
        stmt.finalize();
    });
}


// const querySql = 'select * from beauty';
// const query = `SELECT * FROM ${tableName} LIMIT ${3} OFFSET ${(n - 1) * 3}`;
// function queryData(rows){
//     console.log(rows)
// }
// // sqliteDB.queryData(querySql,queryData);
DB.SqliteDB.prototype.queryData = function (sql:string, callback:(rows:string[])=>void) {
    DB.db.all(sql, function (err:any, rows:string[]) {
        if (null != err) {
            DB.printErrorInfo(err);
            return;
        }
        if (callback) {
            callback(rows);
        }
    })
}

// const updateSql = 'update beauty set download = 1 where star = 0';
// sqliteDB.executeSql(updateSql)
DB.SqliteDB.prototype.executeSql = function (sql:string) {
    DB.db.run(sql, function (err:any) {
        if (null != err) {
            DB.printErrorInfo(err);
        }
    })
}

DB.SqliteDB.prototype.close = function () {
    DB.db.close();
}

export const SqliteDB = DB.SqliteDB;
