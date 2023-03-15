const jsdom = require("jsdom");
const { JSDOM } = jsdom;

export default class Product {
    private BRAND = 'varumärke';
    private TYPE = 'typ';
    private CORRESPONDS_TO = 'motsvarar';
    private DESCRIPTION = 'beskrivning';
    private AMOUNT_PER_PACKAGE = 'antal/frp';
    private MEASURES = 'mått';

    private _url: string; // needed for category, though currently commented out...
    private _window: Window;
    private _brand: string = '';
    private _type: string = '';
    private _title: string = '';
    private _category: string = '1'; // this may need altered - getting this info from https://help.shopify.com/txt/product_taxonomy/en.txt
    private _description: string = '';
    private _amount: string = '';
    private _measures: string = '';
    private _corresponds: string = '';
    private _sku: string = '';
    private _variantPrice: string = '';
    private _imgSource: string = '';

    constructor(html: string, url: string) {
        let dom = new JSDOM(html);
        this._window = dom.window;
        this._url = url;
        this.setDescriptors();
    }

    get title(): string {
        if (!this._title) {
            let h1 = this._window.document.querySelector('.ArticleDetails h1');
            this._title = h1 && h1.textContent && h1.textContent.trim().replace(/['"]+/g, '') || '';
        }

        return `${this._title} - INTE REDIGERAD`;
    }

    public isProduct() {
        // can be category as well - if title is empty we assume a category has been clicked
        let title = this.title.trim();
        return title !== '- INTE REDIGERAD'
    }


    get amount(): string {
        return this._amount;
    }

    get description(): string {
        return this._description;
    }

    get type(): string {
        return this._type;
    }

    get brand(): string {
        return this._brand;
    }

    get measures(): string {
        return this._measures;
    }

    get corresponds(): string {
        return this._corresponds;
    }


    get handle(): string {
        return '';
    }

    get body(): string {
        return '';
    }

    get vendor(): string {
        return '';
    }


    get category(): string {

        // if(!this._category) {
        //     let params = (new URL(this._url)).searchParams;
        //     let cats = params.get('tm') || '';
        //     this._category =  cats.split('/').join(' > ');
        // }

        return this._category;
    }


    get published(): string {
        return '';
    }

    get tags(): string {
        return '';
    }

    get opt1Name(): string {
        return '';
    }
    get opt2Name(): string {
        return '';
    }
    get opt3Name(): string {
        return '';
    }
    get opt1Value(): string {
        return '';
    }
    get opt2Value(): string {
        return '';
    }
    get opt3Value(): string {
        return '';
    }

    get sku(): string {
        if(!this._sku) {
            let parent = this._window.document.querySelector('.artnr')
            this._sku = parent && parent.lastElementChild && parent.lastElementChild.innerHTML || '';
        }

        return this._sku;
    }

    get grams(): string {
        return '';
    }


    get inventory(): string {
        return '';
    }


    get policy(): string {
        return 'continue';
    }


    get inventoryQty(): string {
        return '';
    }


    get fulfillmentService(): string {
        return 'manual';
    }


    get variantPrice(): string {
        if(!this._variantPrice) {
            let parent = this._window.document.querySelector('.currency');
            let currency = parent && parent.firstElementChild && parent.firstElementChild.innerHTML;
            this._variantPrice = currency?.trim() || '';
        }

        return this._variantPrice;
    }


    get compareAtPrice(): string {
        return '';
    }


    get requiresShipping(): string {
        return '';
    }


    get taxable(): string {
        return '';
    }


    get barcode(): string {
        return '';
    }


    get imgSource(): string {
        // if(!this._imgSource) {
        //     let parent = this._window.document.querySelector('.artImg')
        //     let img: HTMLImageElement | null = parent && parent.lastElementChild && parent.lastElementChild.querySelector('img');
        //     this._imgSource = img && img.src || '';
        // }

        return this._imgSource;
    }

    get imgPosition(): string {
        return '';
    }


    get imgAltText(): string {
        return '';
    }


    get giftCard(): string {
        return '';
    }


    get seoTitle(): string {
        return '';
    }


    get seoDescription(): string {
        return '';
    }

    get googleCategory(): string {
        return '';
    }
    get googleGender(): string {
        return '';
    }

    get googleAgeGroup(): string {
        return '';
    }

    get googleAdGroup(): string {
        return '';
    }
    get googleMpn(): string {
        return '';
    }
    get googleAdLabels(): string {
        return '';
    }

    get googleCondition(): string {
        return '';
    }

    get googleShoppingCustomProduct(): string {
        return '';
    }

    get compareAt(): string {
        return '';
    }

    get googleCustomLabel0(): string {
        return '';
    }
    get googleCustomLabel1(): string {
        return '';
    }
    get googleCustomLabel2(): string {
        return '';
    }
    get googleCustomLabel3(): string {
        return '';
    }
    get googleCustomLabel4(): string {
        return '';
    }
    get variantImg(): string {
        return '';
    }
    get variantHeight(): string {
        return '';
    }
    get variantTaxCode(): string {
        return '';
    }
    get costPerItem(): string {
        return '';
    }
    get priceInternational(): string {
        return '';
    }

    get status(): string {
        // assuming all products visible to scraper
        // are active.
        return 'active';
    }

    private setDescriptors(): void {
        // these are not yet used  - could be set in "opt1/2/3"
        let descriptors = this._window.document.querySelectorAll('.description p strong');

        descriptors.forEach((item: Node) => {
            item.textContent && item.nextSibling && this.setDescriptorItem(item.textContent!, item.nextSibling.textContent!);
        })
    }

    private setDescriptorItem(name: string, value: string): void {
        name = name.trim();
        name = name.endsWith(':') ? name.slice(0, -1) : name;
        value = value.trim();

        switch (name.toLowerCase()) {
            case this.DESCRIPTION:
                this._description = value;
                break;

            case this.BRAND:
                this._brand = value;
                break;

            case this.TYPE:
                this._type = value;
                break;

            case this.CORRESPONDS_TO:
                this._corresponds = value;
                break;

            case this.AMOUNT_PER_PACKAGE:
                this._amount = value;
                break;

            case this.MEASURES:
                this._measures = value;
                break;

            default:
                break;
        }
    }

    get shopifyRow(): object {
        return {
            'Handle': this.trim(this.sku),
            'Title': this.trim(this.title),
            'Body (HTML)': this.trim(this.body),
            'Vendor': this.trim(this.vendor),
            'Product Category': this.trim(this.category),
            'Type': this.trim(this.type),
            'Tags': this.trim(this.tags),
            'Published': this.trim(this.published),
            'Option1 Name': this.trim(this.opt1Name),
            'Option1 Value': this.trim(this.opt1Value),
            'Option2 Name': this.trim(this.opt2Name),
            'Option2 Value': this.trim(this.opt2Value),
            'Option3 Name': this.trim(this.opt3Name),
            'Option3 Value': this.trim(this.opt3Value),
            'Variant SKU': '',
            'Variant Grams': this.trim(this.grams),
            'Variant Inventory Tracker': this.trim(this.inventory),
            'Variant Inventory Qty': this.trim(this.inventoryQty),
            'Variant Inventory Policy': this.trim(this.policy),
            'Variant Fulfillment Service': this.trim(this.fulfillmentService),
            'Variant Price': this.trim(this.variantPrice),
            'Variant Compare At Price': this.trim(this.compareAtPrice),
            'Variant Requires Shipping': this.trim(this.requiresShipping),
            'Variant Taxable': this.trim(this.taxable),
            'Variant Barcode': this.trim(this.barcode),
            'Image Src': this.trim(this.imgSource),
            'Image Position': this.trim(this.imgPosition),
            'Image Alt Text': this.trim(this.imgAltText),
            'Gift Card': this.trim(this.giftCard),
            'SEO Title': this.trim(this.seoTitle),
            'SEO Description': this.trim(this.seoDescription),
            'Google Shopping / Google Product Category': this.trim(this.googleCategory),
            'Google Shopping / Gender': this.trim(this.googleGender),
            'Google Shopping / Age Group': this.trim(this.googleAgeGroup),
            'Google Shopping / MPN': this.trim(this.googleMpn),
            'Google Shopping / AdWords Grouping': this.trim(this.googleAdGroup),
            'Google Shopping / AdWords Labels': this.trim(this.googleAdLabels),
            'Google Shopping / Condition': this.trim(this.googleCondition),
            'Google Shopping / Custom Product': this.trim(this.googleShoppingCustomProduct),
            'Google Shopping / Custom Label 0': this.trim(this.googleCustomLabel0),
            'Google Shopping / Custom Label 1': this.trim(this.googleCustomLabel1),
            'Google Shopping / Custom Label 2': this.trim(this.googleCustomLabel2),
            'Google Shopping / Custom Label 3': this.trim(this.googleCustomLabel3),
            'Google Shopping / Custom Label 4': this.trim(this.googleCustomLabel4),
            'Variant Image': this.trim(this.variantImg),
            'Variant Weight Unit': this.trim(this.variantHeight),
            'Variant Tax Code': this.trim(this.variantTaxCode),
            'Cost per item': this.trim(this.costPerItem),
            'Price / International': this.trim(this.priceInternational),
            'Compare At Price / International': this.trim(this.compareAt),
            'Status': this.trim(this.status)
        }
    }

    private trim(val: string) {
        return val.trim().replace(/['"]+/g, '')
    }
}