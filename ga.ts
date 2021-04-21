import {Cheerio, load} from "cheerio";
import {readFileSync, writeFileSync} from "fs";
import { partition, unescape } from "lodash";
import {join} from 'path';
import XLSX from 'xlsx';

interface GaType {
  flag: string;
  pc: string;
  mobile?: string;
  pad?: string;
}

class Ga {
  constructor(private pageName: string, private dir: string) {}

  // 获取添加了‘data-ga’的html文件
  private getFlagHtml() {
    try {
      const file = readFileSync(join(this.dir, this.pageName, 'index.ejs'), {encoding: 'utf8'});
      const $ = load(file);
      const btns:Cheerio = $('a,button');
      if (btns.length) {
        const btnsArr = partition(btns, (btn) => {
          return $(btn).data('ga')
        });
        const hasGaArr = btnsArr[0];
        const noGaArr = btnsArr[1];
        for (let i = 0; i < noGaArr.length; i++ ){
          $(noGaArr[i]).attr('data-ga', this.pageName + (i + hasGaArr.length + 1));
        }
        return $.html();
      }
    } catch (e) {
      console.error(`读取文件${this.pageName}失败`);
    }
  }
  // 获取xlsx文件的代码
  private getGa(): GaType[] {
    const workbook = XLSX.readFile(join(this.dir, this.pageName, 'ga.xlsx'));
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    return XLSX.utils.sheet_to_json<GaType>(worksheet);
  }
  // 获取生成了ga attr 的html
  private async getGeneratedGaHtml() {
    const html = this.getFlagHtml();
    const gaCode = this.getGa();
    const $ = load(html!);
    const btns = $('[data-ga]');
    for (let i = 0; i < btns.length; i++ ){
      const dom = $(btns[i]);
      const flag = dom.data('ga');
      const code: GaType = gaCode.filter(item => item.flag === flag)[0];
      for (const type in code) {
        if (type !== 'flag') {
          // @ts-ignore
          dom.attr(`data-ga-${type}`, code[type])
        }
      }
    }
    return unescape($.html());
  }

  async reWriteSingleFile() {
    const html = await this.getGeneratedGaHtml();
    try {
      writeFileSync(join(this.dir, this.pageName, 'index.ejs'), html, {encoding: 'utf8'});
      console.info(`重写文件${this.pageName}成功~`)
    } catch (e) {
      console.error(`重写文件${this.pageName}失败！`);
    }
  }
}

export function reWriteSingleFile(pageName: string, dir='src/pages/') {
  new Ga(pageName, dir).reWriteSingleFile().then();
}
// reWriteSingleFile('demo');




