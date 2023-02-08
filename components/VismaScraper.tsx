const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');

import csvAppend from "csv-append";
import Product from "./Product";


export default class VismaScraper
{
    private _url:string;
    private _path:string = 'templates/result.csv';
    private _csvAppend:any;
    //private _stream:Stream|null;

    constructor(url:string) {
        this._url = url;
        this._csvAppend = csvAppend(this._path);
    }

    public async scrape():Promise<void|Product[][]> {
        //writeToPath(this._path, [get]);
        //this._stream = format();



        return fetch(this._url)
        .then(response => response.text())
        .then(html => this.getCategories(html))
        .then(categories => this.loadProducts(categories)); //
    }

    private fsCb = (err:any) => {
        if(err) {
            console.log('GOT AN ERROR');
        }
    }

    private getCategories(html:string): HTMLAnchorElement[]
    {
        let dom = new JSDOM(html);
        let nodes = dom.window.document.querySelectorAll('.nav.mainmenu li:not(.hasSubmenu) a');
        return Array.from(nodes);
    }

    private async loadProducts(categories:HTMLAnchorElement[])
    {
        categories.forEach(category => this.saveCategoryProducts(category));
    }

    private saveCategoryProducts = (category:HTMLAnchorElement) => {
        let next = this.getNext(category);

        fetch(next)
        .then(response => response.text())
        .then(html => this.saveProducts(html));
    }

    private async saveProducts(html:string): Promise<void>
    {
        let dom = new JSDOM(html);
        let elements:HTMLAnchorElement[] = dom.window.document.querySelectorAll('.articleCategoryList .ArticleOverview a.moreInfo');

        //let promises = array_elements.map(product => this.getProductRow(product));
        //let rows = await Promise.all(promises);

        elements.forEach(element => this.writeProductRow(element));
    }

    private writeProductRow = async(product:HTMLAnchorElement) => {
        let next = this.getNext(product);

        let response = await fetch(next)
        let url = response.url
        let html =  await response.text()
        let p = new Product(html, url);
        if(p.isProduct()) {
            //return this._stream.write(p.shopifyArray);
            //writeToStream()
            this._csvAppend.append(p.shopifyRow)
        }
    }

    private getNext = (link:HTMLAnchorElement) => `${this._url}${link.href}`;
}