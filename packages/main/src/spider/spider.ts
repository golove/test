import { ipcMain,net } from "electron";
import {SqliteDB} from '/@/spider/sqlite'
const file = 'pictron.db';
const sqliteDB = new SqliteDB(file);


const host = "http://w11.a6def2ef910.rocks/pw/";

export function spider(url: string,tableName:string, flag: boolean,event:Electron.IpcMainEvent ,rootUrl?: string) {
  const request = net.request(url);
  request.on("response", (response) => {
    // console.log('STATUS: '+response.statusCode)
    // console.log('HEADERS: '+ JSON.stringify(response.headers))
    response.on("data", (chunk) => {
      if (chunk) {
        if (flag) {
          const createTableSql = `CREATE TABLE IF NOT EXISTS ${tableName} (title TEXT,href TEXT,srcs BLOB,star INTEGER,collect NUMERIC,deleted NUMERIC,download NUMERIC);`;
          sqliteDB.createTable(createTableSql);
          const hrefs = getHref("" + chunk);
          for (let index = 0; index < hrefs.length; index++) {
            spider(host + hrefs[index],tableName, false, event,url);
          }
        } else {
          getSrc("" + chunk, rootUrl!,tableName,event);
        }
      }
    });
    response.on("end", () => {
      console.log("NO MORE DATA IN RESPONSE");
    });
  });
  request.end();
}

function getHref(html: string) {
  const b = /html_data\/14\/([^<>"]*)/gi;
  const href = html.match(b);
  return Array.from(new Set(href));
}

function getSrc(html: string, url: string,tableName:string,event:Electron.IpcMainEvent) {
  const b = /http:\/\/p1.pi22y.cc\/([^<>"]*)\.jpg/gi;
  const srcs = html.match(b);
  // 匹配 img 的 title 值
  const t = /<span id="subject_tpc">(.*?)<\/span>/gi;
  const title = t.exec(html);
  const img = [
    title![1],
    url,
    Array.from(new Set(srcs)),
    0,
    false,
    false,
    false,
  ];
  event.sender.send('mainMsg',img)
  const insertSql = `INSERT INTO ${tableName} VALUES (?,?,?,?,?,?,?);`;
  sqliteDB.insertData(insertSql, img);
}
