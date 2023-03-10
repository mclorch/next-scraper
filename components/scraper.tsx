const jsdom = require("jsdom");
const { JSDOM } = jsdom;

import csvAppend from "csv-append";
import Product from "./Product";

let csv: any;
let base: any;

export default async function scrapeVisma(url: string) {
    let path = getPath();
    csv = csvAppend(path);
    base = url;

    let response = await fetch(url);
    let html = await response.text();
    let categories = await getCategories(html);
    loadProducts(categories);
};

let getPath = () => {
    let date = Date.now();
    return `temp/result-${date}.csv`;
}

let getCategories = (html: string): HTMLAnchorElement[] => {
    let dom = new JSDOM(html);
    let nodes = dom.window.document.querySelectorAll('.nav.mainmenu li:not(.hasSubmenu) a');
    return Array.from(nodes);
}
let loadProducts = async (categories: HTMLAnchorElement[]) => {
    categories.forEach(category => saveCategoryProducts(category));
}

let saveCategoryProducts = async (category: HTMLAnchorElement): Promise<void> => {
    let next = getNext(category);
    let response = await fetch(next);
    let html = await response.text();
    saveProducts(html);
}

let saveProducts = async (html: string): Promise<void> => {
    let dom = new JSDOM(html);
    let elements: HTMLAnchorElement[] = dom.window.document.querySelectorAll('.articleCategoryList .ArticleOverview a.moreInfo');
    elements.forEach(element => writeProductRow(element));
}

let writeProductRow = async (product: HTMLAnchorElement) => {
    let next = getNext(product);

    let response = await fetch(next)
    let url = response.url
    let html = await response.text()
    let p = new Product(html, url);
    if (p.isProduct()) {
        csv.append(p.shopifyRow)
    }
}

let getNext = (link: HTMLAnchorElement) => `${base}${link.href}`;
